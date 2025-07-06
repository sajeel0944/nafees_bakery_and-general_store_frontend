"use client"

// is ko meny home page main dia hai

import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    quote: "The bread here is always fresh and delicious. I come every morning for my daily baguette!",
    author: "Sarah Johnson",
    role: "Regular Customer",
  },
  {
    id: 2,
    quote: "Best general store in the neighborhood. They have everything I need at reasonable prices.",
    author: "Michael Chen",
    role: "Local Resident",
  },
  {
    id: 3,
    quote: "Their chocolate croissants are to die for! My kids love their after-school treats from FreshMart.",
    author: "Emma Rodriguez",
    role: "Parent",
  },
];

function Testimonials() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-12 bg-green-100 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">What Our Customers Say</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="mb-4">
                <svg className="h-8 w-8 text-green-400" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4 italic">{testimonial.quote}</p>
              <div className="text-gray-800 font-medium">{testimonial.author}</div>
              <div className="text-gray-500 text-sm">{testimonial.role}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default Testimonials