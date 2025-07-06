"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Navbar from "@/components/Navbar";
import CategoryGrid from "@/components/CategoryGrid";
import ChatBotUI from "@/components/ChatBot";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar placed here */}
      <Navbar />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Categories */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-12 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Shop by Category
            </h2>
            {/* category crad arahy hai */}
            <CategoryGrid />
          </div>
        </motion.section>

        {/* Featured Products */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-12 bg-white px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Bakery Specials
            </h2>
            {/*  */}
            <FeaturedProducts />
          </div>
        </motion.section>

        {/* is main special product ky card aye gy */}
        <Testimonials /> 

        {/* Newsletter */}
        <Newsletter />
        {/* ye ia chatbot hai */}
        <ChatBotUI />
      </main>
    </div>
  );
}
