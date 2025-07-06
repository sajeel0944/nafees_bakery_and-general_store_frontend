// pages/dairy.tsx
"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { useEffect, useState } from "react";
import FetchSanityData, { Product } from "@/components/FetchSanityData";
import ChatBotUI from "@/components/ChatBot";


export default function DairyPage() {
  const [sanity_dairy_data, set_sanity_dairy_data] = useState<Product[]>([]); // sanity sy dailry product is main aye gy

  useEffect(() => {
    const getData = async () => {
      const data = await FetchSanityData("Dairy"); // is main sy sanity ky daily product aye gu
      if (Array.isArray(data)) {
        set_sanity_dairy_data(data);  // sanity sy daily product is set_sanity_dairy_data ja rahy hai
      } else {
        console.error("Error:", data);
      }
    };
    getData();
  }, []);

  // is main sary category aye gi 
  const dairyTypes = Array.from(
    new Set(sanity_dairy_data.map((product) => product.category))
  );

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />

      <main>
        {/* Hero Banner */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-96 overflow-hidden"
        >
          <Image
            src="/picture/dairy.png"
            alt="Dairy Products"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0  bg-opacity-40 flex items-center justify-center">
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-center px-4"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-amber-500 mb-4">
                Dairy Products
              </h1>
              <p className="text-xl text-amber-500">
                Fresh from farm to your table
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* is main  Category show hoye gi */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-8 bg-white sticky top-0 z-10 shadow-sm"
        >
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto space-x-4 pb-2">
              {["All", ...dairyTypes].map((type) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full whitespace-nowrap"
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Products Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-800 mb-8"
            >
              Our Dairy Selection
            </motion.h2>

            <ProductCard products={sanity_dairy_data} /> {/* is ky andat dairy ky sary product is main jarahy hai or wo phir is main product card bunky aye gy */}

          </div>
        </section>

        {/* Special Offer */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-16 bg-gray-800 text-white"
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Dairy Bundle Deal</h2>
            <p className="text-xl mb-6">
              Buy any 3 dairy products and get 15% off!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 cursor-pointer rounded-lg font-medium"
            >
              Shop Now
            </motion.button>
          </div>
        </motion.section>
        <ChatBotUI/> {/* ye ai chatbot hai */}
      </main>
    </div>
  );
}
