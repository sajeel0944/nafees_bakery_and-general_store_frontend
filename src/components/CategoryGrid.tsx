"use client"

// is ko meny home page main dia hai

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    name: 'Bakery',
    description: 'Fresh bread, pastries, and cakes',
    image: '/picture/bakary.png',
    href: 'bakery',
    bgColor: 'bg-amber-100',
  },
  {
    name: 'Dairy',
    description: 'Milk, cheese, and eggs',
    image: '/picture/dairy.png',
    href: '/dairy',
    bgColor: 'bg-blue-100',
  },
  {
    name: 'Snacks',
    description: 'Chips, cookies, and more',
    image: '/picture/snack.png',
    href: '/snacks',
    bgColor: 'bg-red-100',
  },
];

function CategoryGrid() {
  return (
    <section id="select category" className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, index) => (
        <motion.div
          key={category.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`${category.bgColor} rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}
        >
          <Link href={category.href} className="block">
            <div className="relative h-56">
              <Image
                className="w-full h-full object-cover"
                src={category.image}
                alt={category.name}
                width={400}
                height={400}
              />
              <div className="absolute inset-0  bg-opacity-20 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-green-800">{category.name}</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-700">{category.description}</p>
              <div className="mt-2 flex items-center text-green-600">
                <span>Shop now</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </section>
  );
}


export default CategoryGrid