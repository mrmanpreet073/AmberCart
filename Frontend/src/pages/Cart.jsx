import AxiosInstance from '@/Api/AxiosInstance';
import { removeFromCart, setCart } from '@/Redux/productSice';
import axios from 'axios';
import { IndianRupee, ShoppingCart, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Cart = () => {
  const { cart } = useSelector(store => store.product);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const accessToken = localStorage.getItem("accessToken")

  const subTotal = cart.totalPrice;
  let shipping = 0;
  if (cart?.items?.length !== 0) {
    shipping = subTotal > 500 ? 0 : 10;
  }
  const tax = subTotal * 0.18;
  const total = subTotal + shipping + tax

  const updateQuantity = async (productId, type) => {
    try {
      const res = await AxiosInstance.post(
        "/cart/update",
        { productId, type },
        
      );
      if (res.data.success) fetchLatestCart();
    } catch (error) {
      console.log(error.response);
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await axios.post("http://localhost:3000/api/cart/delete",
        { productId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (res.data.success) {
        await fetchLatestCart()
      }
      if (res?.data?.success === false && res?.data?.message === "Product not found in cart") {
        dispatch(removeFromCart(productId));
      }
    } catch (error) {
      console.log(error.response);
    }
  }

  const fetchLatestCart = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/cart/", {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.data.success) dispatch(setCart(res.data.cart))
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => { fetchLatestCart() }, [])

  // ── Empty cart state ──
  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-amber-50/60 flex flex-col items-center justify-center gap-4 px-4">
        <ShoppingCart size={52} className="text-amber-300" />
        <h2 className="text-xl font-bold text-slate-700">Your cart is empty</h2>
        <p className="text-sm text-slate-400">Looks like you haven't added anything yet.</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition"
        >
          Browse Products
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50/60">

      {/* Header strip */}
      <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 px-4 sm:px-8 py-4 shadow-sm">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <ShoppingCart size={20} /> Shopping Cart
          <span className="text-sm font-normal bg-white/30 text-white px-2 py-0.5 rounded-full ml-1">
            {cart?.items?.length} {cart?.items?.length === 1 ? "item" : "items"}
          </span>
        </h1>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">

        {/* ── LEFT — Cart Items ── */}
        <div className="flex flex-col gap-3">
          {cart?.items?.map((item) => (
            <div key={item?.productId?._id || uuidv4()}
              className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-200"
            >
              <div className="flex items-center gap-4">

                {/* Image */}
                <div
                  onClick={() => navigate(`/product/${item?.productId?._id}`)}
                  className="shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-slate-100 bg-amber-50 cursor-pointer"
                >
                  <img
                    src={item?.productId?.productImg[0]?.url}
                    alt={item?.productId?.productName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => navigate(`/product/${item?.productId?._id}`)}
                    className="text-sm font-semibold text-slate-800 hover:text-amber-600 line-clamp-2 text-left transition-colors"
                  >
                    {item?.productId?.productName}
                  </button>

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId._id, "decrement")}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 transition"
                      >
                        <svg className="h-2.5 w-2.5 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                        </svg>
                      </button>

                      <span className="w-8 text-center text-sm font-semibold text-slate-800">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId._id, "increment")}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 transition"
                      >
                        <svg className="h-2.5 w-2.5 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Price + Delete */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-100 flex items-center">
                        <IndianRupee size={13} />
                        {(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={() => removeItem(item?.productId?._id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 border border-red-100 transition active:scale-95"
                        title="Remove item"
                      >
                        <Trash2 size={15} className="text-red-500" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── RIGHT — Order Summary ── */}
        <div className="lg:sticky lg:top-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-800">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800 flex items-center gap-0.5">
                  <IndianRupee size={13} />{cart.totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Savings</span>
                <span className="font-medium text-green-600">— ₹00</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Shipping <span className="text-xs">(free above ₹500)</span></span>
                <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {shipping === 0 ? "Free" : `+ ₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Tax (18%)</span>
                <span className="font-medium text-red-500">+ ₹{Number(tax.toFixed(2)).toLocaleString("en-IN")}</span>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between">
                <span className="font-bold text-slate-800">Total</span>
                <span className="font-bold text-slate-800 flex items-center gap-0.5">
                  <IndianRupee size={14} className="text-green-600" />
                  {Number(total.toFixed(2)).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Promo code */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code"
                className="flex-1 h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
              />
              <button className="h-10 px-4 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition">
                Apply
              </button>
            </div>

            <button
              onClick={() => navigate("/address")}
              className="w-full h-11 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-semibold rounded-xl shadow-sm shadow-amber-200 transition-all duration-200"
            >
              Proceed to Checkout
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <span>or</span>
              <button
                onClick={() => navigate("/products")}
                className="text-amber-600 font-medium hover:underline flex items-center gap-1"
              >
                Continue Shopping
                <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                </svg>
              </button>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-1">
              <p className="text-xs text-slate-400">✦ Free shipping on orders above ₹500</p>
              <p className="text-xs text-slate-400">✦ 100-day return policy</p>
              <p className="text-xs text-slate-400">✦ Secure checkout with SSL encryption</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Cart