import express from 'express';
import { 
  getProductReviews, 
  createReview, 
  approveReview, 
  deleteReview 
} from '../controllers/review.controller.js';

// Authentication and role authorization middlewares
import protect from '../middleware/auth.middleware.js';
import adminOnly from '../middleware/admin.middleware.js';

const router = express.Router();

// Public Routes
router.get('/product/:productId', getProductReviews);

// Protected Routes
router.post('/:productId', protect, createReview);
router.put('/:id/approve', protect, adminOnly, approveReview);
router.delete('/:id', protect, deleteReview);

export default router;
