"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyUser } from "@/lib/users";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();



async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = verifyUser(username.trim(), password);
      if (!user) {
        setError("Username atau password salah.");
        return;
      }

      localStorage.setItem("authUser", JSON.stringify(user));

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="bg-[#f4f5f7] relative">
      {/* TOP SIDE - BLUE BACKGROUND */}
      <div className="h-[50vh] bg-[#0089ED] text-white flex flex-col relative">
        {/* logo */}
        <div className="px-10 py-6 flex items-center gap-3">
          <img src="/assets/logo.png" alt="blibli logo" width={132} height={52} />
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

        {/* clouds */}
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
        <div className="absolute left-32 top-60 transform -translate-y-1/2">
          <img
            src="/assets/gambar-blibli-login.png"
            alt="TTA illustration"
            className="w-96 drop-shadow-2xl"
          />
        </div>
      </div>

      {/* FLOATING LOGIN FORM */}
      <div className="absolute top-[50vh] right-8 transform -translate-y-1/2 z-10 lg:right-16 xl:right-24">
        <div className="w-full max-w-md bg-white rounded-[32px] shadow-[0_20px_50px_rgba(15,23,42,0.08)] py-8 px-8 sm:px-10">
          <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>

          <form className="mt-6" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Username
              </label>
              <div className="flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#4E86F9]/50">
                <input
                  type="text"
                  placeholder="Username *"
                  className="w-full px-3 py-2.5 text-sm outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#4E86F9]/50">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password *"
                  className="w-full px-3 py-2.5 text-sm outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="px-3 py-2 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <img
                    src={showPassword ? "/assets/eye-open.svg" : "/assets/eye-closed.svg"}
                    alt=""
                    width={20}
                    height={20}
                    className="opacity-60 hover:opacity-80"
                  />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 text-sm text-red-600" role="alert">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-[#4E86F9] hover:bg-[#3f73da] disabled:opacity-60 disabled:pointer-events-none text-white font-medium py-3 rounded-lg transition"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

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
