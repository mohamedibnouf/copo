import { getBranchCode } from "@/utils/transactionId";
import type { Branch } from "@/types/workflow";

interface TransactionIdBadgeProps {
  id: string;
  branch?: Branch;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

export function TransactionIdBadge({
  id,
  branch,
  size = "md",
}: TransactionIdBadgeProps) {
  const code = branch ? getBranchCode(branch) : id.split("-")[1] ?? "";

  return (
    <div className="inline-flex max-w-full flex-col gap-0.5">
      <span
        className={`inline-flex max-w-full items-center gap-1 rounded-lg bg-slate-900 font-mono font-bold tracking-wide text-emerald-400 ring-1 ring-slate-700 break-all sm:break-normal ${sizeClasses[size]}`}
      >
        <span className="shrink-0 text-slate-500">#</span>
        <span className="min-w-0 truncate">{id}</span>
      </span>
      {code && (
        <span className="text-[8px] font-medium uppercase leading-tight tracking-wider text-slate-400 sm:text-[9px]">
          رقم المعاملة / Transaction ID · {code}
        </span>
      )}
    </div>
  );
}
