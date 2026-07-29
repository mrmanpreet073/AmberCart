import Navbar from '@/app Components/Navbar'
import DsideBar from '@/app Components/DsideBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Dlayout = () => {
  return (
    <>
      {/* <Navbar/> */}
      {/* <DsideBar/> */}
      <Outlet/>
    </>
  )
}

export default Dlayout
