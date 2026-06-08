"use client";

import { useParams, useRouter } from "next/navigation";
import { ModuleDetailView } from "@/components/modules/ModuleDetailView";
import { Button } from "@/components/ui/button";
import { MODULE_CONFIGS, getModuleRecord } from "@/data/modules-mock";

export default function SalesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const record = getModuleRecord(id);
  const config = MODULE_CONFIGS.sales;

  if (!record || record.moduleId !== "sales") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Button onClick={() => router.push(config.basePath)}>Back</Button>
      </div>
    );
  }

  return <ModuleDetailView record={record} config={config} />;
}
