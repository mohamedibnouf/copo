"use client";

import { ModuleListPage } from "@/components/modules/ModuleListPage";
import { MODULE_CONFIGS, getModuleRecords } from "@/data/modules-mock";

export default function DailyOrdersPage() {
  return (
    <ModuleListPage
      config={MODULE_CONFIGS["daily-order"]}
      records={getModuleRecords("daily-order")}
    />
  );
}
