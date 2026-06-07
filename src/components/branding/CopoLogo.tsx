import { COPO_BRAND } from "@/constants/branding";

interface CopoLogoProps {
  compact?: boolean;
  showTagline?: boolean;
}

export function CopoLogo({ compact = false, showTagline = true }: CopoLogoProps) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <div
          className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 font-black tracking-tighter text-white shadow-md shadow-emerald-200/80 ${
            compact ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-xs"
          }`}
        >
          C
        </div>
        <div className="min-w-0">
          <p
            className={`truncate font-bold tracking-tight text-slate-900 ${
              compact ? "text-sm" : "text-base"
            }`}
          >
            <span className="text-emerald-700">{COPO_BRAND.name}</span>
            <span className="mx-1 font-light text-slate-400">|</span>
            <span className="text-slate-800">Flow</span>
          </p>
          {showTagline && !compact && (
            <p className="truncate text-[10px] leading-tight text-slate-500 sm:text-[11px]">
              {COPO_BRAND.taglineBilingual}
            </p>
          )}
          {showTagline && compact && (
            <p className="truncate text-[9px] text-slate-500">{COPO_BRAND.taglineEn}</p>
          )}
        </div>
      </div>
    </div>
  );
}
