import RazorpayInstance from "../../../Common/Configuration/razorPay.js";
import crypto from "crypto"
import { Cart } from "../Model/cart.model.js";
import { Order } from "../Model/order.model.js";
import { Product } from "../Model/product.Model.js";
import { User } from "../../User/Models/userModel.js";


export const createOrder = async (req, res) => {

    try {

        const { amount, currency, status, shipping, products, tax, paymentFailed, razorpay_order_id, shippingAddress } = req.body;


        if (paymentFailed) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed", },
                { new: true }
            )
        }
        // console.log("Before Razorpay");

        const order = await RazorpayInstance.orders.create({  // This tells Razorpay // "Please create a payment order."
            amount: Math.round(amount * 100), //1 Rupee (₹1) = 100 Paise amount in paise, Razorpay accepts the smallest currency unit.
            currency: currency || "INR",
            receipt: "receipt_" + Date.now()
        });

        // console.log("After Razorpay");

        const newOrder = new Order({
            user: req.user.id,
            products,
            amount,
            currency,
            status,
            shipping,
            shippingAddress,
            tax,
            razorpayOrderId: order.id  //This ID identifies the payment.
        });

        await newOrder.save();

        return res.status(200).json({
            success: true,
            message: "Successfull",
            order: order,
            dbOrder: newOrder
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
        console.error("Error creating order:", err);
        console.error("amount:", req.body.amount);

    }

};

export const verifyPayment = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECERET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        // Verify signature
        if (generatedSignature !== razorpay_signature) {

            await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { new: true }
            );

            return res.status(400).json({
                success: false,
                message: "Invalid Signature",
            });
        }

        // Update order
        const order = await Order.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            {
                status: "Paid",
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Clear user's cart
        await Cart.findOneAndUpdate(
            { userId },
            {
                $set: {
                    items: [],
                    totalPrice: 0,
                },
            }
        );

        return res.status(200).json({
            success: true,
            message: "Payment Verified Successfully",
            order,
        });

    } catch (error) {
        console.error("Verify Payment Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getUserOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({ user: userId }).populate("products.productId").sort({ createdAt: -1 });
        // console.log("orders dates →", orders.map(o => o.createdAt));
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "firstName lastName email")
            .populate("products.productId");

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



export const getDashboard = async (req, res) => {
    try {
        // Basic Counts
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        // All Orders
        const orders = await Order.find();

        // Total Revenue
        const totalRevenue = orders
            .filter(order => order.status === "Paid")
            .reduce((sum, order) => sum + order.amount, 0);

        // Order Status Counts
        const pendingOrders = await Order.countDocuments({
            status: "Pending",
        });

        const deliveredOrders = await Order.countDocuments({
            status: "Paid",
        });

        const cancelledOrders = await Order.countDocuments({
            status: "Failed",
        });

        // Latest 5 Orders
        const recentOrders = await Order.find()
            .populate("user", "firstName lastName email")
            .sort({ createdAt: -1 })
            .limit(5);

        // Latest 5 Products
        const latestProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5);

        const dailySales = await Order.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                    },
                    revenue: {
                        $sum: "$amount",
                    },
                },
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                    "_id.day": 1,
                },
            },
        ]);


        const monthNames = [
            "",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const salesChart = dailySales.map((item) => ({
            day: `${item._id.day} ${monthNames[item._id.month]}`,
            revenue: Number(item.revenue.toFixed(2)),
        }));

        return res.status(200).json({
            success: true,

            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                pendingOrders,
                deliveredOrders,
                cancelledOrders,
                salesChart
            },

            recentOrders,
            latestProducts,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};