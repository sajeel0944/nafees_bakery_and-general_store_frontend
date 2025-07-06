"use client"

//  is ko meny home page main dia hai

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-amber-600 to-amber-500 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="sm:text-center lg:text-left"
            >
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">FreshMart</span>
                <span className="block text-amber-100">General Store & Bakery</span>
              </h1>
              <p className="mt-3 text-base text-amber-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Your neighborhood store for fresh groceries and delicious baked goods
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start ">
                <div className="rounded-md shadow">
                  <Link
                    href="#select category"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-amber-700 bg-white hover:bg-amber-50 md:py-4 md:text-lg md:px-10"
                  >
                    Shop Now
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    href="#Bakery Specials"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10"
                  >
                    Bakery Specials
                  </Link>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2"
      >
        <Image
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="/picture/herosection.png"
          alt="Fresh bakery items"
          width={400}
          height={400}
        />
      </motion.div>
    </div>
  );
}

export default HeroSection