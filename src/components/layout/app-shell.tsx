import { BottomNav } from "@/components/layout/bottom-nav";
export function AppShell({ children }: { children: React.ReactNode }) { return <div className="min-h-screen bg-slate-100"><main className="mx-auto min-h-screen max-w-lg border-x border-slate-200 bg-white pb-22 shadow-sm">{children}</main><BottomNav /></div>; }
