"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { useRouter } from "next/navigation";
import { AppHeader } from "./components/appheader";
import ChatbotView from "./components/chatbotview/chatbotview";
import DashboardController from "./components/dashboards/dashboard_controller";

export default function DashboardPage() {
  const router = useRouter();

  // tambahkan role di state user
  const [user, setUser] = useState<{
    username: string;
    name: string;
    role?: string;
  } | null>(null);

  const [activeMenu, setActiveMenu] = useState<
    "dashboard" | "chatbot" | "settings"
  >("dashboard");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("authUser");
      if (!raw) {
        router.replace("/");
        return;
      }
      setUser(JSON.parse(raw));
    } catch {
      router.replace("/");
    }
  }, [router]);

  function logout() {
    try {
      localStorage.removeItem("authUser");
    } catch {}
    router.push("/");
  }

  if (!user) return null;

  return (
    <div className="size-full flex bg-[#f5f6fa] min-h-screen">
      <Sidebar
        activeMenu={activeMenu}
        onMenuClick={(m) =>
          m === "logout" ? logout() : setActiveMenu(m as any)
        }
      />

      <div className="flex-1 flex flex-col">
        <AppHeader
          userName={user.name ?? "User"}
          userTitle="IT Governance"
          search={search}
          onSearchChange={setSearch}
          onToggleSidebar={() => {}}
          onLogout={logout}
        />

        <div className="flex-1 px-8 py-6">
          <div className="flex-1 px-8 py-6">
            {activeMenu === "dashboard" && (
              <DashboardController role={user.role} />
            )}
            {activeMenu === "chatbot" && <ChatbotView autoplay />}

            {activeMenu === "settings" && (
              <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-gray-600">
                  Settings View
                </h2>
                <p className="text-gray-500 mt-2">
                  Settings content coming soon...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
