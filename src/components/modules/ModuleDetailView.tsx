"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Printer, X } from "lucide-react";
import { RightPanelWithActions } from "@/components/panel/RightPanel";
import { RequestStatusBadge } from "@/components/shared/StatusBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import type { ModuleConfig, ModuleRecord } from "@/types/modules";
import type { PanelTab } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function ModuleDetailView({
  record,
  config,
}: {
  record: ModuleRecord;
  config: ModuleConfig;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PanelTab>("workflow");

  return (
    <div className="flex min-h-0 flex-col lg:min-h-[100dvh] lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-slate-200 bg-white px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500 sm:text-sm">
                {config.code} · {record.refNo} · {record.branch.nameEn}
              </p>
              <h1 className="mt-1 text-base font-semibold text-slate-900 sm:text-lg">
                {record.title}
              </h1>
              <p className="text-xs text-slate-500 sm:text-sm">{record.titleAr}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <RequestStatusBadge status={record.status} />
                <span className="text-xs text-slate-500">
                  Stage: {record.currentStage}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 gap-0.5">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Printer size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="hidden h-9 w-9 sm:flex">
                <Copy size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => router.push(config.basePath)}
              >
                <X size={18} />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#fafaf7] p-3 sm:p-6">
          <div className="mx-auto max-w-5xl space-y-4 sm:space-y-6">
            {record.amount != null && (
              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:p-5">
                <p className="text-xs text-slate-500">Amount | المبلغ</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(record.amount)} ريال
                </p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                <p className="text-xs text-slate-500">Branch | الفرع</p>
                <p className="mt-1 font-medium text-slate-800">{record.branch.nameEn}</p>
                <p className="text-xs text-slate-500">{record.branch.nameAr}</p>
              </div>
              <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                <p className="text-xs text-slate-500">Date | التاريخ</p>
                <p className="mt-1 font-medium text-slate-800">
                  {formatDate(record.date)}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <UserAvatar user={record.requester} size="sm" />
                  <span className="text-sm text-slate-700">{record.requester.name}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">Details | التفاصيل</p>
              </div>
              <dl className="divide-y divide-slate-50">
                {record.fields.map((field) => (
                  <div
                    key={field.labelEn}
                    className="grid gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4"
                  >
                    <dt className="text-xs text-slate-500 sm:col-span-1">
                      {field.labelEn} | {field.labelAr}
                    </dt>
                    <dd className="text-sm font-medium text-slate-800 sm:col-span-2">
                      {field.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 flex flex-wrap justify-end gap-2 border-t border-slate-200 bg-white p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] sm:px-6 lg:static lg:shadow-none">
          <Button variant="secondary">Save / حفظ</Button>
          <Button variant="secondary" onClick={() => router.push(config.basePath)}>
            Discard
          </Button>
          <Button variant="success">Approve / موافقة</Button>
          <Button variant="destructive">Reject / رفض</Button>
        </div>
      </div>

      <RightPanelWithActions
        request={{
          id: record.id,
          seq: 0,
          requestNo: record.refNo,
          date: record.date,
          branch: record.branch,
          requester: record.requester,
          operationType: { id: "", nameEn: config.titleEn, nameAr: config.titleAr },
          searchKeyword: record.title,
          lineItems: [],
          status: record.status,
          currentStage: record.currentStage,
          workflow: record.workflow,
          comments: record.comments,
          attachments: record.attachments,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddComment={() => {}}
      />
    </div>
  );
}
