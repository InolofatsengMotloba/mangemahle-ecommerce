"use client";

import Link from "next/link";
import { useState } from "react";
import { SingleImageGallery } from "@/components/ImageGallery";
import { FiPlus, FiShoppingCart, FiHeart } from "react-icons/fi";

export default function ProductCard({ product, onAddToCart, isAdding }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative flex flex-col border border-gray-200 shadow-sm hover:shadow-md bg-white rounded-2xl overflow-hidden transition-transform duration-300 transform hover:scale-[1.02] w-[280px]">
      {/* Add Icon */}
      <button
        onClick={() => setShowModal(true)}
        className="absolute top-3 right-3 bg-[#94bb9f] hover:bg-[#385941] text-white p-2 rounded-full shadow-md z-10 transition-colors"
        title="Add"
      >
        <FiPlus size={16} />
      </button>

      {/* Product Image */}
      <SingleImageGallery alt={product.name} images={product.images} />

      {/* Product Details */}
      <div className="flex-1 flex flex-col p-4">
        <h2 className="text-base font-semibold text-gray-700 line-clamp-2 mb-1">
          {product.title}
        </h2>
        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs font-medium border border-gray-300 px-2 py-0.5 rounded-full text-gray-600">
            {product.category}
          </span>
          <p className="text-base font-bold text-[#94bb9f]">
            ${parseFloat(product.price).toFixed(2)}
          </p>
        </div>

        <Link
          href={`/products/${product.id}`}
          prefetch={false}
          className="mt-3 text-sm text-[#94bb9f] hover:text-[#385941] text-center"
        >
          View Details →
        </Link>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              What would you like to do?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2d7942] text-white hover:bg-[#1d5931] transition"
                onClick={() => {
                  onAddToCart(product);
                  setShowModal(false);
                }}
              >
                <FiShoppingCart size={16} />
                Add to Cart
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                onClick={() => {
                  setShowModal(false);
                  // Placeholder for wishlist function
                  alert("Wishlist feature coming soon!");
                }}
              >
                <FiHeart size={16} />
                Wishlist
              </button>
            </div>
            <button
              className="mt-4 text-sm text-gray-400 hover:underline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
