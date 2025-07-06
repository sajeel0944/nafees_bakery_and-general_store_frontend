"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import {
  FiShoppingCart,
  FiClock,
  FiMapPin,
  FiX,
} from "react-icons/fi";
import Image from "next/image";
import {
  DeleteData,
  ProductDeleetSchema,
  ReadData,
} from "@/components/BackendApi";
import { urlFor } from "@/sanity/lib/image";
import { useUser } from "@clerk/nextjs";
import OrderForm from "@/components/OrderForm";
import ChatBotUI from "@/components/ChatBot";

type Product = {
  productId: string;
  category: string;
  description: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  type: string;
};

export default function OnlineOrdersPage() {
  const [products, setProducts] = useState<Product[]>(); // jo user ny add to card ki a hai wo product is  main aye gy 
  const { isLoaded, isSignedIn, user } = useUser(); // ye clerk sy araha hai

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // jab tak user ki email clerk sy nhi ati us tiem tak ye nhi chaly ga
        if (user?.emailAddresses?.[0]?.emailAddress) {
          const data = await ReadData(user.emailAddresses[0].emailAddress); // ReadData ky andar email ja rahe hai email ky zaye he user ka add to card ka data aye ga
          setProducts(Array.isArray(data) ? data : []); // agar mongodp ky andar user ka add to card ka data howa to data setProducts ky andar jaye ga or agar data nhi howa ho MT arry  jaye gi
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]); // Set empty array on error
      } 
    };

    // jab tak clerk sy user ki email ye nhi chaly ga
    if (isLoaded && isSignedIn) {
      fetchProducts();
    }
  }, [isLoaded, isSignedIn, user]);

  // jab tak mongodp database sy fetch nhi hoye ga us time tak ye show hoye ga
  if (!products) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // is sy jo user product ko remove kary ga wo product remove hojaye ga is main us product ka index or productId is main ye gi
  const remove_product = async (index: number, productId: string) => {
    if (!user?.emailAddresses?.[0]?.emailAddress) return; // jab tak clerk sy user ki email  nhi aye gi us time tak ye chaly ga
    const data: ProductDeleetSchema = {
      email: `${user?.emailAddresses?.[0]?.emailAddress}`,
      index_number: index,
    };

    //  Optimistically update UI is main setProducts main sy remove sy wo product remove kar raha ho jo jo user ny bola hai us ky index or productId ky zayeye
    setProducts((prev) =>
      (prev || []).filter((p) => p.productId !== productId)
    );
    
    // is main jo user ny index or product dia hai us ky zayeye mongodp main sy wo product delete hojaye ga 
    await DeleteData(data);  // is ky zayeye producr delete hoye gy
    
  };

  // jo add to card main jo product hai unky amount plue kar raha ho 
  const cartTotal = products
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> 

      <main className="pb-20">
        {/* Hero Banner */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-96 overflow-hidden"
        >
          <Image
            src="/picture/online order.png"
            alt="Grocery Store"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-center px-4"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-amber-500 mb-4">
                Online Ordering
              </h1>
              <p className="text-xl text-amber-500">
                Get your favorites delivered or ready for pickup
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Order Type Selector */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-6 bg-white shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 max-w-md py-4 px-6 bg-green-100 text-green-800 rounded-lg flex items-center justify-center gap-3"
              >
                <FiMapPin className="text-xl" />
                <div className="text-left">
                  <h3 className="font-bold">Delivery</h3>
                  <p className="text-sm">Get it delivered to your door</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 max-w-md py-4 px-6 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center gap-3"
              >
                <FiClock className="text-xl" />
                <div className="text-left">
                  <h3 className="font-bold">Pickup</h3>
                  <p className="text-sm">Ready in 30 minutes</p>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Sidebar */}
            <div className="lg:w-1/3 ">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-lg sticky top-4 h-"
              >
                <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                  <FiShoppingCart className="text-green-600" />
                  <h2 className="font-bold text-lg text-green-600">
                    Your Order
                  </h2>
                  <span className="ml-auto bg-green-600 text-white rounded-full px-2 py-1 text-xs">
                    {products.reduce((total, item) => total + item.quantity, 0)} {/* is main is main sary product ki quality aye gi */}
                  </span>
                </div>

                <div className="max-h-[30rem] overflow-y-auto">
                  {products.map((item, index: number) => (
                    <>
                      <div
                        key={item.productId}
                        className="p-4 border-b border-gray-100 text-gray-600"
                      >
                        <div className="flex justify-between">
                          <div>
                            <Image
                              src={urlFor(item.image).url()}
                              alt={item.name}
                              width={45}
                              height={45}
                              className="h-11 w-11 rounded-full"
                            />
                            <h3 className="font-medium">{item.name}</h3>
                            <span>
                              {item.price.toFixed(2)} x {item.quantity}
                            </span>
                          </div>
                          <button
                            className="text-green-500 hover:text-green-700 cursor-pointer"
                            onClick={() => {
                              remove_product(index, item.productId);
                            }}
                          >
                            <FiX size={24} /> {/* is par click karry par wo wala product add to card sy romove ho jaye ga */}
                          </button>
                        </div>
                        <div className="mt-2 flex items-center">
                          <span className="ml-auto font-medium">
                            Rs. {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex justify-between font-bold text-lg mb-4">
                    <span className="text-black">Total:</span>
                    <span className="text-black">Rs. {cartTotal}</span>
                  </div>
                </div>
              </motion.div>
            </div>
            {/*  */}
            <div className="lg:w-2/3">
            {/* ye from hai is ky andar add to card product or total amount ja rahe hai */}
              <OrderForm
                addToCartProduct={products}
                totalAmount={Number(cartTotal)}
              />
            </div>
            {/*  */}
          </div>
        </section>

        <ChatBotUI /> {/* ye ai chat bot hai */}
      </main>
    </div>
  );
}
