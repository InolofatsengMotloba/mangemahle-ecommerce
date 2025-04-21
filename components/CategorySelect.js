"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaFilter } from "react-icons/fa";

const CategorySelect = () => {
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const selectedCategory = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative flex items-center space-x-2 w-full">
      <FaFilter className="text-[#94bb9f]" />
      <select
        value={currentCategory}
        onChange={handleChange}
        className="w-full md:w-52 px-4 py-2 bg-white text-sm text-gray-600 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2d7942] transition-all duration-300 shadow-sm"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;
