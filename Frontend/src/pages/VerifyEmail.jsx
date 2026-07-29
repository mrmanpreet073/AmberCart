import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

const VerifyEmail = () => {
    const [status, setStatus] = useState("Verifying...")
    const navigate = useNavigate();
    const { token } = useParams();
    const hasVerified = useRef(false);


    const verifyEmail = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/user/verify", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setStatus("✅ Email verified successfully");

                // setTimeout(() => {
                //     navigate("/login");
                // }, 2000);
            } else {
                setStatus(response.data.message);
            }
        } catch (error) {
            setStatus(
                error.response?.data?.message || "❌ Verification failed"
            );
            console.log(error.response?.data);

        }
    }

    useEffect(() => {
        if (hasVerified.current) return;

        hasVerified.current = true;
        verifyEmail();
    }, [token]);

    // Helper functions to dynamically render matching warm icons and layout states
    const isSuccess = status.includes("✅");
    const isFailure = status.includes("❌") || (!status.includes("Verifying...") && !isSuccess);

    return (
        <div className="flex justify-center items-center bg-[#FDFBF7] min-h-screen px-4">
            <div className="w-full max-w-md bg-white border border-stone-200/80 rounded-2xl shadow-xl shadow-stone-100 p-8 text-center transition-all">
                <div className="flex flex-col items-center justify-center space-y-4">
                    
                    {/* Status Icon Indicator */}
                    {status === "Verifying..." && (
                        <div className="p-4 rounded-full bg-amber-50 text-amber-600">
                            <Loader2 className="w-10 h-10 animate-spin" />
                        </div>
                    )}
                    
                    {isSuccess && (
                        <div className="p-4 rounded-full bg-emerald-50 text-emerald-600">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                    )}
                    
                    {isFailure && (
                        <div className="p-4 rounded-full bg-rose-50 text-rose-600">
                            <XCircle className="w-10 h-10" />
                        </div>
                    )}

                    {/* Status Message Text */}
                    <h2 className={`text-xl font-semibold tracking-tight ${
                        isSuccess ? 'text-emerald-800' : isFailure ? 'text-rose-800' : 'text-stone-800'
                    }`}>
                        {status === "Verifying..." ? "Verifying your link" : status.replace(/^[✅❌]\s*/, "")}
                    </h2>

                    <p className="text-sm text-stone-500 max-w-xs">
                        {status === "Verifying..." 
                            ? "Please secure this window while we securely process your authorization token." 
                            : isSuccess 
                            ? "Your profile configuration is fully authorized. You can safely return to your app." 
                            : "The authentication link might be expired, malformed, or already processed."}
                    </p>

                    {/* Action Fallbacks */}
                    {!status.includes("Verifying...") && (
                        <button 
                            onClick={() => navigate('/login')}
                            className="mt-4 px-6 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-sm rounded-xl transition-colors cursor-pointer"
                        >
                            Return to Login
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail