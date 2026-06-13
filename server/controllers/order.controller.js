import Order from '../models/Order.js';
import Product from '../models/Product.js';
import PromoCode from '../models/PromoCode.js';
import sendEmail from '../utils/sendEmail.js';
import { emitOrderStatusUpdate } from '../socket/orderSocket.js';

// Helper to generate custom human-readable Order Reference IDs
const generateOrderReferenceId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000); // 4 digit random
  return `PB-${dateStr}-${rand}`;
};

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, promoCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in shopping bag' });
    }

    let subtotal = 0;
    const validatedItems = [];

    // 1. Verify pricing & stock availability of products
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }

      // Calculate price (including laser engraving fee Rs. 500 if text is present)
      const basePrice = product.price;
      const finalPrice = item.engravingText ? basePrice + 500 : basePrice;

      subtotal += finalPrice * item.quantity;
      validatedItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: finalPrice,
        quantity: item.quantity,
        engravingText: item.engravingText || '',
        engravingFont: item.engravingFont || ''
      });
    }

    // 2. Validate Promo Code if applied
    let discount = 0;
    let validPromo = null;

    if (promoCode) {
      validPromo = await PromoCode.findOne({ code: promoCode.toUpperCase(), isActive: true });
      if (validPromo && !validPromo.isExpired()) {
        // Check minimum order limits
        if (subtotal >= validPromo.minOrder) {
          if (validPromo.type === 'percent') {
            discount = Math.round(subtotal * (validPromo.value / 100));
          } else if (validPromo.type === 'flat') {
            discount = Math.min(validPromo.value, subtotal);
          }
        }
      }
    }

    // Calculate shipping (Free shipping for orders over Rs. 5000)
    const shipping = subtotal > 5000 ? 0 : 250;
    const total = subtotal - discount + shipping;

    // Handle bank receipt upload if payment is bank transfer
    let paymentScreenshot = '';
    if (req.file) {
      paymentScreenshot = req.file.path;
    }

    // 3. Create the order document
    const orderId = generateOrderReferenceId();
    const order = await Order.create({
      orderId,
      user: req.user._id,
      items: validatedItems,
      subtotal,
      discount,
      shipping,
      total,
      promoCode: validPromo ? validPromo.code : undefined,
      shippingAddress,
      paymentMethod,
      paymentScreenshot,
      paymentStatus: paymentMethod === 'bank_transfer' ? 'pending' : 'pending'
    });

    // 4. Lock stock quantities
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Increment coupon uses if applicable
    if (validPromo) {
      await PromoCode.findByIdAndUpdate(validPromo._id, {
        $inc: { usedCount: 1 },
        $push: { usedBy: req.user._id }
      });
    }

    // 5. Dispatch email receipt
    const emailSubject = `Order Placed Successfully — ${orderId}`;
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #C9A96E; border-radius: 8px;">
        <h2 style="color: #C9A96E; text-align: center; letter-spacing: 2px;">AURA ATELIER RECEIPT</h2>
        <p>Thank you for purchasing from AURA, <strong>${shippingAddress.name}</strong>.</p>
        <p>Order Reference: <strong>${orderId}</strong></p>
        <p>Status: <strong>Verification in progress</strong></p>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <h3 style="color: #333;">Summary:</h3>
        <table style="width: 100%; text-align: left; font-size: 14px;">
          <tr>
            <th>Subtotal:</th>
            <td>Rs. ${subtotal.toLocaleString()}</td>
          </tr>
          <tr>
            <th>Shipping:</th>
            <td>Rs. ${shipping.toLocaleString()}</td>
          </tr>
          ${discount > 0 ? `<tr><th>Discount:</th><td style="color: #C9A96E;">- Rs. ${discount.toLocaleString()}</td></tr>` : ''}
          <tr style="font-weight: bold; font-size: 16px;">
            <th>Total Amount:</th>
            <td style="color: #C9A96E;">Rs. ${total.toLocaleString()}</td>
          </tr>
        </table>
        <p style="font-size: 12px; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; text-align: center;">
          Karachi, Pakistan. concierge@auraperfumes.com
        </p>
      </div>
    `;

    await sendEmail({
      email: req.user.email,
      subject: emailSubject,
      html: emailBody
    }).catch(err => console.error('Mailer error:', err));

    res.status(201).json({
      success: true,
      message: 'Order initiated successfully',
      order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user order history
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify user owns the order OR is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// @desc    Get order details by reference code (For anonymous tracking check)
// @route   GET /api/orders/track/:orderId
// @access  Public
export const getTrackedOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId.toUpperCase() })
      .select('orderId status statusHistory paymentMethod paymentStatus estimatedDelivery createdAt');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order code not found' });
    }

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status timeline (Admin Only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      note: note || `Order transitioned to ${status}`,
      timestamp: new Date()
    });

    // Auto update payment if delivered
    if (status === 'delivered') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    // 1. Emit live status to the socket room instantly!
    emitOrderStatusUpdate(order.orderId, order);

    // 2. Dispatch status update email alerts
    const emailSubject = `Order Status Updated — ${order.orderId}`;
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #C9A96E; border-radius: 8px;">
        <h2 style="color: #C9A96E; text-align: center; letter-spacing: 2px;">ORDER UPDATE</h2>
        <p>Hi, your order <strong>${order.orderId}</strong> has been updated.</p>
        <p>New Status: <strong style="text-transform: uppercase; color: #C9A96E;">${status}</strong></p>
        <p>Update Note: <em>${note || 'Transitioned successfully'}</em></p>
        <p>Est. Delivery: <strong>${order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : '3-5 days'}</strong></p>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <p style="text-align: center;"><a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/track/${order.orderId}" style="background-color: #C9A96E; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Track Order Online</a></p>
      </div>
    `;

    await sendEmail({
      email: req.user.email,
      subject: emailSubject,
      html: emailBody
    }).catch(err => console.error('Mailer error:', err));

    res.json({
      success: true,
      message: 'Status updated and socket update broadcasted',
      order
    });
  } catch (err) {
    next(err);
  }
};
