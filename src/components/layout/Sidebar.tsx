"use client";

import {
  BarChart3,
  CheckSquare,
  ClipboardList,
  GitBranch,
} from "lucide-react";
import { useWorkflow } from "@/context/WorkflowContext";
import { CopoLogo } from "@/components/branding/CopoLogo";
import { DemoBadge } from "@/components/branding/DemoBadge";
import { COPO_BRAND } from "@/constants/branding";
import type { ActiveView } from "@/types/workflow";

const navItems: {
  id: ActiveView;
  label: string;
  labelAr: string;
  icon: typeof ClipboardList;
  badge?: "pending";
}[] = [
  {
    id: "request",
    label: "New Request",
    labelAr: "طلب جديد",
    icon: ClipboardList,
  },
  {
    id: "approval",
    label: "Approvals",
    labelAr: "الموافقات",
    icon: CheckSquare,
    badge: "pending",
  },
  {
    id: "analytics",
    label: "Analytics",
    labelAr: "التحليلات",
    icon: BarChart3,
  },
];

export function Sidebar() {
  const { activeView, setActiveView, stats } = useWorkflow();

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-slate-200 bg-white md:flex lg:w-64">
      <div className="border-b border-slate-200 px-4 py-4 lg:px-5 lg:py-5">
        <CopoLogo showTagline />
        <div className="mt-3">
          <DemoBadge size="sm" />
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          COPO Modules / وحدات كوبو
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const badgeCount =
            item.badge === "pending" ? stats.pending : undefined;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
                isActive
                  ? "bg-emerald-50 text-emerald-800 shadow-sm ring-1 ring-emerald-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon
                className={`shrink-0 ${
                  isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
                }`}
                size={18}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.label}</p>
                <p className="truncate text-[11px] opacity-70">{item.labelAr}</p>
              </div>
              {badgeCount !== undefined && badgeCount > 0 && (
                <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="hidden border-t border-slate-200 p-4 lg:block">
        <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-3 ring-1 ring-slate-200">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
            <GitBranch className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            COPO Branches / فروع كوبو
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {COPO_BRAND.branchesShort.map((branch) => (
              <span
                key={branch}
                className="rounded-md bg-white px-2 py-1 text-center text-[10px] font-medium text-slate-600 ring-1 ring-slate-200"
              >
                {branch}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
