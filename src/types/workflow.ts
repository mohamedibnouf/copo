export const BRANCHES = [
  "COPO Riyadh Branch",
  "COPO Jeddah Branch",
  "COPO Dammam Branch",
  "COPO Khobar Branch",
] as const;

export type Branch = (typeof BRANCHES)[number];

export type UrgencyLevel = "Low" | "Medium" | "High";

export type RequestStatus = "Pending" | "Approved" | "Rejected";

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
  | "status_updated";

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
  notes?: string;
}

export type UserRole = "requester" | "area_manager" | "finance" | "viewer";

export type ActiveView = "request" | "approval" | "analytics";
