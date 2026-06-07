import type { Branch } from "@/types/workflow";

export const BRANCH_CODES: Record<Branch, string> = {
  "COPO Riyadh Branch": "RUH",
  "COPO Jeddah Branch": "JED",
  "COPO Dammam Branch": "DMM",
  "COPO Khobar Branch": "KHB",
};

export function generateSequentialId(
  branch: Branch,
  existing: { id: string; branch: Branch }[]
): string {
  const code = BRANCH_CODES[branch];
  const maxNum = existing
    .filter((r) => r.branch === branch)
    .reduce((max, req) => {
      const match = req.id.match(new RegExp(`^REQ-${code}-(\\d+)$`));
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);
  return `REQ-${code}-${String(maxNum + 1).padStart(3, "0")}`;
}

export function formatTransactionIdLabel(id: string): string {
  return id;
}

export function getBranchCode(branch: Branch): string {
  return BRANCH_CODES[branch];
}
