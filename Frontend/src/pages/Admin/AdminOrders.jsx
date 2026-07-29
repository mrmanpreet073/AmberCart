import axios from 'axios'
import React, { useEffect, useState } from 'react'

const AdminOrders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:3000/api/orders/getOrders",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.data.success) {
        const sorted = [...response.data.orders].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sorted);
      }
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl border border-amber-200 shadow-sm hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-5 border-b border-amber-100">
              <div>
                <h2 className="font-semibold text-lg text-amber-700">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h2>

                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <span className='mx-2 font-light  text-amber-700 '>Payment :</span>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium
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

            {/* Customer, Address & Payment */}
            <div className="p-5 grid lg:grid-cols-3 gap-8">

              {/* Customer */}
              <div>
                <h3 className="font-semibold text-amber-600 mb-3">
                  Customer
                </h3>

                <div className="space-y-1 text-gray-700">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {order.user.firstName} {order.user.lastName}
                  </p>

                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {order.user.email}
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className="font-semibold text-amber-600 mb-3">
                  Delivery Address
                </h3>

                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-1 text-gray-700">
                  <p className="font-semibold text-gray-800">
                    {order?.shippingAddress?.fullName}
                  </p>

                  <p>{order?.shippingAddress?.phone}</p>

                  <p>{order?.shippingAddress?.address}</p>

                  <p>
                    {order?.shippingAddress?.city},{" "}
                    {order?.shippingAddress?.state}
                  </p>

                  <p>
                    {order?.shippingAddress?.postalCode},{" "}
                    {order?.shippingAddress?.country}
                  </p>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h3 className="font-semibold text-amber-600 mb-3">
                  Payment
                </h3>

                <div className="space-y-1 text-gray-700">
                  <p>
                    <span className="font-medium">Subtotal:</span> ₹
                    {(order?.amount - order?.tax - order?.shipping).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <p>
                    <span className="font-medium">Tax:</span> ₹
                    {order.tax.toLocaleString("en-IN")}
                  </p>

                  <p>
                    <span className="font-medium">Shipping:</span> ₹
                    {order.shipping.toLocaleString("en-IN")}
                  </p>

                  <p className="text-lg font-bold text-amber-700">
                    Total: ₹{order.amount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

            </div>

            {/* Products */}
            <div className="px-5 pb-5">
              <h3 className="font-semibold text-amber-600 mb-3">
                Products
              </h3>

              <div className="space-y-3">
                {order?.products?.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 items-center border rounded-xl p-3 bg-amber-50"
                  >
                    <img
                      src={item?.productId?.productImg[0]?.url}
                      alt={item?.productId?.productName}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />

                    <div className="flex-1">
                      <h4 className="font-semibold line-clamp-2">
                        {item?.productId?.productName}
                      </h4>

                      <p className="text-sm text-gray-500">
                        {item?.productId?.brand}
                      </p>

                      <p className="text-sm">
                        Qty : {item?.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-amber-700">
                        ₹
                        {item?.productId?.productPrice?.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-amber-100 p-5 flex flex-col md:flex-row md:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  Razorpay Order ID
                </p>

                <p className="font-mono text-sm break-all">
                  {order?.razorpayOrderId}
                </p>
              </div>

              <select
                defaultValue={order?.status}
                className="border border-amber-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default AdminOrders
