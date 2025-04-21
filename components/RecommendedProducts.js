"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { useCart } from "@/contexts/CartContext";

export default function RecommendedProducts() {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const res = await fetch("/api/products?limit=8");
        const data = await res.json();

        // Shuffle the products array to get random ones
        const shuffled = [...data.products].sort(() => 0.5 - Math.random());
        setRecommendedProducts(shuffled.slice(0, 4)); // Get 4 random products
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
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

  if (loading) return <div className="py-12 text-center">Loading...</div>;

  return (
    <section className="bg-white py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700">
            Recommended Products
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
          {recommendedProducts.map((product) => (
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
