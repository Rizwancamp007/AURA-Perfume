import express from 'express';
import { 
  getDashboardStats, 
  getAllMembers, 
  getAllOrders, 
  getAllMessages, 
  verifyOrderPayment 
} from '../controllers/admin.controller.js';

import protect from '../middleware/auth.middleware.js';
import adminOnly from '../middleware/admin.middleware.js';

const router = express.Router();

// All routes here are admin-only
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllMembers);
router.get('/orders', getAllOrders);
router.get('/messages', getAllMessages);
router.put('/orders/:id/verify', verifyOrderPayment);

export default router;
