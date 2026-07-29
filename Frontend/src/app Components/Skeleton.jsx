import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="bg-white w-full max-w-[220px] rounded-2xl border border-stone-100 overflow-hidden p-0 flex flex-col justify-between animate-pulse">
            
            {/* Image Placeholder */}
            <div className="w-full h-40 bg-stone-200 shrink-0" />

            {/* Details Placeholder */}
            <div className="p-3 flex flex-col flex-1 gap-3">
                <div className="space-y-2">
                    {/* Title Lines */}
                    <div className="h-3.5 bg-stone-200 rounded-md w-5/6" />
                    <div className="h-3.5 bg-stone-200 rounded-md w-1/2" />
                </div>

                {/* Price Line */}
                <div className="h-5 bg-stone-200 rounded-md w-1/3 mt-1" />

                {/* Button Line */}
                <div className="h-8 bg-stone-200 rounded-xl w-full mt-1" />
            </div>
            
        </div>
    );
};

export default SkeletonCard;