import React, { useState } from 'react';
import { Send, Phone, MessageSquare, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Your message has been delivered to AURA Concierge. We will reply within 24 hours.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="pt-28 min-h-screen max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
      
      {/* Left Column: Info */}
      <div className="space-y-6 flex flex-col justify-center">
        <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-gold font-bold">Inquire</span>
        <h1 className="font-display text-4xl md:text-5xl tracking-widest text-luxury-gold uppercase">
          GET IN TOUCH
        </h1>
        <p className="text-sm text-luxury-gray font-light leading-relaxed">
          For corporate gifting, custom fragrance blending requests, or questions regarding your order status, please message us directly.
        </p>

        <div className="space-y-4 pt-6 text-xs text-luxury-gray font-light">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-luxury-gold" />
            <span>concierge@auraperfumes.com</span>
          </div>
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-luxury-gold" />
            <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" className="hover:underline text-luxury-gold font-medium">
              WhatsApp Concierge: +92 (300) 123-4567
            </a>
          </div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex items-center">
        <form onSubmit={handleSubmit} className="glass-card p-8 rounded-lg border border-luxury-gold/15 space-y-5 w-full">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Your Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-gold text-luxury-ivory"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-gold text-luxury-ivory"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-luxury-gray mb-1">Message</label>
            <textarea 
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded px-4 py-2.5 text-xs focus:outline-none focus:border-luxury-gold text-luxury-ivory"
              placeholder="How can we assist you?"
            ></textarea>
          </div>

          <button type="submit" className="w-full btn-gold py-3 rounded text-xs tracking-widest flex items-center justify-center gap-2">
            Send Message
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
