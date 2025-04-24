"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiShoppingBag, FiLogIn } from "react-icons/fi";
import RecommendedProducts from "@/components/RecommendedProducts";
import MothersDayBanner from "@/components/Promotional Banners/MothersDay";
import FathersDayBanner from "@/components/Promotional Banners/FathersDay";
import PopularProducts from "@/components/PopularProducts";

export default function Home() {
  const currentMonth = new Date().getMonth() + 1; // 1-12

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section - Updated with white background */}
      <div className="relative flex flex-col items-center justify-center text-gray-900 p-8 sm:p-12 min-h-[80vh] bg-white">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/whitegreen.jpg"
            alt="Mangemahle Backdrop"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Text content */}
        <motion.div
          className="relative z-10 text-center max-w-4xl px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-700"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Welcome to Mangemahle
          </motion.h1>

          <motion.p
            className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Empowering Africa through innovation and technology. Mangemahle
            Trading is a proudly South African, women-owned ICT company
            pioneering smart retail experiences and digital transformation.
            Discover a smarter way to shop — online and in-store — with
            real-time product location, seamless checkout, and AI-powered
            assistance.
          </motion.p>

          {/* Buttons - Reduced base size */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products">
              <motion.button
                className="flex items-center gap-2 bg-[#94bb9f] hover:bg-[#385941] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiShoppingBag size={16} />
                <span>Browse Products</span>
              </motion.button>
            </Link>

            <Link href="/signin">
              <motion.button
                className="flex items-center gap-2 border-2 border-[#94bb9f] text-[#385941] hover:bg-gray-50 px-5 py-2.5 rounded-full text-xs sm:text-sm transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiLogIn size={16} />
                <span>Login to Start Shopping</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Recommended Products Section */}
      <div className="bg-white">
        <RecommendedProducts />
      </div>

      {/* Show Mother's Day banner in April-May */}
      {(currentMonth === 4 || currentMonth === 5) && <MothersDayBanner />}

      {/* Popular Products Section */}
      <div className="bg-white">
        <PopularProducts />
      </div>

      {/* Show Father's Day banner in May-June */}
      {(currentMonth === 4 || currentMonth === 5) && <FathersDayBanner />}
    </div>
  );
}
