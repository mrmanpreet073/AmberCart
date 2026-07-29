import { log } from "console";
import { Cart } from "../Model/cart.model.js";
import { Product } from "../Model/product.Model.js";

export const getCart = async (req, res) => {

    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart) {
            return res.json({ success: true, cart: [] })
        }
        // Remove broken cart items
        cart.items = cart.items.filter(item => item.productId);
        
        if (cart.items.length === 0) {
            cart.totalPrice = 0;
        }

        // Save cleaned cart
        await cart.save();

        return res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

export const updateCart = async (req, res) => {

    try {
        const { productId } = req.body;
        const userId = req.user.id;

        // Find the product
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }

        // Find if users cart exists
        let cart = await Cart.findOne({ userId })

        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [{ productId, quantity: 1, price: product.productPrice }],
                totalPrice: product.productPrice
            })
        } else {

            // Check if product already exists in cart
            const existingProduct = cart.items.find(
                (item) => item.productId.toString() === productId
            );

            if (existingProduct) {

                existingProduct.quantity += 1;

            } else {

                cart.items.push({
                    productId,
                    quantity: 1,
                    price: product.productPrice
                });

            }

            // Recalculate Total Price
            cart.totalPrice = cart.items.reduce((total, item) => {
                return total + item.price * item.quantity;
            }, 0);

            await cart.save();
        }

        const populatedCart = await Cart.findById(cart._id).populate("items.productId")

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart: populatedCart
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

export const updateQuantity = async (req, res) => {

    try {
        const userId = req.user.id;
        const { productId, type } = req.body;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart Not Found"
            });
        }

        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item Not Found"
            });
        }

        if (!["increment", "decrement"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid type"
            });
        }
        if (type === "increment") {
            item.quantity++;
        } else if (type === "decrement") {
            if (item.quantity > 1) {
                item.quantity--;
            }
        }

        cart.totalPrice = cart.items.reduce((acc, item) => (
            acc + item.price * item.quantity
        ), 0);
        await cart.save()
        const populatedCart = await cart.populate("items.productId")

        return res.status(200).json({
            success: true,
            message: "Product Updated ",
            cart: populatedCart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

export const removeFromCart = async (req, res) => {
    try {

        const userId = req.user.id;
        const { productId } = req.body;

        // Find User Cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // console.log("Received:", productId);

        cart.items.forEach(item => {
            // console.log("Stored:", item.productId.toString());
            // console.log("equals:", item.productId.equals(productId));
        });


        // Check if product exists in cart
        const item = cart.items.find(item =>
            item.productId.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        // Remove product
        cart.items = cart.items.filter(item =>
            item.productId.toString() !== productId
        );

        // Recalculate total price
        cart.totalPrice = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        await cart.save();

        await cart.populate("items.productId");

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

