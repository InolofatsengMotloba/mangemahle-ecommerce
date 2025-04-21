"use client";

import { FaSearch } from "react-icons/fa";

const SearchInput = ({ query, setQuery }) => {
  return (
    <div className="flex">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-4 py-2 pl-6 text-gray-500 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2d7942] transition-all duration-300"
        />
        <button
          type="submit"
          className="absolute right-0 p-3 bg-[#2d7942] rounded-full text-white  shadow-lg hover:bg-[#1d5931] transition-colors duration-300"
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchInput;
