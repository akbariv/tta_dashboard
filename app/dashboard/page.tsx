"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { useRouter } from "next/navigation";
import { AppHeader } from "./components/appheader/index";
import { ChatbotView } from "./components/chatbotview";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; name: string } | null>(
    null
  );
  const [activeMenu, setActiveMenu] = useState<
    "dashboard" | "chatbot" | "settings"
  >("chatbot");
  const [chatInput, setChatInput] = useState("");
  const [search, setSearch] = React.useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("authUser");
      if (!raw) {
        router.replace("/");
        return;
      }
      setUser(JSON.parse(raw));
    } catch (e) {
      router.replace("/");
    }
  }, [router]);

  function logout() {
    try {
      localStorage.removeItem("authUser");
    } catch (e) {}
    router.push("/");
  }

  const handleMenuClick = (
    menu: "dashboard" | "chatbot" | "settings" | "logout"
  ) => {
    if (menu === "logout") {
      logout();
      return;
    }
    setActiveMenu(menu);
  };

  if (!user) return null;

  return (
    <div className="size-full flex bg-[#f5f6fa] min-h-screen">
      <Sidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <AppHeader
          userName={user?.name ?? "User"}
          userTitle="IT Governance"
          search={search}
          onSearchChange={setSearch}
          onToggleSidebar={() => {
            /* kalau nanti ada drawer/mini sidebar */
          }}
          onLogout={logout}
        />

        {/* Page Content */}
        <div className="flex-1 px-8 py-6">
          <div className="flex-1 px-8 py-6">
            {activeMenu === "chatbot" && <ChatbotView autoplay />}

            {activeMenu === "dashboard" && (
              <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-gray-600">
                  Dashboard View
                </h2>
                <p className="text-gray-500 mt-2">
                  Dashboard content coming soon...
                </p>
              </div>
            )}

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
