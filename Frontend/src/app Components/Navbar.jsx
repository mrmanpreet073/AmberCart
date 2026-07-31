import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, Menu, X, LogOut, User, Settings, UserCircle2Icon, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setUser } from '@/Redux/userSlice.js';
import { store } from '@/Redux/store';
import { setAddresses, setCart, setProduct, setSelectedAddress } from '@/Redux/productSice';
import AxiosInstance from '@/Api/AxiosInstance';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile drawer state
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Desktop profile dropdown state
  const [showSubNav, setShowSubNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate()
  const { user } = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const { cart } = useSelector((state) => state.product);



  const isLogin = !!user;

  const role = user?.role === "admin" ? true : false
  // console.log("user ", user);
  // console.log("use role", role);


  // Close desktop profile dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  // Monitor scroll behavior to hide/show the secondary navbar smoothly
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setShowSubNav(true);
        return;
      }
      if (Math.abs(currentScrollY - lastScrollY) < 5) return;
      if (currentScrollY > lastScrollY) {
        setShowSubNav(false);
      } else {
        setShowSubNav(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogin = () => {
    // console.log("Logging out user...");
    navigate("/login")
    // Add your actual logout logic or routing action redirection here
  };
  const accessToken = localStorage.getItem("accessToken")

  const handleLogout = async () => {
    try {
      const response = await AxiosInstance.post("/user/logout",)
      if (response.data.success) {

        dispatch(setUser(null))
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        dispatch(setUser(null));
        dispatch(setCart({ items: [], totalPrice: 0 }));
        dispatch(setAddresses([]));
        dispatch(setSelectedAddress(null));
        dispatch(setProduct(null))

        // console.log(store.getState());
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data.message)
      console.log(error);
    }
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm font-sans">

      {/* Top Tier Element Wrapper */}
      <div className="relative z-20 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4 bg-amber-100">

          {/* Hamburger Menu Button (Mobile Only) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 -ml-2 rounded-lg text-stone-500 hover:bg-stone-100 focus:outline-none transition-colors cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Brand Logo */}
          <div className="hidden md:flex items-center gap-2 select-none cursor-pointer" onClick={() => navigate("/")}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 shadow-sm shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4.5 w-4.5 text-white">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-stone-800">
              AMBER<span className="text-amber-600">CART</span>
            </span>
          </div>

          {/* Central Fluid Search Input */}
          {/* <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-9 pl-9 pr-4 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-amber-500 focus:bg-white transition-all"
              />
            </div>
          </div> */}

          {/* Action Cart & Avatar Profile Segment */}
          <div className="flex items-center gap-1 sm:gap-4 shrink-0 relative" ref={dropdownRef}>
            <button onClick={() => navigate("/cart")}
              className="p-2 text-stone-500 hover:text-stone-700 transition-colors relative cursor-pointer">
              <ShoppingBag
                size={26}

              />
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-amber-600 text-[10px] font-bold text-white flex items-center justify-center scale-90">
                {cart?.items?.length}

              </span>
            </button>

            {/* Desktop Clickable Profile Avatar Button */}
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="hidden md:flex rounded-full border border-stone-200 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <img
                className="h-11 w-11 object-cover"
                src={user?.profilePic ? user.profilePic : "https://storage.needpix.com/rsynced_images/blank-profile-picture-973460_1280.png"}
                alt="User profile"
              />
            </button>

            {/* Placement 1: Desktop Dropdown Menu Overlay */}
            {isProfileOpen && (
              <div className="hidden md:block absolute right-0 top-12 w-50 bg-white border border-stone-200 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                <div className="px-4 py-2 border-b border-stone-100">
                  <p className="text-xs text-stone-400 font-medium">Signed in as</p>
                  <p className="text-sm font-semibold text-stone-700 truncate">{user?.email?.toLowerCase()}</p>
                </div>
                {/* <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:bg-orange-100"><User className="h-4 w-4" /> My Profile</a> */}
                <button onClick={() => (navigate(`/profile/${user?._id}`))} className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 w-full hover:bg-orange-100"><User className="h-4 w-4" /> My Profile</button>
                <button onClick={() => (navigate("/setting"))} className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 w-full hover:bg-orange-100"><Settings className="h-4 w-4" /> Settings</button>
                {/* <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:bg-orange-100"><Settings className="h-4 w-4" /> Settings</a> */}
                <hr className="border-t border-stone-100 my-1" />
                {
                  isLogin ?

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium cursor-pointer text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button> :
                    <button
                      onClick={handleLogin}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-red-50 font-medium cursor-pointer text-left"
                    >
                      <LogIn className="h-4 w-4" />
                      Log In
                    </button>}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Tier Links */}
      <div
        className={`w-full bg-white border-b border-stone-200/60 hidden md:block absolute left-0 z-10 transition-transform duration-300 ease-in-out shadow-sm ${showSubNav ? 'translate-y-0' : '-translate-y-full pointer-events-none'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-2   ">
          <button className="px-3 py-1.5 text-sm font-semibold text-stone-800 bg-stone-100/80 rounded-lg transition-colors cursor-pointer" onClick={() => navigate("/")}>Home</button>
          <button onClick={() => (navigate("/products"))} className="px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg transition-colors">Products</button>
          <button onClick={() => (navigate("/contactUs"))} className="px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg transition-colors">Contact Us</button>
          {role && (
            <button onClick={() => (navigate("/dashboard/sales"))} className="px-3 py-1.5 text-sm font-medium text-amber-600 hover:text-stone-900 rounded-lg transition-colors">Dashboard</button>
          )}
          {/* <a href="#" className="px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg transition-colors">Projects</a> */}
          {/* <a href="#" className="px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg transition-colors">Contact Us</a> */}
        </div>
        <div>

        </div>
      </div>

      {/* Mobile Nav Toggle Dropdown Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-inner relative z-30">
          <button onClick={() => (navigate("/dashboard/sales"))} className="block px-3 py-2.5 text-base font-semibold text-stone-800 bg-stone-100 rounded-lg">Dashboard</button>
          <div className='flex items-center justify-between'>
            {/* <a href="#" className="block px-3 py-2.5 text-base font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg">Profile</a> */}
            <button onClick={() => navigate(`/profile/${user._id}`)} className="block px-3 py-2.5 text-base font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg"> Profile</button>
            <UserCircle2Icon className='text-orange-700' />
          </div>
          <button onClick={() => (navigate("/products"))} className="px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg transition-colors">Products</button>
          <a href="#" className="block px-3 py-2.5 text-base font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg">Contact Us</a>

          {/* Placement 2: Mobile Logout Button integrated clean at the bottom */}
          <hr className="border-t border-stone-200 !my-3" />
          {isLogin ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium cursor-pointer text-left rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 font-medium cursor-pointer text-left rounded-lg transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Log In
            </button>
          )}
        </div>
      )}

    </header>
  );
}