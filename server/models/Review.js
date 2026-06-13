import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  title: { type: String, required: [true, 'Please add a review title'] },
  body: { type: String, required: [true, 'Please add review description text'] },
  isApproved: { type: Boolean, default: false }, // Moderated by Admin
  isFeatured: { type: Boolean, default: false } // Featured on Landing Page
}, {
  timestamps: true
});

// Static method to get avg rating and save
reviewSchema.statics.getAverageRating = async function(productId) {
  const obj = await this.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  try {
    if (obj.length > 0) {
      await mongoose.model('Product').findByIdAndUpdate(productId, {
        avgRating: Math.round(obj[0].averageRating * 10) / 10,
        reviewCount: obj[0].reviewCount
      });
    } else {
      await mongoose.model('Product').findByIdAndUpdate(productId, {
        avgRating: 0,
        reviewCount: 0
      });
    }
  } catch (err) {
    console.error('Error computing average rating:', err);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.product);
});

// Call getAverageRating before remove
reviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.product);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
