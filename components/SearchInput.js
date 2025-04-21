"use client";

import { FaSearch } from "react-icons/fa";

const SearchInput = ({ query, setQuery }) => {
  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search Products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pr-10 pl-5 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#94bb9f] transition-all duration-300"
        />
        <button
          type="submit"
          className="absolute top-1/2 -translate-y-1/2 right-2 p-2 bg-[#94bb9f] hover:bg-[#385941] text-white rounded-full transition-colors duration-300"
        >
          <FaSearch size={14} />
        </button>
      </div>
    </div>
  );
};

export default SearchInput;
