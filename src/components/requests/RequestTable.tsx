"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { RequestStatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import type { TransactionRequest } from "@/types";
import { calcTotal, formatCurrency, formatDate } from "@/lib/utils";

function RequestMobileCard({
  req,
  showStage,
}: {
  req: TransactionRequest;
  showStage?: boolean;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-mono text-sm font-bold text-slate-900">{req.requestNo}</p>
          <p className="mt-1 line-clamp-2 text-sm text-slate-700">
            {req.searchKeyword || req.lineItems[0]?.purpose}
          </p>
        </div>
        <RequestStatusBadge status={req.status} />
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
        <div>
          <dt className="text-slate-400">Requester</dt>
          <dd className="font-medium text-slate-700">{req.requester.name}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Date</dt>
          <dd className="text-slate-700">{formatDate(req.date)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-slate-400">Branch</dt>
          <dd className="text-slate-700">
            {req.branch.nameEn}
            <span className="block text-slate-400">{req.branch.nameAr}</span>
          </dd>
        </div>
        <div>
          <dt className="text-slate-400">Operation</dt>
          <dd className="text-slate-700">{req.operationType.nameEn}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Amount</dt>
          <dd className="font-semibold text-slate-900">
            {formatCurrency(calcTotal(req.lineItems))} SAR
          </dd>
        </div>
        {showStage && (
          <div className="col-span-2">
            <dt className="text-slate-400">Stage</dt>
            <dd className="text-slate-700">{req.currentStage}</dd>
          </div>
        )}
      </dl>

      <Button variant="secondary" size="sm" className="mt-4 w-full" asChild>
        <Link href={`/financial-requests/${req.id}`}>
          <Eye size={14} />
          View / عرض
        </Link>
      </Button>
    </article>
  );
}

export function RequestTable({
  requests,
  compact = false,
}: {
  requests: TransactionRequest[];
  compact?: boolean;
}) {
  if (requests.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-slate-400">No requests found</p>
    );
  }

  return (
    <>
      {/* Mobile & tablet cards */}
      <div className="space-y-3 lg:hidden">
        {requests.map((req) => (
          <RequestMobileCard key={req.id} req={req} showStage={!compact} />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Request No</th>
              <th className="px-4 py-3">Requester</th>
              <th className="px-4 py-3">Branch</th>
              <th className="px-4 py-3">Operation</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              {!compact && <th className="px-4 py-3">Stage</th>}
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr
                key={req.id}
                className="border-b border-slate-50 transition hover:bg-slate-50/60"
              >
                <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                  {req.requestNo}
                </td>
                <td className="px-4 py-3 text-slate-700">{req.requester.name}</td>
                <td className="px-4 py-3 text-slate-600">
                  {req.branch.nameEn}
                  <span className="block text-xs text-slate-400">{req.branch.nameAr}</span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {req.operationType.nameEn}
                </td>
                <td className="px-4 py-3 text-slate-600">{formatDate(req.date)}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {formatCurrency(calcTotal(req.lineItems))} SAR
                </td>
                <td className="px-4 py-3">
                  <RequestStatusBadge status={req.status} />
                </td>
                {!compact && (
                  <td className="px-4 py-3 text-slate-600">{req.currentStage}</td>
                )}
                <td className="px-4 py-3 text-right">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/financial-requests/${req.id}`}>
                      <Eye size={14} />
                      View
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
