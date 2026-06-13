import PromoCode from '../models/PromoCode.js';

// @desc    Validate a promo code
// @route   POST /api/promo/validate
// @access  Private (or Public depending on checkout check)
export const validatePromo = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code' });
    }

    const promo = await PromoCode.findOne({ 
      code: code.toUpperCase().trim(), 
      isActive: true 
    });

    if (!promo) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }

    if (promo.isExpired()) {
      return res.status(400).json({ success: false, message: 'Coupon code has expired' });
    }

    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }

    // Check minimum order amount constraint
    if (subtotal !== undefined && Number(subtotal) < promo.minOrder) {
      return res.status(400).json({ 
        success: false, 
        message: `This code requires a minimum order subtotal of Rs. ${promo.minOrder.toLocaleString()}` 
      });
    }

    // Check if user has already used it (limit one use per user if applicable)
    if (req.user && promo.usedBy.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You have already used this coupon code' });
    }

    res.json({
      success: true,
      message: 'Promo code applied successfully!',
      code: promo.code,
      type: promo.type,
      value: promo.value,
      minOrder: promo.minOrder
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new promo code (Admin Only)
// @route   POST /api/promo
// @access  Private/Admin
export const createPromo = async (req, res, next) => {
  try {
    const { code, type, value, minOrder, maxUses, expiry } = req.body;

    const promoExists = await PromoCode.findOne({ code: code.toUpperCase() });
    if (promoExists) {
      return res.status(400).json({ success: false, message: 'Promo code already exists' });
    }

    const promo = await PromoCode.create({
      code: code.toUpperCase(),
      type,
      value: Number(value),
      minOrder: Number(minOrder || 0),
      maxUses: maxUses ? Number(maxUses) : undefined,
      expiry: new Date(expiry)
    });

    res.status(201).json({
      success: true,
      message: 'Promo code created successfully',
      promo
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all promo codes (Admin Only)
// @route   GET /api/promo
// @access  Private/Admin
export const getPromoCodes = async (req, res, next) => {
  try {
    const promos = await PromoCode.find({}).sort('-createdAt');
    res.json({ success: true, count: promos.length, promos });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a promo code (Admin Only)
// @route   DELETE /api/promo/:id
// @access  Private/Admin
export const deletePromo = async (req, res, next) => {
  try {
    const promo = await PromoCode.findById(req.params.id);

    if (!promo) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }

    await promo.deleteOne();

    res.json({
      success: true,
      message: 'Promo code removed successfully'
    });
  } catch (err) {
    next(err);
  }
};
