import SkeletonCard from '@/app Components/Skeleton';
import { setProduct } from '@/Redux/productSice';
import axios from 'axios';
import { Edit, Loader2, Search, Trash2, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
// import { Button } from "@/components/ui/button"

import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form";
import { toast } from 'sonner';





const AdminProducts = () => {

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [order, setOrder] = useState("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState()
  const [editProduct, setEditProduct] = useState(null);


  const [deletingId, setDeletingId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);





  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();



  // const { allProducts } = useSelector(store => store.product);
  const dispatch = useDispatch();

  const categorys = allProducts.map((p) => (p.category))
  const uniqueCategorys = ["All", ...new Set(categorys)]
  // console.log("allProducts", allProducts);
  // console.log("products", products);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/product/allProducts"
      );
      // console.log("Response", response);
      if (response.data.success) {
        console.log("Products fetched successfully:", response);
        setProducts(response.data.products);
        setAllProducts(response.data.products);
        dispatch(setProduct(response.data.products))
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {

    fetchProducts();
  }, [])


  const handleSearch = (e) => {
    setSearch(e.target.value)
  }
  const handleOrder = (value) => {
    setOrder(value)
  }

  useEffect(() => {
    if (products?.length === 0) return

    let filtered = [...products];

    if (search.trim() !== "") {
      filtered = filtered.filter((product) => (
        product.productName?.toLowerCase().includes(search.toLowerCase())
      ))
    }

    setFilteredProducts(filtered)
    // console.log("filtered", filteredProducts);
  }, [search, order, products]);


  const openEditDialog = (product) => {
    setEditProduct(product);

    reset({
      productName: product.productName,
      productDesc: product.productDesc,
      productPrice: product.productPrice,
      category: product.category,
      brand: product.brand,
    });

    setImages(product.productImg);

    setPreviewUrls(
      product.productImg.map(img => img.url)
    );
  };



  const MAX_IMAGES = 5;
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // check total won't exceed max
    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`You can upload only ${MAX_IMAGES} images.`);
      return;
    }

    // ✅ accumulate new files on top of existing ones
    setImages(prev => [...prev, ...files]);

    // ✅ accumulate new previews on top of existing ones
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };




  const removeImage = (indexToRemove) => {

    const image = images[indexToRemove];

    if (image instanceof File) {
      URL.revokeObjectURL(previewUrls[indexToRemove]);
    }

    setImages(prev =>
      prev.filter((_, index) => index !== indexToRemove)
    );

    setPreviewUrls(prev =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };



  const updateProduct = async (formData, reset, productId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:3000/api/product/updateProduct/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        })
      console.log(response);

      if (response.data.success) {
        toast.success("Product Updated")

        previewUrls.forEach(url => URL.revokeObjectURL(url));

        reset();
        setImages([]);
        setPreviewUrls([]);
        setEditProduct(null);
        setOpen(false);
        fetchProducts()

      }
    } catch (error) {
      console.log(error.response);

    } finally {
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

    const existingImages = images
      .filter(
        img => !(img instanceof File) && img.public_id
      )
      .map(
        img => img.public_id
      );

    formData.append(
      "existingImages",
      JSON.stringify(existingImages)
    );
    // console.log("existingImages", existingImages);
    // console.log(JSON.stringify(existingImages));


    images
      .filter(img => img instanceof File)
      .forEach(file => {
        formData.append("files", file);
      });
    // console.log("images", images);


    updateProduct(
      formData,
      reset,
      editProduct._id
    );
  };

  const deleteProduct = async (productId) => {


    try {
      setDeletingId(productId)
      setDeleteLoading(true);
      console.log("product_id", productId);

      const response = await axios.delete(`http://localhost:3000/api/product/deleteProduct/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`

          },
        })
      if (response.data.success) {
        toast.success("Product Deleted Successfully")
        dispatch(removeFromCart(productId));
        setDeleteOpen(false);
        
      }

    } catch (error) {
      console.log(error.response);

    } finally {
      fetchProducts()
      setDeleteLoading(false)
      setDeletingId(null)
    }


  }

  return (
    <div className="flex flex-col w-full font-sans">

      {/* 1. PREMIUM RESILIENT SEARCH BAR */}
      <div className="w-full max-w-md mx-auto mb-6 px-4">
        <div className="flex items-center bg-white rounded-2xl border border-stone-200/80 shadow-sm focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/10 transition-all overflow-hidden p-1">
          <input
            type="text"
            name="search"
            placeholder="Search products..."
            className="w-full h-10 bg-transparent ps-4 text-sm text-stone-800 outline-none placeholder-stone-400"
            onChange={handleSearch}
          />
          <button className="bg-amber-600 hover:bg-amber-700 text-white h-10 w-10 rounded-xl flex items-center justify-center transition-colors shrink-0 cursor-pointer shadow-sm">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC CONTENT WORKSPACE CONTAINER */}
      <div className="Products  w-full px-4 md:px-8 py-2">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : allProducts?.length === 0 ? (
          <div className="w-full h-64 flex justify-center items-center bg-white/40 rounded-2xl border border-dashed border-amber-300">
            <p className="text-stone-600 font-medium text-sm">No products found...</p>
          </div>
        ) : (
          /* RESPONSIVE ROW LIST COMPONENT CONTAINER */
          <div className="space-y-4 max-w-5xl mx-auto">
            {filteredProducts && filteredProducts.map((product) => (
              <div
                key={product._id || product.id}
                className="bg-white border border-stone-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >

                {/* Product Info Block left align wrapper */}
                <div className="flex  sm:flex-row items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
                  {/* Image Frame Box Container */}
                  <div className=" flex flex-col  gap-2 justify-center items-center p-1 overflow-hidden shrink-0">
                    <img
                      src={product?.productImg?.[0]?.url}
                      alt={product?.productName || "Product"}
                      className=" h-20 w-20 p-1  bg-stone-50 border border-stone-100 rounded-xl"
                    />
                      <div className="text-base font-extrabold text-amber-700">
                    ₹{product?.productPrice?.toLocaleString('en-IN')}
                  </div>
                  </div>

                  {/* Meta details segment text fields */}
                  <div className="md:item-start item-center sm:text-left min-w-0 flex-1">
                    <h4 className="text-sm font-bold  text-stone-800 line-clamp-3 md:line-clamp-2">
                      {product?.productName || "Product Title"}
                    </h4>
                    <p className="text-xs hidden md:block text-stone-500 line-clamp-2 mt-1 leading-relaxed md:h-10 overflow-hidden">
                      {product?.productDesc}
                    </p>
                  </div>
                </div>

                {/* Pricing & Control Action block adjustments right align row */}
                <div className="flex sm:flex-row items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-stone-100 pt-3 sm:pt-0 shrink-0">
                

                  {/* Control Action Buttons Panel wrapper */}
                  <div className="flex items-center gap-4 justify-between w-full">
                    {/* <button className="p-2 text-stone-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all cursor-pointer">
                      <Edit size={18} />
                      
                    </button> */}
                    <Dialog open={open} onOpenChange={setOpen} >
                      <DialogTrigger asChild>
                        <Button onClick={() => openEditDialog(product)}>
                          Edit
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="w-[90vw] md:!max-w-6xl max-h-[90vh] overflow-hidden">
                        <DialogHeader>
                          <DialogTitle >Edit Product</DialogTitle>
                          <DialogDescription>
                            Update product information and images.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="max-h-[80vh] overflow-y-auto px-2 pb-4">
                          <form
                            onSubmit={handleSubmit(submitHandler)}
                            className="space-y-6 overflow-y-auto"
                          >

                            {/* Product Name */}
                            <div>
                              <label className="block mb-2 font-medium text-amber-900">
                                Product Name
                              </label>

                              <input
                                type="text"
                                // defaultValue={product.productName}
                                {...register("productName", {
                                  required: "Product name is required",
                                })}
                                className="w-full border border-amber-300 rounded-lg p-2"
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
                                // defaultValue={product.productDesc}

                                rows={3}
                                {...register("productDesc", {
                                  required: "Description is required",
                                })}
                                className="w-full border border-amber-300 rounded-lg p-2"
                              />

                              {errors.productDesc && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.productDesc.message}
                                </p>
                              )}
                            </div>

                            {/* Price, Category, Brand */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                              <div>
                                <label>Price</label>

                                <input
                                  // defaultValue={product.productPrice}

                                  type="number"
                                  {...register("productPrice")}
                                  className="w-full border border-amber-300 rounded-lg p-2"
                                />
                              </div>

                              <div>
                                <label>Category</label>

                                <input
                                  {...register("category")}
                                  value={product.category}
                                  readOnly
                                  className="w-full border border-amber-300 rounded-lg p-2 text-gray-500"
                                >
                                  {/* {uniqueCategorys.map(category => (
                                    <option
                                      key={category}
                                      value={category}
                                    >
                                      {category}
                                    </option>
                                  ))} */}
                                </input>
                              </div>

                              <div>
                                <label>Brand</label>

                                <input
                                  // defaultValue={product.brand}
                                  type="text"
                                  {...register("brand")}
                                  className="w-full border border-amber-300 rounded-lg p-2"
                                />
                              </div>

                              <div className='flex flex-col gap-2'>
                                <label>New Images : </label>

                                <input
                                  className='cursor-pointer bg-amber-500 p-2  text-white rounded-md'
                                  type="file"
                                  multiple

                                  accept="image/*"
                                  {...register("files", {
                                    onChange: handleImageChange
                                  })}
                                />
                              </div>
                            </div>

                            {/* Existing + New Images */}
                            <div className="flex flex-wrap gap-4 border p-4 rounded-lg">
                              {previewUrls.map((url, index) => (
                                <div className="relative">
                                  <img
                                    key={index}
                                    src={url}
                                    alt={`preview-${index}`}
                                    className="w-32 h-32 object-cover rounded-lg border"
                                  />
                                  {/* {console.log(url)
                                } */}
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
                              className="w-full bg-amber-500 text-white py-3 rounded-lg"
                            >
                              {loading
                                ? <Loader2 className="animate-spin mx-auto" />
                                : "Update Product"}
                            </button>

                          </form>
                        </div>

                      </DialogContent>
                    </Dialog>

                    <AlertDialog  >
                      <AlertDialogTrigger asChild>
                        <button className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer">
                          {deletingId === product._id ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Trash2 />
                          )}
                        </button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete this product?
                          </AlertDialogTitle>

                          <AlertDialogDescription>
                            This action cannot be undone. This product will be permanently removed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel
                            disabled={deletingId === product._id}
                          >
                            Cancel
                          </AlertDialogCancel>

                          <AlertDialogAction
                            onClick={() => deleteProduct(product._id)}
                            disabled={deletingId === product._id}
                          >
                            {deletingId === product._id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              "Delete Product"
                            )}
                          </AlertDialogAction>

                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>



    </div>
  );
}

export default AdminProducts
