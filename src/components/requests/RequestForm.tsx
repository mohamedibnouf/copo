"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { emptyLine, LineItemsTable, type LineItemDraft } from "@/components/requests/LineItemsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { calcTotal, formatCurrency, generateRequestNo } from "@/lib/utils";
import { getNextSeq } from "@/data/mock-data";

export function RequestForm() {
  const router = useRouter();
  const { createRequest, submitRequest, branches, operationTypes, users, requests } =
    useApp();

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [branchId, setBranchId] = useState(branches[0].id);
  const [requesterId, setRequesterId] = useState(users.othman.id);
  const [operationTypeId, setOperationTypeId] = useState(operationTypes[0].id);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [lineItems, setLineItems] = useState<LineItemDraft[]>([emptyLine()]);

  const nextSeq = getNextSeq(requests);
  const previewNo = generateRequestNo(nextSeq);
  const requester = Object.values(users).find((u) => u.id === requesterId)!;
  const total = calcTotal(lineItems);

  const buildPayload = () => ({
    date,
    branchId,
    requesterId,
    operationTypeId,
    searchKeyword: searchKeyword || lineItems[0]?.purpose || "",
    lineItems: lineItems.map(({ purpose, beneficiary, value, documentNumber, notes, attachmentName }) => ({
      purpose,
      beneficiary,
      value,
      documentNumber,
      notes,
      attachmentName,
    })),
  });

  const handleSave = () => {
    const req = createRequest(buildPayload());
    router.push(`/financial-requests/${req.id}`);
  };

  const handleSubmit = () => {
    const req = createRequest(buildPayload());
    submitRequest(req.id);
    router.push(`/financial-requests/${req.id}`);
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-[#fafaf7] shadow-sm">
      <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
        <p className="text-sm text-slate-500">
          from {requester.name} , , {branches.find((b) => b.id === branchId)?.nameEn}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-slate-900">
          New Transaction Request | معاملة جديدة
        </h2>
      </div>

      <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm text-slate-600">
              <BilingualLabel en="Seq #" ar="الرقم التسلسلي" />
            </label>
            <Input
              readOnly
              value={previewNo}
              className="border-emerald-200 bg-emerald-50/70 font-mono font-semibold text-emerald-900"
            />
            <p className="mt-1 text-xs text-slate-400">رقم المعاملة التسلسلي</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-600">
              <BilingualLabel en="Date" ar="تاريخ الطلب" required />
            </label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-600">
              <BilingualLabel en="Branch name" ar="إسم الفرع" required />
            </label>
            <Select value={branchId} onValueChange={setBranchId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.nameEn} | {branch.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-slate-400">العلامة التجارية</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-600">
              <BilingualLabel en="Name" ar="صاحب الطلب" required />
            </label>
            <div className="flex items-center gap-2">
              <UserAvatar user={requester} size="sm" />
              <Select value={requesterId} onValueChange={setRequesterId}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(users).map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-600">
              <BilingualLabel en="Operation type" ar="نوع العملية" required />
            </label>
            <Select value={operationTypeId} onValueChange={setOperationTypeId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {operationTypes.map((op) => (
                  <SelectItem key={op.id} value={op.id}>
                    {op.nameEn} | {op.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-600">
              <BilingualLabel en="Search keyword" ar="كلمة مفتاحية للبحث" />
            </label>
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="For future search..."
            />
          </div>
        </div>

        <LineItemsTable items={lineItems} onChange={setLineItems} />

        <div className="rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200">
          <p className="text-xs text-slate-500">Coupon total | إجمالي القسيمة</p>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(total)} SAR
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-3 sm:flex sm:flex-wrap sm:justify-end sm:gap-2 sm:px-6 sm:py-4">
        <Button
          variant="secondary"
          type="button"
          onClick={() => router.back()}
          className="min-h-[44px]"
        >
          Discard / تجاهل
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={handleSave}
          className="min-h-[44px]"
        >
          Save / حفظ
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="col-span-2 min-h-[44px] sm:col-span-1"
        >
          Submit / إرسال
        </Button>
      </div>
    </div>
  );
}
