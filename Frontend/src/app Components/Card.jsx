import React from "react";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { setCart } from '@/Redux/productSice.js';
import AxiosInstance from "@/Api/AxiosInstance";


const Card = ({ product, isLoading }) => {

    const accessToken = localStorage.getItem('accessToken')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const addToCart = async (productId) => {

        try {
            const res = await AxiosInstance.post(`/cart/add`, { productId })
            // console.log("response", res);

            if (res.data.success) {
                // console.log("cart data", res.data.cart);
                toast.success("Product Added")

                dispatch(setCart(res.data.cart))
            }
        } catch (error) {
            console.log(error);

        }

    }
    return (
        <div className="bg-white w-39   sm:w-45 max-w-[250px] rounded shadow-sm border border-stone-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">

            {/* Aspect Ratio Balanced Image Box */}
            <div className="w-full h-35 sm:h-40 overflow-hidden bg-stone-50 relative shrink-0 m-auto">
                {isLoading ? <Skeleton className="aspect-video w-full " />
                    : <img
                    onClick={()=>(navigate(`/product/${product?._id}`))}
                        src={product.productImg?.[0]?.url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400"}
                        alt={product.productName}
                        className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-500 p-1"
                    />}
            </div>

            {/* Product Details Wrapper */}
            <div className="p-3 flex flex-col flex-1 justify-between gap-4 bg-white">
                <div onClick={()=>(navigate(`/product/${product?._id}`))} className="mx-1 my-2">
                    <h2 className="text-xs md:text-sm font-semibold text-stone-800 line-clamp-2 max-h-[36px] leading-tight">
                        {product.productName}
                    </h2>

                    <p className="text-base text-sm font-extrabold text-amber-700 mt-1">
                        ₹{product.productPrice?.toLocaleString('en-IN')}
                    </p>
                </div>

                <button
                    onClick={() => addToCart(product._id)}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded flex items-center justify-center gap-1.5 text-sm tracking-wide transition-colors shadow-sm cursor-pointer"
                >
                    <ShoppingCart size={14} />
                    Add to Cart
                </button>
            </div>

        </div>
    );
};

export default Card;