// pages/groceries.tsx
"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import FetchSanityData, { Product } from "@/components/FetchSanityData";
import { useEffect, useState } from "react";
import ChatBotUI from "@/components/ChatBot";

export default function GroceriesPage() {
  const [sanity_snack_data, set_sanity_snack_data] = useState<Product[]>([]); // is ky andar sanity sy snacks product is main aye gy  

  useEffect(() => {
    const getData = async () => {
      const data = await FetchSanityData("Snacks"); // is main sanity sy sncks data araha hai
      if (Array.isArray(data)) {
        set_sanity_snack_data(data); // jo snacks data sanity sy aya hai us ko set_sanity_snack_data main dy raha ho
      } else {
        console.error("Error:", data);
      }
    };
    getData();
  }, []);

  // is main sary category aye gi 
  const categories: string[] = Array.from(
    new Set(sanity_snack_data.map((product) => product.category))
  );

  return (
    <div className="min-h-screen bg-gray-50">
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
            src="/picture/snack.png"
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
                Fresh Snacks
              </h1>
              <p className="text-xl text-amber-500">
                Quality products for your family
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
              {["All", ...categories].map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-green-100 text-green-800 rounded-full whitespace-nowrap"
                >
                  {category}
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
              Our Grocery Selection
            </motion.h2>

            <ProductCard products={sanity_snack_data} /> {/* is ky andar snack ky sary product is main jarahy hai or wo phir is main product card bunky aye gy */}
          </div>
        </section>

        {/* Weekly Special */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-16 bg-gray-800 text-white"
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Weekly Special</h2>
            <p className="text-xl mb-6">
              Buy $50 worth of groceries and get 10% off!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 cursor-pointer rounded-lg font-medium"
            >
              View All Deals
            </motion.button>
          </div>
        </motion.section>
        <ChatBotUI /> {/* ye ai chatbot hai */}
      </main>
    </div>
  );
}
