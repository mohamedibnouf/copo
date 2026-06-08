export type StepStatus =
  | "completed"
  | "in_progress"
  | "not_started"
  | "skipped"
  | "rejected";

export type RequestStatus =
  | "draft"
  | "pending"
  | "in_progress"
  | "approved"
  | "rejected"
  | "completed";

export interface User {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
}

export interface Branch {
  id: string;
  nameEn: string;
  nameAr: string;
}

export interface OperationType {
  id: string;
  nameEn: string;
  nameAr: string;
}

export interface LineItem {
  id: string;
  purpose: string;
  beneficiary: string;
  value: number;
  documentNumber: string;
  attachmentName?: string;
  notes: string;
}

export interface Comment {
  id: string;
  author: User;
  text: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "image" | "other";
  uploadedAt: string;
}

export interface WorkflowStep {
  id: string;
  titleEn: string;
  titleAr: string;
  status: StepStatus;
  assignee?: User;
  timestamp?: string;
  deadline?: string;
  children?: WorkflowStep[];
  isBranch?: boolean;
}

export interface TransactionRequest {
  id: string;
  seq: number;
  requestNo: string;
  date: string;
  branch: Branch;
  requester: User;
  operationType: OperationType;
  searchKeyword: string;
  lineItems: LineItem[];
  status: RequestStatus;
  currentStage: string;
  workflow: WorkflowStep[];
  comments: Comment[];
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  total: number;
  inProgress: number;
  completed: number;
  rejected: number;
}

export type PanelTab = "workflow" | "comments" | "files";
