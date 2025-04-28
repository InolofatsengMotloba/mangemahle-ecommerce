"use client";

import { useState, useEffect, useContext, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CartContext } from "@/contexts/CartContext";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { addToCart } = useContext(CartContext);

  // Initialize state from URL parameters
  const initialSearch = searchParams.get("search") || "";
  const initialSort = searchParams.get("sort") || "";
  const initialCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortOption, setSortOption] = useState(initialSort);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [addingToCart, setAddingToCart] = useState(null);
  const [loading, setLoading] = useState(false);

  // Update URL when filters change
  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (sortOption) params.set("sort", sortOption);
    if (categoryFilter) params.set("category", categoryFilter);

    // Reset to first page when filters change
    setPage(1);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const loadProducts = async (
    pageNum = 1,
    search = searchQuery,
    sort = sortOption,
    category = categoryFilter
  ) => {
    setLoading(true);
    try {
      let url = `/api/products?${
        search ? `search=${encodeURIComponent(search)}` : `page=${pageNum}`
      }`;

      if (!search && lastVisible && pageNum !== 1) {
        url += `&lastVisibleId=${lastVisible}`;
      }

      if (sort) url += `&sort=${sort}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (search || category || pageNum === 1) {
        setProducts(data.products);
        setLastVisible(data.lastVisibleId || null);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
        setLastVisible(data.lastVisibleId || null);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load products when component mounts or filters change
  useEffect(() => {
    loadProducts();
  }, []); // Initial load

  // Sync state with URL changes (back/forward navigation)
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "";
    const category = searchParams.get("category") || "";

    if (
      search !== searchQuery ||
      sort !== sortOption ||
      category !== categoryFilter
    ) {
      setSearchQuery(search);
      setSortOption(sort);
      setCategoryFilter(category);
      loadProducts(1, search, sort, category);
    }
  }, [searchParams]);

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    switch (type) {
      case "search":
        setSearchQuery(value);
        break;
      case "sort":
        setSortOption(value);
        break;
      case "category":
        setCategoryFilter(value);
        break;
    }
    updateURL();
    loadProducts(
      1,
      type === "search" ? value : searchQuery,
      type === "sort" ? value : sortOption,
      type === "category" ? value : categoryFilter
    );
  };

  const handleAddToCart = async (product) => {
    setAddingToCart(product.id);
    try {
      await addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image || null,
        quantity: 1,
      });
      alert("Item added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add item to cart.");
    } finally {
      setAddingToCart(null);
    }
  };

  const handleLoadMore = () => {
    if (lastVisible) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(nextPage);
    }
  };

  return (
    <div className="bg-white max-w-[90rem] mx-auto p-8 pb-12 gap-8 sm:p-12">
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={(value) => handleFilterChange("search", value)}
        sortOption={sortOption}
        setSortOption={(value) => handleFilterChange("sort", value)}
        categoryFilter={categoryFilter}
        setCategoryFilter={(value) => handleFilterChange("category", value)}
      />

      {/* Product Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 pt-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            isAdding={addingToCart === product.id}
            className="max-h-[200px]"
          />
        ))}
      </div>

      {loading && (
        <div className="max-w-5xl mx-auto p-6 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#94bb9f]"></div>
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="max-w-5xl mx-auto mt-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-red-500">
            No products found matching your filters.
          </p>
        </div>
      )}

      {lastVisible && !loading && !searchQuery && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-[#94bb9f] text-white rounded-full hover:bg-[#385941]"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

function ProductsLoading() {
  return (
    <div className="max-w-5xl mx-auto p-6 flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#94bb9f]"></div>
    </div>
  );
}

const Products = () => {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
};

export default Products;
