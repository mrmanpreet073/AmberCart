import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    // CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CircleCheckBigIcon, Eye, EyeClosed, EyeOff, Loader2, Loader2Icon, LucideRotate3d } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import axios from 'axios'
import { toast } from 'sonner'



const Signup = () => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    async function onSubmit(data) {
        setLoading(true)
        console.log(data)
        // clear all fields after submit
        try {
            const response = await axios.post("http://localhost:3000/api/user/register", data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.data.success) {
                // toast.success("SignUp Successfull")
                toast("SignUp Successfull", {
                    className: " text-green", // Overrides background and text color
                    icon: <CircleCheckBigIcon className='text-emerald-600'/>
                })
                setTimeout(() => (
                    navigate("/verify")
                ), 2000)
            }

            console.log(response);

        } catch (error) {
            toast.error(error.response?.data.message)


        } finally {
            setLoading(false)

        }
        // reset()
    }

    const [showPassword, setShowPassword] = useState(false)
    return (
        <div className='flex justify-center items-center bg-[#FDFBF7] min-h-screen '>
            <Card className="w-full max-w-sm bg-white text-stone-700 border-stone-200/80 shadow-xl shadow-stone-100 ml-4 mr-4">
                <CardHeader>
                    <CardTitle className="text-stone-800 font-bold text-2xl">Create your account</CardTitle>
                    <CardDescription className="text-stone-500">
                        Enter the details
                    </CardDescription>

                </CardHeader>


                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>

                        <div className="flex flex-col ">

                            <div className='grid grid-cols-2 gap-2'>
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-stone-700 font-medium">First Name</Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="john.."
                                        {...register('firstName', {
                                            required: "firstName is Required",
                                            minLength: { value: 2, message: " Enter Character between 2-10 " },
                                            maxLength: { value: 10, message: " Enter Character between 2-10 " }
                                        })}
                                        className="bg-stone-50 h-10 rounded-xl border border-stone-200 text-stone-800 placeholder-stone-400 focus-visible:ring-amber-500"

                                    /> <div className=' h-5 flex justify-center items-center'>
                                        {errors.firstName && <p className="text-rose-600  text-sm">
                                            {errors.firstName?.message}
                                        </p>
                                        }
                                    </div>

                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-stone-700 font-medium">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="doe.."
                                        {...register('lastName', {
                                            required: "lastnName is Required",
                                            minLength: { value: 2, message: " Enter Character between 2-10 " },
                                            maxLength: { value: 10, message: " Enter Character between 2-10 " }
                                        })}
                                        className="bg-stone-50 h-10 rounded-xl border border-stone-200 text-stone-800 placeholder-stone-400 focus-visible:ring-amber-500"

                                    /><div className=' h-5 flex justify-center items-center'>
                                        {errors.lastName && <p className="text-rose-600  text-sm">
                                            {errors.lastName?.message}
                                        </p>
                                        }
                                    </div>
                                </div>


                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-stone-700 font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...register('email', {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Please Enter Valid Email"
                                        }
                                    })}
                                    className="bg-stone-50 h-10 rounded-xl border border-stone-200 text-stone-800 placeholder-stone-400 focus-visible:ring-amber-500"
                                /> <div className=' h-5 ml-4 text-sm'>
                                    {errors.email && <p className="text-rose-600 ">
                                        {errors.email?.message}
                                    </p>
                                    }
                                </div>

                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="text-stone-700 font-medium">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm text-amber-700 underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <div className='flex-col'>
                                    <div className='flex gap-2 justify-center items-center'>
                                        <Input id="password" placeholder="john@1233#..." type={showPassword ? "text" : "password"}
                                            {...register('password', {
                                                required: true,
                                                
                                                minLength: { value: 5, message: "Password must more than 5 character " },
                                                maxLength: { value: 10, message: "Password too long" }
                                            })}
                                            className="bg-stone-50 h-10 rounded-xl border border-stone-200 text-stone-800 placeholder-stone-400 focus-visible:ring-amber-500"

                                        />
                                        {
                                            showPassword ? <Eye onClick={() => (setShowPassword(false))} className='cursor-pointer text-stone-500 hover:text-stone-700' />
                                                : <EyeOff onClick={() => (setShowPassword(true))} className='cursor-pointer text-stone-500 hover:text-stone-700' />
                                        }
                                    </div>
                                    <div className=' flex  items-center
                                      h-7 ml-4 text-sm'>
                                        {errors.password && <p className="text-rose-600 ">
                                            {errors.password?.message}
                                        </p>
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-3 w-full max-w-sm bg-white text-stone-600 border-none">
                        <Button type="submit" className="w-full bg-amber-600 text-white h-10 rounded-xl border-none hover:bg-amber-700 shadow-sm shadow-amber-600/10 cursor-pointer transition-colors">
                            {loading ? <><Loader2Icon className=' size-7 animate-spin' /></> : "Signup"}
                        </Button>
                        <p className="text-sm">Already Have an Account? <Link to={'/login'} className='text-amber-700 font-medium hover:underline'>Login</Link></p>
                    </CardFooter>
                </form>

            </Card>
        </div >
    )
}

export default Signup