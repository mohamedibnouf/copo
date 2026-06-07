import type { RequestStatus, UrgencyLevel } from "@/types/workflow";

const statusStyles: Record<RequestStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 ring-rose-200",
};

const statusLabels: Record<RequestStatus, string> = {
  Pending: "Pending / قيد الانتظار",
  Approved: "Approved / موافق عليه",
  Rejected: "Rejected / مرفوض",
};

const statusShort: Record<RequestStatus, string> = {
  Pending: "Pending",
  Approved: "Approved",
  Rejected: "Rejected",
};

const urgencyStyles: Record<UrgencyLevel, string> = {
  Low: "bg-slate-100 text-slate-600 ring-slate-200",
  Medium: "bg-blue-50 text-blue-700 ring-blue-200",
  High: "bg-orange-50 text-orange-700 ring-orange-200",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset sm:px-2.5 sm:text-xs ${statusStyles[status]}`}
    >
      <span className="truncate sm:hidden">{statusShort[status]}</span>
      <span className="hidden truncate sm:inline">{statusLabels[status]}</span>
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: UrgencyLevel }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset sm:px-2.5 sm:text-xs ${urgencyStyles[urgency]}`}
    >
      {urgency}
    </span>
  );
}

export function DoubleApprovalBadge() {
  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200 sm:px-2.5 sm:text-xs">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
      <span className="truncate sm:hidden">Double Approval</span>
      <span className="hidden truncate sm:inline">Double Approval / موافقة مزدوجة</span>
    </span>
  );
}
