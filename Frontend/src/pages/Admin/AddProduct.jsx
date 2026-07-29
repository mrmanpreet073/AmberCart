import axios from "axios";
import { Loader2, X } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";






const AddProduct = () => {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const MAX_IMAGES = 5;

  const handleImageChange = (e) => {

    console.log(("HandleImageChange Run"));
    const files = Array.from(e.target.files);
    if (files.length > MAX_IMAGES) {
      toast.error(`You can upload only ${MAX_IMAGES} images.`);
      return;
    }

    setImages(files);

    const previews = files.map(file =>
      previewUrls.push(URL.createObjectURL(file))
    );

  };

  const removeImage = (indexToRemove) => {
    URL.revokeObjectURL(previewUrls[indexToRemove]);

    setImages(prev =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    // console.log(images);


    setPreviewUrls(prev =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    // console.log(previewUrls);
    // 
  };


  const { allProducts } = useSelector(store => store.product)
  // console.log("allProducts", allProducts);

  const uniqueCategorys = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Groceries",
  "Books & Stationery",
  "Sports & Fitness",
  "Toys & Baby Products",
  "Automotive",
  "Health & Wellness",
  "Pet Supplies",
  "Jewelry & Watches",
  "Gaming",
  "Garden & Outdoor",
  "Office Supplies",
  "Gifts & Gift Cards",
  "Music & Instruments",
];

  // const categorys = allProducts.map((p) => (p.category))
  // const uniqueCategorys = ["All", ...new Set(categorys)]
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const addProductAxios = async (formData, reset) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/product/addProducts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        })
      console.log(response);

      if (response.data.success) {
        toast.success("Product Added")

        previewUrls.forEach(url => URL.revokeObjectURL(url));

        reset();
        setImages([]);
        setPreviewUrls([]);
      }
    } catch (error) {
      console.log(error.response);

    }finally {
      setLoading(false);
    }
  }

  const submitHandler = (data) => {
    const formData = new FormData();

    formData.append("productName", data.productName);
    formData.append("productDesc", data.productDesc);
    formData.append("productPrice", data.productPrice);
    formData.append("category", data.category);
    formData.append("brand", data.brand);

    for (let file of images) {
      formData.append("files", file);
    }
    addProductAxios(formData, reset)
    console.log(data);
    console.log(formData);
  };

  return (
    <div className=" ">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-amber-100 p-6 md:p-8 text-sm">
        <h1 className="text-xl  font-bold text-amber-700 mb-4">
          Add Product
        </h1>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="space-y-6"
        >
          {/* Product Name */}
          <div>
            <label className="block mb-2 font-medium text-amber-900">
              Product Name
            </label>

            <input
              type="text"
              placeholder="Enter product name"
              {...register("productName", {
                required: "Product name is required",
              })}
              className="w-full border border-amber-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-amber-500"
            />

            {errors.productName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.productName.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium text-amber-900">
              Product Description
            </label>

            <textarea
              rows={2}
              placeholder="Enter product description"
              {...register("productDesc", {
                required: "Description is required",
              })}
              className="w-full border border-amber-300 rounded-lg p-2 outline-none resize-none focus:ring-2 focus:ring-amber-500"
            />

            {errors.productDesc && (
              <p className="text-red-500 text-sm mt-1">
                {errors.productDesc.message}
              </p>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block mb-2 font-medium text-amber-900">
                Product Price
              </label>

              <input
                type="number"
                placeholder="Enter price"
                {...register("productPrice", {
                  required: "Price is required",
                  min: {
                    value: 0,
                    message: "Price must be a positive number",
                  },
                  max: {
                    value: 999999,
                    message: "Price must be less than 999999",
                  },
                })}
                className="w-full border border-amber-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-amber-500"
              />

              {errors.productPrice && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.productPrice.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 font-medium text-amber-900">
                Category
              </label>

              <select
                {...register("category", {
                  required: "Category is required",
                })}
                className="w-full border border-amber-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="">Select Category</option>

                {uniqueCategorys.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="block mb-2 font-medium text-amber-900">
                Brand
              </label>

              <input
                type="text"
                placeholder="Enter brand name"
                {...register("brand", {
                  required: "Brand is required",
                })}
                className="w-full border border-amber-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-amber-500"
              />

              {errors.brand && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.brand.message}
                </p>
              )}
            </div>

            {/* Images */}
            <div>
              <label className="block mb-2 font-medium text-amber-900">
                Product Images
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                // onChange={(e) => handleImageChange(e)}

                {...register("files", {
                  required: "Please select product images",
                  onChange: handleImageChange
                })}
                className="w-full border border-amber-300 rounded-lg p-2 file:bg-amber-500 file:text-white file:border-none file:px-4 file:py-2 file:rounded-md file:cursor-pointer"
              />

              {errors.files && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.files.message}
                </p>
              )}

            </div>

          </div>
          <div className="flex p-4 border w-full gap-4 flex-wrap">
            {previewUrls.map((url, index) => (
              <div className="relative">
                <img
                  key={index}
                  src={url}
                  alt={`preview-${index}`}
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-gray-300 text-white rounded-full p-1 hover:bg-gray-500 transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full flex justify-center items-center bg-amber-500  hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
           {loading ? <Loader2 className="animate-spin  " /> : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;