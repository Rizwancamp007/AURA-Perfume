import express from 'express';
import {
  registerUser,
  loginUser,
  verify2FALogin,
  setup2FA,
  verify2FASetup,
  disable2FA,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  getMyProfile,
  updateUserProfile
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authRateLimiter } from '../middleware/lockout.middleware.js';

const router = express.Router();

// Public routes with rate limiters
router.post('/register', authRateLimiter, registerUser);
router.post('/login', authRateLimiter, loginUser);
router.post('/verify-2fa', authRateLimiter, verify2FALogin);
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password/:token', authRateLimiter, resetPassword);
router.post('/refresh', refreshAccessToken);

// Protected routes (User session required)
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMyProfile);
router.put('/update-profile', protect, updateUserProfile);

// Admin / Security settings routes (User session required)
router.post('/2fa/setup', protect, setup2FA);
router.post('/2fa/verify', protect, verify2FASetup);
router.post('/2fa/disable', protect, disable2FA);

export default router;
