import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function OrderConfirm() {
  const mockOrderId = 'PB-20260613-0042';

  return (
    <div className="pt-40 min-h-[90vh] flex flex-col items-center justify-center text-center px-6 max-w-2xl mx-auto space-y-6">
      <CheckCircle2 className="w-16 h-16 text-luxury-gold animate-bounce" />
      
      <div className="space-y-2">
        <h1 className="font-display text-3xl md:text-5xl tracking-widest text-luxury-gold uppercase">ORDER PLACED</h1>
        <p className="text-sm text-luxury-gray font-light">
          Your order has been initiated. If you selected manual Bank Transfer, our team is currently verifying the uploaded deposit receipt.
        </p>
      </div>

      <div className="glass-card p-6 rounded-lg border border-luxury-gold/20 w-full text-left space-y-4">
        <div className="flex justify-between items-center text-xs border-b border-luxury-gold/5 pb-3">
          <span className="text-luxury-gray uppercase tracking-widest font-semibold">Order Reference ID</span>
          <span className="font-mono text-luxury-gold font-bold">{mockOrderId}</span>
        </div>
        <div className="text-xs text-luxury-gray font-light leading-relaxed">
          An automated order confirmation receipt has been dispatched to your email address with purchase details and delivery updates.
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full justify-center">
        <Link to={`/track/${mockOrderId}`} className="btn-gold px-6 py-3 rounded text-xs tracking-widest flex items-center justify-center gap-2">
          Track Live Status
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/shop" className="btn-outline px-6 py-3 rounded text-xs tracking-widest text-center">
          Continue Shopping
        </Link>
      </div>

    </div>
  );
}
