"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LogoutPage() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  useEffect(() => {
    logout();
    toast.success("Vous avez été déconnecté.");

    router.push("/login");
  }, [logout, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center text-lg text-gray-700">Déconnexion en cours...</div>
    </div>
  );
}