"use client";

import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { TransactionIdBadge } from "@/components/ui/TransactionIdBadge";
import { useWorkflow } from "@/context/WorkflowContext";

export function StatusKanban() {
  const { requests, stats } = useWorkflow();

  const columns = [
    {
      key: "Pending" as const,
      label: "Pending",
      labelAr: "قيد الانتظار",
      count: stats.pending,
      icon: Clock,
      color: "amber",
      bg: "bg-amber-50",
      border: "ring-amber-200",
      text: "text-amber-700",
      iconBg: "bg-amber-100",
    },
    {
      key: "Approved" as const,
      label: "Approved",
      labelAr: "موافق عليه",
      count: stats.approved,
      icon: CheckCircle2,
      color: "emerald",
      bg: "bg-emerald-50",
      border: "ring-emerald-200",
      text: "text-emerald-700",
      iconBg: "bg-emerald-100",
    },
    {
      key: "Rejected" as const,
      label: "Rejected",
      labelAr: "مرفوض",
      count: stats.rejected,
      icon: XCircle,
      color: "rose",
      bg: "bg-rose-50",
      border: "ring-rose-200",
      text: "text-rose-700",
      iconBg: "bg-rose-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {columns.map((col) => {
          const Icon = col.icon;
          const pct = stats.total > 0 ? Math.round((col.count / stats.total) * 100) : 0;

          return (
            <div
              key={col.key}
              className={`rounded-2xl ${col.bg} p-5 ring-1 ${col.border} transition hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl ${col.iconBg} p-2.5`}>
                  <Icon className={`h-5 w-5 ${col.text}`} />
                </div>
                <span className={`text-3xl font-bold ${col.text}`}>{col.count}</span>
              </div>
              <p className={`mt-3 font-semibold ${col.text}`}>{col.label}</p>
              <p className="text-xs opacity-70">{col.labelAr}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/60">
                <div
                  className={`h-full rounded-full ${
                    col.color === "amber"
                      ? "bg-amber-400"
                      : col.color === "emerald"
                        ? "bg-emerald-400"
                        : "bg-rose-400"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] opacity-60">{pct}% of total</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <h4 className="mb-3 text-sm font-semibold text-slate-900 sm:mb-4">
          Kanban Board — COPO Branches / لوحة كانبان — فروع كوبو
        </h4>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {columns.map((col) => {
            const items = requests.filter((r) => r.status === col.key);

            return (
              <div
                key={col.key}
                className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase ${col.text}`}>
                    {col.label}
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 ring-1 ring-slate-200">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {items.length === 0 ? (
                    <p className="py-4 text-center text-xs text-slate-400">No items</p>
                  ) : (
                    items.map((req) => (
                      <div
                        key={req.id}
                        className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
                      >
                        <div className="mb-1.5">
                          <TransactionIdBadge id={req.id} branch={req.branch} size="sm" />
                        </div>
                        <p className="mt-1 text-sm font-medium text-slate-800 line-clamp-1">
                          {req.itemName}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">{req.branch}</p>
                        <p className="mt-2 text-xs font-semibold text-slate-700">
                          {new Intl.NumberFormat("en-SA", {
                            style: "currency",
                            currency: "SAR",
                            minimumFractionDigits: 0,
                          }).format(req.estimatedCost)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
