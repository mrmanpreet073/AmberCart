import { Mail, CheckCircle } from "lucide-react";

export default function VerifyEmail() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-stone-200/80 rounded-2xl shadow-xl shadow-stone-100 p-8 text-center">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-amber-50">
            <Mail className="w-10 h-10 text-amber-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-stone-800 mb-3">
          Verify Your Email
        </h1>

        <p className="text-stone-600 mb-6">
          We've sent a verification link to your email address.
          Please check your inbox and click the link to activate your account.
        </p>

        {/* Email */}
        <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 mb-6">
          <p className="text-amber-800 font-medium">
            example@gmail.com
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 text-emerald-700 mb-6 font-medium">
          <CheckCircle size={20} className="text-emerald-600" />
          <span>Waiting for verification...</span>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-sm shadow-amber-600/10 transition-all">
            I've Verified My Email
          </button>

          <button className="w-full py-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-medium transition-all">
            Resend Verification Email
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-sm text-stone-500">
          Didn't receive the email? Check your spam folder or request a new verification link.
        </p>

      </div>
    </div>
  );
}