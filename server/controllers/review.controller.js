import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get approved reviews for a specific product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ 
      product: req.params.productId, 
      isApproved: true 
    })
    .populate('user', 'name')
    .sort('-createdAt');

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a product review (User protected)
// @route   POST /api/reviews/:productId
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { rating, title, body } = req.body;
    const productId = req.params.productId;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user has already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    // Optional Check: Has the user actually purchased the product? (Verified Purchase Badge)
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      paymentStatus: 'paid'
    });

    const isVerified = !!hasPurchased;

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      title,
      body,
      isApproved: false // Requires Admin approval to prevent spam
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted. It will appear live once verified by our curation team.',
      review,
      isVerified
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve a review (Admin Only)
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
export const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.isApproved = true;
    await review.save(); // Triggers Mongoose pre-save average calculation hook

    res.json({
      success: true,
      message: 'Review approved and published live',
      review
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a review (Admin Only / Owner)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Allow deletion if the user is an admin OR the original review owner
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const productId = review.product;
    await review.deleteOne();

    // Force recalculate average on deletion (since pre-save is not triggered on delete)
    await Review.getAverageRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
