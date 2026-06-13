import React from 'react';

export default function About() {
  return (
    <div className="pt-28 min-h-screen max-w-5xl mx-auto px-6 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="font-display font-light text-4xl md:text-6xl tracking-widest text-luxury-gold uppercase">
          OUR ATELIER STORY
        </h1>
        <p className="text-xs uppercase tracking-[0.25em] text-luxury-goldLight font-bold">
          Blended by hand · Crafted in Pakistan
        </p>
      </div>

      <div className="glass-card p-8 rounded-lg border border-luxury-gold/15 space-y-6 text-sm text-luxury-gray leading-relaxed font-light">
        <p>
          Founded in Karachi, <span className="text-luxury-gold font-medium">AURA</span> was established with a singular mission: to bring premium luxury, artisanal perfumery to Pakistan. We believe that a perfume is not merely a cosmetic accessory, but an extension of one's identity.
        </p>
        <p>
          Our ingredients are sourced globally—from the fields of Grasse to the forests of Cambodia and the sandalwood reserves of Mysore. Each blend is balanced, matured, and poured by hand in small, numbered batches to guarantee quality and integrity.
        </p>
        <p>
          We merge traditional craft with modern technology, introducing custom laser engraving directly to our glass decanters, ensuring that each purchase is a personalized work of art.
        </p>
      </div>
    </div>
  );
}
