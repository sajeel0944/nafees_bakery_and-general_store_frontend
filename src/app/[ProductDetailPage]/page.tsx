"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiShoppingCart, FiChevronLeft, FiPlus, FiMinus } from "react-icons/fi";
import { useEffect, useState } from "react";
import FetchSanityData, { Product } from "@/components/FetchSanityData";
import { urlFor } from "@/sanity/lib/image";
import AddToCardNotification from "@/components/AddToCardNotification";
import { ProductDataSchema, PustData } from "@/components/BackendApi";
import { useUser } from "@clerk/nextjs";
import ChatBotUI from "@/components/ChatBot";

const ProductDetailPage = ({ params }: any) => {
  const get_id = params.ProductDetailPage; // is main product ki id arahe hai params ki madad sy

  const router = useRouter(); // navigation ky zaye hai
  const [quantity, setQuantity] = useState<number>(1); // is ky andar product ki quantity aye gi
  const [product, setProduct] = useState<Product | null>(null); // sanity sy data is main aye ga
  const [showAddToCart, setShowAddToCart] = useState<boolean>(false); // is sy AddToCardNotification component ko manage kar raha ho ye true ho ye ga to AddToCardNotification component show hoye ga
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await FetchSanityData(undefined, get_id); // is main sanity ka data fetch ho raha hai

        if (Array.isArray(data) && data.length > 0) {
          setProduct(data[0]);
        } else {
          console.error("Error: Product data not available", data);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    getData();
  }, [get_id]);

  // jab user add to card waly buttom par clieck karry ga to ye chaly ga
  const addToCart = async () => {
    // is main check kar raha ho ky user login hai
    if (!isLoaded || !isSignedIn || !user) {
      alert("Please sign in to add items to your cart");
      return;
    }

    // is main check kar raha ho ky product ky andar data agaya
    if (!product) {
      console.error("No product data available");
      return;
    }

    try {
      // ye data schema hai jo mangodp database ky andar add to card main jaye ga
      const dataschema: ProductDataSchema = {
        email: user.emailAddresses[0].emailAddress,
        productId: product._id,
        category: product.category,
        description: product.description,
        image: product.image.asset._ref,
        name: product.name,
        price: Number(product.price),
        quantity: quantity,
        type: product.type,
      };

      setShowAddToCart(true); // is ky True hoye sy AddToCardNotification wala component show hoye ga
      setTimeout(() => {
        setShowAddToCart(false); // AddToCardNotification wala componenet bas 4 second he show hoye ga
      }, 4000);

      // Wait for the API call to complete
      await PustData(dataschema);
      
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  // jab tak sanity sy data fetch nhi ho raha hai to ye chaly ga
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white py-4 px-6 border-b">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <FiChevronLeft className="mr-1" /> Back to shop
        </button>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image */}
          <div className="lg:w-1/2">
            <div className="relative aspect-square rounded-xl bg-white shadow-sm overflow-hidden">
              <Image
                src={`${urlFor(product.image.asset._ref)}`}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 space-y-6">
            <div>
              <span className="text-sm text-gray-500 uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">
                {product.name}
              </h1>
              <p className="text-gray-700 mt-2">{product.description}</p>
            </div>

            <p className="text-3xl font-semibold text-green-700">
              Rs {product.price}
            </p>

            {/* Add to Cart */}
            <div className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="px-4 py-2 w-12 text-center font-medium text-gray-600">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
                <button
                  onClick={addToCart} // jab is par clien karro ga to data mongodp main adtocrad waly main chaly jaye ga
                  className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-colors shadow-md"
                >
                  <FiShoppingCart className="mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
        <ChatBotUI/> {/* ye ai chat bot hai*/ }
      </main>
      {/* jab user add to card par click karry ga to ye show hoye ga or is main name, price, wuality or image ja rahy hai */}
      {showAddToCart ? (
        <AddToCardNotification
          product_name={product.name}
          product_price={Number(product.price) * quantity}
          quantity={quantity}
          image={product.image.asset._ref}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default ProductDetailPage;


