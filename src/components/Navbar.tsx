// components/Navbar.js
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiMenu, FiX, FiShoppingCart } from "react-icons/fi";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { ReadData } from "./BackendApi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [countProduct, setCountProduct] = useState<number>(0);
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (user?.emailAddresses?.[0]?.emailAddress) {
          const data = await ReadData(user.emailAddresses[0].emailAddress);
          const count: number = data.length;
          if (count) {
            setCountProduct(count);
          } else {
            setCountProduct(0);
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (isLoaded && isSignedIn) {
      fetchProducts();
    }
  }, [isLoaded, isSignedIn, user]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Bakery", path: "/bakery" },
    { name: "Snacks", path: "/snacks" },
    { name: "Dairy", path: "/dairy" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-amber-600">
              Nafees
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="text-gray-700 hover:text-amber-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link href={"order"}>
              <button className="relative p-2 text-gray-700 hover:text-amber-600 cursor-pointer">
                <FiShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {countProduct}
                </span>
              </button>
            </Link>
            <div>
              {/* ye clerk.js ky components hai  */}
              <SignedOut>
                <div className=" ">
                  <SignInButton>
                    <button className="bg-amber-500 text-white px-3 py-2 rounded-md hover:bg-amber-500 transition duration-300 cursor-pointer">
                      Sign in
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-end cursor-pointer ">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonTrigger:
                          "px-1 py-1 text-white font-medium rounded  transition",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-amber-600 focus:outline-none cursor-pointer"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="block px-3 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2 flex items-center text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-md cursor-pointer">
              <Link href={"order"}>
                <FiShoppingCart className="mr-2" />
                Cart ({countProduct})
              </Link>
            </div>
            <div>
              {/* ye clerk.js ky components hai  */}
              <SignedOut>
                <div className=" ">
                  <SignInButton>
                    <button className="bg-amber-500 text-white px-3 py-2 rounded-md hover:bg-amber-500 transition duration-300 cursor-pointer">
                      Sign in
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-end  ">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonTrigger:
                          "px-1 py-1 text-white font-medium rounded  transition",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
