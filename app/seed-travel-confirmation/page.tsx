"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { seedTravelConfirmationFromApprovals } from "@/app/dashboard/data/ttaMock";

export default function SeedTravelConfirmationPage() {
  const router = useRouter();
  const [seeded, setSeeded] = React.useState(false);

  React.useEffect(() => {
    // Auto-seed when page loads
    seedTravelConfirmationFromApprovals();
    setSeeded(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">
          ✓ Travel Confirmation Data Seeded
        </h1>
        <p className="text-slate-600 mb-6">
          Travel Request data telah berhasil ditambahkan ke Travel Confirmation untuk kategori Travel Request.
        </p>
        
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </button>
        
        <p className="text-xs text-slate-500 mt-4">
          Anda dapat membuka DevTools (F12) → Application → LocalStorage → tta_travel_confirmation_v1 untuk melihat data yang telah disimpan
        </p>
      </div>
    </div>
  );
}
