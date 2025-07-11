"use client";

// is ko meny dymanic bakery, dairy or snack waly page main dia hai

import { motion } from "framer-motion";
import Image from "next/image";
import { Product } from "./FetchSanityData";
import { urlFor } from "@/sanity/lib/image";
import { useEffect, useState } from "react";
import AddToCardNotification from "./AddToCardNotification";
import Link from "next/link";
import { ProductDataSchema, PustData } from "./BackendApi";
import { useUser } from "@clerk/nextjs";
import { FiSearch, FiX } from "react-icons/fi";

interface ProductProps {
  products: Product[]; // Product FetchSanityData sa arahe hai
}

// is ky parameter main product aye gy
export default function ProductCard({ products }: ProductProps) {
  const [showAddToCart, setShowAddToCart] = useState<boolean>(false);
  const [addToCardProduct, setAddToCardProduct] = useState<Product | null>(
    null
  ); // jo parameter main data araha hai us data is main aye ga
  const { isLoaded, isSignedIn, user } = useUser(); // ye clerk sy araha hai
  const [get_input_value, setGet_input_value] = useState(""); // is ky andar input field ki value aye gi
  const [filterProduct, setFilterProduct] = useState<Product[]>([]); // is main filter ho ky product aye gy

  useEffect(() => {
    // jo user ny input field main jo vlaue di hai us ko product name ku zayeye filter kar raha ho 
    const filter_product = products.filter((product) =>
      product.name.toLowerCase().includes(get_input_value.toLowerCase())
    );
    // filter waly product ko filterProduct ky dy raha ho
    setFilterProduct(filter_product);
  }, [get_input_value, products]);

  // jab tak bata nhi ata us time tak ye chaly ga
  if (!filterProduct || products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }


  // jis product ky add to card waly buttom ko user click karry ga wo product mondodp ky add to card main chala jaye ga
  const addToCart = async (data: Product) => {
    // jab tak clerk sy email nhi aye gi us time tak ye nhi chaly ga
    if (!isLoaded || !isSignedIn || !user) {
      // Handle case when user is not signed in
      alert("Please sign in to add items to cart");
      return;
    }

    try {
      // Set the product immediately
      setAddToCardProduct(data); // jo parameter main data arahahai us ko mein setAddToCardProduct ky andar dy raha ho
      setShowAddToCart(true);

      // Prepare the data schema with the current product data (not from state)
      const dataschema: ProductDataSchema = {
        email: user.emailAddresses[0].emailAddress,
        productId: data._id,
        category: data.category,
        description: data.description,
        image: data.image.asset._ref,
        name: data.name,
        price: Number(data.price),
        quantity: 1,
        type: data.type,
      };

      // Call your API to add to cart
      await PustData(dataschema); // is main mongodp ky add to card main data ja raha hai

      // Optional: You can hide the notification after some time
      setTimeout(() => setShowAddToCart(false), 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setShowAddToCart(false);
      // Handle error (show toast, etc.)
    }
  };

  return (
    <>
      <div className="relative max-w-xl mx-auto mb-10">
        {/* Search Input */}
        <div className="relative flex items-center  bg-white rounded-lg shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
          {/* Search Icon */}
          <FiSearch className="absolute left-3 text-gray-400 h-5 w-5" />

          {/* Input Field */}
          <input
            type="text"
            value={get_input_value}
            onChange={(e) => setGet_input_value(e.target.value)}
            placeholder="Search products..."
            className="w-full py-3 pl-10 pr-12 text-gray-700 rounded-lg focus:outline-none"
          />
          {/* Clear Button (conditionally shown) */}
          <button className="absolute right-10 text-gray-400 hover:text-gray-600 cursor-pointer" onClick={()=>{setGet_input_value("")}}>
            <FiX className="h-6 w-6 -mr-28" />
          </button>
        </div>
      </div>

      {/* product card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filterProduct.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-[23rem]"
          >
            <Link href={`/${product._id}`}>
              <div className="h-48 overflow-hidden relative cursor-pointer">
                <Image
                  src={`${urlFor(product.image.asset._ref)}`}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </Link>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  {product.category}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-green-600">
                  Rs. {product.price}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    addToCart(product); // user jo product addtocard karry ga us assToCard waly function main jaye ga
                  }}
                  className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-4 py-2 rounded-lg"
                >
                  Add to Cart
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
        {/* jsb user add to card waly buttom par click karry ga jab ye cahly ga or is main  product name, price, quality or image jaye gi */}
        {showAddToCart ? (
          <AddToCardNotification
            product_name={`${addToCardProduct?.name}`}
            product_price={Number(addToCardProduct?.price)}
            quantity={1}
            image={`${addToCardProduct?.image.asset._ref}`}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}
