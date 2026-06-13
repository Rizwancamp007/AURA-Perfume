import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Message from '../models/Message.js';

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    // Sum of all paid orders
    const paidOrders = await Order.find({ paymentStatus: 'paid' });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);

    // Total Orders count
    const totalOrders = await Order.countDocuments();

    // Registered Members count (role is user)
    const registeredMembers = await User.countDocuments({ role: 'user' });

    // Pending Verifications count (bank transfer pending)
    const pendingVerifications = await Order.countDocuments({ 
      paymentMethod: 'bank_transfer', 
      paymentStatus: 'pending' 
    });

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        registeredMembers,
        pendingVerifications
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all registered members
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllMembers = async (req, res, next) => {
  try {
    const members = await User.find({ role: 'user' }).sort('-createdAt');
    res.json({ success: true, count: members.length, members });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all messages
// @route   GET /api/admin/messages
// @access  Private/Admin
export const getAllMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort('-createdAt');
    res.json({ success: true, count: messages.length, messages });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify Bank Transfer Payment
// @route   PUT /api/admin/orders/:id/verify
// @access  Private/Admin
export const verifyOrderPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    order.statusHistory.push({
      status: 'confirmed',
      note: 'Bank transfer receipt verified by Administrator. Payment confirmed.',
      timestamp: new Date()
    });
    
    await order.save();
    res.json({ success: true, message: 'Payment verified successfully', order });
  } catch (err) {
    next(err);
  }
};
