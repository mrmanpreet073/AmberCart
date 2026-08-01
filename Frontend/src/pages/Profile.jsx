import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"

import photo from "../assets/photo.jpg"
import { Label } from 'radix-ui'
import { Input } from '@/components/ui/input'
import { ArrowLeftCircleIcon, Camera, ShoppingBag, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '@/Redux/userSlice'
import AxiosInstance from '@/Api/AxiosInstance'

// import photo from '../assets/icon-7797704_1280.png'



const Profile = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const params = useParams();
    const id = params.id

    // 1. Grab current user info from Redux to use as old values
    const user = useSelector((state) => state.user.user);
    // console.log(" User in Redux", user);

    const navigate = useNavigate()


    // Local state to store either the backend image URL, or the local preview URL
    const [previewUrl, setPreviewUrl] = useState("");
    // Local state to store the actual File object to send to the backend
    const [imageFile, setImageFile] = useState(null);

    // 2. Initialize React Hook Form with defaults
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            phoneNumber: user?.phoneNumber || "",
            city: user?.city || "",
            address: user?.address || "",
            zipCode: user?.zipCode || ""
        }
    });

    // 3. Keep inputs synced if Redux state updates late/async from API
    useEffect(() => {

        if (user) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                city: user.city,
                address: user.address,
                zipCode: user.zipCode
            });
        }
    }, [user, reset]);
    useEffect(() => {
        if (user?.photo) {
            setPreviewUrl(user.photo);
        }
    }, [user]);

    // 4. Submit handler function
    const onSaveProfile = async (textData) => {
        try {
            console.log("textData =", textData);

            const formData = new FormData();

            // Append all normal text fields into the form data
            formData.append("firstName", textData.firstName);
            formData.append("lastName", textData.lastName);
            formData.append("email", textData.email);
            formData.append("city", textData.city);
            formData.append("address", textData.address);
            formData.append("zipCode", textData.zipCode);
            formData.append("phoneNumber", textData.phoneNumber);


            // Append the raw image file if a new one was uploaded
            if (imageFile) {
                formData.append("file", imageFile); // 'photo' must match your backend upload middleware key (multer)
            }
            // console.log("Form Data = ", formData);

            const accessToken = localStorage.getItem("accessToken")
            const response = await AxiosInstance.post(`/user/updateProfile/${id}`, formData,);

            if (response.data?.success) {
                console.log("Response", response.data.user);
                try {
                    dispatch(setUser(response.data.user));
                } catch (err) {
                    console.error("Dispatch Error:", err);
                }
                toast.success("Profile updated successfully!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
            // console.error(error.response?.data);
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // Store the file object for the API
            setPreviewUrl(URL.createObjectURL(file)); // Create a temporary visual preview blob URL
        }
    };

    // http://localhost:3000/api/orders/getOrders

    const fetchUserOrders = async () => {
        try {
            setLoading(true);

            const response = await AxiosInstance.post(
                "/orders/getUserOrders",
            );
            console.log(response);


            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.log(error.response);
        } finally {
            setLoading(false);
        }
    };

    useState(() => { fetchUserOrders() }, [])


    return (
        <>
            <div className="tabs min-h-screen flex justify-center items-start pt-10 bg-stone-50/50 px-4 bg-gradient-to-br from-amber-100 to-orange-200">
                <Tabs defaultValue="overview" className="w-full max-w-[850px] bg-white border border-stone-200/80 p-6 md:p-8 rounded-3xl shadow-sm">

                    <div className="head flex justify-between items-center mb-10 ">
                        {/* Navigation Tab Header Row */}
                        <TabsList variant='' className=" cursor-pointer flex justify-start gap-2 border-b border-stone-100 pb-px">
                            <TabsTrigger
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all data-[state=active]:border-b-2 data-[state=active]:border-amber-600 data-[state=active]:text-amber-600"
                                value="overview"
                            >
                                <User className="h-4 w-4" />
                                Profile
                            </TabsTrigger>
                            <TabsTrigger
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all data-[state=active]:border-b-2 data-[state=active]:border-amber-600 data-[state=active]:text-amber-600 text-stone-500"
                                value="analytics"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                Orders
                            </TabsTrigger>

                        </TabsList>
                        <div className="back">
                            <ArrowLeftCircleIcon onClick={() => (navigate("/"))} className='text-green-700 '></ArrowLeftCircleIcon>
                        </div>
                    </div>

                    {/* TAB CONTENT 1: PROFILE MANAGMENT */}
                    <TabsContent value="overview" className="focus-visible:outline-none">
                        <div className="profile flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start">

                            {/* Left Column Avatar Frame Panel */}
                            <div className="photo flex flex-col items-center shrink-0">
                                <div className="relative group w-36 h-36 rounded-full border-4 border-green-500/50 overflow-hidden shadow-sm bg-stone-100">
                                    <img
                                        src={
                                            previewUrl ||
                                            user?.profilePic ||
                                            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
                                        } alt="Profile Avatar thumbnail"
                                        className='h-full w-full object-cover'
                                    />
                                </div>

                                <label
                                    htmlFor="file"
                                    className='mt-4 px-4 py-2 bg-green-600 hover:bg-green-700  text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-sm cursor-pointer transition-colors flex items-center gap-1.5'
                                >
                                    <Camera className="h-3.5 w-3.5" />
                                    Update Photo
                                    <Input id="file" type="file" className="hidden" onChange={handleImageChange} />
                                </label>
                            </div>

                            {/* Right Column Core Field Layout */}
                            <div className="feilds flex-1 w-full">
                                <form
                                    onSubmit={handleSubmit(onSaveProfile)}
                                    className='w-full grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4'
                                >

                                    {/* 1. FIRST NAME */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">First Name</label>
                                        <input
                                            {...register("firstName", { required: "First name is required" })}
                                            type="text"
                                            placeholder="Enter first name"
                                            // defaultValue={user?.firstName || " "} 
                                            className={`w-full h-10 px-3 bg-stone-50 border rounded-xl text-sm text-stone-800 placeholder-stone-400 outline-none focus:bg-white transition-all ${errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-amber-500'
                                                }`}
                                        />
                                        {errors.firstName && <span className="text-xs text-red-500 font-medium px-1">{errors.firstName.message}</span>}
                                    </div>

                                    {/* 2. LAST NAME */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Last Name</label>
                                        <input
                                            {...register("lastName", { required: "Last name is required" })}
                                            type="text"
                                            placeholder="Enter last name"
                                            className={`w-full h-10 px-3 bg-stone-50 border rounded-xl text-sm text-stone-800 placeholder-stone-400 outline-none focus:bg-white transition-all ${errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-amber-500'
                                                }`}
                                        />
                                        {errors.lastName && <span className="text-xs text-red-500 font-medium px-1">{errors.lastName.message}</span>}
                                    </div>

                                    {/* 3. EMAIL ADDRESS */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Email Address</label>
                                        <input
                                            {...register("email", {

                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address format"
                                                },

                                            })}
                                            disabled
                                            type="email"
                                            placeholder="name@domain.com"
                                            className={`w-full h-10  px-3 bg-gray-100 border rounded-xl text-sm text-gray-400 placeholder-stone-400 outline-none focus:bg-white transition-all ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-amber-500'
                                                }`}
                                        />
                                        {errors.email && <span className="text-xs text-red-500 font-medium px-1">{errors.email.message}</span>}
                                    </div>

                                    {/* 4. PHONE NUMBER */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Phone Number</label>
                                        <input
                                            {...register("phoneNumber", {
                                                required: "Phone number is required",
                                                minLength: { value: 10, message: "Phone number must be at least 10 digits" }
                                            })}
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            className={`w-full h-10 px-3 bg-stone-50 border rounded-xl text-sm text-stone-800 placeholder-stone-400 outline-none focus:bg-white transition-all ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-amber-500'
                                                }`}
                                        />
                                        {errors.phone && <span className="text-xs text-red-500 font-medium px-1">{errors.phone.message}</span>}
                                    </div>

                                    {/* 5. CITY */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">City</label>
                                        <input
                                            {...register("city", { required: "City is required" })}
                                            type="text"
                                            placeholder="Delhi"
                                            className={`w-full h-10 px-3 bg-stone-50 border rounded-xl text-sm text-stone-800 placeholder-stone-400 outline-none focus:bg-white transition-all ${errors.city ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-amber-500'
                                                }`}
                                        />
                                        {errors.city && <span className="text-xs text-red-500 font-medium px-1">{errors.city.message}</span>}
                                    </div>

                                    {/* 6. ADDRESS */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Address</label>
                                        <input
                                            {...register("address", { required: "Address details are required" })}
                                            type="text"
                                            placeholder="202 street, Melbourne..."
                                            className={`w-full h-10 px-3 bg-stone-50 border rounded-xl text-sm text-stone-800 placeholder-stone-400 outline-none focus:bg-white transition-all ${errors.address ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-amber-500'
                                                }`}
                                        />
                                        {errors.address && <span className="text-xs text-red-500 font-medium px-1">{errors.address.message}</span>}
                                    </div>

                                    {/* 7. ZIP CODE */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Zip Code</label>
                                        <input
                                            {...register("zipCode", {
                                                required: "Zip code is required",
                                                pattern: { value: /^\d+$/, message: "Zip code must contain numbers only" }
                                            })}
                                            type="text"
                                            placeholder="120045"
                                            className={`w-full h-10 px-3 bg-stone-50 border rounded-xl text-sm text-stone-800 placeholder-stone-400 outline-none focus:bg-white transition-all ${errors.zipCode ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-amber-500'
                                                }`}
                                        />
                                        {errors.zipCode && <span className="text-xs text-red-500 font-medium px-1">{errors.zipCode.message}</span>}
                                    </div>

                                    {/* SUBMIT BUTTON BOX */}
                                    <div className="sm:col-span-2 pt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full sm:w-auto px-6 h-10 bg-green-600 hover:bg-green-700 disabled:bg-stone-300 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
                                        >
                                            {isSubmitting ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>

                                </form>
                            </div>

                        </div>
                    </TabsContent>

                    {/* TAB CONTENT 2: INCOMING PURCHASE METRICS */}
                    <TabsContent value="analytics" className="focus-visible:outline-none">
                        <Card className="border border-stone-200/60 shadow-none rounded-2xl bg-stone-50/50">
                            {orders.length > 0 ? <div className="space-y-4">
                                {orders.map((order) => (
                                    <div
                                        key={order._id}
                                        className="bg-white border border-amber-200 rounded-xl shadow-sm p-4 mx-5"
                                    >
                                        {/* Header */}
                                        <div className="flex justify-between items-center mb-3">
                                            <div>
                                                <h3 className="font-semibold text-amber-700">
                                                    Order #{order._id.slice(-6).toUpperCase()}
                                                </h3>

                                                <p className="text-xs text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                                </p>
                                            </div>
                                            <div className='flex gap-2 text-gray-400'>
                                                <span>Payment</span>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium
                                                            ${order.status === "Pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : order.status === "Paid"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {order.status}
                                                </span></div>
                                        </div>

                                        {/* Products */}
                                        <div className="space-y-3">
                                            {order.products.map((item) => (
                                                <div
                                                    key={item._id}
                                                    className="flex items-center gap-3"
                                                >
                                                    <img
                                                        src={item?.productId?.productImg[0]?.url}
                                                        alt={item.productId.productName}
                                                        className="w-16 h-16 rounded-lg object-cover border"
                                                    />

                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-sm line-clamp-2">
                                                            {item.productId.productName}
                                                        </h4>

                                                        <p className="text-xs text-gray-500">
                                                            Qty: {item.quantity}
                                                        </p>
                                                    </div>

                                                    <p className="font-semibold text-amber-700">
                                                        ₹{item.productId.productPrice.toLocaleString("en-IN")}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Footer */}
                                        <div className="border-t border-amber-100 mt-4 pt-3 flex justify-between items-center">
                                            <div>
                                                <p className="text-xs text-gray-500">Total</p>
                                                <p className="font-bold text-amber-700">
                                                    ₹{order.amount.toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                            <div>
                                                .....
                                            </div>
                                            {/* <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm transition">
                                                View Details
                                            </button> */}
                                        </div>
                                    </div>
                                ))}
                            </div> : <div className='px-4 font-medium text-amber-700 '>No orders found</div>}


                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </>
    )
}

export default Profile



