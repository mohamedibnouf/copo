"use client";

import { Eye } from "lucide-react";
import { useWorkflow } from "@/context/WorkflowContext";
import { ROLE_CONFIG, getRoleConfig } from "@/constants/roles";
import { DemoBadge } from "@/components/branding/DemoBadge";
import type { UserRole } from "@/types/workflow";

export function RoleSwitcher() {
  const { currentRole, switchRole } = useWorkflow();
  const active = getRoleConfig(currentRole);
  const ActiveIcon = active.icon;

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 px-3 py-2.5 shadow-lg sm:px-4 sm:py-3 md:px-6">
      <div className="flex flex-col gap-3">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex shrink-0 items-center gap-1.5 text-slate-300">
            <Eye size={15} className="shrink-0" />
            <span className="text-xs font-medium sm:text-sm">
              <span className="hidden sm:inline">Viewing as / </span>العرض كـ
            </span>
          </div>

          <div
            className={`flex max-w-full items-center gap-2 rounded-full px-3 py-1.5 shadow-lg ring-2 ring-inset transition-all duration-300 sm:gap-2.5 sm:px-4 sm:py-2 ${active.badgeClass}`}
          >
            <ActiveIcon size={16} className="shrink-0 sm:h-[18px] sm:w-[18px]" />
            <span className="truncate text-sm font-bold tracking-tight sm:text-base">
              {active.demoLabel}
            </span>
            <span className="hidden text-sm font-normal opacity-80 sm:inline">
              · {active.labelAr}
            </span>
          </div>

          <p className="hidden min-w-0 text-xs text-slate-400 lg:block">{active.description}</p>
          </div>
          <DemoBadge size="sm" className="hidden shrink-0 sm:inline-flex" />
        </div>

        <div className="-mx-1 overflow-x-auto pb-0.5 sm:mx-0 sm:overflow-visible">
          <div className="flex min-w-min items-center gap-1.5 px-1 sm:flex-wrap sm:gap-2 sm:px-0">
            <span className="mr-0.5 hidden shrink-0 text-[10px] font-semibold uppercase tracking-wider text-slate-500 md:inline">
              Switch Role
            </span>
            {ROLE_CONFIG.map((role) => {
              const Icon = role.icon;
              const isActive = currentRole === role.value;

              return (
                <button
                  key={role.value}
                  onClick={() => switchRole(role.value as UserRole)}
                  className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-200 sm:gap-1.5 sm:px-3 sm:text-xs ${
                    isActive ? role.pillActiveClass : role.pillIdleClass
                  }`}
                  aria-pressed={isActive}
                  aria-label={`Switch to ${role.demoLabel}`}
                >
                  <Icon size={12} className="sm:h-[13px] sm:w-[13px]" />
                  <span className="whitespace-nowrap">{role.demoLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
