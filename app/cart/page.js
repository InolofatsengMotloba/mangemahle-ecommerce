"use client";

import { useContext, useState } from "react";
import { CartContext } from "@/contexts/CartContext";
import Link from "next/link";
import {
  FiShoppingCart,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiArrowLeft,
  FiCreditCard,
  FiRefreshCw,
} from "react-icons/fi";

const CartPage = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    loading: cartLoading,
  } = useContext(CartContext);
  const [processingItem, setProcessingItem] = useState(null);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setProcessingItem(productId);
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setProcessingItem(null);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    setProcessingItem(productId);
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setProcessingItem(null);
    }
  };

  const totalPrice = cart?.reduce(
    (total, item) => total + (parseFloat(item.price) || 0) * item.quantity,
    0
  );

  if (cartLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#94bb9f]"></div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#385941] flex items-center justify-center">
            <FiShoppingCart className="mr-2" /> Your Cart
          </h1>
          <div className="w-16 h-1 bg-[#94bb9f] mx-auto mt-2"></div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-600 mb-6">Your cart is empty.</p>
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 bg-[#94bb9f] text-white rounded-lg hover:bg-[#385941] transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[#385941] flex items-center">
          <FiShoppingCart className="mr-2" /> Your Cart
        </h1>
        <div className="w-16 h-1 bg-[#94bb9f] mt-2"></div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 p-4 border-b text-sm font-medium text-gray-600">
          <div className="col-span-5">Product</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-2 text-center">Quantity</div>
          <div className="col-span-2 text-center">Subtotal</div>
          <div className="col-span-1"></div>
        </div>

        {/* Cart Items */}
        {cart.map((item) => (
          <div
            key={item.productId || item.cartItemId}
            className="grid grid-cols-2 md:grid-cols-12 gap-4 items-center p-4 border-b last:border-b-0"
          >
            {/* Product Name */}
            <div className="col-span-2 md:col-span-5 flex items-center">
              <div className="bg-gray-100 rounded-lg w-16 h-16 mr-3"></div>
              <h2 className="font-medium text-gray-800">{item.title}</h2>
            </div>

            {/* Price */}
            <div className="col-span-1 md:col-span-2 text-center text-gray-600">
              ${parseFloat(item.price).toFixed(2)}
            </div>

            {/* Quantity */}
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center justify-center">
                <button
                  onClick={() =>
                    handleQuantityChange(item.productId, item.quantity - 1)
                  }
                  className={`p-2 rounded-l-lg ${
                    item.quantity <= 1 || processingItem === item.productId
                      ? "bg-gray-100 text-gray-400"
                      : "bg-[#f0f7f2] text-[#385941] hover:bg-[#94bb9f] hover:text-white"
                  } transition-colors`}
                  disabled={
                    item.quantity <= 1 || processingItem === item.productId
                  }
                >
                  <FiMinus size={14} />
                </button>
                <span className="px-4 py-2 bg-gray-50 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    handleQuantityChange(item.productId, item.quantity + 1)
                  }
                  className={`p-2 rounded-r-lg ${
                    processingItem === item.productId
                      ? "bg-gray-100 text-gray-400"
                      : "bg-[#f0f7f2] text-[#385941] hover:bg-[#94bb9f] hover:text-white"
                  } transition-colors`}
                  disabled={processingItem === item.productId}
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            {/* Subtotal */}
            <div className="col-span-1 md:col-span-2 text-center font-medium text-[#385941]">
              ${((parseFloat(item.price) || 0) * item.quantity).toFixed(2)}
            </div>

            {/* Remove */}
            <div className="col-span-1 flex justify-end">
              <button
                onClick={() => handleRemoveFromCart(item.productId)}
                className={`p-2 rounded-full ${
                  processingItem === item.productId
                    ? "text-gray-400"
                    : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                } transition-colors`}
                disabled={processingItem === item.productId}
              >
                {processingItem === item.productId ? (
                  <div className="animate-spin">
                    <FiRefreshCw size={16} />
                  </div>
                ) : (
                  <FiTrash2 size={16} />
                )}
              </button>
            </div>
          </div>
        ))}

        {/* Cart Summary */}
        <div className="p-6 border-t">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <Link
              href="/products"
              className="flex items-center px-4 py-2 text-[#385941] hover:text-[#94bb9f] transition-colors"
            >
              <FiArrowLeft className="mr-2" /> Continue Shopping
            </Link>

            <div className="w-full md:w-auto">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-lg font-bold text-[#385941]">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-[#385941]">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="flex items-center justify-center w-full px-6 py-3 bg-[#94bb9f] text-white rounded-lg hover:bg-[#385941] transition-colors"
              >
                <FiCreditCard className="mr-2" /> Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
