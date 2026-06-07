"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MOCK_REQUESTS } from "@/data/mockData";
import type {
  ActiveView,
  Branch,
  PurchaseRequest,
  UrgencyLevel,
  UserRole,
} from "@/types/workflow";
import {
  buildAreaManagerApprovedEntry,
  buildAreaManagerRejectedEntry,
  buildAwaitingFinanceEntry,
  buildCreatedTrail,
  buildFinalApprovedEntry,
  buildFinanceApprovedEntry,
  buildFinanceRejectedEntry,
  buildPaymentIssuedEntry,
  ensureAuditTrail,
} from "@/utils/auditTrail";
import { generateSequentialId } from "@/utils/transactionId";
import {
  generateJournalEntryId,
  MATCHED_THREE_WAY,
  UNMATCHED_THREE_WAY,
} from "@/utils/journalEntry";
import { getDefaultViewForRole } from "@/constants/roles";

interface NewRequestInput {
  branch: Branch;
  itemName: string;
  quantity: number;
  estimatedCost: number;
  urgency: UrgencyLevel;
  requester: string;
}

interface WorkflowContextValue {
  requests: PurchaseRequest[];
  activeView: ActiveView;
  currentRole: UserRole;
  userRole: UserRole;
  branchFilter: Branch | "All";
  setActiveView: (view: ActiveView) => void;
  switchRole: (role: UserRole) => void;
  setBranchFilter: (branch: Branch | "All") => void;
  submitRequest: (input: NewRequestInput) => PurchaseRequest;
  approveRequest: (id: string, approverRole: "area_manager" | "finance") => void;
  rejectRequest: (id: string, reason?: string) => void;
  issuePayment: (id: string) => void;
  stats: {
    pending: number;
    approved: number;
    readyForPayment: number;
    paid: number;
    rejected: number;
    total: number;
  };
  filteredRequests: PurchaseRequest[];
  pendingForRole: PurchaseRequest[];
  approvedForPayment: PurchaseRequest[];
  paidRequests: PurchaseRequest[];
}

const DEMO_ACTORS = {
  area_manager: "Fahad Al-Malki",
  finance: "Nadia Al-Faraj",
  accountant: "Salman Al-Aud",
};

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<PurchaseRequest[]>(() =>
    MOCK_REQUESTS.map(ensureAuditTrail)
  );
  const [activeView, setActiveView] = useState<ActiveView>("request");
  const [currentRole, setCurrentRole] = useState<UserRole>("requester");
  const [branchFilter, setBranchFilter] = useState<Branch | "All">("All");

  const switchRole = useCallback((role: UserRole) => {
    setCurrentRole(role);
    setActiveView(getDefaultViewForRole(role));
  }, []);

  const submitRequest = useCallback((input: NewRequestInput): PurchaseRequest => {
    const now = new Date().toISOString();
    const requiresDoubleApproval = input.estimatedCost > 5000;

    let newRequest!: PurchaseRequest;

    setRequests((prev) => {
      const id = generateSequentialId(input.branch, prev);
      newRequest = {
        id,
        branch: input.branch,
        itemName: input.itemName,
        quantity: input.quantity,
        estimatedCost: input.estimatedCost,
        urgency: input.urgency,
        status: "Pending",
        workflowStep: "Under Review",
        requiresDoubleApproval,
        areaManagerApproved: false,
        financeApproved: false,
        requester: input.requester,
        createdAt: now,
        updatedAt: now,
        auditTrail: buildCreatedTrail(input.requester, now),
        threeWayMatch: { ...UNMATCHED_THREE_WAY },
      };
      return [newRequest, ...prev];
    });

    return newRequest!;
  }, []);

  const approveRequest = useCallback(
    (id: string, approverRole: "area_manager" | "finance") => {
      setRequests((prev) =>
        prev.map((req) => {
          if (req.id !== id || req.status !== "Pending") return req;

          const base = ensureAuditTrail(req);
          const now = new Date().toISOString();
          const newTrail = [...base.auditTrail];

          if (approverRole === "area_manager") {
            newTrail.push(
              buildAreaManagerApprovedEntry(now, DEMO_ACTORS.area_manager)
            );

            if (!base.requiresDoubleApproval) {
              newTrail.push(buildFinalApprovedEntry(now));
              return {
                ...base,
                areaManagerApproved: true,
                status: "Approved" as const,
                workflowStep: "Final Approval" as const,
                updatedAt: now,
                auditTrail: newTrail,
                threeWayMatch: { ...MATCHED_THREE_WAY },
                notes: undefined,
              };
            }

            if (base.financeApproved) {
              newTrail.push(buildFinalApprovedEntry(now));
              return {
                ...base,
                areaManagerApproved: true,
                status: "Approved" as const,
                workflowStep: "Final Approval" as const,
                updatedAt: now,
                auditTrail: newTrail,
                threeWayMatch: { ...MATCHED_THREE_WAY },
                notes: undefined,
              };
            }

            newTrail.push(buildAwaitingFinanceEntry(now));
            return {
              ...base,
              areaManagerApproved: true,
              updatedAt: now,
              auditTrail: newTrail,
              notes: "Awaiting Finance Manager approval",
            };
          }

          if (approverRole === "finance") {
            if (!base.requiresDoubleApproval) return base;

            newTrail.push(
              buildFinanceApprovedEntry(now, DEMO_ACTORS.finance)
            );

            if (base.areaManagerApproved) {
              newTrail.push(buildFinalApprovedEntry(now));
              return {
                ...base,
                financeApproved: true,
                status: "Approved" as const,
                workflowStep: "Final Approval" as const,
                updatedAt: now,
                auditTrail: newTrail,
                threeWayMatch: { ...MATCHED_THREE_WAY },
                notes: undefined,
              };
            }

            return {
              ...base,
              financeApproved: true,
              updatedAt: now,
              auditTrail: newTrail,
              notes: "Awaiting Area Manager approval",
            };
          }

          return base;
        })
      );
    },
    []
  );

  const rejectRequest = useCallback((id: string, reason?: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req;

        const base = ensureAuditTrail(req);
        const now = new Date().toISOString();
        const rejectReason = reason || "Request rejected by approver";
        const isFinanceReject = reason?.toLowerCase().includes("finance");
        const newTrail = [...base.auditTrail];

        if (isFinanceReject) {
          newTrail.push(
            buildFinanceRejectedEntry(now, rejectReason, DEMO_ACTORS.finance)
          );
        } else {
          newTrail.push(
            buildAreaManagerRejectedEntry(now, rejectReason, DEMO_ACTORS.area_manager)
          );
        }

        return {
          ...base,
          status: "Rejected" as const,
          updatedAt: now,
          notes: rejectReason,
          auditTrail: newTrail,
        };
      })
    );
  }, []);

  const issuePayment = useCallback((id: string) => {
    setRequests((prev) => {
      const journalId = generateJournalEntryId(prev);
      const now = new Date().toISOString();

      return prev.map((req) => {
        if (req.id !== id || req.status !== "Approved") return req;

        const base = ensureAuditTrail(req);
        const newTrail = [
          ...base.auditTrail,
          buildPaymentIssuedEntry(now, journalId, DEMO_ACTORS.accountant),
        ];

        return {
          ...base,
          status: "Paid" as const,
          journalEntryId: journalId,
          paidAt: now,
          updatedAt: now,
          auditTrail: newTrail,
          threeWayMatch: { ...MATCHED_THREE_WAY },
          notes: undefined,
        };
      });
    });
  }, []);

  const normalizedRequests = useMemo(
    () => requests.map(ensureAuditTrail),
    [requests]
  );

  const stats = useMemo(
    () => ({
      pending: normalizedRequests.filter((r) => r.status === "Pending").length,
      approved: normalizedRequests.filter((r) => r.status === "Approved").length,
      readyForPayment: normalizedRequests.filter((r) => r.status === "Approved")
        .length,
      paid: normalizedRequests.filter((r) => r.status === "Paid").length,
      rejected: normalizedRequests.filter((r) => r.status === "Rejected").length,
      total: normalizedRequests.length,
    }),
    [normalizedRequests]
  );

  const approvedForPayment = useMemo(
    () => normalizedRequests.filter((r) => r.status === "Approved"),
    [normalizedRequests]
  );

  const paidRequests = useMemo(
    () => normalizedRequests.filter((r) => r.status === "Paid"),
    [normalizedRequests]
  );

  const filteredRequests = useMemo(() => {
    if (branchFilter === "All") return normalizedRequests;
    return normalizedRequests.filter((r) => r.branch === branchFilter);
  }, [normalizedRequests, branchFilter]);

  const pendingForRole = useMemo(() => {
    return normalizedRequests.filter((req) => {
      if (req.status !== "Pending") return false;

      if (currentRole === "area_manager") {
        if (req.requiresDoubleApproval) {
          return !req.areaManagerApproved;
        }
        return true;
      }

      if (currentRole === "finance") {
        return req.requiresDoubleApproval && req.areaManagerApproved && !req.financeApproved;
      }

      return req.status === "Pending";
    });
  }, [normalizedRequests, currentRole]);

  const value = useMemo(
    () => ({
      requests: normalizedRequests,
      activeView,
      currentRole,
      userRole: currentRole,
      branchFilter,
      setActiveView,
      switchRole,
      setBranchFilter,
      submitRequest,
      approveRequest,
      rejectRequest,
      issuePayment,
      stats,
      filteredRequests,
      pendingForRole,
      approvedForPayment,
      paidRequests,
    }),
    [
      normalizedRequests,
      activeView,
      currentRole,
      branchFilter,
      switchRole,
      submitRequest,
      approveRequest,
      rejectRequest,
      issuePayment,
      stats,
      filteredRequests,
      pendingForRole,
      approvedForPayment,
      paidRequests,
    ]
  );

  return (
    <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within WorkflowProvider");
  }
  return context;
}
