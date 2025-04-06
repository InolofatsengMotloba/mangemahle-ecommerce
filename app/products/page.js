"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { CartContext } from "@/contexts/CartContext";
import { SingleImageGallery } from "@/components/ImageGallery";

const Products = () => {
  const { addToCart, loading: cartLoading } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [addingToCart, setAddingToCart] = useState(null);

  const loadProducts = async (pageNum = 1) => {
    setLoading(true);
    try {
      const url = `/api/products?page=${pageNum}${
        lastVisible ? `&lastVisibleId=${lastVisible}` : ""
      }`;
      const res = await fetch(url);
      const data = await res.json();
      // Only add new products if we're loading a new page
      setProducts((prev) =>
        pageNum === 1 ? data.products : [...prev, ...data.products]
      );
      setLastVisible(data.lastVisibleId);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(page);
  }, [page]);

  const handleLoadMore = () => {
    if (lastVisible) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleAddToCart = async (product) => {
    setAddingToCart(product.id);
    try {

      // Prepare cart item with title instead of name
      await addToCart({
        id: product.id,
        title: product.title, // Use title instead of name
        price: product.price,
        image: product.image || null,
        quantity: 1,
      });
      alert("Item added to cart!");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="container p-6">
      <h1>Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => {

          return (
            <div key={product.id} className="card p-4 border rounded shadow">
              {/* Product Image */}
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
          );
        })}
      </div>

      {loading && <p className="text-center my-4">Loading...</p>}

      {lastVisible && !loading && (
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
