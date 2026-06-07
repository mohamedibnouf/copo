"use client";

import { ClipboardList, Clock } from "lucide-react";
import { useWorkflow } from "@/context/WorkflowContext";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TransactionIdBadge } from "@/components/ui/TransactionIdBadge";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function RequesterDashboard() {
  const { requests, stats, switchRole } = useWorkflow();

  const myPending = requests.filter((r) => r.status === "Pending");
  const recent = requests.slice(0, 5);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <ClipboardList className="h-5 w-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              Requester Dashboard / لوحة مقدم الطلب
            </h3>
            <p className="text-sm text-slate-500">
              Your COPO branch requests and submission status
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 ring-1 ring-amber-200">
          <Clock className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-semibold text-amber-800">
            {stats.pending} pending approval
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {recent.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            No requests yet — submit your first purchase request above.
          </p>
        ) : (
          recent.map((req) => (
            <div
              key={req.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100"
            >
              <div className="min-w-0 flex-1">
                <TransactionIdBadge id={req.id} branch={req.branch} size="sm" />
                <p className="mt-1 truncate text-sm font-medium text-slate-800">
                  {req.itemName}
                </p>
                <p className="text-xs text-slate-500">{req.branch}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <StatusBadge status={req.status} />
                <span className="text-xs font-semibold text-slate-700">
                  {formatCurrency(req.estimatedCost)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {myPending.length > 0 && (
        <button
          type="button"
          onClick={() => switchRole("area_manager")}
          className="mt-4 text-sm font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900"
        >
          View pending in Approvals → / عرض المعلقة في الموافقات
        </button>
      )}
    </div>
  );
}
