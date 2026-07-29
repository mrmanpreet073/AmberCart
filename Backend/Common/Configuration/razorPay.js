import Razorpay from "razorpay"


var RazorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECERET,
});

// console.log(process.env.RAZORPAY_KEY);
// console.log(process.env.RAZORPAY_SECERET);

export default RazorpayInstance