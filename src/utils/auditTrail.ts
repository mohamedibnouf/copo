import type { AuditLogEntry, PurchaseRequest } from "@/types/workflow";
import { COPO_BRAND } from "@/constants/branding";

let auditCounter = 0;

function nextAuditId(): string {
  auditCounter += 1;
  return `AUD-${String(auditCounter).padStart(4, "0")}`;
}

export function createAuditEntry(
  partial: Omit<AuditLogEntry, "id">
): AuditLogEntry {
  return { id: nextAuditId(), ...partial };
}

export function buildCreatedTrail(
  requester: string,
  timestamp: string
): AuditLogEntry[] {
  return [
    createAuditEntry({
      timestamp,
      action: "created",
      actorRole: "Chef",
      actorRoleAr: "الشيف",
      actorName: requester,
      messageEn: `Created by COPO Chef (${requester})`,
      messageAr: `تم الإنشاء بواسطة شيف كوبو (${requester})`,
    }),
    createAuditEntry({
      timestamp,
      action: "submitted_for_review",
      actorRole: "System",
      actorRoleAr: "النظام",
      actorName: COPO_BRAND.workflowEngine,
      messageEn: "Submitted to COPO workflow — Under Review by Area Manager",
      messageAr: "تم الإرسال لسير عمل كوبو — قيد المراجعة من مدير المنطقة",
    }),
  ];
}

export function buildAreaManagerApprovedEntry(
  timestamp: string,
  actorName = "Area Manager"
): AuditLogEntry {
  return createAuditEntry({
    timestamp,
    action: "area_manager_approved",
    actorRole: "Area Manager",
    actorRoleAr: "مدير المنطقة",
    actorName,
    messageEn: "Approved / Under Review by Area Manager",
    messageAr: "موافقة / قيد المراجعة من مدير المنطقة",
  });
}

export function buildFinanceApprovedEntry(
  timestamp: string,
  actorName = "Finance Manager"
): AuditLogEntry {
  return createAuditEntry({
    timestamp,
    action: "finance_approved",
    actorRole: "Finance Manager",
    actorRoleAr: "المدير المالي",
    actorName,
    messageEn: "Final Status Updated by Finance Manager — Approved",
    messageAr: "تحديث الحالة النهائية بواسطة المدير المالي — موافق عليه",
  });
}

export function buildFinalApprovedEntry(timestamp: string): AuditLogEntry {
  return createAuditEntry({
    timestamp,
    action: "final_approved",
    actorRole: "System",
    actorRoleAr: "النظام",
    actorName: COPO_BRAND.workflowEngine,
    messageEn: "Final Status: Approved — COPO Transaction Complete",
    messageAr: "الحالة النهائية: موافق عليه — اكتملت معاملة كوبو",
  });
}

export function buildAreaManagerRejectedEntry(
  timestamp: string,
  reason?: string,
  actorName = "Area Manager"
): AuditLogEntry {
  return createAuditEntry({
    timestamp,
    action: "area_manager_rejected",
    actorRole: "Area Manager",
    actorRoleAr: "مدير المنطقة",
    actorName,
    messageEn: `Rejected by Area Manager${reason ? ` — ${reason}` : ""}`,
    messageAr: `مرفوض من مدير المنطقة${reason ? ` — ${reason}` : ""}`,
  });
}

export function buildFinanceRejectedEntry(
  timestamp: string,
  reason?: string,
  actorName = "Finance Manager"
): AuditLogEntry {
  return createAuditEntry({
    timestamp,
    action: "finance_rejected",
    actorRole: "Finance Manager",
    actorRoleAr: "المدير المالي",
    actorName,
    messageEn: `Final Status Updated by Finance Manager — Rejected${reason ? ` (${reason})` : ""}`,
    messageAr: `تحديث الحالة النهائية بواسطة المدير المالي — مرفوض${reason ? ` (${reason})` : ""}`,
  });
}

export function buildAwaitingFinanceEntry(timestamp: string): AuditLogEntry {
  return createAuditEntry({
    timestamp,
    action: "status_updated",
    actorRole: "System",
    actorRoleAr: "النظام",
    actorName: COPO_BRAND.workflowEngine,
    messageEn: "Awaiting Finance Manager approval — COPO Double Approval policy",
    messageAr: "في انتظار موافقة المدير المالي — سياسة الموافقة المزدوجة لكوبو",
  });
}

export function formatAuditTimestamp(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export function appendAuditEntry(
  request: PurchaseRequest,
  entry: AuditLogEntry
): PurchaseRequest {
  return {
    ...request,
    auditTrail: [...request.auditTrail, entry],
    updatedAt: entry.timestamp,
  };
}

// Reset counter when building mock data (called once at module init for mocks)
export function resetAuditCounter(start = 0): void {
  auditCounter = start;
}

export function ensureAuditTrail(request: PurchaseRequest): PurchaseRequest {
  if (Array.isArray(request.auditTrail) && request.auditTrail.length > 0) {
    return request;
  }

  return {
    ...request,
    auditTrail: buildCreatedTrail(request.requester, request.createdAt),
  };
}
