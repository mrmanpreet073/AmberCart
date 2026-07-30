import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle, ShoppingBag, Home, IndianRupee, Package } from "lucide-react";

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { orderId, amount, estimatedDelivery } = location.state || {};

    useEffect(() => {
        if (!location.state) {
            navigate("/products", { replace: true });
        }
    }, []);

    if (!location.state) return null;

    return (
        <div className="min-h-screen bg-green-50/60 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

                    {/* Green top band */}
                    <div className="bg-gradient-to-r from-green-500 via-green-400 to-green-500 px-6 py-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4">
                            <CheckCircle size={38} className="text-green-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
                        <p className="text-green-100 text-sm mt-1">Thank you for your order 🎉</p>
                    </div>

                    <div className="px-6 py-5 space-y-4">

                        {/* Order ID */}
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 font-medium">Order ID</span>
                            <span className="text-slate-700 font-semibold font-mono bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-xs">
                                #{orderId}
                            </span>
                        </div>

                        <div className="border-t border-slate-100" />

                        {/* Amount */}
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 font-medium">Amount Paid</span>
                            <span className="font-bold text-green-600 flex items-center gap-0.5 text-base">
                                <IndianRupee size={15} />
                                {Number(amount?.toFixed(2)).toLocaleString("en-IN")}
                            </span>
                        </div>

                        <div className="border-t border-slate-100" />

                        {/* Delivery */}
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 font-medium">Est. Delivery</span>
                            <span className="text-slate-700 font-semibold">
                                {estimatedDelivery || "3-5 Business Days"}
                            </span>
                        </div>

                        <div className="border-t border-slate-100" />

                        {/* Status tracker */}
                        <div className="pt-1">
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-4">Order Status</p>
                            <div className="flex items-center">

                                <div className="flex flex-col items-center">
                                    <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                                        <CheckCircle size={18} className="text-white" />
                                    </div>
                                    <p className="text-xs text-green-600 font-semibold mt-1.5">Confirmed</p>
                                </div>

                                <div className="flex-1 h-0.5 bg-slate-200 mx-1 mb-5" />

                                <div className="flex flex-col items-center">
                                    <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                                        <Package size={16} className="text-slate-400" />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1.5">Packing</p>
                                </div>

                                <div className="flex-1 h-0.5 bg-slate-200 mx-1 mb-5" />

                                <div className="flex flex-col items-center">
                                    <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                                        <ShoppingBag size={16} className="text-slate-400" />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1.5">Shipped</p>
                                </div>

                                <div className="flex-1 h-0.5 bg-slate-200 mx-1 mb-5" />

                                <div className="flex flex-col items-center">
                                    <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                                        <Home size={16} className="text-slate-400" />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1.5">Delivered</p>
                                </div>

                            </div>
                        </div>

                        {/* green info note */}
                        <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                            <p className="text-xs text-green-700 leading-relaxed">
                                📧 A confirmation has been sent to your registered email. Track your order from the{" "}
                                <span className="font-semibold cursor-pointer underline" onClick={() => navigate("/orders")}>
                                    Orders
                                </span>{" "}
                                section.
                            </p>
                        </div>

                        {/* green buttons */}
                        <div className="flex flex-col gap-2.5 pt-1">
                            {/* <button
                                onClick={() => navigate("/orders")}
                                className="w-full h-11 bg-green-500 hover:bg-green-600 active:scale-[0.99] text-white font-semibold rounded-xl shadow-sm shadow-green-200 transition-all duration-200"
                            >
                                View My Orders
                            </button> */}
                            <button
                                onClick={() => navigate("/products")}
                                className="w-full h-11 bg-white hover:bg-green-50 border border-green-200 text-green-700 font-semibold rounded-xl transition-all duration-200"
                            >
                                Continue Shopping
                            </button>
                        </div>

                    </div>
                </div>

                <p className="text-center text-xs text-slate-400 mt-5">
                    Need help?{" "}
                    <span className="text-green-600 font-medium cursor-pointer hover:underline">
                        Contact Support
                    </span>
                </p>

            </div>
        </div>
    );
};

export default Payment;