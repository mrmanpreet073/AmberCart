import React from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useNavigate } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'






const BreadCrum = ({cart}) => {
    const navigate = useNavigate()
    return (
        <div className='flex item-center justify-between'>
            <div className=' py-2'>
                <Breadcrumb>
                    <BreadcrumbList className={"flex"}>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => navigate("/")}>Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => navigate("/products")}>Products</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className={"text-amber-600 font-bold"}>OverView</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div>
                <div className="flex items-center gap-1 sm:gap-4 shrink-0 relative" >
                    <button onClick={() => navigate("/cart")}
                        className="p-2 text-stone-500 hover:text-stone-700 transition-colors relative cursor-pointer">
                        <ShoppingBag

                            className="h-5 w-5 md:h-6 md:w-6" />
                        <span className="absolute top-1 right-1 h-4 w-4 md:h-4.5 md:w-4.5 rounded-full bg-amber-600 text-[10px] md:text-[13px] font-bold text-white flex items-center justify-center scale-90">
                            {cart?.items?.length}

                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BreadCrum
