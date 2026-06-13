import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success('Thank you for subscribing to AURA newsletters!');
    e.target.reset();
  };

  return (
    <footer className="bg-luxury-midnight border-t border-luxury-gold/10 pt-16 pb-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Slogan and Brand Column */}
        <div className="space-y-4">
          <span className="font-display font-light text-2xl tracking-[0.2em] text-luxury-gold">AURA</span>
          <p className="text-sm text-luxury-gray font-light leading-relaxed">
            Crafting luxury artisanal fragrances from the finest raw elements in Pakistan. Each bottle is blended, poured, and packaged by hand in our private atelier.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-luxury-gray hover:text-luxury-gold transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" className="text-luxury-gray hover:text-luxury-gold transition-colors">
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Links Column */}
        <div className="space-y-4">
          <h4 className="font-display uppercase text-xs tracking-[0.2em] text-luxury-gold">Navigate</h4>
          <ul className="space-y-2 text-sm text-luxury-gray font-light">
            <li><Link to="/shop" className="hover:text-luxury-gold transition-colors">Explore Fragrances</Link></li>
            <li><Link to="/about" className="hover:text-luxury-gold transition-colors">Atelier Story</Link></li>
            <li><Link to="/contact" className="hover:text-luxury-gold transition-colors">Inquire / Support</Link></li>
            <li><Link to="/account" className="hover:text-luxury-gold transition-colors">Customer Profile</Link></li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="space-y-4">
          <h4 className="font-display uppercase text-xs tracking-[0.2em] text-luxury-gold">Contact</h4>
          <ul className="space-y-3 text-sm text-luxury-gray font-light">
            <li className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-luxury-gold/75" />
              <span>Clifton, Karachi, Pakistan</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-luxury-gold/75" />
              <span>+92 (300) 123-4567</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-luxury-gold/75" />
              <span>concierge@auraperfumes.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="space-y-4">
          <h4 className="font-display uppercase text-xs tracking-[0.2em] text-luxury-gold">Newsletter</h4>
          <p className="text-sm text-luxury-gray font-light">
            Subscribe to receive exclusive access to private reserve scent releases and atelier updates.
          </p>
          <form onSubmit={handleSubscribe} className="relative mt-2">
            <input 
              type="email" 
              required
              placeholder="Enter your email"
              className="w-full bg-luxury-slate/30 border border-luxury-gold/20 rounded pl-4 pr-10 py-2.5 text-xs focus:outline-none focus:border-luxury-gold text-luxury-ivory"
            />
            <button 
              type="submit" 
              className="absolute right-3 top-2.5 text-luxury-gray hover:text-luxury-gold transition-colors"
              title="Subscribe"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Bar: Copyright & local payments */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-luxury-gold/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-luxury-gray font-light">
          &copy; {new Date().getFullYear()} AURA Fragrances. All rights reserved. Made in Pakistan.
        </p>

        {/* Pakistani local payments indicators */}
        <div className="flex items-center space-x-4">
          <span className="text-[10px] uppercase tracking-widest text-luxury-gray mr-2">Secure Payments:</span>
          
          {/* JazzCash Text style */}
          <div className="border border-amber-600/30 px-2 py-1 rounded text-[9px] font-bold text-amber-500 bg-amber-950/20 tracking-wider">
            JAZZCASH
          </div>
          
          {/* EasyPaisa style */}
          <div className="border border-green-600/30 px-2 py-1 rounded text-[9px] font-bold text-green-500 bg-green-950/20 tracking-wider">
            EASYPAISA
          </div>
          
          {/* NayaPay style */}
          <div className="border border-blue-600/30 px-2 py-1 rounded text-[9px] font-bold text-blue-400 bg-blue-950/20 tracking-wider">
            NAYAPAY
          </div>

          {/* Bank Transfer style */}
          <div className="border border-luxury-gold/30 px-2 py-1 rounded text-[9px] font-bold text-luxury-gold bg-luxury-slate/20 tracking-wider">
            BANK TRANSFER
          </div>
        </div>
      </div>
    </footer>
  );
}
