"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/contexts/CartContext";
import Step1Shipping from "./Step1Shipping";
import Step2Payment from "./Step2Payment";
import Step3Review from "./Step3Review";

export default function CheckoutForm() {
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const { cart, clearCart } = useContext(CartContext);
  const router = useRouter();

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  const handleSubmit = () => {
    console.log("✅ Order placed!", { shippingData, paymentData, cart });
    clearCart();
    router.push("/thank-you");
  };

  return (
    <>
      {step === 1 && (
        <Step1Shipping
          data={shippingData}
          onNext={(data) => {
            setShippingData(data);
            next();
          }}
        />
      )}
      {step === 2 && (
        <Step2Payment
          data={paymentData}
          onBack={prev}
          onNext={(data) => {
            setPaymentData(data);
            next();
          }}
        />
      )}
      {step === 3 && (
        <Step3Review
          shipping={shippingData}
          payment={paymentData}
          cart={cart}
          onBack={prev}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
