import type {
  Attachment,
  Branch,
  Comment,
  RequestStatus,
  User,
  WorkflowStep,
} from "@/types";

export type ModuleId =
  | "financial"
  | "invoice"
  | "add-file"
  | "daily-order"
  | "support"
  | "sales";

export interface ModuleRecord {
  id: string;
  moduleId: ModuleId;
  refNo: string;
  title: string;
  titleAr: string;
  branch: Branch;
  requester: User;
  status: RequestStatus;
  currentStage: string;
  date: string;
  amount?: number;
  workflow: WorkflowStep[];
  comments: Comment[];
  attachments: Attachment[];
  fields: { labelEn: string; labelAr: string; value: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface ModuleConfig {
  id: ModuleId;
  basePath: string;
  titleEn: string;
  titleAr: string;
  code: string;
  newLabelEn: string;
  newLabelAr: string;
}
