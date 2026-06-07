"use client";

import type { AuditActionType } from "@/types/workflow";
import {
  CheckCircle2,
  Clock,
  FileText,
  Send,
  Shield,
  Wallet,
  XCircle,
} from "lucide-react";
import type { AuditLogEntry } from "@/types/workflow";
import { formatAuditTimestamp } from "@/utils/auditTrail";

const actionStyles: Record<
  AuditActionType,
  { icon: typeof FileText; dot: string; line: string }
> = {
  created: {
    icon: FileText,
    dot: "bg-emerald-500 ring-emerald-100",
    line: "bg-emerald-200",
  },
  submitted_for_review: {
    icon: Send,
    dot: "bg-blue-500 ring-blue-100",
    line: "bg-blue-200",
  },
  area_manager_approved: {
    icon: Shield,
    dot: "bg-indigo-500 ring-indigo-100",
    line: "bg-indigo-200",
  },
  area_manager_rejected: {
    icon: XCircle,
    dot: "bg-rose-500 ring-rose-100",
    line: "bg-rose-200",
  },
  finance_approved: {
    icon: Wallet,
    dot: "bg-violet-500 ring-violet-100",
    line: "bg-violet-200",
  },
  finance_rejected: {
    icon: XCircle,
    dot: "bg-rose-500 ring-rose-100",
    line: "bg-rose-200",
  },
  final_approved: {
    icon: CheckCircle2,
    dot: "bg-teal-500 ring-teal-100",
    line: "bg-teal-200",
  },
  final_rejected: {
    icon: XCircle,
    dot: "bg-rose-500 ring-rose-100",
    line: "bg-rose-200",
  },
  status_updated: {
    icon: Clock,
    dot: "bg-amber-500 ring-amber-100",
    line: "bg-amber-200",
  },
};

interface AuditTrailTimelineProps {
  entries: AuditLogEntry[];
  compact?: boolean;
}

export function AuditTrailTimeline({ entries, compact = false }: AuditTrailTimelineProps) {
  const safeEntries = entries ?? [];

  if (safeEntries.length === 0) {
    return (
      <p className="text-sm text-slate-400">No audit records yet / لا توجد سجلات</p>
    );
  }

  return (
    <div className={compact ? "space-y-0" : ""}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-4">
        <h4 className="text-xs font-semibold text-slate-900 sm:text-sm">
          Operations Audit Trail / تسلسل العمليات
        </h4>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
          {safeEntries.length} events
        </span>
      </div>

      <div className="relative space-y-0">
        {safeEntries.map((entry, index) => {
          const style = actionStyles[entry.action];
          const Icon = style.icon;
          const isLast = index === safeEntries.length - 1;

          return (
            <div key={entry.id} className="relative flex gap-2.5 pb-5 last:pb-0 sm:gap-4 sm:pb-6">
              {!isLast && (
                <div
                  className={`absolute left-[13px] top-7 h-[calc(100%-10px)] w-0.5 sm:left-[15px] sm:top-8 sm:h-[calc(100%-12px)] ${style.line}`}
                />
              )}

              <div
                className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-2 sm:h-8 sm:w-8 sm:ring-4 ${style.dot}`}
              >
                <Icon size={12} className="text-white sm:h-3.5 sm:w-3.5" />
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                  <time className="break-all font-mono text-[10px] font-semibold text-slate-500 sm:break-normal sm:text-[11px]">
                    {formatAuditTimestamp(entry.timestamp)}
                  </time>
                  <span className="w-fit rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-600 sm:text-[10px]">
                    {entry.actorRole} / {entry.actorRoleAr}
                  </span>
                </div>
                <p className="mt-1 break-words text-xs font-medium text-slate-800 sm:text-sm">
                  {entry.messageEn}
                </p>
                <p className="mt-0.5 break-words text-[11px] text-slate-500 sm:text-xs">
                  {entry.messageAr}
                </p>
                {!compact && (
                  <p className="mt-1 text-[10px] text-slate-400">
                    {entry.actorName}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
