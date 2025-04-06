"use client";

import { useContext, useState } from "react";
import { CartContext } from "@/contexts/CartContext"; // Import the CartContext
import Link from "next/link";

const CartPage = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    loading: cartLoading,
  } = useContext(CartContext); // Get cart state and functions from context
  const [loading, setLoading] = useState(false);
  const [processingItem, setProcessingItem] = useState(null);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setProcessingItem(productId);
    try {
      await updateQuantity(productId, newQuantity); // Update product quantity in cart
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setProcessingItem(null);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    setProcessingItem(productId);
    try {
      await removeFromCart(productId); // Remove product from cart
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

  // Debug cart contents
  console.log("Current cart:", cart);

  if (cartLoading) {
    return <div className="container text-center p-8">Loading cart...</div>;
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container p-8">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <div className="text-center p-8 border rounded-lg">
          <p className="mb-4">Your cart is empty.</p>
          <Link href="/products" className="text-blue-500 hover:underline">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {cart.map((item) => (
          <div
            key={item.productId || item.cartItemId}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center border-b p-4"
          >
            <h2 className="text-lg font-bold">{item.title}</h2>
            <div>${parseFloat(item.price).toFixed(2)}</div>
            <div>
              <div className="flex items-center">
                <button
                  onClick={() =>
                    handleQuantityChange(item.productId, item.quantity - 1)
                  }
                  className="px-2 py-1 bg-gray-200 rounded-l disabled:opacity-50"
                  disabled={
                    item.quantity <= 1 ||
                    processingItem === item.productId ||
                    cartLoading
                  }
                >
                  -
                </button>
                <span className="px-4 py-1 bg-gray-100">{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(item.productId, item.quantity + 1)
                  }
                  className="px-2 py-1 bg-gray-200 rounded-r disabled:opacity-50"
                  disabled={processingItem === item.productId || cartLoading}
                >
                  +
                </button>
              </div>
            </div>
            <div>
              ${((parseFloat(item.price) || 0) * item.quantity).toFixed(2)}
            </div>
            <div>
              <button
                onClick={() => handleRemoveFromCart(item.productId)}
                className="text-red-500 hover:text-red-700 disabled:opacity-50"
                disabled={processingItem === item.productId || cartLoading}
              >
                {processingItem === item.productId ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        ))}

        <div className="p-4 text-right font-bold text-lg">
          Total: ${totalPrice.toFixed(2)}
        </div>

        <div className="p-4 flex justify-between border-t">
          <Link href="/products" className="text-blue-500 hover:underline">
            Continue Shopping
          </Link>
          <button
            onClick={() => alert("Proceeding to checkout")}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
          >
            <Link href="/checkout">Proceed to Checkout</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
