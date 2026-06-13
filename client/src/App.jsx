import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Lenis from 'lenis';

// API & State
import api from './services/api';
import { authSuccess, logout } from './store/authSlice';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BackgroundParticles from './components/layout/BackgroundParticles';
import FloraBackground from './components/layout/FloraBackground';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Checkout from './pages/Checkout';
import OrderConfirm from './pages/OrderConfirm';
import OrderTrack from './pages/OrderTrack';
import Account from './pages/Account';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import HeroEditor from './pages/admin/HeroEditor';

// --- ROUTE WRAPPERS ---
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  if (loading) return <div className="min-h-screen bg-luxury-obsidian flex items-center justify-center"><div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div></div>;
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  if (loading) return <div className="min-h-screen bg-luxury-obsidian flex items-center justify-center"><div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div></div>;
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/" replace />;
};

// --- ANIMATION WRAPPER FOR SCROLL RE-TRIGGERS ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function AppContent() {
  const dispatch = useDispatch();
  const [appLoading, setAppLoading] = useState(true);
  const cursorDotRef = useRef(null);
  const cursorFollowerRef = useRef(null);
  
  // Custom Scent Cursor Trail State
  const [cursorColor, setCursorColor] = useState('border-luxury-gold bg-luxury-gold');

  // Verify active JWT session on app start
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          // Re-populate tokens by firing refresh or using active token
          // Since we verified cookie is valid, we can fetch token
          const refreshRes = await api.post('/auth/refresh');
          dispatch(authSuccess({
            user: res.data.user,
            token: refreshRes.data.accessToken
          }));
        }
      } catch (err) {
        dispatch(logout());
      } finally {
        setAppLoading(false);
      }
    };
    checkSession();
  }, [dispatch]);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Track mouse coordinates for Custom luxury cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorDotRef.current && cursorFollowerRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`;
        cursorDotRef.current.style.top = `${e.clientY}px`;
        
        // Follower trailing animation
        cursorFollowerRef.current.animate({
          left: `${e.clientX}px`,
          top: `${e.clientY}px`
        }, { duration: 500, fill: 'forwards' });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Detect route category changes to update cursor glowing color
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('man')) {
      setCursorColor('border-luxury-blue bg-luxury-blue');
    } else if (path.includes('woman')) {
      setCursorColor('border-luxury-rose bg-luxury-rose');
    } else if (path.includes('unisex')) {
      setCursorColor('border-luxury-sage bg-luxury-sage');
    } else {
      setCursorColor('border-luxury-gold bg-luxury-gold');
    }
  }, [location]);

  if (appLoading) {
    return (
      <div className="fixed inset-0 bg-luxury-obsidian flex flex-col items-center justify-center space-y-4 z-[99999]">
        <div className="font-display font-light text-3xl tracking-[0.2em] text-luxury-gold uppercase animate-pulse">AURA</div>
        <div className="w-16 h-[1px] bg-luxury-gold/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-luxury-gold animate-shimmer" style={{ animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-luxury-obsidian text-luxury-ivory selection:bg-luxury-gold selection:text-luxury-obsidian">
      {/* Background Noise Overlay */}
      <div className="bg-grain"></div>

      {/* Interactive Background Particles */}
      <BackgroundParticles />

      {/* Floating Flora Background leaf illustrations */}
      <FloraBackground />

      {/* Luxury Cursor Elements (Hidden on Touch Devices) */}
      <div className={`hidden md:block custom-cursor ${cursorColor.split(' ')[1]}`} ref={cursorDotRef}></div>
      <div className={`hidden md:block custom-cursor-follower ${cursorColor.split(' ')[0]}`} ref={cursorFollowerRef}></div>

      {/* Header Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="min-h-[80vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirm" element={<OrderConfirm />} />
          <Route path="/track/:orderId" element={<OrderTrack />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* User Protected Profile */}
          <Route path="/account" element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } />

          {/* Admin Panels */}
          <Route path="/admin" element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          } />
          <Route path="/admin/hero" element={
            <AdminRoute>
              <HeroEditor />
            </AdminRoute>
          } />
        </Routes>
      </main>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#12121A',
            color: '#F5F0E8',
            border: '1px solid rgba(201, 169, 110, 0.2)',
            borderRadius: '4px',
            fontFamily: 'DM Sans, sans-serif'
          }
        }}
      />
      <AppContent />
    </Router>
  );
}
