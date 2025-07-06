"use client";

// is ko meny ProductCard component or dtnamic [product_detail] main dia hai

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiShoppingCart, FiX } from "react-icons/fi";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface data {
  quantity: number;
  product_name: string;
  product_price: number;
  image: string;
}

function AddToCardNotification(props: data) {
  const router = useRouter();
  // Add this state at the top of your component
  const [showNotification, setShowNotification] = useState(true);

  return (
    <>
      {/* // Add this component just before your closing </div> in the main return */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="bg-white shadow-xl rounded-lg border border-gray-200 w-80 overflow-hidden">
            <div className="flex items-start p-4">
              <div className="flex-shrink-0 bg-green-100 p-1 rounded-full">
                <Image
                  src={`${urlFor(props.image)}`}
                  alt="product image"
                  width={35}
                  height={35}
                  className="h-10 w-10 rounded-full "
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Added to cart!
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {props.quantity} {props.product_name}(s) •{" "}
                  {props.product_price} each
                </p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex justify-end">
              <button
                onClick={() => {
                  router.push("/order");
                  setShowNotification(false);
                }}
                className="inline-flex items-center px-3 cursor-pointer py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none"
              >
                <FiShoppingCart className="mr-2" />
                View Order
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default AddToCardNotification;
