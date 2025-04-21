"use client";

import { FaSortAmountDown } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";

const SortSelect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "";

  const handleChange = (e) => {
    const selectedSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (selectedSort) {
      params.set("sort", selectedSort);
    } else {
      params.delete("sort");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative flex items-center space-x-2 w-full">
      <FaSortAmountDown className="text-[#94bb9f]" />
      <select
        value={currentSort}
        onChange={handleChange}
        className="w-full md:w-52 px-4 py-2 bg-white text-sm text-gray-600 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2d7942] transition-all duration-300 shadow-sm"
      >
        <option value="">Sort: Default</option>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>
    </div>
  );
};

export default SortSelect;
