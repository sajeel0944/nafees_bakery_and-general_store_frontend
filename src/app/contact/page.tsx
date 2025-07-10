"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import Image from "next/image";
import ChatBotUI from "@/components/ChatBot";
import { UserComplaint, UserComplaintSchema } from "@/components/BackendApi";
import { useState } from "react";

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactPage() {
  const [processing, setProcessing] = useState<boolean>(false); 
  const [successMessage, setSuccessMessage] = useState({ type: "", text: "" }); // is ky zayeey user ko message show kar waraha ho

  // is main from ka data aye ga
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UserComplaintSchema>({
    resolver: zodResolver(contactSchema),
  });

// from_data ky andar from ka data aye ga
  const onSubmit = async (from_data: UserComplaintSchema) => {
    try {
      setProcessing(true);
      // backend kt andar from ka data ja raha hai
      const send_complaint = await UserComplaint(from_data);
      console.log(send_complaint);
      if (send_complaint.success) {
        // agar success ho jaye to:
        setSuccessMessage({
          type: "success",
          text: "Thank you! Your message has been received. We will get back to you shortly.",
        });
        reset(); // form fields clear karne ke liye
      }
    } catch (error) {
      console.log({ message: "something was wrong", error: error });
      setSuccessMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        {/* Hero Section */}

        {/* Hero Banner */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-96 overflow-hidden"
        >
          <Image
            src="/picture/contant.png"
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
                Contact Us
              </h1>
              <p className="text-xl text-amber-500">We love to hear from you</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Content */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Register Your Complaint
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    {...register("phone_number")}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.phone_number && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone_number.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    {...register("message")}
                    className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium cursor-pointer hover:bg-green-700 transition-colors"
                >
                  {processing ? (
                    <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-white mx-auto"></div>
                  ) : (
                    "Send Message"
                  )}
                </motion.button>
              </form>
              {/* agar from ka data backend main chala gaye ga to is main successfull ka message aye ga wana wroning aye gi */}
              {successMessage.text && (
                <div
                  className={`mt-6 flex items-start space-x-3 rounded-md border px-4 py-3 shadow-md animate-fade-in
                  ${
                    successMessage.type === "success"
                      ? "border-green-300 bg-green-50 text-green-800"
                      : "border-red-300 bg-red-50 text-red-800"
                  }
                `}
                >
                  {successMessage.type === "success" ? (
                    <svg
                      className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}

                  <div className="text-sm">{successMessage.text}</div>
                </div>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-800">
                Our Store Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FiMapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-800">
                      Address
                    </h3>
                    <p className="text-gray-600">
                      Shop No R 561 Sector 15-A3
                      <br />
                      Buffer Zone , Karachi
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FiPhone className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-800">Phone</h3>
                    <p className="text-gray-600">(+92) 311-2047-971</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FiMail className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-800">Email</h3>
                    <p className="text-gray-600">Zohaibshamsi442@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FiClock className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-800">Hours</h3>
                    <p className="text-gray-600">
                      Days : All Day On <br />
                      Time : 7AM To 1AM
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="rounded-lg overflow-hidden shadow-md"
              >
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d261.6959993635737!2d67.06828117266451!3d24.961049290478584!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb341e78bc1511d%3A0x5127752ae6f701c2!2sNafees%20Bakery!5e0!3m2!1sen!2sus!4v1750622105832!5m2!1sen!2sus"
                  ></iframe>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
        {/* ye ai chatbot hai */}
        <ChatBotUI />
      </main>
    </div>
  );
}
