"use client";

import Link from "next/link";
import { SingleImageGallery } from "@/components/ImageGallery";

export default function ProductCard({ product, onAddToCart, isAdding }) {
  return (
    <div className="flex flex-col max-h-[100rem] border border-gray-200 shadow-md bg-white rounded-3xl overflow-hidden hover:shadow-lg hover:scale-105 transition duration-500 relative">
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
          onClick={() => onAddToCart(product)}
          disabled={isAdding}
          className={`w-full flex items-center justify-center gap-2 rounded-2xl border border-[#2d7942] px-4 py-2 text-sm font-semibold transition-colors ${
            isAdding
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-[#2d7942] text-white hover:bg-[#26442e]"
          }`}
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
