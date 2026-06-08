"use client";

import { AppProvider } from "@/context/AppContext";
import { MobileHeader, Sidebar } from "@/components/layout/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="min-h-[100dvh] overflow-x-hidden bg-[#eef0f3]">
        <Sidebar />
        <div className="flex min-h-[100dvh] flex-col lg:pl-60 xl:pl-64">
          <MobileHeader />
          <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </AppProvider>
  );
}
