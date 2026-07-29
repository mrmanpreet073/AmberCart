import React from 'react';
import { Truck, Headphones, ShieldCheck } from 'lucide-react';

export default function TrustBanner() {
  return (
    <section className="w-full bg-stone-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Horizontal Flat Banner Layout Row */}
        <div className="w-full bg-[#f5f4f0] border border-stone-200/40 rounded-[16px] px-6 py-6 md:py-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-stone-200/70">
          
          {/* Perk 1: Shipping */}
          <div className="flex items-center gap-4 pb-6 md:pb-0 md:px-6 justify-start">
            <Truck className="h-9 w-9 text-amber-500 shrink-0 stroke-[1.75]" />
            <div>
              <h4 className="font-extrabold text-stone-900 text-base uppercase tracking-tight">
                Free Shipping Over $50
              </h4>
              <p className="text-stone-500 text-sm font-medium mt-0.5">
                On all domestic orders
              </p>
            </div>
          </div>

          {/* Perk 2: Service Help */}
          <div className="flex items-center gap-4 pt-6 md:pt-0 md:px-8 justify-start">
            <Headphones className="h-9 w-9 text-amber-500 shrink-0 stroke-[1.75]" />
            <div>
              <h4 className="font-extrabold text-stone-900 text-base uppercase tracking-tight">
                24/7 Customer Support
              </h4>
              <p className="text-stone-500 text-sm font-medium mt-0.5">
                We're here to help
              </p>
            </div>
          </div>

          {/* Perk 3: Gateway Checks */}
          <div className="flex items-center gap-4 pt-6 md:pt-0 md:px-8 justify-start">
            <ShieldCheck className="h-9 w-9 text-amber-500 shrink-0 stroke-[1.75]" />
            <div>
              <h4 className="font-extrabold text-stone-900 text-base uppercase tracking-tight">
                Secure Checkout & Returns
              </h4>
              <p className="text-stone-500 text-sm font-medium mt-0.5">
                Shop with confidence
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}