"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Navbar from "@/components/Navbar";
import CategoryGrid from "@/components/CategoryGrid";
import ChatBotUI from "@/components/ChatBot";
import VoiceAgent from "@/components/VoiceAgent";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false); // jab is ki value true hoye gi to chatbot open hoye ga or is ki value chaneg voice agent ky andar ho rahe hai
  
  // ye function voice agent ky andar chaly ga
  const VoiceAgentOpenChatBot = () => {
    setIsOpen(true)
  }

  // ye function chatbot ky andar jaraha hai waha sy isOpen ki value reset kar raha ho
  const RestartIsOpen = () => {
    setIsOpen(false)
  }
  
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

        {/* is main voice ai agent aye ga or is ky andar VoiceAgentOpenChatBot function ga raha hai*/}
        <VoiceAgent onOpenChatBot={VoiceAgentOpenChatBot}/>

        {/* ye ai chatbot hai or is ky andar isOpen ki value jarahe hai or is ky andar RestartIsOpen function jaraha hai*/}
        <ChatBotUI OpenChatBot={isOpen} RestartIsOpen={RestartIsOpen}/>
      </main>
    </div>
  );
}
