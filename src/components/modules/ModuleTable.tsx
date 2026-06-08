"use client";

import Link from "next/link";
import { Eye, Filter, Search } from "lucide-react";
import { RequestStatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ModuleRecord } from "@/types/modules";
import { formatCurrency, formatDate } from "@/lib/utils";

export function ModuleTable({
  records,
  basePath,
}: {
  records: ModuleRecord[];
  basePath: string;
}) {
  if (records.length === 0) {
    return <p className="py-12 text-center text-sm text-slate-400">No records found</p>;
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="pl-9" placeholder="Search..." />
        </div>
        <Button variant="secondary" size="sm" className="w-full sm:w-auto">
          <Filter size={14} />
          Filter
        </Button>
      </div>

      <div className="space-y-3 lg:hidden">
        {records.map((rec) => (
          <article
            key={rec.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-sm font-bold text-slate-900">{rec.refNo}</p>
                <p className="mt-1 text-sm text-slate-700">{rec.title}</p>
              </div>
              <RequestStatusBadge status={rec.status} />
            </div>
            <p className="text-xs text-slate-500">
              {rec.branch.nameEn} · {formatDate(rec.date)}
            </p>
            {rec.amount != null && (
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatCurrency(rec.amount)} SAR
              </p>
            )}
            <Button variant="secondary" size="sm" className="mt-3 w-full" asChild>
              <Link href={`${basePath}/${rec.id}`}>
                <Eye size={14} />
                View
              </Link>
            </Button>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Ref No</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Branch</th>
              <th className="px-4 py-3">Requester</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr
                key={rec.id}
                className="border-b border-slate-50 transition hover:bg-slate-50/60"
              >
                <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                  {rec.refNo}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {rec.title}
                  <span className="block text-xs text-slate-400">{rec.titleAr}</span>
                </td>
                <td className="px-4 py-3 text-slate-600">{rec.branch.nameEn}</td>
                <td className="px-4 py-3 text-slate-600">{rec.requester.name}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(rec.date)}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {rec.amount != null ? `${formatCurrency(rec.amount)} SAR` : "—"}
                </td>
                <td className="px-4 py-3">
                  <RequestStatusBadge status={rec.status} />
                </td>
                <td className="px-4 py-3 text-slate-600">{rec.currentStage}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`${basePath}/${rec.id}`}>
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
