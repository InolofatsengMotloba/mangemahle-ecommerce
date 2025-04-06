"use client";

import CheckoutForm from "@/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <CheckoutForm />
    </main>
  );
}
