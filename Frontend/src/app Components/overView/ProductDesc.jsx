import React from 'react';
import { ShoppingBag, Heart, ShieldCheck, Truck } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { setCart } from '@/Redux/productSice';
import AxiosInstance from '@/Api/AxiosInstance';

const ProductDesc = ({ product }) => {
  const accessToken = localStorage.getItem('accessToken')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const addToCart = async (productId) => {

    try {
      const res = await AxiosInstance.post(`/cart/add`, { productId }, )
      // console.log("response", res);

      if (res.data.success) {
        // console.log("cart data", res.data.cart);
        toast.success("Product Added", {
          style: {
            background: "green",
            color: "white",
            border: "1px solid darkgreen",
          },
        });
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error);

    }

  }
  return (
    <div className='w-full flex flex-col justify-between h-full space-y-6 lg:space-y-0'>

      {/* Header Info Layout Meta Panel */}
      <div className="space-y-4">

        {/* Brand & Category row badge row indicators */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200/50">
            {product.brand}
          </span>
          <span className="text-xs text-stone-400 font-medium uppercase tracking-widest">
            {product.category}
          </span>
        </div>

        {/* Title Heading typography component */}
        <h1 className='text-xl md:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight'>
          {product.productName}
        </h1>

        {/* Display Price Currency Area */}
        <div className="flex items-baseline gap-2">
          <span className='text-2xl md:text-4xl font-black text-amber-600'>
            ₹{product.productPrice?.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md">
            Inclusive of all taxes
          </span>
        </div>

        <hr className="border-stone-100" />

        {/* Long Text Description segment content */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Description</h3>
          <p className='text-sm md:text-base text-stone-600 leading-relaxed font-normal whitespace-pre-line py-4'>
            {product.productDesc || "No additional description metadata provided for this asset item details panel structure."}
          </p>
        </div>
      </div>

      {/* Action Purchase Block Panel Section */}
      <div className="space-y-4 pt-6 lg:pt-0">

        {/* Bottom utility rows tags info checklist */}
        <div className="grid grid-cols-2 gap-3 text-xs text-stone-500 font-medium pb-2 my-4">
          <div className="flex items-center gap-2"><Truck size={16} className="text-amber-600" /> Free fast delivery inside 2-4 days</div>
          <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-amber-600" /> 100% Genuine product guarantee</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button onClick={() => addToCart(product._id)}
            className="flex-1 min-h-12 bg-stone-900 hover:bg-amber-600 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-stone-900/10 active:scale-[0.99] cursor-pointer">
            <ShoppingBag  size={18} />
            Add to Cart
          </button>

          {/* <button className="h-12 w-full sm:w-12 bg-stone-50 hover:bg-red-50 hover:text-red-600 border border-stone-200 text-stone-600 rounded-xl transition-colors flex items-center justify-center shrink-0 cursor-pointer">
            <Heart size={18} />
          </button> */}
        </div>
      </div>

    </div>
  );
};

export default ProductDesc;