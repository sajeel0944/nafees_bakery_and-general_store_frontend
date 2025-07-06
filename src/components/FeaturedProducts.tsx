"use client"

// is ko home page main dia hai

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const products = [
  {
    id: 1,
    name: 'Cake Rusk',
    category: 'Bakery',
    price: 'Rs. 300',
    image: '/picture/Cake Rusk.png',
    isNew: true,
  },
  {
    id: 2,
    name: 'Currant Round',
    category: 'Bakery',
    price: 'Rs. 430',
    image: '/picture/Currant Round.png',
    isNew: false,
  },
  {
    id: 3,
    name: 'Plain Cake',
    category: 'Bakery',
    price: 'Rs. 250',
    image: '/picture/Plain Cake.png',
    isNew: true,
  },
  {
    id: 4,
    name: 'Single Chocolate',
    category: 'Bakery',
    price: 'Rs. 420',
    image: '/picture/Single Chocolate.png',
    isNew: false,
  },
];

function FeaturedProducts() {
  return (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="group relative"
          id="Bakery Specials"
        >
          <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
            <Image
              src={product.image}
              alt={product.name}
              className="w-full h-full object-center object-cover lg:w-full lg:h-full"
              width={400}
              height={400}
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-sm text-gray-700">
                <Link href="/bakery">
                  <span aria-hidden="true" className="absolute inset-0" />
                  {product.name}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-gray-500">{product.category}</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-sm font-medium text-gray-900">{product.price}</p>
              {product.isNew && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  New
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default FeaturedProducts