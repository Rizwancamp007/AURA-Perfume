import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateQuantity, removeFromCart, updateSize } from '../../store/cartSlice';

export default function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const getBasePrice = (item) => {
    if (item.id === 'trio_bundle_set') return item.price;
    if (item.size === '30ml') return item.price + 1500;
    if (item.size === '100ml') return item.price - 3000;
    return item.price;
  };

  const handleSizeChange = (item, newSize) => {
    if (item.id === 'trio_bundle_set') return;
    const base = getBasePrice(item);
    let newPrice = base;
    if (newSize === '30ml') newPrice = base - 1500;
    if (newSize === '100ml') newPrice = base + 3000;
    dispatch(updateSize({ id: item.id, newSize, newPrice }));
  };

  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.engravingText ? item.price + 500 : item.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Sliding Panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-luxury-obsidian/95 border-l border-luxury-gold/15 shadow-2xl flex flex-col backdrop-blur-md"
          >
            {/* Header */}
            <div className="p-6 border-b border-luxury-gold/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-luxury-gold" />
                <span className="font-display uppercase tracking-widest text-sm text-luxury-ivory">Your Shopping Bag ({items.length})</span>
              </div>
              <button onClick={onClose} className="text-luxury-gray hover:text-luxury-gold transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag className="w-12 h-12 text-luxury-gold/20 animate-bounce" />
                  <p className="text-sm text-luxury-gray font-light">Your shopping bag is empty.</p>
                  <button onClick={() => { onClose(); navigate('/shop'); }} className="btn-gold px-6 py-2 rounded text-[10px] tracking-widest">
                    Browse Collection
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded bg-luxury-slate/10 border border-luxury-gold/5">
                    
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-luxury-slate/20 rounded overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Meta details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-xs tracking-wider text-luxury-ivory truncate">{item.name}</h4>
                      <p className="text-[10px] text-luxury-gold font-mono mt-0.5">Rs. {item.price.toLocaleString()}</p>
                      
                      {/* Engravings tag */}
                      {item.engravingText && (
                        <div className="mt-1 bg-luxury-gold/5 border border-luxury-gold/10 px-2 py-0.5 rounded text-[8px] text-luxury-goldLight w-fit">
                          Engraved: <span className="font-semibold">"{item.engravingText}"</span> ({item.engravingFont})
                          <span className="block text-[7px] text-luxury-gray">+ Rs. 500 Customization fee</span>
                        </div>
                      )}

                      {/* Bottle Size Selection dropdown */}
                      {item.id !== 'trio_bundle_set' && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[9px] text-luxury-gray uppercase tracking-wider">Size:</span>
                          <select 
                            value={item.size || '50ml'}
                            onChange={(e) => handleSizeChange(item, e.target.value)}
                            className="bg-luxury-slate border border-luxury-gold/20 rounded px-1.5 py-0.5 text-[9px] text-luxury-ivory focus:outline-none focus:border-luxury-gold cursor-pointer"
                          >
                            <option value="30ml">30ml (Rs. {(getBasePrice(item) - 1500).toLocaleString()})</option>
                            <option value="50ml">50ml (Rs. {getBasePrice(item).toLocaleString()})</option>
                            <option value="100ml">100ml (Rs. {(getBasePrice(item) + 3000).toLocaleString()})</option>
                          </select>
                        </div>
                      )}

                      {/* Quantity control steppers */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-luxury-gold/10 rounded">
                          <button 
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                            className="p-1.5 text-luxury-gray hover:text-luxury-gold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs text-luxury-ivory px-2">{item.quantity}</span>
                          <button 
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                            className="p-1.5 text-luxury-gray hover:text-luxury-gold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button 
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="text-luxury-gray hover:text-red-400 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Footer Pricing Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-luxury-gold/10 bg-luxury-slate/5 space-y-4">
                <div className="flex justify-between text-xs font-light">
                  <span className="text-luxury-gray">Estimated Subtotal</span>
                  <span className="font-mono text-luxury-gold font-semibold">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <p className="text-[9px] text-luxury-gray font-light">Taxes and shipping fees calculated at checkout step.</p>
                <button 
                  onClick={handleCheckout}
                  className="w-full btn-gold py-3 text-xs tracking-widest font-medium rounded uppercase flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
