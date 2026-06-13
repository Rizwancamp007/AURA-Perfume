import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShieldAlert, ShoppingCart, Users, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="pt-28 min-h-screen max-w-7xl mx-auto px-6 space-y-8">
      
      {/* Title */}
      <div className="border-b border-luxury-gold/10 pb-4">
        <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-gold font-bold">Store Administration</span>
        <h1 className="font-display text-2xl md:text-3xl tracking-widest text-luxury-ivory uppercase mt-1">
          Dashboard Overview
        </h1>
      </div>

      {/* KPI statistics row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="glass-card p-6 rounded-lg border border-luxury-gold/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-luxury-gray">Total Revenue</span>
            <div className="text-xl font-mono text-luxury-gold">Rs. 185,400</div>
          </div>
          <DollarSign className="w-8 h-8 text-luxury-gold/20" />
        </div>

        <div className="glass-card p-6 rounded-lg border border-luxury-gold/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-luxury-gray">Total Orders</span>
            <div className="text-xl font-mono text-luxury-ivory">24</div>
          </div>
          <ShoppingCart className="w-8 h-8 text-luxury-gold/20" />
        </div>

        <div className="glass-card p-6 rounded-lg border border-luxury-gold/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-luxury-gray">Registered Members</span>
            <div className="text-xl font-mono text-luxury-ivory">12</div>
          </div>
          <Users className="w-8 h-8 text-luxury-gold/20" />
        </div>

        <div className="glass-card p-6 rounded-lg border border-luxury-gold/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-luxury-gray">Pending Verifications</span>
            <div className="text-xl font-mono text-amber-500 font-bold">2</div>
          </div>
          <ShieldAlert className="w-8 h-8 text-amber-500/20" />
        </div>

      </div>

      {/* Navigation shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        
        <Link to="/admin/products" className="glass-card p-6 rounded-lg border border-luxury-gold/10 hover:border-luxury-gold/30 transition-all flex justify-between items-center group">
          <div>
            <h4 className="font-display uppercase text-xs tracking-widest text-luxury-gold">Manage Products</h4>
            <p className="text-[10px] text-luxury-gray mt-1">Add, update, or remove boutique perfumes</p>
          </div>
          <ArrowRight className="w-4 h-4 text-luxury-gray group-hover:text-luxury-gold transition-colors" />
        </Link>

        <Link to="/admin/orders" className="glass-card p-6 rounded-lg border border-luxury-gold/10 hover:border-luxury-gold/30 transition-all flex justify-between items-center group">
          <div>
            <h4 className="font-display uppercase text-xs tracking-widest text-luxury-gold">Manage Orders</h4>
            <p className="text-[10px] text-luxury-gray mt-1">Verify bank receipts, modify tracking</p>
          </div>
          <ArrowRight className="w-4 h-4 text-luxury-gray group-hover:text-luxury-gold transition-colors" />
        </Link>

        <Link to="/admin/hero" className="glass-card p-6 rounded-lg border border-luxury-gold/10 hover:border-luxury-gold/30 transition-all flex justify-between items-center group">
          <div>
            <h4 className="font-display uppercase text-xs tracking-widest text-luxury-gold">Hero Banner Editor</h4>
            <p className="text-[10px] text-luxury-gray mt-1">Instantly change homepage content layouts</p>
          </div>
          <ArrowRight className="w-4 h-4 text-luxury-gray group-hover:text-luxury-gold transition-colors" />
        </Link>

      </div>

    </div>
  );
}
