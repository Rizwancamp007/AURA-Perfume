import express from 'express';
import { 
  createOrder, 
  getMyOrders, 
  getOrderById, 
  getTrackedOrder, 
  updateOrderStatus 
} from '../controllers/order.controller.js';

// Authentication and role authorization middlewares
import protect from '../middleware/auth.middleware.js';
import adminOnly from '../middleware/admin.middleware.js';

// Cloudinary storage parser (for manual bank screenshots)
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Public Routes
router.get('/track/:orderId', getTrackedOrder);

// Protected User Routes
router.post('/', protect, upload.single('screenshot'), createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin Routes
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
