"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { verifyUser } from "../lib/users";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <main className="bg-[#f4f5f7] relative">
      {/* TOP SIDE - BLUE BACKGROUND */}
      <div className="h-[50vh] bg-[#0089ED] text-white flex flex-col relative">
        {/* logo */}
        <div className="px-10 py-6 flex items-center gap-3">
          <img
            src="/assets/logo.png"
            alt="blibli logo"
            width={132}
            height={52}
          />
        </div>

        {/* text */}
        <div className="px-10 mt-4 pd-6">
          <p className="text-4xl font-semibold leading-tight">Welcome to</p>
          <p className="mt-5 text-xl text-base leading-snug max-w-md text-white/90">
            Travel, Transportation, and <br /> Accommodation System
          </p>
          <div className="absolute left-[30vh] top-1/2 transform -translate-y-1/2">
          <img
            src="/assets/gambar-melayang-login.png"
            alt="Rocket illustration"
            className="drop-shadow-xl"
            width={450}
          />
        </div>
        </div>

        {/* ilustrasi atas (rocket) - posisi kanan tengah bagian biru */}
        

        {/* clouds/awan kecil */}
        <div className="absolute right-16 top-16">
          <div className="w-8 h-4 bg-white/20 rounded-full"></div>
        </div>
        <div className="absolute right-80 top-24">
          <div className="w-6 h-3 bg-white/15 rounded-full"></div>
        </div>
        <div className="absolute right-96 bottom-16">
          <div className="w-10 h-5 bg-white/25 rounded-full"></div>
        </div>
      </div>

      {/* BOTTOM SIDE - LIGHT BACKGROUND */}
      <div className=" bg-[#f4f5f7] relative">
        {/* ilustrasi bawah - posisi kiri tengah bagian putih */}
        <div className="absolute left-32 top-[25vh] transform -translate-y-1/2">
          <img
            src="/assets/gambar-blibli-login.png"
            alt="TTA illustration"
            className="w-96 drop-shadow-2xl"
          />
        </div>
      </div>

      {/* FLOATING LOGIN FORM - POSITIONED AT THE BORDER LINE */}
      <div className="absolute top-[50vh] right-8 transform -translate-y-1/2 z-10 lg:right-16 xl:right-24">
        <div className="w-full max-w-md bg-white rounded-[32px] shadow-[0_20px_50px_rgba(15,23,42,0.08)] py-8 px-8 sm:px-10">
          <h1 className="text-3xl font-semibold text-slate-900">Sign in</h1>

          {/* Username */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
            <div className="flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#4E86F9]/50">
              <input
                type="text"
                placeholder="Username *"
                className="w-full px-3 py-2.5 text-sm outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#4E86F9]/50">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password *"
                className="w-full px-3 py-2.5 text-sm outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="px-3 py-2 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <img
                  src={showPassword ? "/assets/eye-closed.svg" : "/assets/eye-open.svg"}
                  alt={showPassword ? "Hide password" : "Show password"}
                  width={20}
                  height={20}
                  className="opacity-60 hover:opacity-80"
                />
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={() => {
              setError(null);
              // basic validation
              if (!username.trim() || !password) {
                setError("Username and password are required.");
                return;
              }
              if (username.trim().length < 3) {
                setError("Username must be at least 3 characters.");
                return;
              }
              if (password.length < 4) {
                setError("Password must be at least 4 characters.");
                return;
              }
              setLoading(true);
              const user = verifyUser(username.trim(), password);
              setLoading(false);
              if (!user) {
                setError("Invalid username or password.");
                return;
              }
              try {
                localStorage.setItem("authUser", JSON.stringify(user));
              } catch (e) {
                // ignore
              }
              router.push("/dashboard");
            }}
            className="mt-6 w-full bg-[#4E86F9] hover:bg-[#3f73da] text-white font-medium py-3 rounded-lg transition"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          {/* footer kecil */}
          <p className="mt-6 text-center text-[11px] text-slate-400">
            <span className="font-semibold text-[#4E86F9]">blibli</span>
            <span className="mx-1">×</span>
            <span className="font-semibold text-[#FFB800]">tiket</span> — All Rights Reserved
          </p>
        </div>
      </div>
    </main>
  );
}
