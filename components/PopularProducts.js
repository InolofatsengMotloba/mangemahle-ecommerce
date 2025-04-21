"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";

export default function PopularProducts() {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const res = await fetch("/api/products?sort=rating_desc&limit=4");
        const data = await res.json();
        setPopularProducts(data.products);
      } catch (error) {
        console.error("Error fetching popular products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  const handleAddToCart = async (product) => {
    setAddingToCart(product.id);
    try {
      await addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] || null,
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

  if (loading)
    return (
      <div className="max-w-5xl mx-auto p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#94bb9f]"></div>
      </div>
    );

  return (
    <section className="bg-white py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700">
            Popular Products
          </h2>
          <Link
            href="/products"
            className="text-[#94bb9f] hover:text-[#385941] font-semibold flex items-center gap-1"
          >
            View All Products
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              isAdding={addingToCart === product.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
