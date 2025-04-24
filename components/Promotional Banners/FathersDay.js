"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function FathersDayBanner() {
  const fathersDayCategories = [
    "electronics",
    "mens-shirts",
    "mens-shoes",
    "mens-watches",
    "motorcycle",
    "vehicle",
  ].join(",");

  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-cyan-100 rounded-2xl overflow-hidden my-8 mx-4 sm:mx-8">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row-reverse items-center gap-6">
          {/* Content container */}
          <div className="w-full md:w-1/2 z-10">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mb-3 sm:mb-4">
                Father&apos;s Day Deals
              </h2>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
                Show Dad how much you care with our exclusive collection of
                tech, apparel, and accessories. Limited time offers available!
              </p>
              <div className="flex flex-row sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/products?category=laptops"
                  className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition duration-300 text-sm sm:text-base"
                >
                  Tech Gifts
                </Link>
                <Link
                  href={`/products?category=${fathersDayCategories}`}
                  className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-full transition duration-300 text-sm sm:text-base"
                >
                  View All
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Image container - now visible on all screens */}
          <div className="w-full md:w-1/2 relative h-48 sm:h-56 md:h-64 lg:h-80">
            <Image
              src="/fathersday.png"
              alt="Father's Day Gift Ideas"
              fill
              className="object-contain object-center"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300 rounded-full opacity-20 transform -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-300 rounded-full opacity-20 transform translate-x-20 translate-y-20"></div>
      </div>
    </section>
  );
}
