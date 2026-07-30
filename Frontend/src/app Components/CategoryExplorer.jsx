import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Zap, Shirt, Dumbbell } from 'lucide-react';
import AxiosInstance from '@/Api/AxiosInstance';

// ── Skeleton loader for cards ──
const SkeletonCard = () => (
    <div className="shrink-0 w-40 sm:w-48 bg-white rounded-2xl overflow-hidden border border-amber-100 animate-pulse">
        <div className="h-36 sm:h-44 bg-amber-100" />
        <div className="p-3 space-y-2">
            <div className="h-3 bg-amber-100 rounded w-3/4" />
            <div className="h-3 bg-amber-50 rounded w-1/2" />
            <div className="h-5 bg-amber-100 rounded w-1/3 mt-1" />
        </div>
    </div>
);

// ── Single product card ──
const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`/product/${product._id}`)}
            className="shrink-0 w-40 sm:w-48 bg-white rounded-2xl overflow-hidden border border-amber-100 hover:border-amber-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
        >
            <div className="h-36 sm:h-44 bg-amber-50 overflow-hidden">
                <img
                    src={product?.productImg?.[0]?.url || "/placeholder.png"}
                    alt={product?.productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.png"; }}
                    loading="lazy"
                />
            </div>
            <div className="p-3">
                <p className="text-xs font-medium text-slate-700 line-clamp-2 leading-snug min-h-[2.2rem]">
                    {product?.productName}
                </p>
                <p className="text-sm font-bold text-amber-700 mt-1.5">
                    ₹{product?.productPrice?.toLocaleString("en-IN")}
                </p>
            </div>
        </div>
    );
};

// ── Section row ──
const Section = ({ title, icon: Icon, accent, products, isLoading, onViewAll }) => (
    <div className="mb-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent}`}>
                    <Icon size={16} className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            </div>
            <button
                onClick={onViewAll}
                className="flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-800 transition-colors group"
            >
                View all
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
        </div>

        {/* Horizontal scroll strip */}
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none snap-x snap-mandatory p-2">
            {isLoading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
                : products.map((product) => (
                    <div key={product._id} className="snap-start">
                        <ProductCard product={product} />
                    </div>
                ))
            }
        </div>
    </div>
);

// ── Main component ──
export default function CategoryExplorer() {
    const navigate = useNavigate();
    const [sections, setSections] = useState({
        featured: [],
        electronics: [],
        fashion: [],
        sports: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHomepage = async () => {
            try {
                setIsLoading(true);
                const res = await AxiosInstance.get("/product/homepage");
                if (res.data.success) {
                    setSections(res.data.sections);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHomepage();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50/30">

            {/* ── Hero banner ── */}
            <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-300 px-4 sm:px-8 py-10 sm:py-14">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="text-amber-800 text-sm font-semibold uppercase tracking-widest mb-2">
                            AmberCart
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                            Everything you need,<br />
                            <span className="text-amber-900">delivered fast.</span>
                        </h1>
                        <p className="text-amber-800/80 text-sm mt-3 max-w-sm">
                            Shop electronics, fashion, sports and more — all in one place.
                        </p>
                        <button
                            onClick={() => navigate("/products")}
                            className="mt-5 inline-flex items-center gap-2 bg-amber-900 hover:bg-amber-950 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition active:scale-95 shadow-md"
                        >
                            Shop Now <ArrowRight size={15} />
                        </button>
                    </div>
                    <div className="hidden sm:flex gap-3">
                        {["📱", "👗", "💪", "🏠"].map((emoji, i) => (
                            <div key={i}
                                className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm border border-white/40 hover:bg-white/50 transition cursor-pointer"
                            >
                                {emoji}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Category quick links ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-5">
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {[
                        { label: "Electronics", emoji: "📱", cat: "Electronics" },
                        { label: "Fashion",     emoji: "👗", cat: "Fashion"     },
                        { label: "Sports & Fitness",      emoji: "💪", cat:"Sports & Fitness"},
                        { label: "All",         emoji: "🛍️", cat: ""            },
                    ].map(({ label, emoji, cat }) => (

                        
                        <button
                            key={label}
                            onClick={() => navigate(cat ? `/products?category=${encodeURIComponent(cat)}` : "/products")}
                            className="bg-white hover:bg-amber-50 border border-amber-100 hover:border-amber-300 rounded-2xl p-3 sm:p-4 flex flex-col items-center gap-1.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <span className="text-xl sm:text-2xl">{emoji}</span>
                            <span className="text-xs sm:text-sm font-semibold text-slate-700">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Product sections ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">

                <Section
                    title="Featured"
                    icon={Star}
                    accent="bg-amber-500"
                    products={sections.featured}
                    isLoading={isLoading}
                    onViewAll={() => navigate("/products")}
                />

                <div className="border-t border-amber-100 mb-8" />

                <Section
                    title="Electronics"
                    icon={Zap}
                    accent="bg-blue-500"
                    products={sections.electronics}
                    isLoading={isLoading}
                    onViewAll={() => navigate("/products?category=Electronics")}
                />

                <div className="border-t border-amber-100 mb-8" />

                <Section
                    title="Fashion"
                    icon={Shirt}
                    accent="bg-pink-500"
                    products={sections.fashion}
                    isLoading={isLoading}
                    onViewAll={() => navigate("/products?category=Fashion")}
                />

                <div className="border-t border-amber-100 mb-8" />

                <Section
                    title="Sports & Fitness"
                    icon={Dumbbell}
                    accent="bg-green-500"
                    products={sections.sports}
                    isLoading={isLoading}
                    onViewAll={() => navigate("/products?category=Sports & Fitness")}
                />

            </div>

            {/* ── Bottom banner ── */}
            <div className="bg-amber-900 text-white px-4 sm:px-8 py-8 mt-4">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="font-bold text-lg">Free delivery above ₹500</p>
                        <p className="text-amber-300 text-sm mt-0.5">100-day returns · Secure checkout</p>
                    </div>
                    <button
                        onClick={() => navigate("/products")}
                        className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-6 py-2.5 rounded-xl transition active:scale-95 text-sm"
                    >
                        Browse All Products
                    </button>
                </div>
            </div>

        </div>
    );
}