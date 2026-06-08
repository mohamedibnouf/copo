"use client";

import { ModuleListPage } from "@/components/modules/ModuleListPage";
import { MODULE_CONFIGS, getModuleRecords } from "@/data/modules-mock";

export default function InvoicesPage() {
  return (
    <ModuleListPage
      config={MODULE_CONFIGS.invoice}
      records={getModuleRecords("invoice")}
    />
  );
}
