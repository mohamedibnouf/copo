export const BRANCHES = [
  "COPO Riyadh Branch",
  "COPO Jeddah Branch",
  "COPO Dammam Branch",
  "COPO Khobar Branch",
] as const;

export type Branch = (typeof BRANCHES)[number];

export type UrgencyLevel = "Low" | "Medium" | "High";

export type RequestStatus = "Pending" | "Approved" | "Rejected" | "Paid";

export type WorkflowStep = "Created" | "Under Review" | "Final Approval";

export type AuditActionType =
  | "created"
  | "submitted_for_review"
  | "area_manager_approved"
  | "area_manager_rejected"
  | "finance_approved"
  | "finance_rejected"
  | "final_approved"
  | "final_rejected"
  | "status_updated"
  | "payment_issued";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: AuditActionType;
  actorRole: string;
  actorRoleAr: string;
  actorName: string;
  messageEn: string;
  messageAr: string;
}

export interface ThreeWayMatch {
  purchaseRequest: boolean;
  receivedGoods: boolean;
  supplierInvoice: boolean;
}

export interface PurchaseRequest {
  id: string;
  branch: Branch;
  itemName: string;
  quantity: number;
  estimatedCost: number;
  urgency: UrgencyLevel;
  status: RequestStatus;
  workflowStep: WorkflowStep;
  requiresDoubleApproval: boolean;
  areaManagerApproved: boolean;
  financeApproved: boolean;
  requester: string;
  createdAt: string;
  updatedAt: string;
  auditTrail: AuditLogEntry[];
  threeWayMatch?: ThreeWayMatch;
  journalEntryId?: string;
  paidAt?: string;
  notes?: string;
}

export type UserRole =
  | "requester"
  | "area_manager"
  | "finance"
  | "accountant"
  | "viewer";

export type ActiveView = "request" | "approval" | "accounting" | "analytics";
