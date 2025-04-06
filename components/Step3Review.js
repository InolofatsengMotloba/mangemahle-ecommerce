"use client";

export default function Step3Review({
  shipping,
  payment,
  cart,
  onBack,
  onSubmit,
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold">Shipping Info:</h3>
        <p>
          {shipping.name}, {shipping.address}, {shipping.city}
        </p>
      </div>
      <div>
        <h3 className="font-bold">Payment Info:</h3>
        <p>Card ending in {payment.cardNumber?.slice(-4)}</p>
      </div>
      <div>
        <h3 className="font-bold">Cart Items:</h3>
        <ul className="list-disc list-inside">
          {cart.map((item) => (
            <li key={item.productId}>
              {item.title} × {item.quantity}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
