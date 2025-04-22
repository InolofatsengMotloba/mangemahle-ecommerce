"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#94bb9f]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white max-w-[90rem] mx-auto p-8 pb-12 gap-8 sm:p-12">
      {/* Hero Header */}
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#385941] mb-4">
          Shop by Category
        </h1>
        <div className="w-24 h-1 bg-[#94bb9f] mx-auto"></div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/products?category=${encodeURIComponent(category)}`}
            className="group block"
          >
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              {/* Replace with your actual category images */}
              <Image
                src={`/categories/${category.toLowerCase()}.png`}
                alt={category}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-2 text-lg font-medium text-center text-gray-900 group-hover:text-[#2d7942]">
              {category}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
