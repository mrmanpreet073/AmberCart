import axios from 'axios';
import { EditIcon, IndianRupee, MapPin, Phone, Trash, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { setAddresses, setCart, setSelectedAddress } from '@/Redux/productSice.js';
import { toast } from 'sonner';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useNavigate } from 'react-router-dom';


const Address = () => {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [localAddresses, setLocalAddresses] = useState([])
    const [editingAddress, setEditingAddress] = useState(null);
    const [isEditingEnable, setIsEditingEnable] = useState(false)
    const [editngAddressId, setEditingAddressId] = useState(null)

    const navigate = useNavigate()

    const { addresses, selectedAddress, cart } = useSelector(store => store.product);
    const { user } = useSelector(store => store.user);
    const dispatch = useDispatch()

    const subTotal = cart.totalPrice;
    let shipping = 0;
    if (cart?.items?.length !== 0) {
        shipping = subTotal > 500 ? 0 : 10;
    }
    const tax = subTotal * 0.18;
    const total = subTotal + shipping + tax

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        if (editingAddress) {
            reset(editingAddress);
        } else {
            reset({ fullName: "", phone: "", address: "", city: "", state: "", postalCode: "", country: "India" });
        }
    }, [editingAddress, reset]);

    const fetchAddress = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/user/getAddress/${user._id}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }

            )
            if (response.data.success) {
                dispatch(setAddresses(response.data.address));
                setLocalAddresses(response.data.address)
            }
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => { fetchAddress() }, [])

    const onSubmit = async (data) => {
        try {
            if (isEditingEnable && editingAddress) {
                const response = await axios.post(`http://localhost:3000/api/user/updateAddress/${editngAddressId}`, data,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }

                )
                if (response.data.success) {
                    toast.success("Address Updated Successfully")
                    dispatch(setSelectedAddress(response.data.address))
                    setIsFormOpen(false)
                }
            }
            else {
                const response = await axios.post(`http://localhost:3000/api/user/addAddress/${user._id}`, data,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
                )
                if (response.data.success) {
                    toast.success("Address Added Successfully")
                    dispatch(setSelectedAddress(response.data.address))
                    setIsFormOpen(false)
                }
            }
        } catch (error) {
            console.log(error.response);
        } finally {
            fetchAddress()
            reset()
        }
    };


    const inputClass = (hasError) => `w-full bg-white text-slate-800 border h-11 rounded-xl px-4 text-sm outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 ${hasError ? 'border-red-400' : 'border-slate-200'}`;


    const handlePayment = async () => {
        const accessToken = localStorage.getItem("accessToken")
        try {
            if (selectedAddress === null) {
                toast.error("Please Select The Address To Complete The Payment")
                return;
            }
            const { data } = await axios.post(`http://localhost:3000/api/orders/create-order`, {
                products: cart?.items?.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity
                })),
                shippingAddress: selectedAddress,
                tax,
                shipping,
                amount: total,
                currency: "INR"
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })

            if (!data.success) return toast.error("Something went wrong")
            console.log("Razorpay data");

            const options = { // This object configures the checkout.

                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                order_id: data.order.id, // Order ID from backend
                name: "AmberCart",
                description: "Order Payment",
                handler: async function (response) {  // This function is called when the payment is completed successfully.
                    // and response contains the payment details. like razorpay_payment_id, razorpay_order_id, razorpay_signature These are proof of payment.
                    try {
                        const verifyRes = await axios.post('http://localhost:3000/api/orders/verify-payment',
                            response,
                            {
                                headers: { Authorization: `Bearer ${accessToken}` }
                            }
                        )
                        if (verifyRes.data.success) {
                            console.log((verifyRes));

                            toast.success("✅ Payment Successful!!")
                            dispatch(setCart({ items: [], totalPrice: 0 }))
                            console.log("orderId", verifyRes.data.order._id);
                            console.log("amount", verifyRes.data.order.amount);

                            navigate("/payment", {
                                state: {
                                    orderId: verifyRes.data.order._id,
                                    amount: verifyRes.data.order.amount,
                                    estimatedDelivery: "3–5 Business Days"
                                }
                            })
                        } else {
                            toast.error("❌ Payment Verification Failed!!")

                        }
                    } catch (error) {
                        console.error("Payment verification error:", error)
                        toast.error("Payment verification failed")
                    }
                },
                modal: { // This configures the Razorpay modal behavior.
                    // escape: true, // Allow closing the modal with the escape key.
                    // backdropclose: false, // Prevent closing the modal by clicking outside of it.
                    onDismiss: async function () { // This function is called when the user closes the Razorpay modal without completing the payment.
                        // Handle user closing the popup
                        try {
                            await axios.post(
                                `http://localhost:3000/api/orders/verify-payment`,
                                {
                                    razorpay_order_id: data.order.id,
                                    paymentFailed: true
                                },
                                {
                                    headers: { Authorization: `Bearer ${accessToken}` }
                                }
                            );
                            toast.error("Payment Cancelled or Failed");
                        } catch (error) {
                            console.error("Error handling payment dismissal:", error);
                        }
                    }
                },
                prefill: {
                    name: user.fullName,
                    email: user.email,
                    contact: user.phone
                },
                theme: {
                    color: "#D97706"
                }
            }

            const rzp = new window.Razorpay(options) // This creates a new instance of Razorpay with the specified options.

            rzp.on('payment.failed', async function (response) { // This function is called when the payment fails. It receives a response object with details about the failure.
                try {
                    await axios.post(
                        `http://localhost:3000/api/orders/verify-payment`,
                        {
                            razorpay_order_id: data.order.id,
                            paymentFailed: true
                        },
                        {
                            headers: { Authorization: `Bearer ${accessToken}` }
                        }
                    );
                    toast.error("Payment Cancelled or Failed");
                } catch (error) {
                    console.error("Error handling payment failure:", error);
                }
            });

            rzp.open();

        } catch (error) {
            console.error("Error fetching Razorpay data:", error.response)
            toast.error("Error fetching Razorpay data:", error)
        }
    }


    // const verifyPayment = async (paymentDetails) => {
    //     const response = await fetch("http://localhost:5000/verify-payment", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify(paymentDetails),
    //     });
    //     const result = await response.json();
    //     console.log(result);
    // };


    return (
        <div className="min-h-screen bg-amber-50/60">

            {/* Top nav strip */}
            <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 px-4 sm:px-8 py-3.5 shadow-sm">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink className="cursor-pointer text-amber-900 font-medium hover:text-white transition-colors"
                                onClick={() => navigate("/products")}>Products</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-amber-700" />
                        <BreadcrumbItem>
                            <BreadcrumbLink className="cursor-pointer text-amber-900 font-medium hover:text-white transition-colors"
                                onClick={() => navigate("/cart")}>Cart</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-amber-700" />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-bold text-white">Checkout</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Main layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">

                {/* ── LEFT COLUMN ── */}
                <div className="flex flex-col gap-5">

                    {/* Page heading */}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Confirm your delivery address before placing the order.</p>
                    </div>

                    {/* Selected address card */}
                    <section>
                        <h2 className="text-base font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <MapPin size={16} className="text-amber-500" /> Delivery Address
                        </h2>

                        {selectedAddress ? (
                            <div className="bg-white rounded-2xl border-2 border-amber-200 p-5 shadow-lg">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-slate-800 text-base">{selectedAddress.fullName}</p>
                                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                                            <Phone size={12} /> {selectedAddress.phone}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">Default</span>
                                        <button
                                            onClick={() => { setEditingAddress(selectedAddress); setIsFormOpen(true); setIsEditingEnable(true); setEditingAddressId(selectedAddress._id) }}
                                            className="p-1.5 rounded-lg hover:bg-slate-100 transition"
                                        >
                                            <EditIcon size={16} className="text-blue-500" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                                    {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.postalCode}, {selectedAddress.country}
                                </p>

                                <button
                                    onClick={() => { setIsFormOpen(true); setEditingAddress(null); setIsEditingEnable(false); }}
                                    className="mt-4 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 px-4 py-2 rounded-xl transition"
                                >
                                    + Add New Address
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-dashed border-amber-300 p-6 text-center">
                                <MapPin size={28} className="text-amber-400 mx-auto mb-2" />
                                <p className="text-slate-500 text-sm mb-3">No address selected. Please add a delivery address.</p>
                                <button
                                    onClick={() => setIsFormOpen(true)}
                                    className="text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-xl transition"
                                >
                                    Add Address
                                </button>
                            </div>
                        )}
                    </section>

                    {/* Address form */}
                    {isFormOpen && (
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-7 shadow-sm">
                            <div className="flex items-start justify-between mb-5">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">
                                        {isEditingEnable ? "Edit Address" : "Add New Address"}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Enter accurate shipping details.</p>
                                </div>
                                <button onClick={() => setIsFormOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg transition">
                                    <X size={18} className="text-slate-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Full Name</label>
                                        <input type="text" placeholder="John Doe" className={inputClass(errors.fullName)}
                                            {...register("fullName", { required: "Full Name is required" })} />
                                        {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Phone</label>
                                        <input type="text" placeholder="10-digit mobile number" className={inputClass(errors.phone)}
                                            {...register("phone", { required: "Phone is required", minLength: { value: 10, message: "Must be 10 digits" }, maxLength: { value: 10, message: "Must be 10 digits" } })} />
                                        {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Street Address</label>
                                    <textarea rows="3" placeholder="Flat/House no., Building, Apartment, Street"
                                        className={`w-full bg-white text-slate-800 border rounded-xl p-3 text-sm outline-none resize-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 ${errors.address ? 'border-red-400' : 'border-slate-200'}`}
                                        {...register("address", { required: "Address is required" })} />
                                    {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">City</label>
                                        <input type="text" placeholder="City name" className={inputClass(errors.city)}
                                            {...register("city", { required: "City is required" })} />
                                        {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">State</label>
                                        <input type="text" placeholder="State" className={inputClass(errors.state)}
                                            {...register("state", { required: "State is required" })} />
                                        {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Postal Code / PIN</label>
                                        <input type="text" placeholder="6-digit PIN" className={inputClass(errors.postalCode)}
                                            {...register("postalCode", { required: "Postal Code is required" })} />
                                        {errors.postalCode && <p className="text-xs text-red-500">{errors.postalCode.message}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Country</label>
                                        <input type="text" className={inputClass(errors.country)}
                                            {...register("country", { required: "Country is required" })} />
                                        {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
                                    </div>
                                </div>

                                <button type="submit"
                                    className="w-full h-11 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-semibold rounded-xl shadow-sm shadow-amber-200 transition-all duration-200 mt-1">
                                    Save Address
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Saved addresses list */}
                    <section>
                        <h2 className="text-base font-semibold text-slate-700 mb-3">Other Saved Addresses</h2>
                        <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-amber-400 scrollbar-track-amber-100">
                            {localAddresses.map((address) => (
                                <div key={address._id}
                                    className={`bg-white rounded-2xl border p-4 shadow-sm transition-all duration-200 ${selectedAddress?._id === address._id ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-100 hover:border-amber-200'}`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-800 truncate">{address.fullName}</p>
                                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                                <Phone size={11} /> {address.phone}
                                            </p>
                                        </div>
                                        <button onClick={() => { setEditingAddress(address); setIsFormOpen(true); setIsEditingEnable(true); }}
                                            className="p-1.5 rounded-lg hover:bg-slate-100 transition shrink-0">
                                            <EditIcon
                                                onClick={() => (setEditingAddressId(address._id))}
                                                size={15} className="text-blue-500" />
                                        </button>
                                    </div>

                                    <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                                        {address.address}, {address.city}, {address.state} — {address.postalCode}, {address.country}
                                    </p>

                                    <div className="flex items-center justify-between mt-3">
                                        <button
                                            onClick={() => dispatch(setSelectedAddress(address))}
                                            className={`text-sm font-medium px-4 py-1.5 rounded-xl transition ${selectedAddress?._id === address._id
                                                ? "bg-green-500 text-white"
                                                : "bg-amber-500 hover:bg-amber-600 text-white"}`}
                                        >
                                            {selectedAddress?._id === address._id ? "✓ Selected" : "Select"}
                                        </button>
                                        <button className="p-1.5 rounded-lg hover:bg-red-50 transition">
                                            <Trash size={16} className="text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* ── RIGHT COLUMN — Order Summary ── */}
                <div className="lg:sticky lg:top-6 ">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5 sm:p-6 space-y-5">
                        <h2 className="text-lg font-bold text-slate-800">Order Summary</h2>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Subtotal</span>
                                <span className="font-medium text-slate-800 flex items-center">
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
                                <span className="font-bold text-slate-800 flex items-center">
                                    <IndianRupee size={14} className="text-green-600" />
                                    {Number(total.toFixed(2)).toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>

                        {/* Promo code */}
                        <div className="flex gap-2">
                            <input type="text" placeholder="Promo code"
                                className="flex-1 h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition" />
                            <button className="h-10 px-4 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition">
                                Apply
                            </button>
                        </div>

                        <button
                            onClick={() => { handlePayment() }}
                            className="w-full h-11 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-semibold rounded-xl shadow-sm shadow-amber-200 transition-all duration-200"
                        >
                            Proceed to Pay
                        </button>

                        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                            <span>or</span>
                            <button onClick={() => navigate("/products")} className="text-amber-600 font-medium hover:underline flex items-center gap-1">
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

export default Address