import type { ThreeWayMatch } from "@/types/workflow";
import { CheckCircle2 } from "lucide-react";

interface ThreeWayMatchingProps {
  match: ThreeWayMatch;
  compact?: boolean;
}

const steps = [
  {
    key: "purchaseRequest" as const,
    labelEn: "Purchase Request",
    labelAr: "طلب الشراء",
  },
  {
    key: "receivedGoods" as const,
    labelEn: "Received Goods",
    labelAr: "استلام البضاعة",
  },
  {
    key: "supplierInvoice" as const,
    labelEn: "Supplier Invoice",
    labelAr: "فاتورة المورد",
  },
];

export function ThreeWayMatching({ match, compact = false }: ThreeWayMatchingProps) {
  const allMatched = steps.every((s) => match[s.key]);

  return (
    <div
      className={`rounded-xl ring-1 ${
        allMatched
          ? "bg-emerald-50/80 ring-emerald-200"
          : "bg-slate-50 ring-slate-200"
      } ${compact ? "p-2" : "p-3"}`}
    >
      {!compact && (
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          3-Way Matching / المطابقة الثلاثية
        </p>
      )}
      <div className={`flex ${compact ? "flex-col gap-1.5" : "flex-wrap gap-2"}`}>
        {steps.map((step) => {
          const matched = match[step.key];
          return (
            <div
              key={step.key}
              className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-medium ring-1 sm:text-xs ${
                matched
                  ? "bg-white text-emerald-700 ring-emerald-200"
                  : "bg-white text-slate-400 ring-slate-200"
              }`}
            >
              <CheckCircle2
                size={14}
                className={matched ? "text-emerald-500" : "text-slate-300"}
              />
              <span className="truncate">
                {compact ? step.labelEn.split(" ")[0] : step.labelEn}
                {!compact && (
                  <span className="hidden opacity-70 sm:inline"> / {step.labelAr}</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
      {allMatched && !compact && (
        <p className="mt-2 text-[10px] font-semibold text-emerald-700">
          ✓ All matched — Ready for payment / جاهز للصرف
        </p>
      )}
    </div>
  );
}
