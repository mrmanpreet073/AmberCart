import DsideBar from '@/app Components/DsideBar'
import Navbar from '@/app Components/Navbar'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
    const [isOpen, setIsOpen] = useState(false);

 return (
        // Added overflow-x-hidden to prevent the whole page from slipping sideways on mobile
        <div className="min-h-screen flex flex-col overflow-x-hidden">
            
            {/* 1. PASS TOGGLE TO NAVBAR */}
            {/* Allows clicking the mobile menu trigger icon inside the navbar to change state */}
            <Navbar  />
            
            {/* 2. THE CORE STRUCTURAL WRAPPER */}
            {/* Added w-full and min-w-0 so content acts responsively rather than breaking layout */}
            <div className='flex w-full min-w-0 relative flex-1'>
                
                <DsideBar
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onOpen={() => setIsOpen(true)}
                />
                
                {/* 3. FIXED MAIN OUTLET CANVAS CONTAINER */}
                {/* min-w-0 forces the content inside the Outlet to stay bounded to screen width */}
                <main className="flex-1 min-w-0 md:mt-14 min-h-screen bg-amber-50 p-4 md:p-6">
                    <Outlet />
                </main>

            </div>
        </div>
    )
}

export default Dashboard
