import React, { useEffect, useState, useCallback } from 'react';
import Card from "../app Components/Card.jsx";
import axios from 'axios';
import { ChevronDown, ChevronLeft, ChevronRight, Search, ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import SkeletonCard from '../app Components/Skeleton.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { setProduct, setSelectedCategory } from '@/Redux/productSice.js';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useSearchParams } from 'react-router-dom';
import AxiosInstance from '@/Api/AxiosInstance.jsx';

const LIMIT = 10;

const Products = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()


const [searchParams] = useSearchParams();

    // const [selectedCategory, setSelectedCategory] = useState(paramsCategory || "All");

    // products & pagination
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalProducts: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false });

    // filter state
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState(() => {
        return searchParams.get("category") || "All";
    });
    const [brand, setBrand] = useState("All")
    const [priceRange, setPriceRange] = useState([0, 999999])
    const [order, setOrder] = useState("")
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

    // options for category/brand — fetched once from all products
    const [allCategories, setAllCategories] = useState(["All"])
    const [allBrands, setAllBrands] = useState(["All"])

    const { cart } = useSelector(store => store.product);
    // const { category } = useSelector(store => store.product);


    // const paramsCategory = new URLSearchParams(window.location.search).get("category");
    // console.log("Params Category =", paramsCategory);

    // if(paramsCategory && paramsCategory !== "All") {
    //     setCategory(paramsCategory);
    //     // dispatch(setSelectedCategory(paramsCategory));
    // }  

    // fetch meta ONCE — never again unless page refreshes
    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const res = await AxiosInstance.get("/product/productMeta");
                if (res.data.success) {
                    setAllCategories(res.data.categories);
                    setAllBrands(res.data.brands);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchMeta();
    }, []) //  ← empty array = runs once only

    // fetch paginated + filtered products from backend
    const fetchProducts = useCallback(async (currentPage) => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams({ page: currentPage, limit: LIMIT });
            if (search.trim()) params.append("search", search.trim());
            if (category !== "All") params.append("category", category);
            if (brand !== "All") params.append("brand", brand);
            if (priceRange[0] > 0) params.append("minPrice", priceRange[0]);
            if (priceRange[1] < 999999) params.append("maxPrice", priceRange[1]);
            if (order) params.append("order", order);

            const res = await AxiosInstance.get(`/product/allProducts?${params}`);
            if (res.data.success) {
                setProducts(res.data.products);
                setPagination(res.data.pagination);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [search, category, brand, priceRange, order]);

    // re-fetch when page changes
    useEffect(() => {
        fetchProducts(page);
    }, [page, fetchProducts]);

    // reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [search, category, brand, priceRange, order]);

    const handleReset = () => {
        setSearch("");
        setCategory("All");
        setBrand("All");
        setPriceRange([0, 999999]);
        setOrder("");
        setPage(1);
    };

    const activeFilterCount = [
        search.trim() !== "",
        category !== "All",
        brand !== "All",
        priceRange[0] > 0 || priceRange[1] < 999999,
        order !== ""
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gradient-to-r from-amber-300 via-orange-100 to-amber-300 font-sans">

            {/* Top bar */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-amber-100 shadow-sm">
                <div className="max-w-7xl mx-auto h-14 flex justify-between items-center px-4">
                    <Breadcrumb>
                        <BreadcrumbList className="flex">
                            <BreadcrumbItem>
                                <BreadcrumbLink className="cursor-pointer" onClick={() => navigate("/")}>Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem className="font-bold">
                                <BreadcrumbLink className="cursor-pointer" onClick={() => navigate("/products")}>Products</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex items-center gap-3">
                        {/* Sort */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-9 text-sm">
                                    Sort <ChevronDown size={14} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => setOrder("lowToHigh")}>Price: Low to High</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setOrder("highToLow")}>Price: High to Low</DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Cart */}
                        <button className="relative p-2 text-stone-500 hover:text-stone-700 transition-colors"
                            onClick={() => navigate("/cart")}>
                            <ShoppingBag className="h-5 w-5" />
                            {cart?.items?.length > 0 && (
                                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-amber-600 text-[10px] font-bold text-white flex items-center justify-center">
                                    {cart.items.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto md:px-4 py-5 flex flex-col lg:flex-row gap-5">

                {/* ── FILTER PANEL ── */}

                {/* Mobile filter button */}
                <div className="lg:hidden flex justify-between items-center">
                    <button
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="flex items-center gap-2 bg-amber-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow active:scale-95 transition mx-2"
                    >
                        <SlidersHorizontal size={15} className="text-white" />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                    {activeFilterCount > 0 && (
                        <button onClick={handleReset} className="text-sm text-amber-700 font-medium underline">
                            Reset all
                        </button>
                    )}
                </div>

                {/* Mobile backdrop */}
                {isMobileFilterOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsMobileFilterOpen(false)} />
                )}

                {/* Filter sidebar — slide on mobile, sticky on desktop */}
                <aside className={`
                    fixed lg:sticky top-0 lg:top-20 left-0 h-full lg:h-fit min-w-65 lg:w-64
                    bg-white lg:bg-white/80 backdrop-blur-md
                    border-r lg:border border-stone-200 lg:border-amber-200/60
                    shadow-xl lg:shadow-sm rounded-none lg:rounded-2xl
                    p-5 z-50 lg:z-10 overflow-y-auto lg:overflow-visible
                    transition-transform duration-300 ease-in-out
                    ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    self-start
                `}>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="font-bold text-stone-800 flex items-center gap-2">
                            <SlidersHorizontal size={16} className="text-amber-600" />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                                    {activeFilterCount}
                                </span>
                            )}
                        </h2>
                        <button onClick={() => setIsMobileFilterOpen(false)} className="lg:hidden p-1 rounded-lg bg-stone-100 text-stone-500 hover:text-stone-800 transition">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="space-y-5 text-sm">

                        {/* Search */}
                        <div>
                            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5 block">Search</label>
                            <div className="flex items-center gap-2 border border-stone-200 rounded-xl px-3 py-2 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition bg-white">
                                <Search size={14} className="text-stone-400 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full text-sm outline-none bg-transparent text-stone-800 placeholder-stone-400"
                                />
                                {search && (
                                    <button onClick={() => setSearch("")}>
                                        <X size={13} className="text-stone-400 hover:text-stone-700" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-stone-100" />

                        {/* Categories */}
                        <div>
                            <h3 className="text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">Category</h3>
                            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-300 pr-1">
                                {allCategories.map((cat) => (
                                    <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={category === cat}
                                            onChange={() => setCategory(cat)}
                                            className="accent-amber-600 w-4 h-4 rounded"
                                        />
                                        <span className={`text-sm transition-colors ${category === cat ? "text-amber-700 font-semibold" : "text-stone-600 group-hover:text-stone-800"}`}>
                                            {cat}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-stone-100" />

                        {/* Brand */}
                        <div>
                            <h3 className="text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">Brand</h3>
                            <Select value={brand} onValueChange={setBrand}>
                                <SelectTrigger className="w-full rounded-xl border-stone-200 focus:border-amber-400">
                                    <SelectValue placeholder="Select brand" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {allBrands.map((b) => (
                                            <SelectItem key={b} value={b}>{b}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="border-t border-stone-100" />

                        {/* Price range */}
                        {/* Price range — preset buttons */}
                        <div>
                            <h3 className="text-xs font-semibold text-stone-600 uppercase tracking-wide mb-3">Price Range</h3>
                            <div className="flex flex-col overflow-y-scroll h-30 gap-2 scrollbar-thin scrollbar-thumb-amber-500 pr-1">
                                {[
                                    { label: "Under ₹500", min: 0, max: 500 },
                                    { label: "₹500 – ₹1,000", min: 500, max: 1000 },
                                    { label: "₹1,000 – ₹5,000", min: 1000, max: 5000 },
                                    { label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
                                    { label: "₹10,000 – ₹50,000", min: 10000, max: 50000 },
                                    { label: "₹50,000 – ₹1,00,000", min: 50000, max: 100000 },
                                    { label: "Above ₹1,00,000", min: 100000, max: 999999 },
                                ].map((range) => {
                                    const isActive = priceRange[0] === range.min && priceRange[1] === range.max;
                                    return (
                                        <button
                                            key={range.label}
                                            onClick={() => setPriceRange([range.min, range.max])}
                                            className={`text-left text-sm px-3 py-2 rounded-xl border transition-all duration-150
                        ${isActive
                                                    ? "bg-amber-500 text-white border-amber-500 font-semibold shadow-sm"
                                                    : "bg-white text-stone-600 border-stone-200 hover:border-amber-300 hover:bg-amber-50"
                                                }`}
                                        >
                                            {range.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="border-t border-stone-100" />

                        {/* Reset */}
                        <Button
                            onClick={handleReset}
                            className="w-full bg-amber-600 hover:bg-amber-700 rounded-xl"
                        >
                            Reset Filters
                        </Button>
                    </div>
                </aside>

                {/* ── PRODUCT GRID ── */}
                <div className=" flex flex-col gap-4">

                    {/* Result count */}
                    {!isLoading && (
                        <p className="text-sm text-stone-500 px-1">
                            <span className="font-semibold text-stone-700">{pagination.totalProducts}</span> products found
                            {search && <span> for "<span className="text-amber-700">{search}</span>"</span>}
                        </p>
                    )}

                    {/* Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 mx-3">
                            {Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard className="w-35" key={i} />)}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="w-full h-64 flex flex-col justify-center items-center bg-white/40 rounded-2xl border border-dashed border-amber-300 gap-3">
                            <p className="text-stone-500 font-medium">No products found</p>
                            <button onClick={handleReset} className="text-sm text-amber-700 underline font-medium">Clear filters</button>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-4 justify-center">
                            {products.map((product) => (
                                <Card key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!isLoading && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 py-4 flex-wrap">
                            <button
                                onClick={() => setPage(p => p - 1)}
                                disabled={!pagination.hasPrevPage}
                                className="w-9 h-9 flex items-center justify-center rounded-xl border border-amber-200 bg-white hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeft size={16} className="text-amber-700" />
                            </button>

                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-9 h-9 rounded-xl text-sm font-semibold border transition
                                        ${page === p
                                            ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                                            : "bg-white text-slate-600 border-amber-200 hover:bg-amber-50"}`}
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={!pagination.hasNextPage}
                                className="w-9 h-9 flex items-center justify-center rounded-xl border border-amber-200 bg-white hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <ChevronRight size={16} className="text-amber-700" />
                            </button>
                        </div>
                    )}

                    {!isLoading && pagination.totalPages > 0 && (
                        <p className="text-center text-xs text-slate-400 pb-4">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;