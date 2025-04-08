"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/contexts/CartContext";
import { auth } from "@/lib/firebase";

export default function CheckoutForm() {
  const { cart, clearCart } = useContext(CartContext);
  const [user, setUser] = useState(null);
  const [shippingOption, setShippingOption] = useState("standard");
  const [paymentOption, setPaymentOption] = useState("credit");
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    // Setup navigation warning
    const handleBeforeUnload = (e) => {
      const message =
        "Your order has not been completed. If you leave now, your progress will be lost.";
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    // Add event listener for tab/browser closing
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Setup history change detection for back button and other navigations
    const handlePopState = (e) => {
      if (
        confirm(
          "Your order has not been completed. If you leave now, your progress will be lost. Are you sure you want to leave?"
        )
      ) {
        // User confirmed they want to leave
        return;
      } else {
        // User chose to stay - prevent the navigation
        e.preventDefault();
        // Push a dummy state to prevent navigation
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    // Add a history entry to enable back button detection
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    // Cleanup function
    return () => {
      unsubscribe();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = shippingOption === "express" ? 50 : 20;
  const grandTotal = total + shippingCost;

  // Safe navigation to payment page
  const handlePayments = () => {
    // Remove the warning for intentional navigation
    window.onbeforeunload = null;
    router.push(`/payment`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {/* User Info */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Your Details</h3>
        <p>
          <strong>Name:</strong> {user?.displayName || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
      </div>

      {/* Order Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
        <ul>
          {cart.map((item) => (
            <li key={item.productId} className="flex justify-between mb-1">
              <span>
                {item.title} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Shipping Options */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Shipping</h3>
        <label className="block mb-2">
          <input
            type="radio"
            value="standard"
            checked={shippingOption === "standard"}
            onChange={(e) => setShippingOption(e.target.value)}
            className="mr-2"
          />
          Standard ($20)
        </label>
        <label>
          <input
            type="radio"
            value="express"
            checked={shippingOption === "express"}
            onChange={(e) => setShippingOption(e.target.value)}
            className="mr-2"
          />
          Express ($50)
        </label>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Payment</h3>
        <label className="block mb-2">
          <input
            type="radio"
            value="credit"
            checked={paymentOption === "credit"}
            onChange={(e) => setPaymentOption(e.target.value)}
            className="mr-2"
          />
          Credit Card
        </label>
        <label>
          <input
            type="radio"
            value="paypal"
            checked={paymentOption === "paypal"}
            onChange={(e) => setPaymentOption(e.target.value)}
            className="mr-2"
          />
          PayPal
        </label>
      </div>

      {/* Totals */}
      <div className="mb-6 border-t pt-4">
        <p className="flex justify-between">
          <span>Subtotal:</span>
          <span>${total.toFixed(2)}</span>
        </p>
        <p className="flex justify-between">
          <span>Shipping:</span>
          <span>${shippingCost.toFixed(2)}</span>
        </p>
        <p className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>${grandTotal.toFixed(2)}</span>
        </p>
      </div>

      {/* Submit */}
      <div className="text-right">
        <button
          onClick={handlePayments}
          disabled={processing}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {processing ? "Processing..." : "Continue to Payment"}
        </button>
      </div>
    </div>
  );
}
