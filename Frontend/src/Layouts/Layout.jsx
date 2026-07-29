import React from 'react'
import Navbar from '../app Components/Navbar.jsx'
import Footer from '../app Components/Footer.jsx'
import { Outlet } from 'react-router-dom'
 

function Layout() {
  return (
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default Layout