import express from 'express';
import { 
  getProducts, 
  getProductBySlug, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/product.controller.js';

// Authentication and role authorization middlewares
import protect from '../middleware/auth.middleware.js';
import adminOnly from '../middleware/admin.middleware.js';

// Multer storage engine
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Public Routes
router.get('/', getProducts);
router.get('/id/:id', getProductById);
router.get('/:slug', getProductBySlug);

// Admin Routes (Create, Update, Delete)
router.post(
  '/', 
  protect, 
  adminOnly, 
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'video', maxCount: 1 },
    { name: 'model3D', maxCount: 1 }
  ]),
  createProduct
);

router.put(
  '/:id', 
  protect, 
  adminOnly, 
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'video', maxCount: 1 },
    { name: 'model3D', maxCount: 1 }
  ]),
  updateProduct
);

router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
