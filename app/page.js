"use client"

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-start justify-center text-white p-8">
      {/* Static background without parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg.jpg')",
        }}
      ></div>

      {/* Simple overlay for better contrast (kept from original) */}
      <div className="absolute inset-0 bg-black opacity-20"></div>

      {/* Text content with animations */}
      <motion.div
        className="relative z-10 text-left px-4 max-w-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl sm:text-6xl font-bold mb-4 py-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Welcome to HerStore: Your One-Stop Shop for Everything!
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Discover an unbeatable selection of products that cater to all your
          needs. From trendy fashion and tech gadgets to home essentials and
          beauty must-haves, Her Store has it all. Shop with ease, enjoy
          exclusive deals, and experience fast, reliable delivery. Ready to
          elevate your shopping game? Start exploring today!
        </motion.p>

        {/* Button with hover animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/products">
            <button className="relative bg-black text-white py-3 px-6 rounded-lg text-lg font-semibold overflow-hidden group">
              <span className="relative z-10">Shop Now</span>
              <div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
