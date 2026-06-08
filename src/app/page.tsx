"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, FileText, XCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { RequestTable } from "@/components/requests/RequestTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { calcTotal, formatCurrency, formatDate } from "@/lib/utils";
import { COMPANY } from "@/data/mock-data";

export default function DashboardPage() {
  const { stats, requests } = useApp();
  const recent = requests.slice(0, 5);

  const statCards = [
    {
      label: "Total Requests",
      labelAr: "إجمالي الطلبات",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "In Progress",
      labelAr: "قيد المعالجة",
      value: stats.inProgress,
      icon: Clock3,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Completed",
      labelAr: "مكتملة",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Rejected",
      labelAr: "مرفوضة",
      value: stats.rejected,
      icon: XCircle,
      color: "text-rose-600 bg-rose-50",
    },
  ];

  return (
    <>
      <Header
        title="Dashboard"
        subtitle={`${COMPANY.nameEn} · ${COMPANY.nameAr} · Internal Transactions Demo`}
      />

      <main className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ label, labelAr, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-500">
                    {label}
                    <span className="block text-xs">{labelAr}</span>
                  </CardTitle>
                  <span className={`rounded-xl p-2 ${color}`}>
                    <Icon size={18} />
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle>Recent Transactions | آخر المعاملات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recent.map((req) => (
                <Link
                  key={req.id}
                  href={`/financial-requests/${req.id}`}
                  className="block rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100 transition hover:bg-slate-100"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-xs font-bold text-slate-900">
                        {req.requestNo}
                      </p>
                      <p className="mt-1 line-clamp-1 text-sm text-slate-700">
                        {req.searchKeyword || req.lineItems[0]?.purpose}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(req.date)} · {req.requester.name}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-slate-900">
                      {formatCurrency(calcTotal(req.lineItems))}
                    </p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base sm:text-lg">
                Requests Overview | نظرة عامة
              </CardTitle>
              <Button asChild size="sm" className="w-full sm:w-auto">
                <Link href="/financial-requests/new">
                  New Request
                  <ArrowRight size={14} />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <RequestTable requests={requests.slice(0, 6)} compact />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
