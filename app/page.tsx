"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("authUser");
      if (raw) {
        router.replace("/dashboard");
      } else {
        router.replace("/login_page");
      }
    } catch (e) {
      router.replace("/login_page");
    }
  }, [router]);

  return null;
}
