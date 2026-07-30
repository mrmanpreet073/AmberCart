import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  IndianRupee,
  Loader2,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import AxiosInstance from "@/Api/AxiosInstance";

const AdminSales = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await AxiosInstance.get(
        "/orders/getDashboard"
      );

      if (response.data.success) {
        console.log(response);

        setDashboard(response.data);
      }
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2
          className="animate-spin text-amber-500"
          size={50}
        />      </div>
    );
  }

  if (!dashboard) return null;

  const { stats, recentOrders, latestProducts } = dashboard;




  return (

    <div className="p-6 bg-amber-50 min-h-screen">

      <div className="flex  flex-col  justify-center md:justify-between text-center md:text-left md:flex-row  items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="text-slate-500">
            Manage your entire store from one place.
          </p>

        </div>

        <div className="flex md:flex-col p-2 justify-center md:justify-normal  gap-2 w-full md:w-30  ">

          <p className="text-slate-500">
            Today
          </p>

          <h3 className="font-semibold">
            {new Date().toLocaleDateString()}
          </h3>

        </div>

      </div>

      <div className="mb-8 rounded-3xl bg-gradient-to-r bg-gradient-to-br
from-amber-400
to-amber-200
text-white p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="mt-2 text-amber-50">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <div
          className="
rounded-3xl
bg-gradient-to-br
from-amber-100
to-orange-400
text-white
shadow-xl
p-6
">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Revenue</p>
              <h2 className="text-2xl font-bold text-amber-700">
                ₹{stats.totalRevenue.toLocaleString("en-IN")}
              </h2>
            </div>

            <IndianRupee className="text-amber-600"
              size={28} />
          </div>
        </div>

        <div onClick={() => navigate("/dashboard/orders")}
          className="
group
cursor-pointer
rounded-3xl
bg-white
p-6
shadow-lg
hover:shadow-2xl
hover:-translate-y-2
duration-300
border
border-amber-100
">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Orders</p>
              <h2 className="text-2xl font-bold">
                {stats.totalOrders}
              </h2>
            </div>

            <ShoppingCart className="text-amber-600"
              size={28} />
          </div>
        </div>

        <div onClick={() => navigate("/dashboard/products")}
          className="
group
cursor-pointer
rounded-3xl
bg-white
p-6
shadow-lg
hover:shadow-2xl
hover:-translate-y-2
duration-300
border
border-amber-100
">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Products</p>
              <h2 className="text-2xl font-bold">
                {stats.totalProducts}
              </h2>
            </div>

            <Package className="text-amber-600"
              size={28} />
          </div>
        </div>

        <div onClick={() => navigate("/dashboard/users")}
          className="
group
cursor-pointer
rounded-3xl
bg-white
p-6
shadow-lg
hover:shadow-2xl
hover:-translate-y-2
duration-300
border
border-amber-100
">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Users</p>
              <h2 className="text-2xl font-bold">
                {stats.totalUsers}
              </h2>
            </div>

            <Users
              onClick={() => navigate("/dashboard/users")}
              className="text-amber-600"
              size={28} />
          </div>
        </div>

      </div>

      {/* Middle */}

      <div className="rounded-3xl bg-white shadow-lg border border-amber-100 p-6 mt-8">

        <h2 className="text-xl font-bold mb-6">
          Sales Overview
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={dashboard.stats.salesChart}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip
              formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 5, fill: "#f59e0b" }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        {/* Order Status */}

        <div className="bg-white rounded-xl shadow border border-amber-200 p-6">

          <h2 className="text-lg font-semibold mb-5 text-amber-700">
            Order Status
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between items-center">

              <span>
                Pending
              </span>

              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">
                {stats.pendingOrders}
              </span>

            </div>
            <div className="flex justify-between items-center">

              <span>
                Pending
              </span>

              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">
                {stats.pendingOrders}
              </span>

            </div>
            {/* <div className="flex justify-between">
              <span>Cancelled</span>

              <span className="font-semibold text-red-600">
                {stats.deliveredOrders}
              </span>
            </div> */}

          </div>

        </div>

        {/* Latest Products */}

        <div className="bg-white rounded-xl shadow border border-amber-200 p-6">

          <h2 className="text-lg font-semibold mb-5 text-amber-700">
            Latest Products
          </h2>

          <div className="space-y-4">

            {latestProducts.map((product) => (

              <div
                key={product._id}
                className="flex gap-3 items-center"
              >

                <img
                  src={product.productImg[0]?.url}
                  alt=""
                  className="w-14 h-14 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-medium line-clamp-1">
                    {product.productName}
                  </h3>

                  <p className="text-sm text-gray-500">
                    ₹{product.productPrice.toLocaleString("en-IN")}
                  </p>
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* Recent Orders */}

      <div className="bg-white rounded-xl shadow border border-amber-200 mt-8 p-6">

        <h2 className="text-lg font-semibold mb-5 text-amber-700">
          Recent Orders
        </h2>

        <div className="space-y-4">

          {recentOrders.map((order) => (

            <div
              key={order._id}
              className="flex justify-between items-center border-b pb-3"
            >

              <div>

                <h3 className="font-medium">
                  {order.user.firstName} {order.user.lastName}
                </h3>

                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

              </div>

              <div className="text-right">

                <h3 className="font-semibold text-amber-700">
                  ₹{order.amount.toLocaleString("en-IN")}
                </h3>

                <span
                  className={`text-xs px-3 py-1 rounded-full
                    ${order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {order.status}
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default AdminSales;