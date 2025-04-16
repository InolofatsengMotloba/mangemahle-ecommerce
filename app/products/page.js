"use client";

import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CartContext } from "@/contexts/CartContext";
import { SingleImageGallery } from "@/components/ImageGallery";
import SearchBar from "@/components/SearchBar";

const Products = () => {
  const searchParams = useSearchParams();
  const { addToCart, loading: cartLoading } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [addingToCart, setAddingToCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    // Check for category in URL on initial load
    const urlCategory = searchParams.get("category");
    if (urlCategory) {
      setCategoryFilter(urlCategory);
      loadProducts(1, "", "", urlCategory);
    } else if (!searchQuery && !categoryFilter) {
      loadProducts(page, "", sortOption, "");
    }
  }, [page, searchQuery, sortOption, categoryFilter, searchParams]);

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
      if (!search && lastVisible) url += `&lastVisibleId=${lastVisible}`;
      if (sort) url += `&sort=${sort}`;
      if (category) url += `&category=${category}`;

      const res = await fetch(url);
      const data = await res.json();

      if (search || category) {
        setProducts(data.products);
        setLastVisible(null);
        setPage(1);
      } else {
        setProducts((prev) =>
          pageNum === 1 ? data.products : [...prev, ...data.products]
        );
        setLastVisible(data.lastVisibleId);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery && !categoryFilter) {
      loadProducts(page, "", sortOption, "");
    }
  }, [page, searchQuery, sortOption, categoryFilter]);

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
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="bg-white max-w-[90rem] mx-auto p-8 pb-12 gap-8 sm:p-12">
      <SearchBar onSearchSort={handleSearchSort} />

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 pt-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col max-h-[100rem] border border-gray-200 shadow-md bg-white rounded-3xl overflow-hidden hover:shadow-lg hover:scale-105 transition duration-500 relative"
          >
            {/* Product Image */}
            <SingleImageGallery alt={product.name} images={product.images} />

            {/* Product Details */}
            <div className="flex-1 flex flex-col pt-6 px-6">
              <div className="flex-1">
                <header className="mb-2 flex-2">
                  <h2 className="text-lg line-clamp-2 font-extrabold leading-snug text-gray-700">
                    {product.title}
                  </h2>
                </header>
              </div>

              <div className="flex-1">
                <header className="mb-2 flex-2">
                  <p className="text-sm line-clamp-2 leading-snug text-gray-400">
                    {product.description}
                  </p>
                </header>
              </div>

              <div className="flex items-center justify-between mt-1">
                <span className="inline-flex items-center rounded-sm px-2 py-1 text-xs border-2 font-bold border-black bg-white text-black ring-1 ring-inset ring-blue-700/10">
                  {product.category}
                </span>

                <p className="text-base font-bold text-[#2d7942] leading-snug">
                  ${parseFloat(product.price).toFixed(2)}
                </p>
              </div>

              <Link
                href={`/products/${product.id}`}
                prefetch={false}
                className="flex text-black justify-center mt-3 bg-white px-3 py-2 text-sm font-semibold hover:text-[#2d7942]"
              >
                <span>View Details →</span>
              </Link>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => handleAddToCart(product)}
                disabled={addingToCart === product.id}
                className={`w-full flex items-center justify-center gap-2 rounded-2xl border border-[#2d7942] px-4 py-2 text-sm font-semibold transition-colors ${
                  addingToCart === product.id
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#2d7942] text-white hover:bg-[#26442e]"
                }`}
              >
                {addingToCart === product.id ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
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
};

export default Products;
