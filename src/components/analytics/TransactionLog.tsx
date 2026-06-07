"use client";

import { ChevronDown, ChevronUp, Filter, Search } from "lucide-react";
import { useState } from "react";
import { useWorkflow } from "@/context/WorkflowContext";
import { BRANCHES } from "@/types/workflow";
import type { PurchaseRequest } from "@/types/workflow";
import {
  DoubleApprovalBadge,
  StatusBadge,
  UrgencyBadge,
} from "@/components/ui/StatusBadge";
import { TransactionIdBadge } from "@/components/ui/TransactionIdBadge";
import { AuditTrailTimeline } from "@/components/audit/AuditTrailTimeline";
import { COPO_BRAND } from "@/constants/branding";

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

function TransactionMobileCard({ req }: { req: PurchaseRequest }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-xl bg-white ring-1 ring-slate-200">
      <button
        type="button"
        className="w-full p-3 text-left sm:p-4"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className="mb-2">
          <TransactionIdBadge id={req.id} branch={req.branch} size="sm" />
        </div>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-slate-900">{req.itemName}</p>
            <p className="mt-0.5 text-xs text-slate-500">{req.branch}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">{req.requester}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-semibold text-slate-900">{formatCurrency(req.estimatedCost)}</p>
            <p className="text-[10px] text-slate-500">Qty {req.quantity}</p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <StatusBadge status={req.status} />
          <UrgencyBadge urgency={req.urgency} />
          {req.requiresDoubleApproval && <DoubleApprovalBadge />}
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
          <span>{formatDate(req.createdAt)}</span>
          <span className="flex items-center gap-1 font-medium text-emerald-700">
            {expanded ? "Hide audit" : "View audit"}
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </div>
      </button>
      {expanded && (
        <div className="border-t border-slate-100 p-3 sm:p-4">
          <AuditTrailTimeline entries={req.auditTrail} compact />
        </div>
      )}
    </article>
  );
}

function TransactionRow({ req }: { req: PurchaseRequest }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="cursor-pointer transition hover:bg-slate-50/80"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-3 lg:px-6">
          <TransactionIdBadge id={req.id} branch={req.branch} size="sm" />
          {req.requiresDoubleApproval && (
            <div className="mt-1.5">
              <DoubleApprovalBadge />
            </div>
          )}
        </td>
        <td className="hidden px-4 py-3 text-slate-600 md:table-cell">{req.branch}</td>
        <td className="px-4 py-3">
          <p className="font-medium text-slate-800">{req.itemName}</p>
          <p className="text-xs text-slate-400">{req.requester}</p>
        </td>
        <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">{req.quantity}</td>
        <td className="px-4 py-3 font-semibold text-slate-800">
          {formatCurrency(req.estimatedCost)}
        </td>
        <td className="hidden px-4 py-3 lg:table-cell">
          <UrgencyBadge urgency={req.urgency} />
        </td>
        <td className="px-4 py-3">
          <StatusBadge status={req.status} />
        </td>
        <td className="hidden px-4 py-3 text-xs text-slate-500 xl:table-cell">
          {formatDate(req.createdAt)}
        </td>
        <td className="px-4 py-3">
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 ring-1 ring-slate-200 transition hover:bg-white hover:text-slate-600"
            aria-label={expanded ? "Collapse details" : "Expand details"}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-slate-50/50">
          <td colSpan={9} className="px-4 py-4 lg:px-6 lg:py-5">
            <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200 sm:p-5">
              <AuditTrailTimeline entries={req.auditTrail} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function TransactionLog() {
  const { filteredRequests, branchFilter, setBranchFilter, stats } = useWorkflow();
  const [search, setSearch] = useState("");

  const displayed = filteredRequests.filter((req) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      req.id.toLowerCase().includes(q) ||
      req.itemName.toLowerCase().includes(q) ||
      req.branch.toLowerCase().includes(q) ||
      req.requester.toLowerCase().includes(q)
    );
  });

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="border-b border-slate-100 px-3 py-3 sm:px-4 sm:py-4 md:px-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
              COPO Transaction Log / سجل معاملات كوبو
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              {displayed.length} records across COPO branches · Tap to view audit trail
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <div className="relative w-full sm:max-w-xs sm:flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, item, branch..."
                className="w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-9 pr-4 text-sm ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Filter className="h-4 w-4 shrink-0 text-slate-400" />
              <select
                value={branchFilter}
                onChange={(e) =>
                  setBranchFilter(e.target.value as typeof branchFilter)
                }
                className="w-full rounded-xl border-0 bg-slate-50 px-3 py-2.5 text-sm ring-1 ring-slate-200 transition focus:ring-2 focus:ring-emerald-500 sm:w-auto"
              >
                <option value="All">All COPO Branches / جميع فروع كوبو</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 p-3 md:hidden">
        {displayed.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">
            No transactions found for the selected filter
          </p>
        ) : (
          displayed.map((req) => <TransactionMobileCard key={req.id} req={req} />)
        )}
      </div>

      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm lg:min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 lg:px-6">
                Transaction ID / رقم المعاملة
              </th>
              <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">
                Branch / الفرع
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Item / الصنف
              </th>
              <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:table-cell">
                Qty
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Cost (SAR)
              </th>
              <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">
                Urgency
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 xl:table-cell">
                Date
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Audit
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                  No transactions found for the selected filter
                </td>
              </tr>
            ) : (
              displayed.map((req) => <TransactionRow key={req.id} req={req} />)
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-6">
        <p className="text-[11px] text-slate-500 sm:text-xs">
          Showing {displayed.length} of {stats.total} COPO transactions
        </p>
        <div className="flex flex-wrap gap-3 text-[11px] sm:gap-4 sm:text-xs">
          <span className="text-amber-600">{stats.pending} pending</span>
          <span className="text-emerald-600">{stats.approved} approved</span>
          <span className="text-rose-600">{stats.rejected} rejected</span>
        </div>
      </div>
    </div>
  );
}
