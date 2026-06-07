"use client";

import { Bell } from "lucide-react";
import { useWorkflow } from "@/context/WorkflowContext";
import { CopoLogo } from "@/components/branding/CopoLogo";
import { DemoBadge } from "@/components/branding/DemoBadge";
import { COPO_BRAND } from "@/constants/branding";

const viewTitles: Record<string, { title: string; subtitle: string }> = {
  request: {
    title: "Purchase Request / طلب شراء مواد",
    subtitle: `Submit procurement requests for COPO branches — ${COPO_BRAND.branchesShort.join(", ")}`,
  },
  approval: {
    title: "Workflow & Approvals / سير العمل والموافقات",
    subtitle: "Review and approve COPO branch purchase requests",
  },
  accounting: {
    title: "Accounting & Invoice Center / مركز الحسابات والفواتير",
    subtitle: "3-way matching, payment issuance & journal entries for COPO branches",
  },
  analytics: {
    title: "Dashboard & Logs / لوحة التحكم والسجلات",
    subtitle: "Track transactions across all COPO Restaurants Group branches",
  },
};

export function Header() {
  const { activeView, stats } = useWorkflow();
  const current = viewTitles[activeView];

  return (
    <header className="border-b border-slate-200 bg-white px-3 py-3 sm:px-4 sm:py-4 md:px-6">
      <div className="mb-3 flex items-center justify-between gap-2 md:hidden">
        <CopoLogo compact showTagline />
        <DemoBadge size="sm" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1 hidden items-center gap-2 md:flex">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              {COPO_BRAND.taglineEn}
            </span>
            <DemoBadge size="sm" />
          </div>
          <h2 className="text-base font-bold leading-snug text-slate-900 sm:text-lg">
            {current.title}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{current.subtitle}</p>
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-end sm:gap-3">
          <div className="flex flex-1 items-center justify-around gap-2 rounded-xl bg-slate-50 px-2 py-2 ring-1 ring-slate-200 sm:flex-none sm:justify-start sm:gap-4 sm:px-4">
            <div className="text-center">
              <p className="text-base font-bold text-amber-600 sm:text-lg">{stats.pending}</p>
              <p className="text-[9px] text-slate-500 sm:text-[10px]">Pending</p>
            </div>
            <div className="h-7 w-px bg-slate-200 sm:h-8" />
            <div className="text-center">
              <p className="text-base font-bold text-emerald-600 sm:text-lg">{stats.approved}</p>
              <p className="text-[9px] text-slate-500 sm:text-[10px]">Approved</p>
            </div>
            <div className="h-7 w-px bg-slate-200 sm:h-8" />
            <div className="text-center">
              <p className="text-base font-bold text-rose-600 sm:text-lg">{stats.rejected}</p>
              <p className="text-[9px] text-slate-500 sm:text-[10px]">Rejected</p>
            </div>
          </div>

          <button
            className="relative shrink-0 rounded-xl p-2.5 text-slate-500 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-slate-700"
            aria-label="COPO notifications"
          >
            <Bell size={18} />
            {stats.pending > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {stats.pending}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
