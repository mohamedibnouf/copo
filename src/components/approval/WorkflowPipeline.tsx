"use client";

import { Check, Circle, Clock } from "lucide-react";
import type { PurchaseRequest, WorkflowStep } from "@/types/workflow";

const STEPS: { key: WorkflowStep; label: string; labelAr: string }[] = [
  { key: "Created", label: "Created", labelAr: "تم الإنشاء" },
  { key: "Under Review", label: "Under Review", labelAr: "قيد المراجعة" },
  { key: "Final Approval", label: "Final Approval", labelAr: "الموافقة النهائية" },
];

function getStepIndex(step: WorkflowStep): number {
  return STEPS.findIndex((s) => s.key === step);
}

function getStepState(
  stepIndex: number,
  currentIndex: number,
  status: PurchaseRequest["status"]
): "completed" | "current" | "upcoming" | "rejected" {
  if (status === "Rejected" && stepIndex === currentIndex) return "rejected";
  if (stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "current";
  return "upcoming";
}

export function WorkflowPipeline({ request }: { request: PurchaseRequest }) {
  const currentIndex = getStepIndex(request.workflowStep);

  return (
    <div className="-mx-1 overflow-x-auto pb-1">
      <div className="flex min-w-[300px] items-center gap-0.5 px-1 sm:min-w-0 sm:gap-1">
        {STEPS.map((step, index) => {
          const state = getStepState(index, currentIndex, request.status);
          const isLast = index === STEPS.length - 1;

          return (
            <div key={step.key} className="flex flex-1 items-center">
              <div className="flex min-w-[72px] flex-col items-center sm:min-w-0">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-all sm:h-8 sm:w-8 ${
                    state === "completed"
                      ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200"
                      : state === "current"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-2 ring-indigo-100 sm:ring-4"
                        : state === "rejected"
                          ? "bg-rose-500 text-white shadow-sm shadow-rose-200"
                          : "bg-slate-100 text-slate-400 ring-1 ring-slate-200"
                  }`}
                >
                  {state === "completed" ? (
                    <Check size={12} strokeWidth={3} className="sm:h-3.5 sm:w-3.5" />
                  ) : state === "current" ? (
                    <Clock size={12} className="sm:h-3.5 sm:w-3.5" />
                  ) : state === "rejected" ? (
                    <span className="text-[10px] font-bold sm:text-xs">✕</span>
                  ) : (
                    <Circle size={8} fill="currentColor" className="sm:h-2.5 sm:w-2.5" />
                  )}
                </div>
                <p
                  className={`mt-1 px-0.5 text-center text-[8px] font-medium leading-tight sm:mt-1.5 sm:text-[10px] ${
                    state === "current"
                      ? "text-indigo-700"
                      : state === "completed"
                        ? "text-emerald-700"
                        : state === "rejected"
                          ? "text-rose-700"
                          : "text-slate-400"
                  }`}
                >
                  <span className="block sm:hidden">
                    {step.label.split(" ")[0]}
                  </span>
                  <span className="hidden sm:block">{step.label}</span>
                  <span className="hidden opacity-70 sm:block">{step.labelAr}</span>
                </p>
              </div>
              {!isLast && (
                <div
                  className={`mx-0.5 mb-4 h-0.5 flex-1 rounded-full sm:mx-1 sm:mb-5 ${
                    index < currentIndex
                      ? "bg-emerald-400"
                      : state === "rejected"
                        ? "bg-rose-200"
                        : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WorkflowPipelineLegend() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
      <h4 className="mb-3 text-sm font-semibold text-slate-900 sm:mb-4">
        Pipeline Overview / نظرة عامة على سير العمل
      </h4>
      <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {STEPS.map((step, index) => (
          <div key={step.key} className="flex flex-col items-center text-center sm:flex-1">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold sm:h-10 sm:w-10 sm:text-sm ${
                index === 0
                  ? "bg-emerald-100 text-emerald-700"
                  : index === 1
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-teal-100 text-teal-700"
              }`}
            >
              {index + 1}
            </div>
            <p className="mt-1.5 text-[10px] font-medium leading-tight text-slate-700 sm:mt-2 sm:text-xs">
              {step.label}
            </p>
            <p className="text-[9px] text-slate-400 sm:text-[10px]">{step.labelAr}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-600 sm:mt-4 sm:text-xs">
        <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
        <span>
          Requests over 5,000 SAR require COPO Area Manager + Finance Manager approval
        </span>
      </div>
    </div>
  );
}
