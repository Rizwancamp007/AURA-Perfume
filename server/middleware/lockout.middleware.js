import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 login/signup actions per 15 minutes
  message: {
    success: false,
    message: 'Too many authentication attempts from this network. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
