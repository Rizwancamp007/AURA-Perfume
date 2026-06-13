import React from 'react';

export default function FloraBackground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none">
      {/* Top Left Ivy Vine */}
      <div className="absolute top-[12vh] -left-12 w-64 h-64 opacity-[0.22] text-luxury-gray animate-flora-left origin-top-left">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          {/* Main Stem */}
          <path d="M10,0 C20,30 15,60 50,80 C60,88 75,90 90,95" fill="none" stroke="currentColor" strokeWidth="1.5" />
          {/* Leaves */}
          <path d="M18,15 C10,10 5,20 18,25 C30,22 25,12 18,15 Z" />
          <path d="M16,35 C5,35 10,48 22,42 C30,35 25,30 16,35 Z" />
          <path d="M25,50 C20,65 35,65 33,52 C32,45 28,45 25,50 Z" />
          <path d="M38,68 C35,80 50,75 45,66 C42,60 39,62 38,68 Z" />
          <path d="M60,82 C65,95 80,85 70,78 C65,75 62,78 60,82 Z" />
        </svg>
      </div>

      {/* Middle Right Olive Leaf Branch */}
      <div className="absolute top-[85vh] -right-16 w-80 h-80 opacity-[0.18] text-luxury-gold animate-flora-right origin-top-right">
        <svg viewBox="0 0 120 120" fill="currentColor" className="w-full h-full">
          {/* Stem */}
          <path d="M120,10 C90,40 60,70 10,110" fill="none" stroke="currentColor" strokeWidth="1.8" />
          {/* Elegant pointed leaves */}
          <path d="M100,25 C85,20 80,35 98,38 C110,38 110,28 100,25 Z" />
          <path d="M85,42 C70,38 65,52 82,56 C95,56 95,46 85,42 Z" />
          <path d="M68,60 C55,55 50,70 66,74 C78,74 78,64 68,60 Z" />
          <path d="M50,78 C38,72 32,88 48,90 C60,90 60,80 50,78 Z" />
          <path d="M30,95 C20,90 15,102 28,105 C38,105 38,96 30,95 Z" />
        </svg>
      </div>

      {/* Bottom Left Wild Rose Stem */}
      <div className="absolute top-[170vh] -left-20 w-96 h-96 opacity-[0.16] text-luxury-gray animate-flora-left origin-bottom-left">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          {/* Curved thorn stem */}
          <path d="M0,100 C20,80 30,50 60,40 C80,30 90,15 100,0" fill="none" stroke="currentColor" strokeWidth="1.2" />
          {/* Leaves */}
          <path d="M15,82 C10,72 22,68 24,78 C25,84 20,85 15,82 Z" />
          <path d="M28,62 C22,50 35,48 36,58 C37,65 32,66 28,62 Z" />
          <path d="M48,46 C42,35 55,30 57,40 C58,47 52,48 48,46 Z" />
          <path d="M72,28 C68,18 80,12 82,22 C83,28 78,30 72,28 Z" />
        </svg>
      </div>
    </div>
  );
}
