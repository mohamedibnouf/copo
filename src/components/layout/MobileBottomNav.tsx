"use client";

import { BarChart3, CheckSquare, ClipboardList } from "lucide-react";
import { useWorkflow } from "@/context/WorkflowContext";
import type { ActiveView } from "@/types/workflow";

const navItems: {
  id: ActiveView;
  label: string;
  labelAr: string;
  icon: typeof ClipboardList;
  badge?: "pending";
}[] = [
  { id: "request", label: "Request", labelAr: "طلب", icon: ClipboardList },
  { id: "approval", label: "Approve", labelAr: "موافقة", icon: CheckSquare, badge: "pending" },
  { id: "analytics", label: "Analytics", labelAr: "تحليل", icon: BarChart3 },
];

export function MobileBottomNav() {
  const { activeView, setActiveView, stats } = useWorkflow();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const badgeCount =
            item.badge === "pending" ? stats.pending : undefined;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 transition-colors ${
                isActive
                  ? "text-emerald-700"
                  : "text-slate-500 active:text-slate-700"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                  isActive ? "bg-emerald-100" : "bg-transparent"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {badgeCount !== undefined && badgeCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white">
                    {badgeCount}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-semibold leading-none">{item.label}</span>
              <span className="text-[9px] leading-none opacity-70">{item.labelAr}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
