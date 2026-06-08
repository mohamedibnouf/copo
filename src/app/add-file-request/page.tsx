"use client";

import { ModuleListPage } from "@/components/modules/ModuleListPage";
import { MODULE_CONFIGS, getModuleRecords } from "@/data/modules-mock";

export default function AddFileRequestPage() {
  return (
    <ModuleListPage
      config={MODULE_CONFIGS["add-file"]}
      records={getModuleRecords("add-file")}
    />
  );
}
