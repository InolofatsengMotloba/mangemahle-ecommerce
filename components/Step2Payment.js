"use client";

import { useState } from "react";

export default function Step2Payment({ data, onBack, onNext }) {
  const [form, setForm] = useState(data || { cardNumber: "", expiry: "" });

  return (
    <div className="space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="Card Number"
        value={form.cardNumber}
        onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
      />
      <input
        className="border p-2 w-full"
        placeholder="Expiry"
        value={form.expiry}
        onChange={(e) => setForm({ ...form, expiry: e.target.value })}
      />
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>
        <button
          onClick={() => onNext(form)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
