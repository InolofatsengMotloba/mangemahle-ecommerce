"use client";

import { FaSortAmountDown } from "react-icons/fa";

const SortSelect = ({ sort, setSort }) => {
  return (
    <div className="relative flex items-center space-x-2">
      <FaSortAmountDown className="text-[#2d7942]" />
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="w-52 px-4 py-2 bg-white text-black rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2d7942] transition-all duration-300 overflow-hidden"
      >
        <option
          value=""
          className="px-4 py-2 hover:bg-[#2d7942] hover:text-white transition-colors duration-300 rounded-md"
        >
          Sort: Default
        </option>
        <option
          value="asc"
          className="px-4 py-2 hover:bg-[#2d7942] hover:text-white transition-colors duration-300 rounded-md"
        >
          Price: Low to High
        </option>
        <option
          value="desc"
          className="px-4 py-2 hover:bg-[#2d7942] hover:text-white transition-colors duration-300 rounded-md"
        >
          Price: High to Low
        </option>
      </select>
    </div>
  );
};

export default SortSelect;
