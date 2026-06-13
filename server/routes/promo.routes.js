import express from 'express';
import { 
  validatePromo, 
  createPromo, 
  getPromoCodes, 
  deletePromo 
} from '../controllers/promo.controller.js';

// Authentication and role authorization middlewares
import protect from '../middleware/auth.middleware.js';
import adminOnly from '../middleware/admin.middleware.js';

const router = express.Router();

// Validate code (Requires User sign-in to prevent malicious automated coupon checks)
router.post('/validate', protect, validatePromo);

// Administrative Routes
router.post('/', protect, adminOnly, createPromo);
router.get('/', protect, adminOnly, getPromoCodes);
router.delete('/:id', protect, adminOnly, deletePromo);

export default router;
