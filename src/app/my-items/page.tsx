"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { RequestStatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { USERS } from "@/data/mock-data";
import { getModuleDetailPath, getMyModuleRecords } from "@/data/modules-mock";
import { useApp } from "@/context/AppContext";
import { calcTotal, formatCurrency, formatDate } from "@/lib/utils";

export default function MyItemsPage() {
  const { requests } = useApp();
  const myFinancial = requests.filter((r) => r.requester.id === USERS.othman.id);
  const myModules = getMyModuleRecords(USERS.othman.id);

  const items = [
    ...myFinancial.map((r) => ({
      id: r.id,
      refNo: r.requestNo,
      title: r.searchKeyword || r.lineItems[0]?.purpose || "Payment request",
      date: r.date,
      status: r.status,
      amount: calcTotal(r.lineItems),
      href: `/financial-requests/${r.id}`,
    })),
    ...myModules.map((r) => ({
      id: r.id,
      refNo: r.refNo,
      title: r.title,
      date: r.date,
      status: r.status,
      amount: r.amount,
      href: getModuleDetailPath(r),
    })),
  ];

  return (
    <>
      <Header
        title="My items"
        subtitle={`Assigned to ${USERS.othman.name} · COPO KSA`}
      />
      <main className="space-y-4 p-4 sm:p-6 lg:p-8">
        {items.length === 0 ? (
          <p className="py-12 text-center text-slate-400">No items assigned to you</p>
        ) : (
          items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm font-bold text-slate-900">{item.refNo}</p>
                <p className="mt-1 truncate text-sm text-slate-700">{item.title}</p>
                <p className="mt-1 text-xs text-slate-400">{formatDate(item.date)}</p>
              </div>
              <div className="flex items-center gap-3">
                {item.amount != null && (
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(item.amount)} SAR
                  </span>
                )}
                <RequestStatusBadge status={item.status} />
                <Button variant="secondary" size="sm" asChild>
                  <Link href={item.href}>
                    <Eye size={14} />
                    View
                  </Link>
                </Button>
              </div>
            </article>
          ))
        )}
      </main>
    </>
  );
}
