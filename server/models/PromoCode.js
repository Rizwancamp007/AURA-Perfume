import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['percent', 'flat'],
    required: true
  },
  value: {
    type: Number,
    required: true // e.g. 15 for 15% or 500 for Rs.500 flat discount
  },
  minOrder: {
    type: Number,
    default: 0 // Minimum order amount before code is applicable
  },
  maxUses: {
    type: Number
  },
  usedCount: {
    type: Number,
    default: 0
  },
  usedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  expiry: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Check if coupon is expired
promoCodeSchema.methods.isExpired = function() {
  return Date.now() > this.expiry;
};

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);
export default PromoCode;
