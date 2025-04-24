"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function MothersDayBanner() {
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
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Content container */}
          <div className="w-full md:w-1/2 z-10 md:ml-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-800 mb-3 sm:mb-4">
                Mother&apos;s Day Special
              </h2>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
                Celebrate the amazing women in your life with our curated
                collection of thoughtful gifts. Get 15% off selected items!
              </p>
              <Link
                href={`/products?category=${mothersDayCategories}`}
                className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-full transition duration-300 text-sm sm:text-base"
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

          {/* Image container - now visible on all screens */}
          <div className="w-full md:w-1/2 relative h-48 sm:h-56 md:h-64 lg:h-80">
            <Image
              src="/mothersday.png"
              alt="Mother's Day Gift Ideas"
              fill
              className="object-contain object-center"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-300 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-300 rounded-full opacity-20 transform -translate-x-20 translate-y-20"></div>
      </div>
    </section>
  );
}
