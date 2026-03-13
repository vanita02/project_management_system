"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!user || isRedirecting) return;

    setIsRedirecting(true);
    
    // Route to appropriate dashboard based on role
    if (user.role === 'MANAGER') {
      router.replace('/dashboard/manager');
    } else {
      router.replace('/dashboard/user');
    }
  }, [user, router, isRedirecting]);

  // Don't show anything if redirecting to prevent flash
  if (isRedirecting) {
    return null;
  }

  // Show loading only on initial load
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-r-2 border-slate-900 border-t-transparent"></div>
        <p className="mt-4 text-slate-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}

