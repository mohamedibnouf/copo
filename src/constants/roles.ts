import type { LucideIcon } from "lucide-react";
import { Calculator, ChefHat, Eye, Shield, Wallet } from "lucide-react";
import type { ActiveView, UserRole } from "@/types/workflow";

export interface RoleConfig {
  value: UserRole;
  demoLabel: string;
  labelAr: string;
  description: string;
  defaultView: ActiveView;
  icon: LucideIcon;
  badgeClass: string;
  pillActiveClass: string;
  pillIdleClass: string;
}

export const ROLE_CONFIG: RoleConfig[] = [
  {
    value: "requester",
    demoLabel: "Chef",
    labelAr: "الشيف",
    description: "Submit purchase requests for COPO branches",
    defaultView: "request",
    icon: ChefHat,
    badgeClass: "bg-emerald-600 text-white ring-emerald-400/40",
    pillActiveClass:
      "bg-emerald-600 text-white shadow-md shadow-emerald-200 ring-2 ring-emerald-300",
    pillIdleClass:
      "bg-white text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50",
  },
  {
    value: "area_manager",
    demoLabel: "Area Manager",
    labelAr: "مدير المنطقة",
    description: "Review and approve COPO branch requests",
    defaultView: "approval",
    icon: Shield,
    badgeClass: "bg-indigo-600 text-white ring-indigo-400/40",
    pillActiveClass:
      "bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-2 ring-indigo-300",
    pillIdleClass:
      "bg-white text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50",
  },
  {
    value: "finance",
    demoLabel: "Finance Manager",
    labelAr: "المدير المالي",
    description: "Final approval for high-value COPO purchases",
    defaultView: "approval",
    icon: Wallet,
    badgeClass: "bg-violet-600 text-white ring-violet-400/40",
    pillActiveClass:
      "bg-violet-600 text-white shadow-md shadow-violet-200 ring-2 ring-violet-300",
    pillIdleClass:
      "bg-white text-violet-700 ring-1 ring-violet-200 hover:bg-violet-50",
  },
  {
    value: "accountant",
    demoLabel: "Accountant",
    labelAr: "المحاسب",
    description: "Issue payments, 3-way matching & journal entries",
    defaultView: "accounting",
    icon: Calculator,
    badgeClass: "bg-teal-600 text-white ring-teal-400/40",
    pillActiveClass:
      "bg-teal-600 text-white shadow-md shadow-teal-200 ring-2 ring-teal-300",
    pillIdleClass: "bg-white text-teal-700 ring-1 ring-teal-200 hover:bg-teal-50",
  },
  {
    value: "viewer",
    demoLabel: "Viewer",
    labelAr: "عارض",
    description: "Read-only access to analytics and logs",
    defaultView: "analytics",
    icon: Eye,
    badgeClass: "bg-slate-600 text-white ring-slate-400/40",
    pillActiveClass:
      "bg-slate-600 text-white shadow-md shadow-slate-200 ring-2 ring-slate-300",
    pillIdleClass: "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
  },
];

export function getRoleConfig(role: UserRole): RoleConfig {
  return ROLE_CONFIG.find((r) => r.value === role) ?? ROLE_CONFIG[0];
}

export function getDefaultViewForRole(role: UserRole): ActiveView {
  return getRoleConfig(role).defaultView;
}
