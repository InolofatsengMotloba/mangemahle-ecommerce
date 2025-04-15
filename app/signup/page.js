"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { saveUserToFirestore } from "@/lib/userService";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Image from "next/image";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, { displayName: name });

      // Save user to Firestore
      await saveUserToFirestore(user);

      alert("Account created successfully!");
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

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Email */}
          <div className="bg-[#dfe8de] flex items-center px-3 py-2 rounded-md">
            <AiOutlineMail className="text-[#2e4d3b] mr-2" size={20} />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-transparent outline-none placeholder:text-[#2e4d3b] text-[#2e4d3b]"
            />
          </div>
          <div className="bg-[#dfe8de] flex items-center px-3 py-2 rounded-md">
            <AiOutlineMail className="text-[#2e4d3b] mr-2" size={20} />
            <input
              type="email"
              placeholder="Email"
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

          {/* Confirm Password */}
          <div className="bg-[#dfe8de] flex items-center px-3 py-2 rounded-md">
            <AiOutlineLock className="text-[#2e4d3b] mr-2" size={20} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-transparent outline-none placeholder:text-[#2e4d3b] text-[#2e4d3b]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-[#2e4d3b]"
            >
              {showConfirmPassword ? (
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
            Sign Up
          </button>
        </form>

        {/* Link to Sign In */}
        <p className="text-center text-sm text-[#2e4d3b] mt-6">
          Already have an account?{" "}
          <a href="/signin" className="underline font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
