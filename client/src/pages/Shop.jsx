import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../components/layout/SEO';

// Mock list of 3 perfumes
const MOCK_PRODUCTS = [
  {
    _id: 'man_perfume_1',
    name: 'NIGHT ODYSSEY',
    category: 'man',
    tagline: 'Bold & Mysterious Wood',
    price: 6800,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600'],
    description: 'A deep, rich oriental blend with layers of Cambodian Oud, Amberwood, and pink pepper. Specially blended for cold evening statements.'
  },
  {
    _id: 'woman_perfume_1',
    name: 'ROSE IMPÉRIAL',
    category: 'woman',
    tagline: 'Sensual Velvet Rose',
    price: 7200,
    images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600'],
    description: 'An elegant, feminine combination of pure Turkish Rose extract, white musk, and Madagascan vanilla. Drapes the wearer in a velvet floral aura.'
  },
  {
    _id: 'unisex_perfume_1',
    name: 'OUD DE KARACHI',
    category: 'unisex',
    tagline: 'Warm Spice & Saffron',
    price: 8500,
    images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600'],
    description: 'Our signature blend. Rich Persian saffron, Kashmiri tea extracts, Mysore sandalwood, and light agarwood notes. Crafted for modern connoisseurs.'
  }
];

export default function Shop() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'man' | 'woman' | 'unisex'

  const filteredProducts = activeTab === 'all' 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(p => p.category === activeTab);

  return (
    <div className="pt-28 min-h-screen max-w-7xl mx-auto px-6">
      <SEO title="Atelier Collection" description="Explore AURA handcrafted, custom-engraved luxury perfume catalog." />
      
      {/* Title & Tabs */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="font-display font-light text-4xl md:text-6xl tracking-widest text-luxury-gold uppercase">
          THE ATELIER COLLECTION
        </h1>
        <p className="text-sm text-luxury-gray max-w-xl mx-auto font-light leading-relaxed">
          Carefully selected profiles blended from rare botanical extracts. Select a category below to filter your olfactory experience.
        </p>

        {/* Filter categories */}
        <div className="flex justify-center gap-4 pt-6 border-b border-luxury-gold/10 pb-6 max-w-md mx-auto">
          {['all', 'man', 'woman', 'unisex'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[10px] md:text-xs uppercase tracking-[0.2em] px-4 py-2 border-b-2 transition-all ${
                activeTab === tab 
                  ? 'border-luxury-gold text-luxury-gold' 
                  : 'border-transparent text-luxury-gray hover:text-luxury-ivory'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div 
            key={product._id} 
            className="glass-card rounded overflow-hidden flex flex-col group relative"
          >
            {/* Image Box */}
            <div className="aspect-[4/5] w-full overflow-hidden bg-luxury-slate/20 relative">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Shimmer light effect overlay on card hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out"></div>
              
              {/* Category tags */}
              <span className="absolute top-4 left-4 text-[9px] uppercase tracking-widest font-bold bg-luxury-obsidian/80 text-luxury-gold border border-luxury-gold/20 px-3 py-1 rounded">
                {product.category}
              </span>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xl tracking-widest text-luxury-ivory uppercase group-hover:text-luxury-gold transition-colors">
                  {product.name}
                </h3>
                <p className="text-[11px] text-luxury-goldLight tracking-wider font-light italic mt-0.5">
                  {product.tagline}
                </p>
                <p className="text-xs text-luxury-gray leading-relaxed font-light mt-3 line-clamp-3">
                  {product.description}
                </p>
              </div>

              {/* Price & Action */}
              <div className="flex justify-between items-center pt-6 border-t border-luxury-gold/5 mt-4">
                <span className="text-sm font-semibold tracking-wider font-mono text-luxury-ivory">
                  Rs. {product.price.toLocaleString()}
                </span>
                
                <button 
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="btn-outline px-4 py-2 rounded text-[10px] tracking-widest flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
