import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'mongo-sanitize';
import xss from 'xss-clean';

// DB Config
import connectDB from './config/db.js';

// Middlewares
import errorHandler from './middleware/error.middleware.js';

// Sockets
import { initOrderSocket } from './socket/orderSocket.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import reviewRoutes from './routes/review.routes.js';
import adminRoutes from './routes/admin.routes.js';
import promoRoutes from './routes/promo.routes.js';

// Load Env variables
dotenv.config();

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize WebSockets
initOrderSocket(server);

// --- SECURITY MIDDLEWARES ---
// Set secure HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:5000", "ws://localhost:5000"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"]
    }
  }
}));

// CORS setup
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or Postman requests (origin is undefined)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is explicitly in allowedOrigins
    const isAllowed = allowedOrigins.some(allowed => origin === allowed || origin.startsWith(allowed));
    
    // Also allow any dynamic vercel.app subdomains / preview branches
    const isVercel = origin.endsWith('.vercel.app') || origin.includes('vercel.app');
    
    if (isAllowed || isVercel) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true
}));

// --- BODY PARSERS ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logger (dev environment)
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev'));
}

// --- SANITIZERS ---
// Prevent NoSQL Query Injection
app.use((req, res, next) => {
  req.body = mongoSanitize(req.body);
  req.query = mongoSanitize(req.query);
  req.params = mongoSanitize(req.params);
  next();
});

// Prevent Cross-Site Scripting (XSS)
app.use(xss());

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/promo', promoRoutes);

// Root Hello route
app.get('/', (req, res) => {
  res.json({ success: true, message: '✨ AURA Perfumes API — Active' });
});

// --- ERROR HANDLER ---
app.use(errorHandler);

// Listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
