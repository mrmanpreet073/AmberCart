import express from "express"
import dotenv from "dotenv/config"
import connectDb from "./Common/Configuration/db.js"
import UserRouter from "./Module/User/routes/user.Routes.js";
import cors from "cors"
import productRouter from "./Module/Product/Routes/product.routes.js";
import cartRouter from "./Module/Product/Routes/cart.routes.js";
import OrderRouter from "./Module/Product/Routes/order.route.js";


const app = express();
const PORT = process.env.PORT || 3000


// Allow requests from your React app
app.use(
  cors({
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.use("/api/user",UserRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/orders",OrderRouter)


async function main() {

    await connectDb()

    app.listen(PORT, () => {
        console.log(`server is listning on port http://localhost:${PORT}`);

    })

}

main()





