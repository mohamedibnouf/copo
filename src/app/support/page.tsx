"use client";

import { ModuleListPage } from "@/components/modules/ModuleListPage";
import { MODULE_CONFIGS, getModuleRecords } from "@/data/modules-mock";

export default function SupportPage() {
  return (
    <ModuleListPage
      config={MODULE_CONFIGS.support}
      records={getModuleRecords("support")}
    />
  );
}
