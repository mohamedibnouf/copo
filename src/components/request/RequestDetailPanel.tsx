"use client";

import type { PurchaseRequest } from "@/types/workflow";
import {
  DoubleApprovalBadge,
  StatusBadge,
  UrgencyBadge,
} from "@/components/ui/StatusBadge";
import { TransactionIdBadge } from "@/components/ui/TransactionIdBadge";
import { AuditTrailTimeline } from "@/components/audit/AuditTrailTimeline";
import { WorkflowPipeline } from "@/components/approval/WorkflowPipeline";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
  }).format(amount);
}

interface RequestDetailPanelProps {
  request: PurchaseRequest;
  children?: React.ReactNode;
}

export function RequestDetailPanel({ request, children }: RequestDetailPanelProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col gap-4 rounded-xl bg-gradient-to-r from-slate-50 to-white p-3 ring-1 ring-slate-200 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:p-4">
        <div className="min-w-0 space-y-2">
          <TransactionIdBadge id={request.id} branch={request.branch} size="lg" />
          <div className="flex flex-wrap items-center gap-1.5 pt-1 sm:gap-2">
            <StatusBadge status={request.status} />
            <UrgencyBadge urgency={request.urgency} />
            {request.requiresDoubleApproval && <DoubleApprovalBadge />}
          </div>
          <h4 className="text-sm font-semibold text-slate-900 sm:text-base">
            {request.itemName}
          </h4>
          <p className="break-words text-xs text-slate-500 sm:text-sm">
            {request.branch} · {request.requester}
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right">
          <span className="text-xs text-slate-500 sm:hidden">Estimated Cost</span>
          <div>
            <p className="text-lg font-bold text-slate-900 sm:text-xl">
              {formatCurrency(request.estimatedCost)}
            </p>
            <p className="text-xs text-slate-500">Qty: {request.quantity}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100 sm:p-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:mb-3 sm:text-xs">
            Workflow Pipeline / مسار سير العمل
          </p>
          <WorkflowPipeline request={request} />
        </div>

        <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200 sm:p-4">
          <AuditTrailTimeline entries={request.auditTrail} />
        </div>
      </div>

      {request.notes && (
        <p className="break-words rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200">
          {request.notes}
        </p>
      )}

      {children}
    </div>
  );
}
