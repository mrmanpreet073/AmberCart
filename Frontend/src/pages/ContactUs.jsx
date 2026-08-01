import { Mail, Phone, MapPin, Clock, Share2, AtSign, MessageCircle } from "lucide-react";

const ContactUs = () => {
    return (
        <div className="min-h-screen bg-amber-50/60">

            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 px-4 sm:px-8 py-12 text-center shadow-sm">
                <p className="text-amber-800 text-xs font-bold uppercase tracking-widest mb-2">We'd love to hear from you</p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Get in Touch</h1>
                <p className="text-amber-800/80 text-sm max-w-md mx-auto leading-relaxed">
                    Have a question about your order, a product, or just want to say hello? We're here for you.
                </p>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ── LEFT — Contact info ── */}
                <div className="flex flex-col gap-5">

                    {/* Info cards */}
                    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 space-y-5">
                        <h2 className="text-lg font-bold text-slate-800 mb-1">Contact Information</h2>

                        {[
                            {
                                icon: Mail,
                                label: "Email Us",
                                value: "support@ambercart.in",
                                sub: "We reply within 24 hours",
                                color: "bg-amber-100 text-amber-700"
                            },
                            {
                                icon: Phone,
                                label: "Call Us",
                                value: "+91 98765 43210",
                                sub: "Mon – Fri, 9 AM – 7 PM IST",
                                color: "bg-green-100 text-green-700"
                            },
                            {
                                icon: MapPin,
                                label: "Visit Us",
                                value: "12, Amber Tower, MG Road",
                                sub: "Pune, Maharashtra — 411001",
                                color: "bg-blue-100 text-blue-700"
                            },
                        ].map(({ icon: Icon, label, value, sub, color }) => (
                            <div key={label} className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                                    <Icon size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">{label}</p>
                                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Support hours */}
                    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
                                <Clock size={15} className="text-amber-700" />
                            </div>
                            <h2 className="text-base font-bold text-slate-800">Support Hours</h2>
                        </div>

                        <div className="space-y-2.5">
                            {[
                                { day: "Monday – Friday", time: "9:00 AM – 7:00 PM", open: true },
                                { day: "Saturday",        time: "10:00 AM – 4:00 PM", open: true },
                                { day: "Sunday",          time: "Closed", open: false },
                            ].map(({ day, time, open }) => (
                                <div key={day} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-none last:pb-0">
                                    <span className="text-slate-500">{day}</span>
                                    <span className={`font-semibold ${open ? "text-green-600" : "text-slate-400"}`}>
                                        {time}
                                        {open && (
                                            <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">
                                                OPEN
                                            </span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <p className="text-xs text-slate-400 mt-3">All times are in IST. Average response time is under 2 hours on working days.</p>
                    </div>

                    {/* Social links */}
                    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
                        <h2 className="text-base font-bold text-slate-800 mb-4">Follow Us</h2>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: AtSign,        label: "Instagram", handle: "@ambercart",      color: "hover:border-pink-300 hover:bg-pink-50" },
                                { icon: Share2,        label: "Twitter",   handle: "@ambercart",      color: "hover:border-blue-300 hover:bg-blue-50" },
                                { icon: MessageCircle, label: "WhatsApp",  handle: "+91 98765 43210", color: "hover:border-green-300 hover:bg-green-50" },
                            ].map(({ icon: Icon, label, handle, color }) => (
                                <div key={label}
                                    className={`flex flex-col items-center gap-2 p-3 border border-slate-100 rounded-xl cursor-pointer transition-all duration-200 ${color}`}
                                >
                                    <Icon size={20} className="text-slate-600" />
                                    <div className="text-center">
                                        <p className="text-xs font-semibold text-slate-700">{label}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{handle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* ── RIGHT — Message form (display only) ── */}
                <div className="flex flex-col gap-5">

                    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-1">Send a Message</h2>
                        <p className="text-xs text-slate-400 mb-5">Fill out the form and our team will get back to you shortly.</p>

                        <div className="space-y-4">

                            {/* Name row */}
                            <div className="grid grid-cols-2 gap-3">
                                {["First Name", "Last Name"].map((label) => (
                                    <div key={label}>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">{label}</label>
                                        <div className="h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 flex items-center">
                                            <span className="text-sm text-slate-300">John</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Email</label>
                                <div className="h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 flex items-center gap-2">
                                    <Mail size={14} className="text-slate-300" />
                                    <span className="text-sm text-slate-300">you@example.com</span>
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Phone (optional)</label>
                                <div className="h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 flex items-center gap-2">
                                    <Phone size={14} className="text-slate-300" />
                                    <span className="text-sm text-slate-300">+91 00000 00000</span>
                                </div>
                            </div>

                            {/* Topic */}
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Topic</label>
                                <div className="h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 flex items-center justify-between">
                                    <span className="text-sm text-slate-300">Select a topic</span>
                                    <span className="text-slate-300 text-xs">▼</span>
                                </div>
                                {/* Topic chips */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {["Order issue", "Return", "Payment", "Product query", "Other"].map((t, i) => (
                                        <span key={t}
                                            className={`text-xs px-3 py-1 rounded-full border transition cursor-pointer ${i === 0
                                                ? "bg-amber-500 text-white border-amber-500"
                                                : "bg-white text-slate-500 border-slate-200 hover:border-amber-300"}`}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Message</label>
                                <div className="h-32 bg-slate-50 border border-slate-200 rounded-xl p-3">
                                    <span className="text-sm text-slate-300">Describe your issue or question...</span>
                                </div>
                            </div>

                            {/* Submit button */}
                            <button
                                disabled
                                className="w-full h-11 bg-amber-500 text-white font-semibold rounded-xl text-sm opacity-80 cursor-not-allowed"
                            >
                                Send Message
                            </button>

                            <p className="text-center text-xs text-slate-400">
                                We'll get back to you within <span className="font-semibold text-amber-600">24 hours</span>.
                            </p>
                        </div>
                    </div>

                    {/* Map placeholder */}
                    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
                        <h2 className="text-base font-bold text-slate-800 mb-3">Our Location</h2>
                        <div className="h-40 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 flex flex-col items-center justify-center gap-2">
                            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                                <MapPin size={18} className="text-white" />
                            </div>
                            <p className="text-sm font-semibold text-slate-700">12, Amber Tower, MG Road</p>
                            <p className="text-xs text-slate-400">Pune, Maharashtra — 411001</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Bottom strip ── */}
            <div className="bg-amber-900 text-white px-4 sm:px-8 py-6 mt-2">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                    <div>
                        <p className="font-bold text-base">AmberCart Support</p>
                        <p className="text-amber-300 text-xs mt-0.5">Fast, friendly help — every day of the week.</p>
                    </div>
                    <div className="flex gap-4 text-xs text-amber-300">
                        <span>✦ Free returns</span>
                        <span>✦ Secure payments</span>
                        <span>✦ 24hr response</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ContactUs;
