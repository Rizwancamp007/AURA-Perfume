import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  // Engraving option refinements
  engravingText: { type: String, default: '' },
  engravingFont: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  promoCode: { type: String },
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    enum: ['jazzcash', 'easypaisa', 'nayapay', 'bank_transfer'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentScreenshot: { type: String }, // Cloudinary URL for bank transfers
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'],
    default: 'placed'
  },
  statusHistory: [{
    status: { type: String, required: true },
    note: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  trackingId: { type: String },
  estimatedDelivery: { type: Date }
}, {
  timestamps: true
});

// Auto-push initial history state on creation
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.statusHistory = [{
      status: 'placed',
      note: 'Order successfully created',
      timestamp: new Date()
    }];
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
