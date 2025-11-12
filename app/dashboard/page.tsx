// app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AppHeader } from "./components/appheader";
import ChatbotView from "./components/chatbotview/chatbotview";
import DashboardController from "./components/dashboards/dashboard_controller";
import ApprovalView from "./components/approval/approval_view";

type Section = "dashboard" | "chatbot" | "approval" | "settings";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // user & auth redirect
  const [user, setUser] = useState<{
    username: string;
    name: string;
    role?: string;
  } | null>(null);

  // sinkron dengan query ?section=
  const sectionParam = (searchParams.get("section") as Section) ?? "dashboard";
  const openIdParam = searchParams.get("id") ?? searchParams.get("openId");

  const [activeMenu, setActiveMenu] = useState<Section>("dashboard");
  const [search, setSearch] = useState("");

  // baca user dari localStorage
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

  // setiap query ?section= berubah → update state tampilan
  useEffect(() => {
    // fallback ke "dashboard" bila param tidak valid
    const valid: Section[] = ["dashboard", "chatbot", "approval", "settings"];
    setActiveMenu(valid.includes(sectionParam) ? sectionParam : "dashboard");
  }, [sectionParam]);

  // helper: ubah section + update URL (tanpa reload)
  function goToSection(next: Section, extra?: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "dashboard") {
      params.delete("section");
      params.delete("id");
    } else {
      params.set("section", next);
      // id hanya dipakai di approval
      if (next !== "approval") params.delete("id");
    }
    if (extra) {
      Object.entries(extra).forEach(([k, v]) => {
        if (v == null) params.delete(k);
        else params.set(k, v);
      });
    }
    router.push(
      params.toString() ? `${pathname}?${params.toString()}` : pathname
    );
  }

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
          m === "logout" ? logout() : goToSection(m as Section)
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
          {/* Controller section berbasis query param */}
          {activeMenu === "dashboard" && (
            <DashboardController role={user.role} />
          )}

          {activeMenu === "chatbot" && <ChatbotView autoplay />}

          {/* Kirim id (jika ada) supaya langsung buka detail */}
          {activeMenu === "approval" && (
            <ApprovalView
              initialOpenId={openIdParam ?? null}
              onCloseDetail={() => goToSection("approval", { id: null })} 
            />
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
  );
}
