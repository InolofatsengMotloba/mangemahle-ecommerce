"use client";

import { useState } from "react";
import SearchInput from "./SearchInput";
import CategorySelect from "./CategorySelect";
import SortSelect from "./SortSelect";

const SearchBar = ({ onSearchSort }) => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSort({ search: query, sort, category });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white flex flex-col md:flex-row justify-between mb-4 gap-4"
    >
      {/* Search Bar */}
      <div className="w-full md:w-2/3">
        <SearchInput query={query} setQuery={setQuery} />
      </div>

      {/* Filter and Sort */}
      <div className="flex flex-col md:flex-row gap-4 justify-between w-full md:w-auto">
        <div className="w-full md:w-auto">
          <CategorySelect category={category} setCategory={setCategory} />
        </div>
        <div className="w-full md:w-auto">
          <SortSelect sort={sort} setSort={setSort} />
        </div>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-[#2d7942] text-white rounded-full hover:bg-[#26442e]"
      >
        Apply
      </button>
    </form>
  );
};

export default SearchBar;
