"use client";

import { useCart } from "@/contexts/CartContext";
import { AiOutlineShoppingCart } from "react-icons/ai";

export default function CartIcon({ size = 24, className = "" }) {
  const { cart, loading } = useCart();

  if (loading) {
    return <div className="ml-4">Loading...</div>;
  }

  const itemCount =
    cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <div className={`relative ${className}`}>
      <AiOutlineShoppingCart size={size} />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center leading-none">
          {itemCount}
        </span>
      )}
    </div>
  );
}
