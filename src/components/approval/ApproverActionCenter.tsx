"use client";

import {
  CheckCircle,
  Inbox,
  Shield,
  XCircle,
} from "lucide-react";
import { getRoleConfig } from "@/constants/roles";
import { useWorkflow } from "@/context/WorkflowContext";
import { RequestDetailPanel } from "@/components/request/RequestDetailPanel";
import { WorkflowPipelineLegend } from "./WorkflowPipeline";
import { TransactionIdBadge } from "@/components/ui/TransactionIdBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function ApproverActionCenter() {
  const { currentRole, pendingForRole, requests, approveRequest, rejectRequest } =
    useWorkflow();

  const canApprove =
    currentRole === "area_manager" || currentRole === "finance";

  const displayRequests = canApprove
    ? pendingForRole
    : requests.filter((r) => r.status === "Pending");

  const roleLabel = `${getRoleConfig(currentRole).demoLabel} / ${getRoleConfig(currentRole).labelAr}`;

  return (
    <div className="space-y-6">
      <WorkflowPipelineLegend />

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
              <Shield className="h-5 w-5 text-indigo-700" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                Approver Action Center / مركز موافقات كوبو
              </h3>
              <p className="text-sm text-slate-500">
                Acting as: <span className="font-medium text-indigo-700">{roleLabel}</span>
              </p>
            </div>
          </div>
          <span className="self-start rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 sm:text-sm">
            {displayRequests.length} pending
          </span>
        </div>

        {displayRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Inbox className="mb-3 h-12 w-12 text-slate-300" />
            <p className="font-medium text-slate-600">No pending requests</p>
            <p className="mt-1 text-sm text-slate-400">
              {canApprove
                ? "All requests have been processed for your role"
                : "Switch to Area Manager or Finance role to approve requests"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {displayRequests.map((req) => {
              const showAreaActions =
                currentRole === "area_manager" &&
                (!req.requiresDoubleApproval || !req.areaManagerApproved);
              const showFinanceActions =
                currentRole === "finance" &&
                req.requiresDoubleApproval &&
                req.areaManagerApproved &&
                !req.financeApproved;
              const showDemoActions = currentRole === "requester" || currentRole === "viewer";

              return (
                <div key={req.id} className="p-3 transition hover:bg-slate-50/50 sm:p-4 md:p-6">
                  <RequestDetailPanel request={req}>
                    {(showAreaActions || showFinanceActions || showDemoActions) && (
                      <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:flex-wrap sm:gap-3">
                        {(showAreaActions || showDemoActions) && (
                          <>
                            <button
                              onClick={() =>
                                approveRequest(req.id, "area_manager")
                              }
                              disabled={showDemoActions}
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:justify-start"
                            >
                              <CheckCircle size={16} />
                              Approve / موافقة
                            </button>
                            <button
                              onClick={() =>
                                rejectRequest(req.id, "Rejected by Area Manager")
                              }
                              disabled={showDemoActions}
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:justify-start"
                            >
                              <XCircle size={16} />
                              Reject / رفض
                            </button>
                          </>
                        )}
                        {showFinanceActions && (
                          <>
                            <button
                              onClick={() => approveRequest(req.id, "finance")}
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 sm:w-auto sm:justify-start"
                            >
                              <CheckCircle size={16} />
                              Finance Approve / موافقة مالية
                            </button>
                            <button
                              onClick={() =>
                                rejectRequest(req.id, "Rejected by Finance")
                              }
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-50 sm:w-auto sm:justify-start"
                            >
                              <XCircle size={16} />
                              Reject / رفض
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {showDemoActions && (
                      <p className="text-xs text-slate-400">
                        Switch role to Area Manager or Finance to approve/reject
                      </p>
                    )}
                  </RequestDetailPanel>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 sm:p-4 md:p-6">
        <h4 className="mb-4 text-sm font-semibold text-slate-900">
          All COPO Requests / جميع طلبات كوبو
        </h4>
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100"
            >
              <div className="min-w-0 flex-1">
                <TransactionIdBadge id={req.id} branch={req.branch} size="sm" />
                <p className="mt-1 truncate text-sm font-medium text-slate-800">
                  {req.itemName}
                </p>
                <p className="text-xs text-slate-500">{req.branch}</p>
              </div>
              <StatusBadge status={req.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
