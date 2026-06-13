import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, User, Menu, X, LogOut, Settings, Eye, EyeOff, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

import api from '../../services/api';
import { authStart, authSuccess, authFailure, logout } from '../../store/authSlice';
import { clearCart } from '../../store/cartSlice';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot' | '2fa'
  const [cartOpen, setCartOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // 2FA state variables
  const [temp2FAToken, setTemp2FAToken] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    dispatch(authStart());

    try {
      if (authMode === 'login') {
        const res = await api.post('/auth/login', { email, password });
        
        if (res.data.require2FA) {
          setTemp2FAToken(res.data.tempToken);
          setAuthMode('2fa');
          toast.success('Admin key required. Please check Authenticator App.');
          dispatch(authFailure(null)); // Clear loading state
        } else {
          dispatch(authSuccess({ user: res.data.user, token: res.data.accessToken }));
          setAuthModalOpen(false);
          toast.success(`Welcome back, ${res.data.user.name}!`);
          resetForm();
        }
      } 
      else if (authMode === '2fa') {
        const res = await api.post('/auth/verify-2fa', {
          tempToken: temp2FAToken,
          code: twoFactorCode
        });
        dispatch(authSuccess({ user: res.data.user, token: res.data.accessToken }));
        setAuthModalOpen(false);
        toast.success(`Access granted. Welcome back, ${res.data.user.name}!`);
        resetForm();
        if (res.data.user.role === 'admin') {
          navigate('/admin');
        }
      }
      else if (authMode === 'register') {
        const res = await api.post('/auth/register', { name, email, phone, password });
        dispatch(authSuccess({ user: res.data.user, token: res.data.accessToken }));
        setAuthModalOpen(false);
        toast.success(`Account created! Welcome, ${res.data.user.name}!`);
        resetForm();
      } 
      else if (authMode === 'forgot') {
        const res = await api.post('/auth/forgot-password', { email });
        toast.success(res.data.message);
        setAuthMode('login');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Authentication failed';
      dispatch(authFailure(errMsg));
      toast.error(errMsg);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      dispatch(logout());
      dispatch(clearCart());
      toast.success('Logged out successfully');
      navigate('/');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setTwoFactorCode('');
    setTemp2FAToken('');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-luxury-gold/10 bg-luxury-obsidian/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Mobile hamburger menu toggle */}
          <button 
            className="md:hidden text-luxury-gray hover:text-luxury-gold transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo brand */}
          <Link to="/" className="flex flex-col items-center">
            <span className="font-display font-light text-2xl md:text-3xl tracking-[0.25em] text-luxury-gold">AURA</span>
            <span className="font-accent text-xs text-luxury-goldLight -mt-1">Pure Artisanal Essence</span>
          </Link>

          {/* Navigation Links Desktop */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="font-sans text-sm uppercase tracking-widest text-luxury-gray hover:text-luxury-gold transition-colors">Home</Link>
            <Link to="/shop" className="font-sans text-sm uppercase tracking-widest text-luxury-gray hover:text-luxury-gold transition-colors">Shop</Link>
            <Link to="/about" className="font-sans text-sm uppercase tracking-widest text-luxury-gray hover:text-luxury-gold transition-colors">Story</Link>
            <Link to="/contact" className="font-sans text-sm uppercase tracking-widest text-luxury-gray hover:text-luxury-gold transition-colors">Contact</Link>
          </div>

          {/* Actions drawer icons */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.role === 'admin' && (
                  <Link to="/admin" title="Admin Dashboard" className="text-luxury-gray hover:text-luxury-gold transition-colors">
                    <Shield className="w-5 h-5 text-luxury-gold" />
                  </Link>
                )}
                <Link to="/account" title="My Account" className="text-luxury-gray hover:text-luxury-gold transition-colors">
                  <User className="w-5 h-5" />
                </Link>
                <button onClick={handleLogout} title="Logout" className="text-luxury-gray hover:text-red-400 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
                className="text-luxury-gray hover:text-luxury-gold transition-colors"
                title="Login / Register"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            {/* Shopping cart trigger */}
            <button 
              onClick={() => setCartOpen(true)}
              className="relative text-luxury-gray hover:text-luxury-gold transition-colors focus:outline-none"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-obsidian text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse-subtle">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-luxury-obsidian/95 backdrop-blur-lg flex flex-col p-6 animate-fade-in">
          <div className="flex justify-between items-center mb-10">
            <span className="font-display font-light text-2xl tracking-[0.2em] text-luxury-gold">AURA</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-luxury-gray hover:text-luxury-gold">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col space-y-6 text-center mt-10">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="font-display text-2xl uppercase tracking-widest text-luxury-ivory hover:text-luxury-gold">Home</Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="font-display text-2xl uppercase tracking-widest text-luxury-ivory hover:text-luxury-gold">Shop Collection</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="font-display text-2xl uppercase tracking-widest text-luxury-ivory hover:text-luxury-gold">Our Story</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="font-display text-2xl uppercase tracking-widest text-luxury-ivory hover:text-luxury-gold">Contact Us</Link>
          </div>
        </div>
      )}

      {/* AUTH MODAL POPUP */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="glass-card w-full max-w-md p-8 rounded-lg relative border border-luxury-gold/20">
            <button 
              onClick={() => { setAuthModalOpen(false); resetForm(); }}
              className="absolute top-4 right-4 text-luxury-gray hover:text-luxury-gold transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="text-center mb-8">
              <h3 className="font-display text-2xl tracking-widest text-luxury-gold uppercase">
                {authMode === 'login' && 'Login'}
                {authMode === 'register' && 'Register'}
                {authMode === 'forgot' && 'Reset Password'}
                {authMode === '2fa' && 'Security Code'}
              </h3>
              <p className="text-xs text-luxury-gray mt-1">
                {authMode === 'login' && 'Immerse in your curated olfactory journey'}
                {authMode === 'register' && 'Join the AURA Fragrance Club'}
                {authMode === 'forgot' && 'Enter your email to receive recovery instructions'}
                {authMode === '2fa' && 'Enter the code from your Google Authenticator app'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-5">
              {authMode === 'register' && (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-luxury-slate/50 border border-luxury-gold/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                    placeholder="Muhammad Khan"
                  />
                </div>
              )}

              {authMode !== '2fa' && (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-luxury-slate/50 border border-luxury-gold/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                    placeholder="user@example.com"
                  />
                </div>
              )}

              {authMode === 'register' && (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-luxury-slate/50 border border-luxury-gold/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                    placeholder="03001234567"
                  />
                </div>
              )}

              {(authMode === 'login' || authMode === 'register') && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] uppercase tracking-widest text-luxury-gray">Password</label>
                    {authMode === 'login' && (
                      <button 
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-[10px] text-luxury-gold hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-luxury-slate/50 border border-luxury-gold/20 rounded pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-luxury-gray hover:text-luxury-gold"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {authMode === '2fa' && (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">6-Digit Code</label>
                  <input 
                    type="text" 
                    required 
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="w-full text-center bg-luxury-slate/50 border border-luxury-gold/20 rounded px-4 py-3 text-lg font-mono tracking-[0.5em] focus:outline-none focus:border-luxury-gold text-luxury-gold"
                    placeholder="000000"
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-gold py-3 text-xs tracking-[0.2em] font-medium disabled:opacity-50 mt-2"
              >
                {loading ? 'Processing...' : (
                  authMode === 'login' && 'Enter Boutique' ||
                  authMode === 'register' && 'Create Identity' ||
                  authMode === 'forgot' && 'Send Request' ||
                  authMode === '2fa' && 'Verify Credentials'
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            {authMode !== '2fa' && (
              <div className="text-center mt-6 pt-4 border-t border-luxury-gold/10 text-xs">
                {authMode === 'login' ? (
                  <p className="text-luxury-gray">
                    New to AURA?{' '}
                    <button onClick={() => setAuthMode('register')} className="text-luxury-gold hover:underline font-medium">
                      Register Here
                    </button>
                  </p>
                ) : (
                  <p className="text-luxury-gray">
                    Already registered?{' '}
                    <button onClick={() => setAuthMode('login')} className="text-luxury-gold hover:underline font-medium">
                      Login Here
                    </button>
                  </p>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Sliding Bag Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
