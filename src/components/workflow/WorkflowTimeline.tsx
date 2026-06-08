"use client";

import { Check, ChevronRight, Clock, SkipForward, X } from "lucide-react";
import { StepStatusBadge } from "@/components/shared/StatusBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import type { StepStatus, WorkflowStep } from "@/types";
import { cn } from "@/lib/utils";

function StepIcon({ status }: { status: StepStatus }) {
  if (status === "completed") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-emerald-100">
        <Check size={14} strokeWidth={3} />
      </span>
    );
  }
  if (status === "skipped") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-400 text-white ring-4 ring-slate-100">
        <SkipForward size={12} />
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white ring-4 ring-rose-100">
        <X size={14} />
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-50 text-amber-600 ring-4 ring-amber-100">
        <Clock size={14} />
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-slate-400 ring-4 ring-slate-50">
      <Clock size={14} />
    </span>
  );
}

function BranchList({ steps }: { steps: WorkflowStep[] }) {
  return (
    <div className="relative ml-4 mt-2 space-y-1.5 border-l-2 border-slate-200 pl-4">
      {steps.map((step) => (
        <div
          key={step.id}
          className="relative flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200"
        >
          <span className="absolute -left-[21px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-slate-300" />
          <div className="flex min-w-0 items-center gap-2">
            <ChevronRight size={14} className="shrink-0 text-slate-400" />
            <span className="truncate text-xs text-slate-700">{step.titleAr}</span>
          </div>
          <StepStatusBadge status={step.status} />
        </div>
      ))}
    </div>
  );
}

function StepNode({ step, isLast }: { step: WorkflowStep; isLast: boolean }) {
  return (
    <div className="relative flex gap-3 pb-6 last:pb-0">
      {!isLast && (
        <div className="absolute left-[15px] top-9 h-[calc(100%-12px)] w-px bg-slate-200" />
      )}

      <div className="relative z-10 shrink-0">
        <StepIcon status={step.status} />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
          <h5 className="text-xs font-medium leading-snug text-slate-800 sm:text-sm">
            <span className="block sm:inline">{step.titleEn}</span>
            <span className="mx-1 hidden text-slate-300 sm:inline">·</span>
            <span className="block text-slate-600 sm:inline">{step.titleAr}</span>
          </h5>
          <StepStatusBadge status={step.status} />
        </div>

        {step.assignee && (
          <div className="mt-2 flex items-center gap-2">
            <UserAvatar user={step.assignee} size="sm" />
            <span className="text-xs text-slate-600">{step.assignee.name}</span>
          </div>
        )}

        {step.timestamp && (
          <p className="mt-1 text-[11px] text-slate-400">{step.timestamp}</p>
        )}
        {step.deadline && (
          <p className="mt-1 text-[11px] font-medium text-amber-700">{step.deadline}</p>
        )}

        {step.children && step.children.length > 0 && (
          <BranchList steps={step.children} />
        )}
      </div>
    </div>
  );
}

export function WorkflowTimeline({ steps }: { steps: WorkflowStep[] }) {
  return (
    <div className="overflow-y-auto pr-1 sm:pr-2">
      <div className="relative">
        {steps.map((step, index) => (
          <StepNode key={step.id} step={step} isLast={index === steps.length - 1} />
        ))}
        <div className="ml-[13px] h-2 w-2 rounded-full bg-slate-300" />
      </div>
    </div>
  );
}
