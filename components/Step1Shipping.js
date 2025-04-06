"use client";

import { useState } from "react";

export default function Step1Shipping({ data, onNext }) {
  const [form, setForm] = useState(data || { name: "", address: "", city: "" });

  return (
    <div className="space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="border p-2 w-full"
        placeholder="Address"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />
      <input
        className="border p-2 w-full"
        placeholder="City"
        value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
      />
      <button
        onClick={() => onNext(form)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Next
      </button>
    </div>
  );
}
