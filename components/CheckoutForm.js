"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/contexts/CartContext";
import { auth } from "@/lib/firebase";
import {
  FiArrowLeft,
  FiCreditCard,
  FiTruck,
  FiLock,
  FiUser,
  FiMail,
  FiMapPin,
  FiCheckCircle,
} from "react-icons/fi";
import Link from "next/link";

export default function CheckoutForm() {
  const { cart, clearCart } = useContext(CartContext);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    country: "South Africa",
  });
  const [shippingOption, setShippingOption] = useState("standard");
  const [paymentOption, setPaymentOption] = useState("credit");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      if (authUser) {
        setFormData((prev) => ({
          ...prev,
          email: authUser.email || "",
          firstName: authUser.displayName?.split(" ")[0] || "",
          lastName: authUser.displayName?.split(" ")[1] || "",
        }));
      }
    });

    const handleBeforeUnload = (e) => {
      if (cart.length > 0) {
        e.preventDefault();
        e.returnValue =
          "Your order has not been completed. If you leave now, your progress will be lost.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      unsubscribe();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [cart]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = shippingOption === "express" ? 50 : 20;
  const grandTotal = total + shippingCost;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.postalCode) newErrors.postalCode = "Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setProcessing(true);
      // In a real app, you would process the payment here
      setTimeout(() => {
        clearCart();
        router.push("/checkout/success");
      }, 1500);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="flex justify-center mb-4">
          <FiCheckCircle className="text-[#94bb9f]" size={48} />
        </div>
        <h3 className="text-xl font-semibold text-[#385941] mb-2">
          Your cart is empty
        </h3>
        <p className="text-gray-600 mb-6">
          There are no items in your cart to checkout.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center px-6 py-3 bg-[#94bb9f] text-white rounded-lg hover:bg-[#385941] transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Checkout Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-[#385941] mb-6">
          Shipping Information
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name*
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#94bb9f] focus:border-[#94bb9f] ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name*
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#94bb9f] focus:border-[#94bb9f] ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#94bb9f] focus:border-[#94bb9f] ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number*
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#94bb9f] focus:border-[#94bb9f] ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address*
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#94bb9f] focus:border-[#94bb9f] ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City*
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#94bb9f] focus:border-[#94bb9f] ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Province*
              </label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#94bb9f] focus:border-[#94bb9f] ${
                  errors.province ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Province</option>
                <option value="Eastern Cape">Eastern Cape</option>
                <option value="Free State">Free State</option>
                <option value="Gauteng">Gauteng</option>
                <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                <option value="Limpopo">Limpopo</option>
                <option value="Mpumalanga">Mpumalanga</option>
                <option value="North West">North West</option>
                <option value="Northern Cape">Northern Cape</option>
                <option value="Western Cape">Western Cape</option>
              </select>
              {errors.province && (
                <p className="text-red-500 text-xs mt-1">{errors.province}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code*
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#94bb9f] focus:border-[#94bb9f] ${
                  errors.postalCode ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.postalCode && (
                <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#94bb9f] focus:border-[#94bb9f]"
              disabled
            />
          </div>

          <h2 className="text-xl font-semibold text-[#385941] mb-4">
            Shipping Method
          </h2>
          <div className="space-y-3 mb-6">
            <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#94bb9f] cursor-pointer">
              <input
                type="radio"
                name="shipping"
                value="standard"
                checked={shippingOption === "standard"}
                onChange={() => setShippingOption("standard")}
                className="text-[#94bb9f] focus:ring-[#94bb9f] mr-3"
              />
              <div className="flex-grow">
                <div className="flex justify-between">
                  <span className="font-medium">Standard Shipping</span>
                  <span className="text-[#385941]">R50.00</span>
                </div>
                <p className="text-sm text-gray-500">3-5 business days</p>
              </div>
            </label>
            <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#94bb9f] cursor-pointer">
              <input
                type="radio"
                name="shipping"
                value="express"
                checked={shippingOption === "express"}
                onChange={() => setShippingOption("express")}
                className="text-[#94bb9f] focus:ring-[#94bb9f] mr-3"
              />
              <div className="flex-grow">
                <div className="flex justify-between">
                  <span className="font-medium">Express Shipping</span>
                  <span className="text-[#385941]">R100.00</span>
                </div>
                <p className="text-sm text-gray-500">1-2 business days</p>
              </div>
            </label>
          </div>

          <h2 className="text-xl font-semibold text-[#385941] mb-4">
            Payment Method
          </h2>
          <div className="space-y-3 mb-6">
            <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#94bb9f] cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="credit"
                checked={paymentOption === "credit"}
                onChange={() => setPaymentOption("credit")}
                className="text-[#94bb9f] focus:ring-[#94bb9f] mr-3"
              />
              <div className="flex items-center">
                <FiCreditCard className="text-[#385941] mr-2" />
                <span className="font-medium">Credit/Debit Card</span>
              </div>
            </label>
            <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#94bb9f] cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={paymentOption === "paypal"}
                onChange={() => setPaymentOption("paypal")}
                className="text-[#94bb9f] focus:ring-[#94bb9f] mr-3"
              />
              <div className="flex items-center">
                <img src="/paypal-logo.png" alt="PayPal" className="h-6 mr-2" />
                <span className="font-medium">PayPal</span>
              </div>
            </label>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-6">
            <FiLock className="mr-2 text-[#94bb9f]" />
            <span>
              Your payment information is processed securely. We do not store
              your credit card details.
            </span>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-3 px-6 bg-[#94bb9f] text-white font-medium rounded-lg hover:bg-[#385941] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {processing ? "Processing Order..." : "Complete Order"}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
        <h2 className="text-xl font-semibold text-[#385941] mb-6">
          Order Summary
        </h2>

        <div className="space-y-4 mb-6">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center border-b border-gray-100 pb-4"
            >
              <div className="flex items-center">
                <div className="bg-gray-100 rounded-lg w-16 h-16 mr-4"></div>
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="text-[#385941] font-medium">
                R{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">R{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {shippingOption === "express" ? "R100.00" : "R50.00"}
            </span>
          </div>
        </div>

        <div className="flex justify-between border-t border-gray-200 pt-4 mb-6">
          <span className="font-semibold text-lg text-[#385941]">Total</span>
          <span className="font-bold text-lg text-[#385941]">
            R{grandTotal.toFixed(2)}
          </span>
        </div>

        <Link
          href="/cart"
          className="flex items-center justify-center text-[#385941] hover:text-[#94bb9f] transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back to Cart
        </Link>
      </div>
    </div>
  );
}
