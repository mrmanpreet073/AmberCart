import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftCircleIcon, CircleCheckBigIcon, Eye, EyeOff, Loader2Icon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setUser } from '@/Redux/userSlice'

// ✅ NEW — import Google OAuth hook and provider
import { useGoogleLogin } from '@react-oauth/google'

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false) // ✅ NEW — separate loader for Google
  const [showPassword, setShowPassword] = useState(false)

  // ── Normal login (unchanged) ──
  async function onSubmit(data) {
    setLoading(true)
    try {
      const response = await axios.post("http://localhost:3000/api/user/login", data, {
        headers: { "Content-Type": "application/json" }
      })
      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.accessToken)
        toast(response.data.message, {
          icon: <CircleCheckBigIcon className='text-emerald-600' />
        })
        dispatch(setUser(response.data.user))
        setTimeout(() => navigate("/"), 2000)
      }
    } catch (error) {
      toast.error(error.response?.data.message)
    } finally {
      setLoading(false)
    }
  }

  // ✅ NEW — Google login handler
  // useGoogleLogin opens a popup, gets Google access token
  // then sends it to your backend to verify and get YOUR JWT
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true)
      try {
        // ✅ NEW — send Google's token to your backend
        const res = await axios.post(
          "http://localhost:3000/api/user/google",
          { token: tokenResponse.access_token },
          { withCredentials: true } // needed for httpOnly cookie (refreshToken)
        )

        if (res.data.success) {
          // ✅ NEW — same as normal login — save token and user
          localStorage.setItem("accessToken", res.data.accessToken)
          dispatch(setUser(res.data.user))
          toast(res.data.message, {
            icon: <CircleCheckBigIcon className='text-emerald-600' />
          })
          setTimeout(() => navigate("/"), 1500)
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Google login failed")
        console.log("Google login error", error.response)
      } finally {
        setGoogleLoading(false)
      }
    },
    onError: () => {
      toast.error("Google login was cancelled or failed")
    }
  })

  return (
    <div>
      <div
        onClick={() => navigate("/")}
        className='text-amber-700 flex gap-2 font-bold bg-[#FDFBF7] p-3 cursor-pointer'
      >
        <ArrowLeftCircleIcon /> <p>Back</p>
      </div>

      <div className='flex justify-center items-center bg-[#FDFBF7] min-h-screen'>
        <Card className="w-full max-w-sm bg-white text-stone-700 border-stone-200/80 shadow-xl shadow-stone-100 mx-4">
          <CardHeader>
            <CardTitle className="text-stone-800 font-bold text-2xl">Log In To Your Account</CardTitle>
            <CardDescription className="text-stone-500">
              Enter your details below
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <div className="flex flex-col">

                {/* Email field — unchanged */}
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
                        message: "Please enter a valid email"
                      }
                    })}
                    className="bg-stone-50 h-10 rounded-xl border border-stone-200 text-stone-800 placeholder-stone-400 focus-visible:ring-amber-500"
                  />
                  <div className='h-5 ml-1 text-sm'>
                    {errors.email && <p className="text-rose-600">{errors.email?.message}</p>}
                  </div>
                </div>

                {/* Password field — unchanged */}
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-stone-700 font-medium">Password</Label>
                    <a href="#" className="ml-auto text-sm text-amber-700 underline-offset-4 hover:underline">
                      Forgot your password?
                    </a>
                  </div>
                  <div className='flex-col'>
                    <div className='flex gap-2 items-center'>
                      <Input
                        id="password"
                        placeholder="john@1233#..."
                        type={showPassword ? "text" : "password"}
                        {...register('password', {
                          required: "Password is required",
                          minLength: { value: 5, message: "Password must be more than 5 characters" },
                          maxLength: { value: 10, message: "Password too long" }
                        })}
                        className="bg-stone-50 h-10 rounded-xl border border-stone-200 text-stone-800 placeholder-stone-400 focus-visible:ring-amber-500"
                      />
                      {showPassword
                        ? <Eye onClick={() => setShowPassword(false)} className='cursor-pointer text-stone-500 hover:text-stone-700' />
                        : <EyeOff onClick={() => setShowPassword(true)} className='cursor-pointer text-stone-500 hover:text-stone-700' />
                      }
                    </div>
                    <div className='h-7 ml-1 text-sm'>
                      {errors.password && <p className="text-rose-600">{errors.password?.message}</p>}
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>

            <CardFooter className="flex-col gap-3 w-full">

              {/* Normal login button — unchanged */}
              <Button
                type="submit"
                className="w-full bg-amber-600 text-white h-10 rounded-xl hover:bg-amber-700 shadow-sm cursor-pointer transition-colors"
              >
                {loading ? <Loader2Icon className='size-5 animate-spin' /> : "Login"}
              </Button>

              {/* ✅ NEW — Divider */}
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-xs text-stone-400 font-medium">or</span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>

              {/* ✅ NEW — Google login button */}
              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                disabled={googleLoading}
                className="w-full h-10 flex items-center justify-center gap-3 border border-stone-200 rounded-xl bg-white hover:bg-stone-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <Loader2Icon className='size-5 animate-spin text-stone-500' />
                ) : (
                  <>
                    {/* Google SVG icon */}
                    <svg width="18" height="18" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
                      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1C9.5 35.6 16.2 44 24 44z" />
                      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.2 5.2C41 35.3 44 30 44 24c0-1.3-.1-2.6-.4-3.9z" />
                    </svg>
                    <span className="text-sm font-medium text-stone-700">Continue with Google</span>
                  </>
                )}
              </button>

              <p className="text-sm text-stone-600">
                Don't have an account?{" "}
                <Link to='/SignUp' className='text-amber-700 font-medium hover:underline'>Sign up</Link>
              </p>

            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Login