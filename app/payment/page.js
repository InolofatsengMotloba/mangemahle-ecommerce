"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/contexts/CartContext";

export default function PaymentPage() {
  const { cart, clearCart, calculateTotal } = useContext(CartContext);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
  });
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const handleInput = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate API call
    setTimeout(async () => {
      await clearCart();
      setProcessing(false);
      router.push("/thank-you");
    }, 2000);
  };

  // Security: Warn user if they try to leave payment page
  useEffect(() => {
    const beforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "Are you sure you want to leave without completing payment?";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, []);

  return (
    <main className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg mt-8">
      <h1 className="text-2xl font-bold mb-4">Enter Card Details</h1>

      <div className="space-y-4">
        <input
          type="text"
          name="number"
          placeholder="Card Number"
          value={cardDetails.number}
          onChange={handleInput}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="expiry"
          placeholder="MM/YY"
          value={cardDetails.expiry}
          onChange={handleInput}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="cvc"
          placeholder="CVC"
          value={cardDetails.cvc}
          onChange={handleInput}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {processing ? "Processing Payment..." : "Pay Now"}
        </button>
      </div>
    </main>
  );
}
