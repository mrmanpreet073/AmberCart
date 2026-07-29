import React, { useState, useEffect } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const IImgGallary = ({ images }) => {
  // Safe validation fallback if images array is empty or undefined
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (images && images.length > 0) {
      setActiveImage(images[0].url);
    }
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div className='w-full flex flex-col gap-4'>
      
      {/* Primary Display Bounding Block Container */}
      <div className="w-full h-[320px] md:h-[450px] overflow-hidden bg-stone-50 rounded-2xl border border-stone-100 shadow-sm relative group flex items-center justify-center">
        <Zoom>
          <img 
            src={activeImage||null} 
            alt="Product focal snapshot View" 
            className='max-h-[320px] md:max-h-[450px] w-full object-cover transition-transform duration-300' 
          />
        </Zoom>
      </div>

      {/* Row Scrolling Panel Section */}
      <div className='flex gap-3 overflow-x-auto py-2 scrollbar-none justify-start sm:justify-center items-center'>
        {images.map((img, idx) => {
          const isSelected = activeImage === img.url;
          return (
            <button
              key={img._id || idx}
              onClick={() => setActiveImage(img.url)}
              className={`relative h-16 w-16 md:h-20 md:w-20 rounded-xl overflow-hidden bg-stone-50 border-2 shrink-0 transition-all cursor-pointer shadow-sm ${
                isSelected ? 'border-amber-500 scale-95 shadow-md' : 'border-stone-200/60 hover:border-stone-400'
              }`}
            >
              <img 
                src={img?.url || null} 
                alt="Product thumbnail asset stream" 
                className="h-full w-full object-cover"
              />
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default IImgGallary;