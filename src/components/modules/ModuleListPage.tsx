"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { ModuleTable } from "@/components/modules/ModuleTable";
import { Button } from "@/components/ui/button";
import type { ModuleConfig, ModuleRecord } from "@/types/modules";

export function ModuleListPage({
  config,
  records,
  newHref,
}: {
  config: ModuleConfig;
  records: ModuleRecord[];
  newHref?: string;
}) {
  return (
    <>
      <Header
        title={`${config.titleEn} | ${config.titleAr}`}
        subtitle={`COPO KSA · ${config.code} · Internal transactions`}
      />
      <main className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-stretch sm:justify-end">
          <Button asChild className="w-full sm:w-auto">
            <Link href={newHref ?? `${config.basePath}/new`}>
              <Plus size={16} />
              {config.newLabelEn} | {config.newLabelAr}
            </Link>
          </Button>
        </div>
        <ModuleTable records={records} basePath={config.basePath} />
      </main>
    </>
  );
}
