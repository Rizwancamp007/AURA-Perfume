import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Star, Sparkles, HelpCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';

import { addToCart } from '../store/cartSlice';
import BottleViewer from '../components/BottleViewer';
import SEO from '../components/layout/SEO';

const MOCK_PRODUCTS = {
  'man_perfume_1': {
    _id: 'man_perfume_1',
    name: 'NIGHT ODYSSEY',
    category: 'man',
    tagline: 'Bold & Mysterious Wood',
    price: 6800,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800'],
    description: 'A deep, rich oriental blend with layers of Cambodian Oud, Amberwood, and pink pepper. Specially blended for cold evening statements. Formulated to persist on the wearer for up to 12 hours.',
    scentNotes: {
      top: ['Pink Pepper', 'Bergamot', 'Grapefruit'],
      heart: ['Lavender', 'Saffron', 'Cinnamon'],
      base: ['Cambodian Oud', 'Amberwood', 'Tobacco', 'Leather']
    }
  },
  'woman_perfume_1': {
    _id: 'woman_perfume_1',
    name: 'ROSE IMPÉRIAL',
    category: 'woman',
    tagline: 'Sensual Velvet Rose',
    price: 7200,
    images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800'],
    description: 'An elegant, feminine combination of pure Turkish Rose extract, white musk, and Madagascan vanilla. Drapes the wearer in a velvet floral aura. Lends a sense of royal presence.',
    scentNotes: {
      top: ['Bergamot', 'Mandarin Orange', 'Pear'],
      heart: ['Turkish Rose', 'Grasse Jasmine', 'Peony'],
      base: ['White Musk', 'Madagascan Vanilla', 'Patchouli', 'Sandalwood']
    }
  },
  'unisex_perfume_1': {
    _id: 'unisex_perfume_1',
    name: 'OUD DE KARACHI',
    category: 'unisex',
    tagline: 'Warm Spice & Saffron',
    price: 8500,
    images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800'],
    description: 'Our signature blend. Rich Persian saffron, Kashmiri tea extracts, Mysore sandalwood, and light agarwood notes. Crafted for modern connoisseurs who appreciate depth and complexity.',
    scentNotes: {
      top: ['Persian Saffron', 'Kashmiri Tea', 'Cardamom'],
      heart: ['Jasmine Sambac', 'Nutmeg', 'Cloves'],
      base: ['Mysore Sandalwood', 'Agarwood (Oud)', 'Amber', 'Patchouli']
    }
  }
};

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  const product = MOCK_PRODUCTS[id];

  if (!product) {
    return (
      <div className="pt-40 min-h-screen text-center space-y-6">
        <h2 className="font-display text-3xl text-luxury-gold">Fragrance Not Found</h2>
        <button onClick={() => navigate('/shop')} className="btn-gold px-6 py-2 rounded text-xs">Return to Collection</button>
      </div>
    );
  }

  // State Management
  const [quantity, setQuantity] = useState(1);
  const [wantsEngraving, setWantsEngraving] = useState(false);
  const [engravingText, setEngravingText] = useState('');
  const [engravingFont, setEngravingFont] = useState('serif'); // 'serif' | 'script' | 'sans'
  const [activeNoteTab, setActiveNoteTab] = useState('top'); // 'top' | 'heart' | 'base'
  const [size, setSize] = useState('50ml'); // '30ml' | '50ml' | '100ml'

  const getProductPrice = () => {
    let p = product.price;
    if (size === '30ml') p -= 1500;
    if (size === '100ml') p += 3000;
    if (wantsEngraving) p += 500;
    return p;
  };

  const handleAddToCart = () => {
    // Check constraints
    if (wantsEngraving && !engravingText.trim()) {
      toast.error('Please enter the initials or name for engraving');
      return;
    }

    let baseSizePrice = product.price;
    if (size === '30ml') baseSizePrice -= 1500;
    if (size === '100ml') baseSizePrice += 3000;

    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: baseSizePrice,
      quantity,
      size,
      engravingText: wantsEngraving ? engravingText : '',
      engravingFont: wantsEngraving ? engravingFont : ''
    }));

    toast.success(`${product.name} (${size}) added to cart!`);
  };

  return (
    <div className="pt-28 min-h-screen max-w-7xl mx-auto px-6">
      <SEO title={product.name} description={`${product.name} — ${product.tagline}. ${product.description}`} />
      
      {/* Upper Segment: Gallery and Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        
        {/* Left Column: Interactive 3D Bottle Viewer */}
        <div className="space-y-6">
          <BottleViewer 
            category={product.category}
            engravingText={engravingText}
            engravingFont={engravingFont}
            wantsEngraving={wantsEngraving}
          />
          <div className="grid grid-cols-3 gap-4">
            <div className="aspect-square bg-luxury-slate/20 border border-luxury-gold/10 rounded overflow-hidden">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="col-span-2 bg-luxury-slate/10 border border-luxury-gold/10 rounded p-4 flex flex-col justify-center text-xs space-y-1 text-luxury-gray">
              <span className="text-luxury-gold font-semibold uppercase tracking-wider text-[10px]">Atelier Customization</span>
              <p className="font-light">Initials are carved onto the front plate in real-time. Turn the bottle around in 3D above to inspect all facets.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Configuration & Purchase */}
        <div className="space-y-6">
          
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-bold">
              {product.category} collection
            </span>
            <h1 className="font-display text-4xl md:text-5xl tracking-widest text-luxury-ivory uppercase mt-1">
              {product.name}
            </h1>
            <p className="text-xs text-luxury-goldLight italic mt-1 font-light tracking-widest">
              {product.tagline}
            </p>
          </div>

          <div className="text-2xl font-mono tracking-widest text-luxury-ivory pt-2 border-t border-luxury-gold/5">
            Rs. {getProductPrice().toLocaleString()}
          </div>

          <p className="text-sm text-luxury-gray leading-relaxed font-light">
            {product.description}
          </p>

          {/* BOTTLE SIZE SELECTOR */}
          <div className="space-y-2 pt-2 border-t border-luxury-gold/5">
            <label className="block text-[10px] uppercase tracking-widest text-luxury-gray font-bold">
              Select Volume
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '30ml', value: '30ml', priceText: '- Rs. 1,500' },
                { label: '50ml', value: '50ml', priceText: 'Base' },
                { label: '100ml', value: '100ml', priceText: '+ Rs. 3,000' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSize(opt.value)}
                  className={`py-2 px-3 border rounded text-center transition-all ${
                    size === opt.value
                      ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5'
                      : 'border-luxury-gold/10 text-luxury-gray hover:text-luxury-ivory'
                  }`}
                >
                  <span className="block text-xs font-semibold">{opt.label}</span>
                  <span className="block text-[8px] font-mono tracking-tighter opacity-80">{opt.priceText}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CUSTOM BOTTLE ENGRAVING PANEL (Premium wow factor) */}
          <div className="glass-card p-5 rounded-lg border border-luxury-gold/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-luxury-gold" />
                <h4 className="font-display uppercase text-xs tracking-widest text-luxury-gold font-semibold">
                  Personal Glass Engraving
                </h4>
              </div>
              <span className="text-[10px] bg-luxury-gold/15 text-luxury-gold px-2 py-0.5 rounded font-mono">
                + Rs. 500
              </span>
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={wantsEngraving}
                onChange={(e) => setWantsEngraving(e.target.checked)}
                className="w-4 h-4 accent-luxury-gold border-luxury-gold/30 bg-transparent rounded focus:outline-none"
              />
              <span className="text-xs text-luxury-ivory">Yes, I want to engrave this bottle</span>
            </label>

            {wantsEngraving && (
              <div className="space-y-3 pt-2 animate-fade-in">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-luxury-gray mb-1">Initials or Name (Max 12 letters)</label>
                  <input 
                    type="text"
                    maxLength={12}
                    value={engravingText}
                    onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                    placeholder="E.G. KHAN"
                    className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-3 py-2 text-xs font-mono uppercase tracking-[0.25em] focus:outline-none focus:border-luxury-gold text-luxury-gold"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-luxury-gray mb-1">Engraving Font Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['serif', 'script', 'sans'].map((font) => (
                      <button
                        key={font}
                        type="button"
                        onClick={() => setEngravingFont(font)}
                        className={`text-[10px] py-2 border rounded transition-all capitalize ${
                          engravingFont === font 
                            ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5' 
                            : 'border-luxury-gold/10 text-luxury-gray hover:text-luxury-ivory'
                        }`}
                      >
                        {font} style
                      </button>
                    ))}
                  </div>
                </div>

                {/* Real-time preview note */}
                <p className="text-[9px] text-luxury-gray/60 italic leading-relaxed">
                  Note: The engraving is etched permanently into the bottle's front facet using premium laser-precision tooling.
                </p>
              </div>
            )}
          </div>

          {/* Stepper & Buy */}
          <div className="flex items-center gap-4 pt-4 border-t border-luxury-gold/5">
            <div className="flex items-center border border-luxury-gold/20 rounded bg-luxury-slate/10 overflow-hidden">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-4 py-2.5 text-sm hover:bg-luxury-gold/10 text-luxury-gray hover:text-luxury-ivory transition-colors"
              >
                -
              </button>
              <span className="px-4 py-2.5 text-sm font-mono">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="px-4 py-2.5 text-sm hover:bg-luxury-gold/10 text-luxury-gray hover:text-luxury-ivory transition-colors"
              >
                +
              </button>
            </div>

            <button 
              onClick={handleAddToCart}
              className="flex-grow btn-gold py-3 px-6 rounded text-xs tracking-widest flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Shopping Bag
            </button>
          </div>

        </div>

      </div>

      {/* Scent Notes Explorer representation */}
      <section className="py-16 border-t border-luxury-gold/10">
        <h3 className="font-display text-2xl tracking-widest text-luxury-gold text-center mb-10 uppercase">
          SCENT ANATOMY & NOTES
        </h3>
        
        <div className="max-w-xl mx-auto glass-card p-6 rounded-lg">
          <div className="flex justify-between border-b border-luxury-gold/10 pb-4 mb-6">
            {['top', 'heart', 'base'].map((nTab) => (
              <button
                key={nTab}
                onClick={() => setActiveNoteTab(nTab)}
                className={`text-xs uppercase tracking-widest font-semibold px-4 py-2 transition-all ${
                  activeNoteTab === nTab ? 'text-luxury-gold' : 'text-luxury-gray hover:text-luxury-ivory'
                }`}
              >
                {nTab} notes
              </button>
            ))}
          </div>

          <div className="space-y-4 min-h-[120px] flex flex-col justify-center text-center">
            <div className="flex flex-wrap gap-2 justify-center">
              {product.scentNotes[activeNoteTab].map((note, idx) => (
                <span key={idx} className="bg-luxury-slate border border-luxury-gold/10 px-3 py-1 rounded text-xs text-luxury-ivory font-light tracking-wide">
                  {note}
                </span>
              ))}
            </div>
            <p className="text-xs text-luxury-gray font-light max-w-sm mx-auto leading-relaxed mt-4">
              {activeNoteTab === 'top' && 'Top notes represent the initial burst of fragrance, lasting for 10-15 minutes immediately after application.'}
              {activeNoteTab === 'heart' && 'Heart/Middle notes form the core of the fragrance profile, emerging as the top notes dissipate.'}
              {activeNoteTab === 'base' && 'Base notes create the long-lasting anchor of the perfume, delivering rich depth that persists throughout the day.'}
            </p>
          </div>
        </div>
      </section>

      {/* 🎬 PRODUCT PROMO VIDEO (Sensory Experience via YouTube Embed) */}
      <section className="py-16 border-t border-luxury-gold/10 bg-luxury-slate/5">
        <h3 className="font-display text-2xl tracking-widest text-luxury-gold text-center mb-10 uppercase">
          Sensory Film
        </h3>
        <div className="max-w-4xl mx-auto aspect-video rounded-lg overflow-hidden border border-luxury-gold/20 shadow-xl relative bg-black">
          <iframe 
            src="https://www.youtube.com/embed/W-dGxZb_0_k?autoplay=1&mute=1&loop=1&playlist=W-dGxZb_0_k&controls=1&modestbranding=1&rel=0" 
            title="Product Sensory Film"
            className="w-full h-full border-0 opacity-90 hover:opacity-100 transition-opacity duration-300"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      </section>

    </div>
  );
}
