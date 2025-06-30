"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth";
import { Toaster } from "react-hot-toast";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const tokenCookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));
    const userCookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("user="));

    if (tokenCookie && userCookie) {
      const token = tokenCookie.split("=")[1];
      try {
        const userData = JSON.parse(
          decodeURIComponent(userCookie.split("=")[1]),
        );
        if (!useAuthStore.getState().token || !useAuthStore.getState().user) {
          login(userData, token);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la lecture des cookies utilisateur:",
          error,
        );
        useAuthStore.getState().logout();
      }
    } else {
      if (useAuthStore.getState().token || useAuthStore.getState().user) {
        useAuthStore.getState().logout();
      }
    }
  }, [login]);

  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
}
