"use client";

import { ModuleListPage } from "@/components/modules/ModuleListPage";
import { MODULE_CONFIGS, getModuleRecords } from "@/data/modules-mock";

export default function SalesRequestsPage() {
  return (
    <ModuleListPage
      config={MODULE_CONFIGS.sales}
      records={getModuleRecords("sales")}
    />
  );
}
