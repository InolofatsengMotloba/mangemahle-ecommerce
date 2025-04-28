"use client";

import Link from "next/link";
import { useState } from "react";
import { SingleImageGallery } from "@/components/ImageGallery";
import { FiPlus, FiShoppingCart, FiHeart } from "react-icons/fi";

export default function ProductCard({ product, onAddToCart, isAdding }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative flex flex-col border border-gray-200 shadow-sm hover:shadow-md bg-white rounded-2xl overflow-hidden transition-transform duration-300 transform hover:scale-[1.02] w-full sm:max-h-none max-h-[300px]">
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
        <h2 className="text-sm sm:text-base font-semibold text-gray-700 line-clamp-1 md:line-clamp-none md:whitespace-normal mb-1">
          {product.title}
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 mb-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-[11px] sm:text-xs font-medium border border-gray-300 px-2 py-0.5 rounded-full text-gray-600">
            {product.category}
          </span>
          <p className="text-sm sm:text-base font-bold text-[#94bb9f]">
            ${parseFloat(product.price).toFixed(2)}
          </p>
        </div>

        <Link
          href={`/products/${product.id}`}
          prefetch={false}
          className="mt-3 text-xs sm:text-sm text-[#94bb9f] hover:text-[#385941] text-center"
        >
          View Details →
        </Link>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-sm text-center">
            <h3 className="text-base sm:text-lg font-semibold mb-6 text-gray-700">
              What would you like to do?
            </h3>

            <div className="flex flex-col gap-3">
              <button
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#94bb9f] hover:bg-[#385941] text-white transition-colors w-full text-sm sm:text-base"
                onClick={() => {
                  onAddToCart(product);
                  setShowModal(false);
                }}
              >
                <FiShoppingCart size={18} />
                Add to Cart
              </button>

              <button
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors w-full text-sm sm:text-base"
                onClick={() => {
                  setShowModal(false);
                  alert("Wishlist feature coming soon!");
                }}
              >
                <FiHeart size={18} />
                Wishlist
              </button>

              <button
                className="mt-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
