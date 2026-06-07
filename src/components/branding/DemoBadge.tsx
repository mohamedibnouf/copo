import { Sparkles } from "lucide-react";
import { COPO_BRAND } from "@/constants/branding";

interface DemoBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

export function DemoBadge({ className = "", size = "md" }: DemoBadgeProps) {
  return (
    <span
      className={`demo-badge-pulse inline-flex max-w-full items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-100 via-orange-100 to-amber-50 font-semibold text-amber-950 ring-1 ring-amber-300/80 ring-inset ${
        size === "sm"
          ? "px-2 py-0.5 text-[9px]"
          : "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs"
      } ${className}`}
      title={COPO_BRAND.demoBadgeBilingual}
    >
      <Sparkles
        size={size === "sm" ? 10 : 12}
        className="shrink-0 text-amber-600"
      />
      <span className="truncate whitespace-nowrap">{COPO_BRAND.demoBadgeEn}</span>
      <span className="hidden opacity-80 sm:inline">·</span>
      <span className="hidden truncate opacity-90 sm:inline">
        {COPO_BRAND.demoBadgeAr}
      </span>
    </span>
  );
}
