"use client";

import { Bell, Search, UserCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative min-w-0 flex-1 sm:flex-none md:w-64 lg:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="w-full pl-9 text-sm" placeholder="Search..." />
          </div>
          <button
            type="button"
            className="shrink-0 rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
          <div className="hidden shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 sm:flex">
            <UserCircle2 size={20} className="text-violet-600" />
            <span className="text-sm font-medium text-slate-700">Othman Awad</span>
          </div>
        </div>
      </div>
    </header>
  );
}
