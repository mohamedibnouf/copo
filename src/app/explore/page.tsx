"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { EXPLORE_MODULES } from "@/constants/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExplorePage() {
  return (
    <>
      <Header
        title="Explore"
        subtitle="COPO KSA · Discover all internal forms & operations"
      />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {EXPLORE_MODULES.map((mod) => (
            <Link key={mod.href} href={mod.href}>
              <Card className="h-full transition hover:shadow-md hover:ring-1 hover:ring-slate-200">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`inline-flex rounded-lg bg-gradient-to-r ${mod.color} px-2 py-0.5 font-mono text-[10px] font-bold text-white`}
                      >
                        {mod.code}
                      </span>
                      <CardTitle className="mt-2 text-base">
                        {mod.titleEn}
                      </CardTitle>
                      <p className="text-sm text-slate-500">{mod.titleAr}</p>
                    </div>
                    <ArrowRight size={18} className="shrink-0 text-slate-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">{mod.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
