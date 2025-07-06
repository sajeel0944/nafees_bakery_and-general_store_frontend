"use client";

// is ko meny order waly page main dia hai

import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShoppingCart,
  FiCheckCircle,
} from "react-icons/fi";
import { useState } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import {
  ApiResponse,
  DeleteAddToCard,
  OrderDataStructure,
  ProductDataSchema,
  PustOrderData,
} from "./BackendApi";
import { useRouter } from "next/navigation";

// 1. Define the form data type
type OrderFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
  deliveryNotes?: string;
};

// is ky andar from ka data aye ga
const orderSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  address: yup.string().required("Address is required"),
  paymentMethod: yup.string().required("Payment method is required"),
  deliveryNotes: yup.string().optional(),
});

// 5. Props
interface OrderFormProps {
  addToCartProduct: ProductDataSchema[];
  totalAmount: number;
}

//  is ky andar add to card product or total amount aye gi order waly page sy
const OrderForm = ({ addToCartProduct, totalAmount }: OrderFormProps) => {
  const [processing, setProcessing] = useState<boolean>(false)
  const [isOrderPlaced, setIsOrderPlaced] = useState<boolean>(false);
  const { isLoaded, isSignedIn, user } = useUser(); // ye clerk sy araha hai
  const router = useRouter(); // navigation ky zaye hai

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrderFormData>({
    resolver: yupResolver(orderSchema) as Resolver<OrderFormData>,
  });

  // jab from submit hoye ka us time ye chaly ga
  const onSubmit: SubmitHandler<OrderFormData> = async (data) => {
    const data_time = new Date();

    setProcessing(true)

    // jab tak clerk sy email nhi aye gi us time tak ye nhi chaly ga 
    if (!isLoaded || !isSignedIn || !user) {
      // Handle case when user is not signed in
      alert("Please sign in to add items to cart");
      return;
    }
    try {
      // ye is ky andar sary data araha hai
      const orderData: OrderDataStructure = {
        ...data, // is main from ka data araha hai
        orderId: uuidv4(), // ye ek labary install ki hai us ky zayeye order ki id generate ho rahe hai
        loginEmail: user.emailAddresses[0].emailAddress, // is main user ki email arahe hai
        totalAmount, // is main total amount aye gi
        orderDate: `${data_time.getFullYear()}-${(data_time.getMonth()+1).toString().padStart(2, '0')}-${data_time.getDate().toString().padStart(2, '0')} ${data_time.getHours().toString().padStart(2, '0')}:${data_time.getMinutes().toString().padStart(2, '0')}:${data_time.getSeconds().toString().padStart(2, '0')}`, // is main date or time arahe hai sahe format main
        orderStatus: false, // is main order status hai
        addToCartProduct, // is main sary addtocard ky product aye gy
      };

      //  is main mongodp ky andar order ka data ja raha hai
      const push_order_data: ApiResponse = await PustOrderData(orderData);
      //  agar data cahla jaye ga to ye chaly ga
      if (push_order_data.success) {
        setProcessing(false)
        setIsOrderPlaced(true);
        setTimeout(() => setIsOrderPlaced(false), 5000);
        await DeleteAddToCard(user.emailAddresses[0].emailAddress); // jo mongodp ky andar addtocard main jo data hai user ki email ky zayeye data remove hogaye ga mongodp main dy
        reset(); // from MT ho jaye ga
        router.push("/")
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setIsOrderPlaced(false);
      // Handle error (show toast, etc.)
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FiShoppingCart className="mr-2" />
        Order Information
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 text-gray-600"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiUser className="mr-2" />
              Full Name
            </label>
            <input
              {...register("name")}
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiMail className="mr-2" />
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiPhone className="mr-2" />
              Phone Number
            </label>
            <input
              {...register("phone")}
              type="tel"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="+1234567890"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Address Field */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiMapPin className="mr-2" />
              Delivery Address
            </label>
            <textarea
              {...register("address")}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Street, City, Postal Code"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">
                {errors.address.message}
              </p>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Payment Method
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["Cash on Delivery"].map((method) => (
              <div key={method} className="flex items-center ">
                <input
                  {...register("paymentMethod")}
                  type="radio"
                  id={method}
                  value={method}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 cursor-pointer "
                />
                <label
                  htmlFor={method}
                  className="ml-2 block text-sm text-gray-700 "
                >
                  {method}
                </label>
              </div>
            ))}
          </div>
          {errors.paymentMethod && (
            <p className="mt-1 text-sm text-red-600">
              {errors.paymentMethod.message}
            </p>
          )}
        </div>

        {/* Delivery Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Instructions (Optional)
          </label>
          <textarea
            {...register("deliveryNotes")}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Gate code, floor, etc."
          />
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg text-gray-500">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Order Summary
          </h3>
          <div className="space-y-2">
            {addToCartProduct.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span>
                  Rs. {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>Rs. {totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-md cursor-pointer"
        >
          {/* jab user is buttom par click karry ga to  processing true hogaye gi phir load hoye gi*/}
            {processing? <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-white mx-auto"></div> : "Place Order"}
        </button>
      </form>

      {/* user jab place order par click karry ga to or order submit hogaya to ye chaly ga */}
      {isOrderPlaced && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3"
        >
          <FiCheckCircle className="text-xl" />
          <div>
            <h3 className="font-bold">Order Placed!</h3>
            <p className="text-sm">Your order has been received</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderForm;
