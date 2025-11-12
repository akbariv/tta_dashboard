"use client";

import * as React from "react";
import { Sidebar } from "@/app/dashboard/components/Sidebar";
import { AppHeader } from "@/app/dashboard/components/appheader";
import { useRouter } from "next/navigation";

export default function ApprovalHistoryLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<{ name?: string; role?: string } | null>(null);

  React.useEffect(() => {
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

  if (!user) return null;

  return (
    <div className="size-full flex bg-[#f5f6fa] min-h-screen">
      <Sidebar activeMenu={"approval"} onMenuClick={(m) => {
        if (m === "logout") {
          try { localStorage.removeItem("authUser"); } catch {}
          router.push("/");
        } else {
          // navigate to dashboard sections via query
          if (m === "dashboard") router.push("/dashboard");
          else if (m === "chatbot") router.push("/dashboard?section=chatbot");
          else if (m === "approval") router.push("/dashboard?section=approval");
        }
      }} />

      <div className="flex-1 flex flex-col">
        <AppHeader
          userName={user.name ?? "User"}
          userTitle={user.role ?? ""}
          search={""}
          onSearchChange={() => {}}
          onToggleSidebar={() => {}}
          onLogout={() => {
            try { localStorage.removeItem("authUser"); } catch {}
            router.push("/");
          }}
        />

        <div className="flex-1 px-8 py-6">{children}</div>
      </div>
    </div>
  );
}
