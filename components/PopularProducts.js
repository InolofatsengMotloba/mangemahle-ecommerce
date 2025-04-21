"use client";

import Link from "next/link";

export default function PopularProducts() {
  return (
    <section className="bg-white py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Popular Products
          </h2>
          <Link
            href="/products"
            className="text-[#2d7942] hover:text-[#26442e] font-semibold flex items-center gap-1"
          >
            View All Products
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
