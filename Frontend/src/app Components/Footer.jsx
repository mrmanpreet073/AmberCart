import React from 'react';
import { ShoppingBag, Globe, Camera, Tv, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 font-sans border-t border-stone-800">
      {/* <footer className="absolute bottom-0 left-0 w-full bg-stone-900 text-stone-300 font-sans border-t border-stone-800"></footer> */}
      
      {/* Top Section: Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 select-none">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 shadow-sm">
                <ShoppingBag className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                AMBER<span className="text-amber-500">CART</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 max-w-sm">
              Your go-to modern marketplace for premium, curated items. Experience smooth shopping that's genuinely easy on your eyes.
            </p>
            
            {/* Safe Fallback Social Badges using standard Lucide icons */}
            <div className="flex gap-4 pt-2">
              <a href="#" aria-label="Website/Facebook Link" className="text-stone-400 hover:text-amber-500 transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram Link" className="text-stone-400 hover:text-amber-500 transition-colors">
                <Camera className="h-5 w-5" />
              </a>
              <a href="#" aria-label="YouTube Video Link" className="text-stone-400 hover:text-amber-500 transition-colors">
                <Tv className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Shop</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">All Products</a></li>
              <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">New Arrivals</a></li>
              <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">Featured Deals</a></li>
              <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">Discounts</a></li>
            </ul>
          </div>

          {/* Column 3: Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">Order Tracking</a></li>
              <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter Signup */}
          <div className="md:col-span-2 lg:col-span-1 min-w-[200px]">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Stay Tuned</h3>
            <p className="text-sm text-stone-400 mb-4">Subscribe to get exclusive warm offers and updates.</p>
            <form className="flex gap-2 max-w-sm">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full h-9 pl-9 pr-3 bg-stone-800 border border-stone-700 rounded-lg text-sm text-stone-200 placeholder-stone-500 outline-none focus:border-amber-500 transition-all"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="px-4 h-9 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Join
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Section: Copyright & Legal */}
      <div className="border-t border-stone-800 bg-stone-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} AmberCart. All rights reserved.
          </p>
          
          <div className="flex gap-6 text-xs text-stone-500">
            <a href="#" className="hover:text-stone-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-stone-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;