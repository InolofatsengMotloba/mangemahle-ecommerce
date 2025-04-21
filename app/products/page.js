"use client";

import { useState, useEffect, useContext, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CartContext } from "@/contexts/CartContext";
import { SingleImageGallery } from "@/components/ImageGallery";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";

// Create a client component that uses useSearchParams inside Suspense
function ProductsContent() {
  const searchParams = useSearchParams();
  const { addToCart } = useContext(CartContext);

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

  const loadProducts = async (
    pageNum = 1,
    search = "",
    sort = "",
    category = ""
  ) => {
    setLoading(true);
    try {
      let url = `/api/products?${
        search ? `search=${search}` : `page=${pageNum}`
      }`;

      if (!search && lastVisible && pageNum !== 1) {
        url += `&lastVisibleId=${lastVisible}`;
      }

      if (sort) url += `&sort=${sort}`;
      if (category) url += `&category=${category}`;

      const res = await fetch(url);
      const data = await res.json();

      if (search || category || pageNum === 1) {
        setProducts(data.products);
        setLastVisible(data.lastVisibleId || null);
        setPage(1);
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

  useEffect(() => {
    loadProducts(1, initialSearch, initialSort, initialCategory);
  }, [initialSearch, initialSort, initialCategory]); // Fixed the dependency array

  const handleSearchSort = ({ search, sort, category }) => {
    setSearchQuery(search);
    setSortOption(sort);
    setCategoryFilter(category);
    loadProducts(1, search, sort, category);
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
      loadProducts(nextPage, searchQuery, sortOption, categoryFilter);
    }
  };

  return (
    <div className="bg-white max-w-[90rem] mx-auto p-8 pb-12 gap-8 sm:p-12">
      <SearchBar
        onSearchSort={handleSearchSort}
        initialSearch={searchQuery}
        initialSort={sortOption}
        initialCategory={categoryFilter}
      />

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 pt-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            isAdding={addingToCart === product.id}
          />
        ))}
      </div>

      {loading && <p className="text-center my-4">Loading...</p>}

      {lastVisible && !loading && !searchQuery && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-[#2d7942] text-white rounded-full hover:bg-[#26442e]"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

// Loading fallback to use within the Suspense boundary
function ProductsLoading() {
  return (
    <div className="bg-white max-w-[90rem] mx-auto p-8 pb-12 gap-8 sm:p-12">
      <div className="flex justify-center items-center h-40">
        <p className="text-xl font-medium">Loading products...</p>
      </div>
    </div>
  );
}

// Main Products component with Suspense boundary
const Products = () => {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
};

export default Products;
