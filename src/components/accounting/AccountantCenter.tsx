"use client";

import { useState } from "react";
import {
  Banknote,
  Calculator,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Receipt,
} from "lucide-react";
import { useWorkflow } from "@/context/WorkflowContext";
import type { PurchaseRequest } from "@/types/workflow";
import { ThreeWayMatching } from "@/components/accounting/ThreeWayMatching";
import { AuditTrailTimeline } from "@/components/audit/AuditTrailTimeline";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TransactionIdBadge } from "@/components/ui/TransactionIdBadge";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function AccountingRow({
  req,
  onIssuePayment,
}: {
  req: PurchaseRequest;
  onIssuePayment: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isPaid = req.status === "Paid";

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <TransactionIdBadge id={req.id} branch={req.branch} size="sm" />
              <h4 className="mt-2 text-base font-semibold text-slate-900">{req.itemName}</h4>
              <p className="text-sm text-slate-500">
                {req.branch} · {req.requester}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(req.estimatedCost)}
              </p>
              <p className="text-xs text-slate-500">Qty: {req.quantity}</p>
              <div className="mt-2">
                <StatusBadge status={req.status} />
              </div>
            </div>
          </div>

          <ThreeWayMatching match={req.threeWayMatch ?? { purchaseRequest: true, receivedGoods: true, supplierInvoice: true }} />

          {req.journalEntryId && (
            <div className="flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 ring-1 ring-teal-200">
              <FileSpreadsheet className="h-4 w-4 shrink-0 text-teal-600" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-700">
                  Journal Entry ID / رقم القيد المحاسبي
                </p>
                <p className="font-mono text-sm font-bold text-teal-900">
                  {req.journalEntryId}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
          {!isPaid ? (
            <button
              type="button"
              onClick={() => onIssuePayment(req.id)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-200 transition hover:from-teal-700 hover:to-emerald-700 active:scale-[0.99]"
            >
              <Banknote size={16} />
              Issue Payment / إصدار أمر الصرف
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-teal-100 px-5 py-3 text-sm font-semibold text-teal-800 ring-1 ring-teal-200">
              <Receipt size={16} />
              Paid / تم الصرف
            </div>
          )}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center gap-1 rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
          >
            Audit Trail / تسلسل العمليات
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-4 py-4 sm:px-5">
          <AuditTrailTimeline entries={req.auditTrail} />
        </div>
      )}
    </div>
  );
}

export function AccountantCenter() {
  const { approvedForPayment, paidRequests, issuePayment, stats } = useWorkflow();

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-4 text-white shadow-lg shadow-teal-200">
          <p className="text-xs font-medium text-emerald-100">Ready for Payment</p>
          <p className="mt-1 text-3xl font-bold">{stats.readyForPayment}</p>
          <p className="text-[11px] text-emerald-100">جاهز للصرف</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-medium text-slate-500">3-Way Matched</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">
            {approvedForPayment.length}
          </p>
          <p className="text-[11px] text-slate-400">المطابقة الثلاثية مكتملة</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-medium text-slate-500">Paid / تم الصرف</p>
          <p className="mt-1 text-3xl font-bold text-teal-600">{stats.paid}</p>
          <p className="text-[11px] text-slate-400">Journal entries posted</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100">
              <Calculator className="h-5 w-5 text-teal-700" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                Accounting & Invoice Center / مركز الحسابات والفواتير
              </h3>
              <p className="text-sm text-slate-500">
                Approved COPO requests ready for invoicing and disbursement
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            {approvedForPayment.length} awaiting payment
          </span>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          {approvedForPayment.length === 0 ? (
            <div className="py-12 text-center">
              <Receipt className="mx-auto mb-3 h-12 w-12 text-slate-300" />
              <p className="font-medium text-slate-600">No requests awaiting payment</p>
              <p className="mt-1 text-sm text-slate-400">
                Approved requests will appear here for 3-way matching and disbursement
              </p>
            </div>
          ) : (
            approvedForPayment.map((req) => (
              <AccountingRow key={req.id} req={req} onIssuePayment={issuePayment} />
            ))
          )}
        </div>
      </div>

      {paidRequests.length > 0 && (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <h4 className="mb-4 text-sm font-semibold text-slate-900">
            Recently Paid / المدفوعات الأخيرة
          </h4>
          <div className="space-y-3">
            {paidRequests.slice(0, 5).map((req) => (
              <div
                key={req.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-teal-50/50 p-3 ring-1 ring-teal-100"
              >
                <div>
                  <TransactionIdBadge id={req.id} branch={req.branch} size="sm" />
                  <p className="mt-1 text-sm font-medium text-slate-800">{req.itemName}</p>
                </div>
                <div className="text-right">
                  {req.journalEntryId && (
                    <p className="font-mono text-xs font-bold text-teal-800">
                      {req.journalEntryId}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-500">
                    {req.paidAt ? formatDate(req.paidAt) : "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
