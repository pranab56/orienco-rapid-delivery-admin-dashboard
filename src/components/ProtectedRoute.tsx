"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { getToken } from "@/utils/storage";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = getToken();


      if (!token || token === null) {
        router.replace("/auth/login");
      }

    }, 2000); // ⏱️ 2 seconds

    return () => clearTimeout(timer);
  }, [router]);



  return <>{children}</>;
}
