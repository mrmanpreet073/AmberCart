import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import BreadCrum from "@/app Components/overView/BreadCrum";
import IImgGallary from "@/app Components/overView/IImgGallary";
import ProductDesc from "@/app Components/overView/ProductDesc";
import AxiosInstance from "@/Api/AxiosInstance";

const ProductOverview = () => {
    const { cart } = useSelector((state) => state.product);
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProduct = async () => {
        try {
            setLoading(true);

            const { data } = await AxiosInstance.get(
                `/product/product/${id}`
            );

            if (data.success) {
                setProduct(data.product);
            }

        } catch (error) {
            console.error("Error fetching product:", error.response);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="animate-pulse text-stone-500 font-medium">
                    Loading Product...
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="text-red-500 font-medium">
                    Product not found.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50/50 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Breadcrumb */}
                <div className="px-1">
                    <BreadCrum cart={cart} />
                </div>

                {/* Product Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white p-4 md:p-8 rounded-3xl border border-stone-100 shadow-sm">

                    <div className="lg:col-span-5">
                        <IImgGallary images={product.productImg} />
                    </div>

                    <div className="lg:col-span-7">
                        <ProductDesc product={product} />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductOverview;