"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Grid3x3,
  Menu,
  Plus,
  X,
} from "lucide-react";
import { COMPANY } from "@/data/mock-data";
import { MAIN_NAV, RECENT_NAV, isNavActive } from "@/constants/navigation";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  label,
  sublabel,
  badge,
  icon: Icon,
  pathname,
  onNavigate,
}: {
  href: string;
  label: string;
  sublabel?: string;
  badge?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isNavActive(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200",
        active
          ? "rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/25"
          : "rounded-xl text-slate-600 hover:bg-slate-100/90"
      )}
    >
      <Icon
        size={18}
        className={cn(
          "shrink-0",
          active ? "text-white" : "text-slate-400 group-hover:text-slate-600"
        )}
      />
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate">{label}</span>
        {sublabel && (
          <span
            className={cn(
              "block truncate text-[10px] font-normal",
              active ? "text-blue-100" : "text-slate-400"
            )}
          >
            {sublabel}
          </span>
        )}
      </span>
      {badge && (
        <span
          className={cn(
            "shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold",
            active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-[#f8f9fb]">
      <div className="border-b border-slate-200/60 px-5 py-5">
        <p className="text-base font-bold text-slate-900">{COMPANY.nameEn}</p>
        <p className="text-xs text-slate-500">{COMPANY.nameAr}</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {MAIN_NAV.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}

        <p className="mb-1 mt-5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          RECENT
        </p>

        <div className="space-y-0.5">
          {RECENT_NAV.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              sublabel={"sublabel" in item ? item.sublabel : undefined}
              badge={item.badge || undefined}
              icon={item.icon}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      <div className="space-y-2 border-t border-slate-200/60 p-3">
        <Link
          href="/financial-requests/new"
          onClick={onNavigate}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:from-blue-700 hover:to-blue-600"
        >
          <Plus size={16} />
          Create
        </Link>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          <Grid3x3 size={16} className="text-slate-400" />
          App Store
        </button>
      </div>
    </div>
  );
}

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-[#f8f9fb] px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0 flex-1 px-3 text-center">
          <p className="truncate text-sm font-bold text-slate-900">{COMPANY.nameEn}</p>
        </div>
        <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-800 ring-1 ring-amber-200">
          Demo
        </span>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <aside className="absolute left-0 top-0 h-full w-[min(280px,85vw)] shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
            <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-20 hidden h-[100dvh] w-60 shrink-0 border-r border-slate-200/80 lg:block xl:w-64">
      <SidebarContent pathname={pathname} />
    </aside>
  );
}
