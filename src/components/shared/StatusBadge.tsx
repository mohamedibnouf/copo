import type { RequestStatus, StepStatus } from "@/types";
import { cn } from "@/lib/utils";

const stepStyles: Record<
  StepStatus,
  { label: string; className: string }
> = {
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  in_progress: {
    label: "In progress",
    className: "bg-amber-50 text-amber-800 ring-amber-200",
  },
  not_started: {
    label: "Not started",
    className: "bg-slate-100 text-slate-500 ring-slate-200",
  },
  skipped: {
    label: "Skipped",
    className: "bg-slate-100 text-slate-400 ring-slate-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
  },
};

const requestStyles: Record<
  RequestStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  },
  pending: {
    label: "Pending",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-amber-50 text-amber-800 ring-amber-200",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
};

export function StepStatusBadge({ status }: { status: StepStatus }) {
  const s = stepStyles[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1",
        s.className
      )}
    >
      {s.label}
    </span>
  );
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const s = requestStyles[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1",
        s.className
      )}
    >
      {s.label}
    </span>
  );
}
