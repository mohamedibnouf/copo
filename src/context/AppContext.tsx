"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BRANCHES,
  buildDefaultWorkflow,
  getNextSeq,
  MOCK_REQUESTS,
  OPERATION_TYPES,
  USERS,
} from "@/data/mock-data";
import type {
  Comment,
  DashboardStats,
  LineItem,
  TransactionRequest,
} from "@/types";
import { calcTotal, generateRequestNo } from "@/lib/utils";

interface NewRequestInput {
  date: string;
  branchId: string;
  requesterId: string;
  operationTypeId: string;
  searchKeyword: string;
  lineItems: Omit<LineItem, "id">[];
}

interface AppContextValue {
  requests: TransactionRequest[];
  stats: DashboardStats;
  getRequest: (id: string) => TransactionRequest | undefined;
  createRequest: (input: NewRequestInput) => TransactionRequest;
  updateRequest: (id: string, patch: Partial<TransactionRequest>) => void;
  submitRequest: (id: string) => void;
  approveRequest: (id: string) => void;
  rejectRequest: (id: string, reason?: string) => void;
  withdrawRequest: (id: string) => void;
  addComment: (requestId: string, text: string, authorId?: string) => void;
  branches: typeof BRANCHES;
  operationTypes: typeof OPERATION_TYPES;
  users: typeof USERS;
}

const AppContext = createContext<AppContextValue | null>(null);

function computeStats(requests: TransactionRequest[]): DashboardStats {
  return {
    total: requests.length,
    inProgress: requests.filter(
      (r) => r.status === "pending" || r.status === "in_progress"
    ).length,
    completed: requests.filter((r) => r.status === "completed").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<TransactionRequest[]>(MOCK_REQUESTS);

  const getRequest = useCallback(
    (id: string) => requests.find((r) => r.id === id),
    [requests]
  );

  const updateRequest = useCallback(
    (id: string, patch: Partial<TransactionRequest>) => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, ...patch, updatedAt: new Date().toISOString() }
            : r
        )
      );
    },
    []
  );

  const createRequest = useCallback(
    (input: NewRequestInput): TransactionRequest => {
      const branch = BRANCHES.find((b) => b.id === input.branchId) ?? BRANCHES[0];
      const requester = Object.values(USERS).find((u) => u.id === input.requesterId) ?? USERS.othman;
      const operationType =
        OPERATION_TYPES.find((o) => o.id === input.operationTypeId) ??
        OPERATION_TYPES[0];
      const seq = getNextSeq(requests);
      const lineItems: LineItem[] = input.lineItems.map((item, i) => ({
        ...item,
        id: `li-new-${Date.now()}-${i}`,
      }));

      const newRequest: TransactionRequest = {
        id: `req-${Date.now()}`,
        seq,
        requestNo: generateRequestNo(seq),
        date: input.date,
        branch,
        requester,
        operationType,
        searchKeyword: input.searchKeyword || lineItems[0]?.purpose || "",
        lineItems,
        status: "draft",
        currentStage: "Draft",
        workflow: buildDefaultWorkflow({ start: "not_started" }),
        comments: [],
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setRequests((prev) => [newRequest, ...prev]);
      return newRequest;
    },
    [requests]
  );

  const submitRequest = useCallback(
    (id: string) => {
      updateRequest(id, {
        status: "in_progress",
        currentStage: "CEO",
        workflow: buildDefaultWorkflow({
          start: "completed",
          "goto-fm": "skipped",
          ceo: "in_progress",
        }),
      });
    },
    [updateRequest]
  );

  const approveRequest = useCallback(
    (id: string) => {
      const req = requests.find((r) => r.id === id);
      if (!req) return;

      if (req.currentStage === "CEO") {
        updateRequest(id, {
          status: "pending",
          currentStage: "Financial Manager",
          workflow: buildDefaultWorkflow({
            start: "completed",
            "goto-fm": "skipped",
            ceo: "completed",
            "attach-invoices": "in_progress",
          }),
        });
        return;
      }

      updateRequest(id, {
        status: "completed",
        currentStage: "Completed",
        workflow: buildDefaultWorkflow({
          start: "completed",
          "goto-fm": "skipped",
          ceo: "completed",
          "attach-invoices": "completed",
          "financial-manager": "completed",
          review: "completed",
          archive: "completed",
          "finance-manager-2": "completed",
          completed: "completed",
        }),
      });
    },
    [requests, updateRequest]
  );

  const rejectRequest = useCallback(
    (id: string, reason = "Request rejected") => {
      const comment: Comment = {
        id: `c-${Date.now()}`,
        author: USERS.saad,
        text: reason,
        createdAt: new Date().toISOString(),
      };
      const req = requests.find((r) => r.id === id);
      if (!req) return;

      updateRequest(id, {
        status: "rejected",
        currentStage: "Rejected",
        workflow: buildDefaultWorkflow({
          start: "completed",
          "goto-fm": "skipped",
          ceo: "rejected",
        }),
        comments: [...req.comments, comment],
      });
    },
    [requests, updateRequest]
  );

  const withdrawRequest = useCallback(
    (id: string) => {
      updateRequest(id, {
        status: "draft",
        currentStage: "Draft",
        workflow: buildDefaultWorkflow({ start: "not_started" }),
      });
    },
    [updateRequest]
  );

  const addComment = useCallback(
    (requestId: string, text: string, authorId = USERS.othman.id) => {
      const req = requests.find((r) => r.id === requestId);
      const author = Object.values(USERS).find((u) => u.id === authorId) ?? USERS.othman;
      if (!req || !text.trim()) return;

      const comment: Comment = {
        id: `c-${Date.now()}`,
        author,
        text: text.trim(),
        createdAt: new Date().toISOString(),
      };

      updateRequest(requestId, { comments: [...req.comments, comment] });
    },
    [requests, updateRequest]
  );

  const stats = useMemo(() => computeStats(requests), [requests]);

  const value = useMemo(
    () => ({
      requests,
      stats,
      getRequest,
      createRequest,
      updateRequest,
      submitRequest,
      approveRequest,
      rejectRequest,
      withdrawRequest,
      addComment,
      branches: BRANCHES,
      operationTypes: OPERATION_TYPES,
      users: USERS,
    }),
    [
      requests,
      stats,
      getRequest,
      createRequest,
      updateRequest,
      submitRequest,
      approveRequest,
      rejectRequest,
      withdrawRequest,
      addComment,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export { calcTotal };
