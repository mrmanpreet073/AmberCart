import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider"

import { Search, SlidersHorizontal, X } from "lucide-react";
import {Select,SelectContent,SelectGroup,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select"
import { Button } from '@/components/ui/button';

const SideBar = ({ products, search, setSearch, priceRange, setPriceRange, brand, setBrand, category, setCategory }) => {

    const categorys = products.map((p) => (p.category))
    const uniqueCategorys = ["All", ...new Set(categorys)]
    // console.log(uniqueCategorys);
    const brands = products.map((p) => (p.brand))
    const uniqueBrands = ["All", ...new Set(brands)]
    // console.log(uniqueBrands);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);


    // handlers \

    const handleCategoryClick = (val) => {
        setCategory(val)
    }
    const handleSearch = (e) => {
        setSearch(e.target.value)
    }
    

    const handleBrandChange = (value) => {
        setBrand(value)
    }

    const handleMinChange = (e) => {
        const value = Number(e.target.value);
        if (value <= priceRange[1]) setPriceRange([value, priceRange[1]])
    }
    const handleMaxChange = (e) => {
        const value = Number(e.target.value);
        if (value >= priceRange[0]) setPriceRange([priceRange[0], value])
    }


    const handleReset = () => {
        setSearch("")
        setBrand("All")
        setCategory("All")
        setPriceRange([0, 999999])
    }



    return (
        <>

            {/* FLOATING MOBILE FILTER BUTTON (Pinned safely to bottom-right) */}
            <div className="md:hidden fixed bottom-6 right-6 z-40 ">
                <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-full shadow-lg font-semibold text-sm active:scale-95 transition-transform cursor-pointer border border-stone-800"
                >
                    <SlidersHorizontal size={16} className="text-amber-400" />
                    Filters
                </button>
            </div>
            {/* BACKDROP OVERLAY FOR MOBILE: Darkens screen when sidebar drawer opens */}
            {isMobileFilterOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-45 md:hidden transition-opacity animate-fade-in"
                    onClick={() => setIsMobileFilterOpen(false)}
                />
            )}

            {/* SIDEBAR CONTAINER (Desktop: Normal panel | Mobile: Sliding Drawer Panel) */}
            <div className={`
                fixed md:sticky top-0 left-0 h-full md:h-auto w-[280px] md:w-[22%] overflow-y-auto  md:overflow-visible 
                bg-white md:bg-white/80 backdrop-blur-md p-5 z-50 md:z-10 
                border-r md:border border-stone-200/80 md:border-amber-200/60 shadow-xl md:shadow-sm 
                transition-transform duration-450  rounded-smease-in-out self-start
                ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>

                {/* Drawer Header Layout (Visible only on Mobile) */}
                <div className="flex justify-between items-center mb-6 md:mb-4">
                    <h2 className="font-bold text-stone-800 text-base flex items-center gap-2">
                        <SlidersHorizontal size={18} className="text-amber-700" />
                        Filters
                    </h2>
                    {/* Close button inside mobile slide container drawer */}
                    <button
                        onClick={() => setIsMobileFilterOpen(false)}
                        className="md:hidden p-1 text-stone-400 hover:text-stone-700 rounded-lg bg-stone-100 cursor-pointer transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Filter Inner Forms Options Elements placeholder */}
                <div className="space-y-4 text-sm text-stone-500">
                    <div className="search border-2 flex justify-between items-center  ">
                        <Search className='h-3.5' 
                        />
                        <input 
                        type="Search" 
                        placeholder='Search...'
                        value={search} 
                        onChange={(e)=>handleSearch(e)}
                         className='h-7  w-full focus:outline-none' />
                    </div>
                    {/* CATEGORIES  */}
                    <div>
                        <h3 className="font-semibold text-stone-700 mb-2">Categories</h3>
                        <div className="flex flex-col gap-2">
                            {
                                uniqueCategorys.map((p) => (

                                    <label key={p.category} className="flex items-center gap-2 text-stone-600 cursor-pointer">
                                        <input type="checkbox"
                                            checked={category === p}
                                            onChange={() => handleCategoryClick(p)}
                                            className="accent-amber-600 w-4 h-4 rounded" />
                                        {p}
                                    </label>

                                ))
                            }

                        </div>
                    </div>
                    {/* BRANDS  */}
                    <div>
                        <h3 className="font-semibold text-stone-700 mb-2">Brands</h3>
                        <div className="flex flex-col gap-2 ">
                            {


                                <Select
                                    value={brand}
                                    onValueChange={(value) => handleBrandChange(value)}
                                >
                                    <SelectTrigger className="w-auto">
                                        <SelectValue placeholder="Select Brand" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {uniqueBrands.map((p) => (
                                                <SelectItem value={`${p}`} key={p}>{p}</SelectItem>
                                            ))}

                                        </SelectGroup>
                                    </SelectContent>
                                </Select>


                            }

                        </div>
                    </div>
                    {/* SLIDER  */}
                    <div>
                        <h4 className='text-black font-medium'>Range</h4>
                        <p className='py-2'>
                            ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                        </p>
                        <input type="number"
                            // value={priceRange[0]}
                            onChange={(e) => handleMinChange(e)}
                            min={0}
                            
                            placeholder='From'
                            className='border w-[45%] rounded-sm px-1 my-1 roun' />

                        <span className='mx-2'>-</span>

                        <input type="number"
                            // value={priceRange[1]}
                            onChange={(e) => handleMaxChange(e)} min={0}
                            max={999999}
                            placeholder='To'
                            className='border w-[45%] rounded-sm px-1  my-1' />
                        <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            min={0}
                            max={999999}
                            step={1000}
                            className="mx-auto w-full max-w-xs py-2 my-2"
                        />                    </div>
                    <div>
                        <Button onClick={() => handleReset()} className={"w-25 bg-amber-700 hover:bg-amber-900"}>Reset</Button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default SideBar;