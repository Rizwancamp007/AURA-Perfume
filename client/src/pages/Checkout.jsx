import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Upload, Sparkles, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { clearCart } from '../store/cartSlice';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, subtotal, discount, shipping, total } = useSelector(state => {
    const items = state.cart.items;
    const sub = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const disc = state.cart.discount;
    const ship = state.cart.shipping;
    return {
      items,
      subtotal: sub,
      discount: disc,
      shipping: ship,
      total: sub - disc + ship
    };
  });

  // Steps: 'details' | 'payment'
  const [step, setStep] = useState('details');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('Sindh');
  const [postalCode, setPostalCode] = useState('');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [screenshot, setScreenshot] = useState(null);

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !street || !city || !postalCode) {
      toast.error('Please fill in all shipping details');
      return;
    }
    setStep('payment');
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (paymentMethod === 'bank_transfer' && !screenshot) {
      toast.error('Please upload your payment deposit receipt screenshot');
      return;
    }

    toast.success('Order placed successfully! Processing bank verification...');
    dispatch(clearCart());
    navigate('/order-confirm');
  };

  if (items.length === 0) {
    return (
      <div className="pt-40 min-h-screen text-center space-y-6">
        <h2 className="font-display text-3xl text-luxury-gold">Your Shopping Bag is Empty</h2>
        <button onClick={() => navigate('/shop')} className="btn-gold px-6 py-2.5 rounded text-xs">Explore Fragrances</button>
      </div>
    );
  }

  return (
    <div className="pt-28 min-h-screen max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      {/* Left 2 Columns: Forms */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Navigation Step Tabs */}
        <div className="flex items-center gap-4 border-b border-luxury-gold/10 pb-4">
          <button 
            onClick={() => setStep('details')}
            className={`text-xs uppercase tracking-widest font-semibold pb-2 border-b-2 transition-all ${
              step === 'details' ? 'border-luxury-gold text-luxury-gold' : 'border-transparent text-luxury-gray'
            }`}
          >
            1. Shipping Details
          </button>
          <button 
            disabled={step === 'details'}
            onClick={() => setStep('payment')}
            className={`text-xs uppercase tracking-widest font-semibold pb-2 border-b-2 transition-all ${
              step === 'payment' ? 'border-luxury-gold text-luxury-gold' : 'border-transparent text-luxury-gray disabled:opacity-50'
            }`}
          >
            2. Payment Options
          </button>
        </div>

        {/* Step 1: Details */}
        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="space-y-6">
            <h3 className="font-display text-xl tracking-widest text-luxury-gold uppercase">Delivery Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Customer Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Contact Phone</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Street Address</label>
              <input 
                type="text" 
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                placeholder="House No, Street, Sector"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">City</label>
                <input 
                  type="text" 
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Province</label>
                <select 
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                >
                  <option value="Sindh">Sindh</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad Capital Territory">Islamabad</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Postal Code</label>
                <input 
                  type="text" 
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                />
              </div>
            </div>

            <button type="submit" className="btn-gold px-8 py-3 rounded text-xs tracking-widest flex items-center gap-2">
              Continue to Payments
              <CreditCard className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Payment */}
        {step === 'payment' && (
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <h3 className="font-display text-xl tracking-widest text-luxury-gold uppercase">Payment Method</h3>

            {/* Selector Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <label className={`glass-card p-5 rounded-lg border flex flex-col justify-between cursor-pointer transition-all ${
                paymentMethod === 'bank_transfer' ? 'border-luxury-gold bg-luxury-gold/5' : 'border-luxury-gold/10'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-luxury-ivory font-medium">Bank Transfer</span>
                  <input 
                    type="radio" 
                    name="pay_method"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="accent-luxury-gold"
                  />
                </div>
                <p className="text-[11px] text-luxury-gray font-light leading-relaxed">
                  Deposit directly to our bank account. Processed manually within 2 hours of receipt verification.
                </p>
              </label>

              <label className={`glass-card p-5 rounded-lg border flex flex-col justify-between cursor-pointer opacity-50 cursor-not-allowed border-luxury-gold/10`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-luxury-ivory font-medium">JazzCash / EasyPaisa</span>
                  <span className="text-[9px] bg-red-950/20 text-red-400 border border-red-950 px-2 py-0.5 rounded font-mono">SANDBOX ONLY</span>
                </div>
                <p className="text-[11px] text-luxury-gray font-light leading-relaxed">
                  Real-time mobile account callback integration. Under server development configuration.
                </p>
              </label>

            </div>

            {/* Bank details and screenshot upload */}
            {paymentMethod === 'bank_transfer' && (
              <div className="glass-card p-6 rounded-lg border border-luxury-gold/20 space-y-4 animate-fade-in">
                <h4 className="font-display uppercase text-xs tracking-widest text-luxury-gold">Atelier Bank Details</h4>
                <div className="text-xs font-mono space-y-1.5 text-luxury-gray">
                  <div>Bank: <span className="text-luxury-ivory">Meezan Bank Limited</span></div>
                  <div>Account: <span className="text-luxury-ivory">AURA Perfumes Private Ltd</span></div>
                  <div>IBAN: <span className="text-luxury-gold">PK42MEZN0030040050060078</span></div>
                </div>

                <div className="border-t border-luxury-gold/5 pt-4">
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-2">Upload Transfer Screenshot</label>
                  <div className="border border-dashed border-luxury-gold/30 rounded p-4 text-center cursor-pointer hover:border-luxury-gold transition-colors flex flex-col items-center justify-center gap-2">
                    <Upload className="w-5 h-5 text-luxury-gold/50" />
                    <span className="text-xs text-luxury-gray">
                      {screenshot ? screenshot.name : 'Drag & Drop or Click to browse'}
                    </span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setScreenshot(e.target.files[0])}
                      className="hidden"
                      id="screenshot-input"
                    />
                    <label htmlFor="screenshot-input" className="text-[10px] uppercase tracking-widest text-luxury-gold cursor-pointer hover:underline">
                      Select File
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => setStep('details')}
                className="btn-outline px-6 py-3 rounded text-xs tracking-widest"
              >
                Back
              </button>
              <button 
                type="submit" 
                className="flex-grow btn-gold py-3 rounded text-xs tracking-widest flex items-center justify-center gap-2"
              >
                Place Order (Rs. {total.toLocaleString()})
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Right Column: Order breakdown summary */}
      <div className="glass-card p-6 rounded-lg h-fit space-y-6">
        <h3 className="font-display text-lg tracking-widest text-luxury-gold uppercase border-b border-luxury-gold/10 pb-4">
          Order Summary
        </h3>

        {/* Item List */}
        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-center text-xs">
              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded border border-luxury-gold/10" />
              <div className="flex-grow">
                <div className="font-semibold text-luxury-ivory uppercase">{item.name}</div>
                <div className="text-[10px] text-luxury-gray">Qty: {item.quantity}</div>
                {item.engravingText && (
                  <div className="text-[9px] text-luxury-goldLight flex items-center gap-1 font-mono">
                    <Sparkles className="w-3 h-3" />
                    Engraved: "{item.engravingText}"
                  </div>
                )}
              </div>
              <div className="font-mono text-luxury-ivory">Rs. {(item.price * item.quantity).toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Financial breakdowns */}
        <div className="border-t border-luxury-gold/10 pt-4 space-y-2 text-xs text-luxury-gray">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono text-luxury-ivory">Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-mono text-luxury-ivory">
              {shipping === 0 ? 'Free' : `Rs. ${shipping.toLocaleString()}`}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-luxury-gold">
              <span>Discount</span>
              <span className="font-mono">- Rs. {discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-semibold border-t border-luxury-gold/5 pt-3 text-luxury-ivory">
            <span>Total Amount</span>
            <span className="font-mono text-luxury-gold">Rs. {total.toLocaleString()}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
