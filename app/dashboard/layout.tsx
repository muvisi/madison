"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/src/components/Sidebar";
import Topbar from "@/src/components/Topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.replace("/");
      return;
    }
    setCheckingSession(false);
  }, [router]);

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#0c477d]/20 border-t-[#0c477d]" />
          Preparing your workspace…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-slate-900">
      <Sidebar
        mobileOpen={mobileNavigationOpen}
        onMobileClose={() => setMobileNavigationOpen(false)}
      />
      <div className="min-h-screen lg:pl-[272px]">
        <Topbar onMenuClick={() => setMobileNavigationOpen(true)} />
        <main className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          {children}
        </main>
      </div>
    </div>
  );
}
