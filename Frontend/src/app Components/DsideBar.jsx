import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PackagePlus,
  PackageSearch,
  Users2,
  Package,
  PanelLeftOpen,
  X
} from "lucide-react";

const DsideBar = ({ isOpen, onClose, onOpen }) => {
  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onOpen}
        className="md:hidden fixed bottom-5 right-5 z-50 bg-amber-600 text-white p-3 rounded-full shadow-lg"
      >
        <PanelLeftOpen size={24} />
      </button>

      {/* Overlay  Show when sidebar is open on mobile so that bg task dont interupt*/}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={` rounded
          fixed md:sticky min-h-screen top-0 md:top-32 left-0
          h-[calc(100vh-56px)]
          bg-white border-r border-amber-100
          w-64 md:w-60
          z-50 shrink-0
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="p-3 flex justify-between items-center border-b border-amber-100">
          <h2 className="font-bold text-amber-600">Dashboard</h2>

          <button
            onClick={onClose}
            className="md:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col gap-2 p-3">
          <NavLink
            to="/dashboard/sales"
            onClick={onClose}
            className={({ isActive }) =>
              `p-3 border-b-2 border-amber-200 rounded-lg flex items-center gap-3 transition ${
                isActive
                  ? "bg-amber-600 text-white"
                  : "hover:bg-amber-50"
              }`
            }
          >
            <LayoutDashboard size={18} />
            Sales
          </NavLink>

          <NavLink
            to="/dashboard/addProduct"
            onClick={onClose}
            className={({ isActive }) =>
              `p-3 border-b-2 border-amber-200 rounded-lg flex items-center gap-3 transition ${
                isActive
                  ? "bg-amber-600 text-white"
                  : "hover:bg-amber-50"
              }`
            }
          >
            <PackagePlus size={18} />
            Add Product
          </NavLink>

          <NavLink
            to="/dashboard/products"
            onClick={onClose}
            className={({ isActive }) =>
              `p-3 border-b-2 border-amber-200 rounded-lg flex items-center gap-3 transition ${
                isActive
                  ? "bg-amber-600 text-white"
                  : "hover:bg-amber-50"
              }`
            }
          >
            <PackageSearch size={18} />
            Products
          </NavLink>

          <NavLink
            to="/dashboard/users"
            onClick={onClose}
            className={({ isActive }) =>
              `p-3  border-b-2 border-amber-200 rounded-lg flex items-center gap-3 transition ${
                isActive
                  ? "bg-amber-600 text-white"
                  : "hover:bg-amber-50"
              }`
            }
          >  
            <Users2 size={18} />
            Users
          </NavLink>

          <NavLink
            to="/dashboard/orders"
            onClick={onClose}
            className={({ isActive }) =>
              `p-3 border-b-2 border-amber-200 rounded-lg flex items-center gap-3 transition ${
                isActive
                  ? "bg-amber-600 text-white"
                  : "hover:bg-amber-50"
              }`
            }
          >
            <Package size={18} />
            Orders
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default DsideBar;