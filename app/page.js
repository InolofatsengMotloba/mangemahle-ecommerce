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
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative flex flex-col items-start justify-center text-white p-4 sm:p-8 h-screen font-[Inter]">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/leaves.jpg"
            alt="Mangemahle Backdrop"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-30"></div>

        {/* Text content */}
        <motion.div
          className="relative z-10 text-left px-4 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 py-4 sm:py-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Welcome to Mangemahle
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8"
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

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link href="/products">
              <button className="flex items-center gap-2 bg-white hover:bg-white/20 text-black border border-black rounded-full px-5 sm:px-6 py-2 sm:py-3 text-sm sm:text-base lg:text-lg transition-all duration-500 ease-in-out backdrop-blur-sm hover:scale-105">
                <FiShoppingBag size={18} />
                <span>Browse Products</span>
              </button>
            </Link>

            <Link href="/signin">
              <button className="flex items-center gap-2 bg-white text-black hover:bg-neutral-100 border border-black rounded-full px-5 sm:px-6 py-2 sm:py-3 text-sm sm:text-base lg:text-lg transition-all duration-500 ease-in-out hover:scale-105">
                <FiLogIn size={18} />
                <span>Login to Start Shopping</span>
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Show Mother's Day banner in April-May */}
      {(currentMonth === 4 || currentMonth === 5) && <MothersDayBanner />}

      {/* Recommended Products Section */}
      <div>
        <RecommendedProducts />
      </div>

      {/* Show Father's Day banner in May-June */}
      {(currentMonth === 4 || currentMonth === 5) && <FathersDayBanner />}

      {/* Popular Products Section */}
      <div>
        <PopularProducts />
      </div>
    </div>
  );
}
