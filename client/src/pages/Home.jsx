import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShoppingBag, Clock, Tag } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import toast from 'react-hot-toast';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from '../components/layout/SEO';
import api from '../services/api';
import BottleViewer from '../components/BottleViewer';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);
  const curtainRef = useRef(null);
  const curtainLogoRef = useRef(null);
  const curtainBarRef = useRef(null);

  const heroTitleRef = useRef(null);
  const heroTaglineRef = useRef(null);
  const heroDescRef = useRef(null);
  const heroActionsRef = useRef(null);

  const cardsRef = useRef([]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 23, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddBundle = () => {
    dispatch(addToCart({
      product: 'bundle_trio',
      name: 'AURA Trilogy Gift Set (3x50ml)',
      price: 14900,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600&auto=format&fit=crop',
      size: '50ml (Trilogy Set)',
      engravingText: '',
      engravingFont: ''
    }));
    toast.success('AURA Trilogy Bundle Set added to your bag!');
  };

  const FALLBACK_PRODUCTS = [
    {
      _id: 'unisex_perfume_1',
      name: 'OUD DE KARACHI',
      category: 'unisex',
      tagline: 'Artisanal Golden Saffron & Warm Oud Wood',
      price: 8500,
      images: ['https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600&auto=format&fit=crop'],
      scentNotes: { top: ['Saffron'], heart: ['Oud'], base: ['Amberwood'] }
    },
    {
      _id: 'woman_perfume_1',
      name: 'ROSE IMPÉRIAL',
      category: 'woman',
      tagline: 'Delicate Bulgarian Rose & Soft White Musk',
      price: 7200,
      images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop'],
      scentNotes: { top: ['Lychee'], heart: ['Turkish Rose'], base: ['Cashmere Musk'] }
    },
    {
      _id: 'man_perfume_1',
      name: 'NIGHT ODYSSEY',
      category: 'man',
      tagline: 'Mysterious Midnight Leather & Spiced Cardamom',
      price: 6800,
      images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600&auto=format&fit=crop'],
      scentNotes: { top: ['Cardamom'], heart: ['Lavender'], base: ['Leather'] }
    }
  ];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products');
        if (res.data.success && res.data.products && res.data.products.length > 0) {
          // Filter featured items or take first 3
          const featured = res.data.products.filter(p => p.isFeatured);
          setProducts(featured.length > 0 ? featured.slice(0, 3) : res.data.products.slice(0, 3));
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
      } catch (err) {
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    // --- 1. INTRO CURTAIN TIMELINE ---
    const introTl = gsap.timeline();

    // Set initial logo properties
    introTl.set(curtainLogoRef.current, { opacity: 0, y: 20 });
    introTl.set(curtainBarRef.current, { scaleX: 0 });

    // Animate curtain elements
    introTl
      .to(curtainLogoRef.current, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' })
      .to(curtainBarRef.current, { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, '-=0.4')
      .to(curtainLogoRef.current, { opacity: 0, y: -20, duration: 0.8, ease: 'power3.in', delay: 0.5 })
      .to(curtainBarRef.current, { scaleX: 0, duration: 0.6, ease: 'power3.in' }, '-=0.6')
      .to(curtainRef.current, { 
        yPercent: -100, 
        duration: 1.2, 
        ease: 'power4.inOut',
        onComplete: () => {
          // Enable scrolling after curtain departs
          document.body.style.overflow = 'auto';
        }
      });

    // --- 2. HERO CONTENT ENTRANCE (Chained to curtain) ---
    introTl
      .fromTo(heroTaglineRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3')
      .fromTo(heroTitleRef.current, { opacity: 0, letterSpacing: '0.3em' }, { opacity: 1, letterSpacing: '0.15em', duration: 1.5, ease: 'power3.out' }, '-=0.5')
      .fromTo(heroDescRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.8')
      .fromTo(heroActionsRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');

    // --- 3. SCROLLTRIGGER CARDS REVEAL ---
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#features-section',
          start: 'top 80%', // Starts when section top reaches 80% viewport
          toggleActions: 'play none none none',
        }
      }
    );

    return () => {
      // Clean up scrolltriggers
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="relative overflow-hidden" ref={containerRef}>
      <SEO />
      
      {/* 🎬 LUXURY ENTRANCE CURTAIN OVERLAY */}
      <div 
        ref={curtainRef}
        className="fixed inset-0 z-[100] bg-luxury-obsidian flex flex-col items-center justify-center border-b border-luxury-gold/15"
      >
        <span 
          ref={curtainLogoRef}
          className="font-display font-light text-5xl tracking-[0.3em] text-luxury-gold uppercase"
        >
          AURA
        </span>
        <div 
          ref={curtainBarRef}
          className="w-24 h-[1px] bg-luxury-gold/50 mt-4 origin-center"
        ></div>
      </div>

      {/* Cinematic Hero Segment */}
      <section className="relative min-h-[95vh] flex flex-col justify-center px-6 overflow-hidden pt-20">
        
        {/* Glowing aura lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-luxury-gold/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-10 left-1/4 w-96 h-96 rounded-full bg-luxury-rose/5 blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 py-12">
          
          {/* Left Column: Hero Typography */}
          <div className="space-y-6 text-center lg:text-left">
            <h2 
              ref={heroTaglineRef}
              className="font-accent text-3xl md:text-5xl text-luxury-goldLight tracking-wide"
            >
              Pure Artisanal Essence
            </h2>
            
            <h1 
              ref={heroTitleRef}
              className="font-display font-light text-5xl md:text-7xl leading-tight text-luxury-ivory uppercase"
            >
              AURA FRAGRANCES
            </h1>
            
            <p 
              ref={heroDescRef}
              className="font-sans text-sm md:text-base text-luxury-gray font-light tracking-wide max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Unveiling a rare collection of hand-blended, custom-engraved perfume bottles made in Pakistan. A luxury sensory statement crafted to linger in memory.
            </p>

            {/* Action CTAs */}
            <div 
              ref={heroActionsRef}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6"
            >
              <Link to="/shop" className="btn-gold px-8 py-3.5 rounded text-xs tracking-[0.15em] flex items-center gap-2">
                Explore Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#brand-film" className="btn-outline px-8 py-3.5 rounded text-xs tracking-[0.15em] hover:bg-luxury-gold/5 transition-all">
                Watch Film
              </a>
            </div>
          </div>

          {/* Right Column: Interactive 3D Bottle Viewer (Wow factor) */}
          <div className="w-full max-w-md mx-auto aspect-square lg:aspect-auto lg:h-[450px] relative">
            {/* Ambient decorative glowing rings around the bottle */}
            <div className="absolute inset-0 rounded-full border border-luxury-gold/5 animate-spin-slow pointer-events-none"></div>
            <div className="absolute inset-4 rounded-full border border-dashed border-luxury-gold/10 animate-spin-reverse pointer-events-none"></div>
            <BottleViewer category="unisex" wantsEngraving={false} />
          </div>

        </div>

        {/* Scroll down mouse indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-luxury-gray/40">
          <span className="text-[9px] uppercase tracking-[0.3em]">Scroll Down</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-luxury-gold/40 to-transparent"></div>
        </div>

      </section>

      {/* 🌹 BOTANICAL SECTION DIVIDER */}
      <div className="w-full flex items-center justify-center my-6 opacity-30 text-luxury-gold">
        <svg className="w-64 h-8" viewBox="0 0 200 30" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M0,15 Q50,10 100,15 T200,15" />
          <path d="M30,13 C30,8 35,5 40,13 C35,13 32,13 30,13 Z" fill="currentColor" />
          <path d="M70,16 C70,21 75,24 80,16 C75,16 72,16 70,16 Z" fill="currentColor" />
          <path d="M120,13 C120,8 125,5 130,13 C125,13 122,13 120,13 Z" fill="currentColor" />
          <path d="M160,16 C160,21 165,24 170,16 C165,16 162,16 160,16 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Quick features Grid */}
      <section 
        id="features-section"
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div 
            ref={el => cardsRef.current[0] = el}
            className="glass-card p-8 rounded text-center space-y-3"
          >
            <h3 className="font-display text-lg tracking-widest text-luxury-gold uppercase">Handcrafted Blend</h3>
            <p className="text-sm text-luxury-gray font-light leading-relaxed">
              Every scent profile is carefully blended and matured in individual glass vessels for 60 days before bottling.
            </p>
          </div>

          <div 
            ref={el => cardsRef.current[1] = el}
            className="glass-card p-8 rounded text-center space-y-3"
          >
            <h3 className="font-display text-lg tracking-widest text-luxury-gold uppercase">Personal Engraving</h3>
            <p className="text-sm text-luxury-gray font-light leading-relaxed">
              Customize your selection with premium dynamic engraving. Type your name and see it etched onto the glass bottle.
            </p>
          </div>

          <div 
            ref={el => cardsRef.current[2] = el}
            className="glass-card p-8 rounded text-center space-y-3"
          >
            <h3 className="font-display text-lg tracking-widest text-luxury-gold uppercase">Local Direct Shipping</h3>
            <p className="text-sm text-luxury-gray font-light leading-relaxed">
              Dispatched directly from our atelier in Karachi with express tracked delivery across all cities in Pakistan.
            </p>
          </div>

        </div>
      </section>

      {/* 🌹 BOTANICAL SECTION DIVIDER */}
      <div className="w-full flex items-center justify-center my-6 opacity-30 text-luxury-gold">
        <svg className="w-64 h-8" viewBox="0 0 200 30" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M0,15 Q50,10 100,15 T200,15" />
          <path d="M30,13 C30,8 35,5 40,13 C35,13 32,13 30,13 Z" fill="currentColor" />
          <path d="M70,16 C70,21 75,24 80,16 C75,16 72,16 70,16 Z" fill="currentColor" />
          <path d="M120,13 C120,8 125,5 130,13 C125,13 122,13 120,13 Z" fill="currentColor" />
          <path d="M160,16 C160,21 165,24 170,16 C165,16 162,16 160,16 Z" fill="currentColor" />
        </svg>
      </div>

      {/* 🌟 FEATURED COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-6 py-24 bg-luxury-slate/5">
        <div className="text-center space-y-4 mb-16">
          <span className="font-accent text-lg text-luxury-gold">Signature Offerings</span>
          <h2 className="font-display font-light text-3xl md:text-5xl uppercase tracking-widest text-luxury-ivory">Featured Collection</h2>
          <div className="w-12 h-[1px] bg-luxury-gold/50 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id || product.id} className="glass-card rounded overflow-hidden flex flex-col group border border-luxury-gold/5 hover:border-luxury-gold/30 transition-all duration-300">
              
              {/* Product Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-luxury-slate/10">
                <img 
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600&auto=format&fit=crop'} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <span className="absolute top-4 left-4 bg-luxury-obsidian/80 border border-luxury-gold/20 px-3 py-1 rounded text-[9px] uppercase tracking-widest text-luxury-gold">
                  {product.category}
                </span>
              </div>

              {/* Product Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-display text-sm tracking-widest text-luxury-ivory">{product.name}</h3>
                  <p className="text-[10px] text-luxury-gray font-light italic leading-relaxed line-clamp-2">
                    {product.tagline}
                  </p>
                  
                  {/* Scent notes pills */}
                  {product.scentNotes && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {product.scentNotes.top?.slice(0, 1).map((note, idx) => (
                        <span key={idx} className="bg-luxury-gold/5 border border-luxury-gold/10 text-[8px] text-luxury-gold px-2 py-0.5 rounded">
                          Top: {note}
                        </span>
                      ))}
                      {product.scentNotes.heart?.slice(0, 1).map((note, idx) => (
                        <span key={idx} className="bg-luxury-gold/5 border border-luxury-gold/10 text-[8px] text-luxury-gold px-2 py-0.5 rounded">
                          Heart: {note}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pt-2 border-t border-luxury-gold/5">
                    <span className="text-xs text-luxury-gray font-light">Price</span>
                    <span className="font-mono text-sm text-luxury-gold">Rs. {product.price.toLocaleString()}</span>
                  </div>
                  
                  <Link 
                    to={`/product/${product._id || product.id}`} 
                    className="btn-gold block text-center py-2.5 rounded text-[9px] tracking-widest font-medium uppercase transition-colors"
                  >
                    Discover Scent
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 🌹 BOTANICAL SECTION DIVIDER */}
      <div className="w-full flex items-center justify-center my-6 opacity-30 text-luxury-gold">
        <svg className="w-64 h-8" viewBox="0 0 200 30" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M0,15 Q50,10 100,15 T200,15" />
          <path d="M30,13 C30,8 35,5 40,13 C35,13 32,13 30,13 Z" fill="currentColor" />
          <path d="M70,16 C70,21 75,24 80,16 C75,16 72,16 70,16 Z" fill="currentColor" />
          <path d="M120,13 C120,8 125,5 130,13 C125,13 122,13 120,13 Z" fill="currentColor" />
          <path d="M160,16 C160,21 165,24 170,16 C165,16 162,16 160,16 Z" fill="currentColor" />
        </svg>
      </div>

      {/* 🎬 CINEMATIC BRAND STATEMENT (Video Background via YouTube Embed) */}
      <section id="brand-film" className="relative h-[65vh] flex items-center justify-center overflow-hidden my-16 border-y border-luxury-gold/15 bg-black">
        {/* Background Iframe wrapper scaled to crop black bars */}
        <div className="absolute inset-0 w-full h-[150%] -top-[25%] pointer-events-none scale-110">
          <iframe 
            src="https://www.youtube.com/embed/aRYc1AYdxKk?autoplay=1&mute=1&loop=1&playlist=aRYc1AYdxKk&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0" 
            title="Aura Brand Film"
            className="w-full h-full object-cover border-0 opacity-40 mix-blend-lighten"
            allow="autoplay; encrypted-media"
            frameBorder="0"
          ></iframe>
        </div>
        
        {/* Soft gold wash over the video */}
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-obsidian/30 via-transparent to-luxury-obsidian/30"></div>

        {/* Content Overlay */}
        <div className="relative z-10 text-center max-w-4xl px-6 space-y-6">
          <span className="font-accent text-xl md:text-2xl text-luxury-goldLight tracking-widest block">The Spirit of Atelier</span>
          <h2 className="font-display font-light text-2xl md:text-4xl text-luxury-ivory leading-relaxed tracking-wider">
            "A fragrance is not merely an olfactory blend. It is a memory captured in liquid amber, a silent statement of identity carved in hand-finished glass."
          </h2>
          <div className="w-16 h-[1px] bg-luxury-gold/50 mx-auto"></div>
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-luxury-gray">Aura Master Perfumer</span>
        </div>
      </section>

      {/* 🌹 BOTANICAL SECTION DIVIDER */}
      <div className="w-full flex items-center justify-center my-6 opacity-30 text-luxury-gold">
        <svg className="w-64 h-8" viewBox="0 0 200 30" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M0,15 Q50,10 100,15 T200,15" />
          <path d="M30,13 C30,8 35,5 40,13 C35,13 32,13 30,13 Z" fill="currentColor" />
          <path d="M70,16 C70,21 75,24 80,16 C75,16 72,16 70,16 Z" fill="currentColor" />
          <path d="M120,13 C120,8 125,5 130,13 C125,13 122,13 120,13 Z" fill="currentColor" />
          <path d="M160,16 C160,21 165,24 170,16 C165,16 162,16 160,16 Z" fill="currentColor" />
        </svg>
      </div>

      {/* 🎁 EXCLUSIVE BUNDLE DEALS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 mb-20">
        <div className="glass-card rounded-lg p-8 md:p-12 border border-luxury-gold/25 relative overflow-hidden bg-gradient-to-br from-luxury-slate/30 to-luxury-champagne/20">
          {/* Subtle floral background highlight */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-luxury-gold/5 blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Bundle Imagery & Timer */}
            <div className="space-y-6">
              <div className="relative aspect-video rounded overflow-hidden shadow-lg border border-luxury-gold/15 bg-luxury-slate/20">
                <img 
                  src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600&auto=format&fit=crop" 
                  alt="AURA Trilogy Gift Set" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-4 left-4 bg-red-500/90 text-white text-[9px] uppercase tracking-[0.2em] font-semibold px-3 py-1 rounded">
                  Limited Offer
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="bg-luxury-slate/50 border border-luxury-gold/15 rounded p-4 text-center space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-luxury-gray font-light flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-luxury-gold" />
                  Exclusive Flash Bundle Ends In
                </span>
                
                <div className="flex justify-center items-center gap-4 pt-1">
                  <div className="flex flex-col">
                    <span className="font-mono text-2xl md:text-3xl text-luxury-gold font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase tracking-widest text-luxury-gray">hours</span>
                  </div>
                  <span className="text-xl text-luxury-gold">:</span>
                  <div className="flex flex-col">
                    <span className="font-mono text-2xl md:text-3xl text-luxury-gold font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase tracking-widest text-luxury-gray">mins</span>
                  </div>
                  <span className="text-xl text-luxury-gold">:</span>
                  <div className="flex flex-col">
                    <span className="font-mono text-2xl md:text-3xl text-luxury-gold font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase tracking-widest text-luxury-gray">secs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Bundle Details & Order Call to Action */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="font-accent text-lg text-luxury-gold flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Special Curation
                </span>
                <h2 className="font-display font-light text-3xl md:text-4xl tracking-widest text-luxury-ivory uppercase">
                  AURA Trilogy Gift Set
                </h2>
                <p className="text-sm text-luxury-gray font-light leading-relaxed">
                  Indulge in the complete AURA collection. This premier gift pack bundles our three iconic fragrances—<strong>Oud de Karachi</strong>, <strong>Rose Impérial</strong>, and <strong>Night Odyssey</strong>—in our signature 50ml glass spray bottles.
                </p>
                <p className="text-xs text-luxury-gray font-light italic">
                  Presented in a bespoke handcrafted lacquer wooden keepsake box. Perfect for collectors or gifting.
                </p>
              </div>

              {/* Perks Grid */}
              <div className="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-wider text-luxury-gray font-medium pt-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                  Free Wooden Keepsake Box
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                  Free Express Delivery
                </div>
              </div>

              {/* Price Calculation & Add to Cart */}
              <div className="pt-4 border-t border-luxury-gold/10 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-luxury-gray font-light block">Trilogy Value</span>
                    <span className="text-sm text-luxury-gray/50 line-through font-mono">Rs. 18,800</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-xs text-luxury-gold font-semibold block">Special Bundle Price</span>
                    <span className="text-2xl font-mono text-luxury-gold font-bold">Rs. 14,900</span>
                  </div>
                </div>

                <button 
                  onClick={handleAddBundle}
                  className="w-full btn-gold py-3.5 rounded text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Claim Trilogy Bundle (Save Rs. 3,900)
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
