"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function MothersDayBanner() {
  // Define all relevant categories for Father's Day
  const mothersDayCategories = [
    "fragrances",
    "womens-bags",
    "beauty",
    "kitchen-accessories",
    "womens-shoes",
    "womens-dresses",
    "womens-watches",
    "womens-jewellery",
  ].join(",");

  return (
    <section className="relative bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl overflow-hidden my-8 mx-4 sm:mx-8">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 z-10 mb-6 md:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-800 mb-4">
                Mother&apos;s Day Special
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Celebrate the amazing women in your life with our curated
                collection of thoughtful gifts. Get 15% off selected items!
              </p>
              <Link
                href={`/products?category=${mothersDayCategories}`}
                className="inline-flex items-center px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-full transition duration-300"
              >
                Shop Now
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
          <div className="md:w-1/2 relative h-64 md:h-80">
            <Image
              src="/mothersday.png" // Replace with your image path
              alt="Mother's Day Gift Ideas"
              fill
              className="object-contain object-center"
              priority
            />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-300 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-300 rounded-full opacity-20 transform -translate-x-20 translate-y-20"></div>
      </div>
    </section>
  );
}
