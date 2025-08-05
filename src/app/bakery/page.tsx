"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { useEffect, useState } from "react";
import FetchSanityData, { Product } from "@/components/FetchSanityData";
import ChatBotUI from "@/components/ChatBot";
import VoiceAgent from "@/components/VoiceAgent";

export default function BakeryPage() {
  const [isOpen, setIsOpen] = useState(false); // jab is ki value true hoye gi to chatbot open hoye ga or is ki value chaneg voice agent ky andar ho rahe hai

  // ye function voice agent ky andar chaly ga
  const VoiceAgentOpenChatBot = () => {
    setIsOpen(true)
  }
  
  // ye function chatbot ky andar jaraha hai waha sy isOpen ki value reset kar raha ho
  const RestartIsOpen = () => {
    setIsOpen(false)
  }

  const [sanity_bakery_data, set_sanity_bakery_data] = useState<Product[]>([]); // is main sary sanity ky product aye gy

  useEffect(() => {
    const getData = async () => {
      const data = await FetchSanityData("Bakery"); // is main sanity ky data araha hai
      if (Array.isArray(data)) {
        set_sanity_bakery_data(data); // is main data set_sanity_bakery_data ky andar ja raha hai
      } else {
        console.error("Error:", data);
      }
    };
    getData();
  }, []);

  //   is main sary categories aye gi
  const categories: string[] = Array.from(
    new Set(sanity_bakery_data.map((product) => product.category))
  );

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />  {/* ye navbar hai*/}

      <main>
        {/* Hero Banner */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-96 overflow-hidden"
        >
          <Image
            src="/picture/bakary.png"
            alt="Bakery Display"
            className="w-full h-full object-cover"
            fill
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
                Our Bakery
              </h1>
              <p className="text-xl text-amber-500">
                Freshly baked with love every morning
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* ia main sary Category aye gy */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-8 bg-white sticky top-0 z-10 shadow-sm"
        >
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto space-x-4 pb-2">
              {categories.map((category) => (
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
              Our Bakery Selection
            </motion.h2>

            <ProductCard products={sanity_bakery_data} /> {/* is ky andat bakery ky sary product is main jarahy hai or wo phir is main product card bunky aye gy */}

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
            <h2 className="text-3xl font-bold mb-4">Daily Bread Special</h2>
            <p className="text-xl mb-6">
              Buy any 2 loaves of bread and get 1 free!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 cursor-pointer rounded-lg font-medium"
            >
              View Todays Specials
            </motion.button>
          </div>
        </motion.section>

        {/* is main voice ai agent aye ga or is ky andar VoiceAgentOpenChatBot function ga raha hai*/}
        <VoiceAgent onOpenChatBot={VoiceAgentOpenChatBot}/>

        {/* ye ai chatbot hai or is ky andar isOpen ki value jarahe hai or is ky andar RestartIsOpen function jaraha hai*/}
        <ChatBotUI OpenChatBot={isOpen} RestartIsOpen={RestartIsOpen}/>
      </main>
    </div>
  );
}
