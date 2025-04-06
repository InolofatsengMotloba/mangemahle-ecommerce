"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { CartContext } from "@/contexts/CartContext";
import { SingleImageGallery } from "@/components/ImageGallery";
import SearchBar from "@/components/SearchBar";

const Products = () => {
  const { addToCart, loading: cartLoading } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [addingToCart, setAddingToCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadProducts = async (pageNum = 1, search = "") => {
    setLoading(true);
    try {
      let url = `/api/products?${
        search ? `search=${search}` : `page=${pageNum}`
      }`;
      if (!search && lastVisible) {
        url += `&lastVisibleId=${lastVisible}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (search) {
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
    if (!searchQuery) {
      loadProducts(page);
    }
  }, [page, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    loadProducts(1, query);
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
    <div className="container p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <SearchBar onSearch={handleSearch} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="card p-4 border rounded shadow">
            <SingleImageGallery alt={product.name} images={product.images} />
            <h2 className="text-lg font-bold">{product.title}</h2>
            <p className="text-sm mb-2 line-clamp-2">{product.description}</p>
            <p className="text-lg font-semibold">
              ${parseFloat(product.price).toFixed(2)}
            </p>
            <div className="mt-4 flex flex-col space-y-2">
              <button
                onClick={() => handleAddToCart(product)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                disabled={addingToCart === product.id || cartLoading}
              >
                {addingToCart === product.id ? "Adding..." : "Add to Cart"}
              </button>
              <Link
                href={`/products/${product.id}`}
                className="px-4 py-2 text-center border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="text-center my-4">Loading...</p>}

      {lastVisible && !loading && !searchQuery && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
