import cloudinary from "../../../Common/Utils/cloudnary.js";
import getDataUri from "../../../Common/Utils/dataUri.js";
import { Product } from '../Model/product.Model.js'

export const addProduct = async (req, res) => {

    try {
        const { productName, productDesc, productPrice, category, brand } = req.body;
        const userId = req.user.id;

        if (!productName || !productDesc || !productPrice || !category || !brand) {
            return res.status(400).json({
                success: false,
                message: "All feilds are required"
            });
        }

        // Handle multiple images upload 
        let productImg = [];
        // console.log(req.files);

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const fileUri = getDataUri(file);
                const result = await cloudinary.uploader.upload(fileUri.content, {
                    folder: "Amber_Products"
                })
                productImg.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
            }

        }

        const newProduct = await Product.create({
            userId,
            productName,
            productDesc,
            productPrice,
            category,
            brand,
            productImg // ({url,public_id})

        })

        return res.status(200).json({
            success: true,
            message: "Product Added Succesfully",
            product: newProduct
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

export const getAllProducts = async (req, res) => {
    try {
        console.log("category received →", req.query.category)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // filters from query params
        const search = req.query.search || "";
        const category = req.query.category || "";
        const brand = req.query.brand || "";
        const minPrice = parseInt(req.query.minPrice) || 0;
        const maxPrice = parseInt(req.query.maxPrice) || 999999;
        const order = req.query.order || "";

        // build MongoDB filter object
        const filter = {};

        if (search) {
            filter.productName = { $regex: search, $options: "i" }; // case-insensitive
        }
        if (category && category !== "All") {
            filter.category = category;
        }
        if (brand && brand !== "All") {
            filter.brand = brand;
        }

        filter.productPrice = { $gte: minPrice, $lte: maxPrice };

        // sort
        let sortOption = { createdAt: -1 }; // default: newest first
        if (order === "lowToHigh") sortOption = { productPrice: 1 };
        if (order === "highToLow") sortOption = { productPrice: -1 };

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        const allProducts = await Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        if (!allProducts.length) {
            return res.status(404).json({
                success: false,
                message: "No Products Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products: allProducts,
            pagination: {
                totalProducts,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// backend — new controller
export const getProductMeta = async (req, res) => {
    try {
        // MongoDB aggregation — DB does the work, not JS
        const categories = await Product.distinct("category");
        const brands = await Product.distinct("brand");

        return res.status(200).json({
            success: true,
            categories: ["All", ...categories],
            brands: ["All", ...brands],
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const {
            productName,
            productDesc,
            productPrice,
            category,
            brand,
            existingImages, // JSON string containing public_ids to keep
        } = req.body;

        // Find product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        let updatedImages = [];

        // ------------------------------------------------
        // Keep existing images & delete removed ones
        // ------------------------------------------------
        if (existingImages) {

            // Convert JSON string to array
            // Example:
            // ["Amber_Products/abc123","Amber_Products/xyz456"]
            const keepIds = JSON.parse(existingImages);

            // Images to keep
            updatedImages = product.productImg.filter((img) =>
                keepIds.includes(img.public_id)
            );

            // Images user removed
            const removedImages = product.productImg.filter(
                (img) => !keepIds.includes(img.public_id)
            );

            // Delete removed images from Cloudinary
            for (const img of removedImages) {
                await cloudinary.uploader.destroy(img.public_id);
            }

        } else {

            // If frontend didn't send existingImages,
            // keep all current images.
            updatedImages = [...product.productImg];
        }

        // ------------------------------------------------
        // Upload newly selected images
        // ------------------------------------------------
        if (req.files && req.files.length > 0) {

            for (const file of req.files) {

                const fileUri = getDataUri(file);

                const result = await cloudinary.uploader.upload(
                    fileUri.content,
                    {
                        folder: "Amber_Products",
                    }
                );

                updatedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        }

        // ------------------------------------------------
        // Update product fields
        // ------------------------------------------------
        product.productName = productName || product.productName;
        product.productDesc = productDesc || product.productDesc;
        product.productPrice = productPrice || product.productPrice;
        product.category = category || product.category;
        product.brand = brand || product.brand;

        // Save updated images
        product.productImg = updatedImages;

        // Save product
        const updatedProduct = await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

export const deleteProduct = async (req, res) => {

    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }
        const product = await Product.findById(productId)

        if (product.productImg && product.productImg.length > 0) {
            for (const img of product.productImg) {

                const result = await cloudinary.uploader.destroy(img.public_id)

            }
        }
        await Product.findByIdAndDelete(productId)

        return res.status(200).json({
            success: true,
            message: "Product Deleted Successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

export const getHomepageProducts = async (req, res) => {
    try {
        // all queries run SIMULTANEOUSLY — not one after another
        const [electronics, fashion, sports, featured] = await Promise.all([
            Product.find({ category: "Electronics" }).limit(8).sort({ createdAt: -1 }),
            Product.find({ category: "Fashion" }).limit(8).sort({ createdAt: -1 }),
            Product.find({ category: "Sports & Fitness" }).limit(8).sort({ createdAt: -1 }),
            Product.find({ featured: true }).limit(8).sort({ createdAt: -1 }),

        ]);

        return res.status(200).json({
            success: true,
            sections: {
                featured,
                electronics,
                fashion,
                sports,
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            product,
        });

    } catch (error) {
        console.error("Get Product Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};