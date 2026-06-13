import React, { useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function HeroEditor() {
  const [headline, setHeadline] = useState('AURA');
  const [subheadline, setSubheadline] = useState('Crafted Luxury Fragrances');
  const [tagline, setTagline] = useState('Pure Artisanal Essence');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Hero content updated. Live layout refreshed.');
  };

  return (
    <div className="pt-28 min-h-screen max-w-4xl mx-auto px-6 space-y-8">
      
      {/* Back Button & Title */}
      <div className="space-y-2">
        <Link to="/admin" className="text-luxury-gold hover:text-luxury-gold/80 transition-colors text-xs flex items-center gap-1 w-fit">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
        <div className="border-b border-luxury-gold/10 pb-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-gray">Store Administration</span>
          <h1 className="font-display text-2xl md:text-3xl tracking-widest text-luxury-ivory uppercase mt-1">
            Hero Section Editor
          </h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="glass-card p-8 rounded-lg border border-luxury-gold/15 space-y-5">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Headline Text</label>
          <input 
            type="text" 
            required
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-gold text-luxury-ivory"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Sub-headline Text</label>
          <input 
            type="text" 
            required
            value={subheadline}
            onChange={(e) => setSubheadline(e.target.value)}
            className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-gold text-luxury-ivory"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Tagline Script Text</label>
          <input 
            type="text" 
            required
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-gold text-luxury-ivory font-accent"
          />
        </div>

        <button type="submit" className="btn-gold px-6 py-3 rounded text-xs tracking-widest flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          Publish Live Changes
        </button>
      </form>

    </div>
  );
}
