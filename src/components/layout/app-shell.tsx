"use client";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/layout/bottom-nav";
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showBottomNav = !pathname.startsWith("/login");
  return (
    <div className="min-h-screen bg-slate-100">
      <main className={`mx-auto min-h-screen max-w-lg border-x border-slate-200 bg-white shadow-sm ${showBottomNav ? "pb-22" : ""}`}>{children}</main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
