export function generateJournalEntryId(
  existing: { journalEntryId?: string }[]
): string {
  const year = new Date().getFullYear();
  const maxNum = existing.reduce((max, req) => {
    if (!req.journalEntryId) return max;
    const match = req.journalEntryId.match(new RegExp(`^JV-${year}-(\\d+)$`));
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);
  return `JV-${year}-${String(maxNum + 1).padStart(4, "0")}`;
}

export const MATCHED_THREE_WAY = {
  purchaseRequest: true,
  receivedGoods: true,
  supplierInvoice: true,
} as const;

export const UNMATCHED_THREE_WAY = {
  purchaseRequest: false,
  receivedGoods: false,
  supplierInvoice: false,
} as const;
