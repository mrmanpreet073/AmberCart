import React from 'react';

const PRODUCTS = [
  { id: 1, name: 'HOME ESSENTIALS', price: '$49.00', img: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=500&q=80' },
  { id: 2, name: 'RUNNING SHOES', price: '$49.00', img: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=500&q=80' },
  { id: 3, name: 'TECH ACCESSORIES', price: '$49.00', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80' },
  { id: 4, name: 'SUMMER FASHION', price: '$49.00', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=80' }
];

export default function ProductGrid() {
  return (
    <section className="w-full bg-stone-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center font-bold tracking-wider text-stone-800 text-lg uppercase mb-10">
          Shoper Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((prod) => (
            <div 
              key={prod.id} 
              className="bg-[#f5f4f0] border border-stone-200/40 rounded-[20px] p-5 flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* Product Meta Header Title */}
                <h3 className="text-stone-900 font-extrabold text-xl tracking-tight uppercase leading-tight whitespace-pre-line mb-4">
                  {prod.name.split(' ').join('\n')}
                </h3>
                
                {/* Central Centered Product Thumbnail Frame */}
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-transparent mb-6 flex items-center justify-center mix-blend-multiply">
                  <img 
                    src={prod.img} 
                    alt={prod.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>

              {/* Price & Primary Call To Action Block */}
              <div className="space-y-3.5">
                <span className="block text-stone-900 font-black text-2xl tracking-tight">
                  {prod.price}
                </span>
                <button className="w-full h-11 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-bold text-sm tracking-wide rounded-lg uppercase transition-colors cursor-pointer shadow-sm">
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}