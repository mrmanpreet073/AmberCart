import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Button } from './components/ui/button.jsx'

import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Verify from './pages/Verify.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import Layout from './Layouts/Layout.jsx'
import Profile from './pages/Profile.jsx'
import Products from './pages/Products.jsx'
import Cart from './pages/Cart.jsx'
import Navbar from './app Components/Navbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AddProduct from './pages/Admin/AddProduct.jsx'
import AdminOrders from './pages/Admin/AdminOrders.jsx'
import ShowUserOrders from './pages/Admin/ShowUserOrders.jsx'
import AdminUsers from './pages/Admin/AdminUsers.jsx'
import UserInfo from './pages/Admin/UserInfo.jsx'
import ProtectedRoute from './app Components/ProtectedRoute.jsx'
import ProductOverview from './pages/ProductOverview.jsx'
import Dlayout from './Layouts/Dlayout.jsx'
import AdminSales from './pages/Admin/AdminSales.jsx'
import AdminProducts from './pages/Admin/AdminProducts.jsx'
import Address from './pages/Address.jsx'
import Payment from './pages/Payment.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {/* <Route path="/orders" element={<Orders />} /> */}
        </Route>
          <Route path="/dashboard" element={<ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute>} >
            <Route path="addProduct" element={<AddProduct />} />
            <Route path="sales" element={<AdminSales />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:userId" element={<UserInfo />} />
            <Route path="users/orders/:userId" element={<ShowUserOrders />} />
          </Route>

        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/verify" element={<Verify />} />
        {/* <Route path="/verify" element={<Verify />} /> */}
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductOverview />} />
        <Route path="/cart" element={<ProtectedRoute><Navbar /><Cart /></ProtectedRoute>} />
        <Route path="/address" element={<ProtectedRoute><Address /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />



      </Routes>
    </BrowserRouter>
  )
}

export default App
