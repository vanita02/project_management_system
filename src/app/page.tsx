"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/AuthForm";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-800">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-amber-200 dark:border-amber-800 border-t-amber-600 dark:border-t-amber-500 rounded-full animate-spin"></div>
          <p className="text-stone-500 dark:text-stone-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-800">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-amber-200 dark:border-amber-800 border-t-amber-600 dark:border-t-amber-500 rounded-full animate-spin"></div>
          <p className="text-stone-500 dark:text-stone-400 font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthForm
      mode={authMode}
      onToggleMode={() => setAuthMode(authMode === "login" ? "register" : "login")}
    />
  );
}
