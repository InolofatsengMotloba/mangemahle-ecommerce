"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import CategorySelect from "./CategorySelect";
import SortSelect from "./SortSelect";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  categoryFilter,
  setCategoryFilter,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (type, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }

    // Remove page parameter when filters change
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form className="bg-white flex flex-col md:flex-row justify-between mb-4 gap-4">
      {/* Filter and Sort */}
      <div className="flex flex-col md:flex-row gap-4 justify-between w-full md:w-auto">
        <div className="w-full md:w-auto">
          <CategorySelect
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              handleFilterChange("category", e.target.value);
            }}
          />
        </div>
        <div className="w-full md:w-auto">
          <SortSelect
            sort={sortOption}
            setSort={(value) => {
              setSortOption(value);
              handleFilterChange("sort", value);
            }}
          />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
