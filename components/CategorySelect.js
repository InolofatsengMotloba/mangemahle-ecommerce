"use client";

import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";

const CategorySelect = ({ category, setCategory }) => {
  const [categories, setCategories] = useState([]);

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

  return (
    <div className="relative flex items-center space-x-2">
      <FaFilter className="text-[#2d7942]" />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-52 px-4 py-2 bg-white text-black rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2d7942] transition-all duration-300"
      >
        <option
          value=""
          className="px-4 py-2 text-gray-700 hover:bg-[#2d7942] hover:text-white transition-colors duration-300 rounded-md"
        >
          All Categories
        </option>
        {categories.map((cat) => (
          <option
            key={cat}
            value={cat}
            className="px-4 py-2 text-gray-700 hover:bg-[#2d7942] hover:text-white transition-colors duration-300 rounded-md"
          >
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;
