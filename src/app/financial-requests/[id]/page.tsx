"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Copy, Printer, X } from "lucide-react";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { RequestStatusBadge } from "@/components/shared/StatusBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { LineItemsTable } from "@/components/requests/LineItemsTable";
import { RightPanelWithActions } from "@/components/panel/RightPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import type { PanelTab } from "@/types";
import { calcTotal, formatCurrency } from "@/lib/utils";

const BASE = "/financial-requests";

export default function FinancialRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const {
    getRequest,
    updateRequest,
    submitRequest,
    approveRequest,
    rejectRequest,
    withdrawRequest,
    addComment,
  } = useApp();

  const request = getRequest(id);
  const [activeTab, setActiveTab] = useState<PanelTab>("workflow");
  const [searchKeyword, setSearchKeyword] = useState(request?.searchKeyword ?? "");

  if (!request) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-700">Request not found</p>
          <Button className="mt-4" onClick={() => router.push(BASE)}>
            Back to Financial Requests
          </Button>
        </div>
      </div>
    );
  }

  const total = calcTotal(request.lineItems);
  const headerTitle = `from ${request.requester.name}, ${request.requestNo}, ${request.branch.nameEn}`;

  return (
    <div className="flex min-h-0 flex-col lg:min-h-[100dvh] lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-slate-200 bg-white px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-3 text-xs text-slate-600 sm:text-sm">{headerTitle}</p>
              <p className="mt-1 line-clamp-2 text-xs text-slate-500 sm:text-sm">
                {request.searchKeyword}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <RequestStatusBadge status={request.status} />
                <span className="text-xs text-slate-500">Stage: {request.currentStage}</span>
              </div>
            </div>
            <div className="flex shrink-0 gap-0.5">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Printer size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="hidden h-9 w-9 sm:flex">
                <Copy size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.push(BASE)}>
                <X size={18} />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#fafaf7] p-3 sm:p-6">
          <div className="mx-auto max-w-5xl space-y-4 sm:space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:p-5">
                <h3 className="text-sm font-semibold text-slate-800">الإجمالي</h3>
                <p className="text-xs text-slate-500">Coupon total | إجمالي القسيمة</p>
                <p className="mt-2 rounded-xl bg-slate-100 px-3 py-3 text-xl font-bold text-slate-900 sm:text-2xl">
                  {formatCurrency(total)} ريال
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:p-5">
                <label className="text-xs text-slate-500">
                  <BilingualLabel en="Search keyword" ar="كلمة مفتاحية للبحث" />
                </label>
                <Input
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="mt-2 border-emerald-200 bg-emerald-50/60"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200 sm:p-4">
                <p className="text-xs text-slate-500">Branch | الفرع</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{request.branch.nameEn}</p>
                <p className="text-xs text-slate-500">{request.branch.nameAr}</p>
              </div>
              <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200 sm:p-4">
                <p className="text-xs text-slate-500">Operation | نوع العملية</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {request.operationType.nameEn}
                </p>
              </div>
              <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200 sm:col-span-2 sm:p-4 lg:col-span-1">
                <p className="text-xs text-slate-500">Requester | صاحب الطلب</p>
                <div className="mt-2 flex items-center gap-2">
                  <UserAvatar user={request.requester} size="sm" />
                  <span className="text-sm font-medium text-slate-800">
                    {request.requester.name}
                  </span>
                </div>
              </div>
            </div>

            <LineItemsTable items={request.lineItems} onChange={() => {}} readOnly />
          </div>
        </div>

        <div className="sticky bottom-0 z-10 grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-3 sm:flex sm:flex-wrap sm:justify-end sm:gap-2 sm:px-6 lg:static">
          <Button variant="secondary" onClick={() => updateRequest(id, { searchKeyword })}>
            Save
          </Button>
          <Button variant="secondary" onClick={() => router.push(BASE)}>
            Discard
          </Button>
          {request.status === "draft" && (
            <Button onClick={() => submitRequest(id)} className="col-span-2 sm:col-span-1">
              Submit / إرسال
            </Button>
          )}
          {(request.status === "in_progress" || request.status === "pending") && (
            <>
              <Button variant="secondary" onClick={() => withdrawRequest(id)}>Withdraw</Button>
              <Button variant="secondary">Reassign</Button>
              <Button variant="success" onClick={() => approveRequest(id)}>Approve</Button>
              <Button variant="destructive" onClick={() => rejectRequest(id)}>Reject</Button>
            </>
          )}
        </div>
      </div>

      <RightPanelWithActions
        request={request}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddComment={(text) => addComment(id, text)}
      />
    </div>
  );
}
