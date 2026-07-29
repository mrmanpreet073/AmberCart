import React from 'react';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full bg-gradient-to-b from-amber-50 via-orange-50/40 to-white overflow-hidden">

      {/* Background glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* ── LEFT — Text content ── */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300/60 text-xs font-bold text-amber-800 uppercase tracking-wider mx-auto lg:mx-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Summer Collection 2026
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-stone-900 tracking-tight leading-[1.1]">
              Shop Smarter,{" "}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                Live Better.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-stone-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover electronics, fashion, sports and more — hand-picked for quality and delivered fast. Your one-stop amber marketplace.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => navigate("/products")}
                className="w-full sm:w-auto h-12 px-7 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-semibold rounded-xl shadow-md shadow-amber-400/30 flex items-center justify-center gap-2 transition-all group"
              >
                Shop Now
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/products")}
                className="w-full sm:w-auto h-12 px-7 bg-white hover:bg-amber-50 text-amber-700 font-semibold border border-amber-200 hover:border-amber-400 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                View Deals
              </button>
            </div>

            {/* Trust bar */}
            <div className="pt-5 border-t border-amber-100 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-medium text-stone-400">
              <div className="flex items-center gap-1.5">
                <Truck size={15} className="text-amber-500" />
                Free delivery above ₹500
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw size={15} className="text-amber-500" />
                100-day returns
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-amber-500" />
                Secure checkout
              </div>
            </div>
          </div>

          {/* ── RIGHT — Image grid ── */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none grid grid-cols-12 gap-3">

              {/* Primary large image */}
              <div className="col-span-8 overflow-hidden rounded-3xl border-4 border-white shadow-xl shadow-amber-200/60 aspect-[3/4] bg-amber-50">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800"
                  alt="Summer fashion"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Secondary stacked images */}
              <div className="col-span-4 flex flex-col gap-3 pt-10">
                <div className="overflow-hidden rounded-2xl border-4 border-white shadow-lg shadow-amber-100/60 aspect-square bg-amber-50">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=400"
                    alt="Retail showcase"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl border-4 border-white shadow-lg shadow-amber-100/60 aspect-[4/5] bg-amber-50">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400"
                    alt="Tech product"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Floating stats badge */}
              <div className="absolute -bottom-4 left-4 bg-white border border-amber-100 px-3 py-2.5 rounded-2xl shadow-lg shadow-amber-200/40 flex items-center gap-3">
                {/* Avatar stack */}
                <div className="flex -space-x-2">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
                  ].map((src, i) => (
                    <img key={i} src={src} alt="Customer"
                      className="w-7 h-7 rounded-full border-2 border-white object-cover" />
                  ))}
                  <div className="w-7 h-7 rounded-full border-2 border-white bg-amber-500 flex items-center justify-center text-[10px] font-bold text-white">
                    +k
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide">Trusted by</p>
                  <p className="text-xs font-bold text-stone-800">12,000+ Shoppers</p>
                </div>
              </div>

              {/* Floating amber accent dot */}
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-amber-400 rounded-full border-4 border-white shadow-md" />

            </div>
          </div>

        </div>
      </div>

    </section>
  );
}