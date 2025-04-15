"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Image from "next/image";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleSignin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#f9fbf8] p-8 rounded-2xl shadow-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/m-logo.png"
            alt="Mangemahle Backdrop"
            width="1"
            height="1"
            className="h-16 w-16"
            priority
          />
          <h1 className="text-lg font-medium text-[#2e4d3b] text-center">
            Your journey starts here <br />{" "}
            <span className="font-semibold">Take the first step</span>
          </h1>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSignin} className="space-y-4">
          {/* Email */}
          <div className="bg-[#dfe8de] flex items-center px-3 py-2 rounded-md">
            <AiOutlineMail className="text-[#2e4d3b] mr-2" size={20} />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent outline-none placeholder:text-[#2e4d3b] text-[#2e4d3b]"
            />
          </div>

          {/* Password */}
          <div className="bg-[#dfe8de] flex items-center px-3 py-2 rounded-md">
            <AiOutlineLock className="text-[#2e4d3b] mr-2" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent outline-none placeholder:text-[#2e4d3b] text-[#2e4d3b]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#2e4d3b]"
            >
              {showPassword ? (
                <IoEyeOffOutline size={20} />
              ) : (
                <IoEyeOutline size={20} />
              )}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#6c9a76] text-white py-2 rounded-full font-medium hover:bg-[#5b865f] transition"
          >
            Sign In
          </button>
        </form>

        {/* Link to Sign Up */}
        <p className="text-center text-sm text-[#2e4d3b] mt-6">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signin;
