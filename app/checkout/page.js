"use client";

import CheckoutForm from "@/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-[#385941]">Checkout</h1>
        <div className="w-16 h-1 bg-[#94bb9f] ml-4"></div>
      </div>
      <CheckoutForm />
    </div>
  );
}
