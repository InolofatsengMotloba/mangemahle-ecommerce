// components/PromotionalBanners/FathersDayBanner.js
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function FathersDayBanner() {
  // Define all relevant categories for Father's Day
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
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row-reverse items-center">
          <div className="md:w-1/2 z-10 mb-6 md:mb-0 md:pl-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-800 mb-4">
                Father&apos;s Day Deals
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Show Dad how much you care with our exclusive collection of
                tech, apparel, and accessories. Limited time offers available!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products?category=laptops"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition duration-300"
                >
                  Tech Gifts
                </Link>
                <Link
                  href={`/products?category=${fathersDayCategories}`}
                  className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-full transition duration-300"
                >
                  View All
                </Link>
              </div>
            </motion.div>
          </div>
          <div className="md:w-1/2 relative h-64 md:h-80">
            <Image
              src="/fathersday.png"
              alt="Father's Day Gift Ideas"
              fill
              className="object-contain object-center"
              priority
            />
          </div>
        </div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300 rounded-full opacity-20 transform -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-300 rounded-full opacity-20 transform translate-x-20 translate-y-20"></div>
      </div>
    </section>
  );
}
