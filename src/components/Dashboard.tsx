"use client";

import { WorkflowProvider, useWorkflow } from "@/context/WorkflowContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";
import { Header } from "@/components/layout/Header";
import { PurchaseRequestForm } from "@/components/request/PurchaseRequestForm";
import { RequesterDashboard } from "@/components/request/RequesterDashboard";
import { ApproverActionCenter } from "@/components/approval/ApproverActionCenter";
import { AccountantCenter } from "@/components/accounting/AccountantCenter";
import { StatusKanban } from "@/components/analytics/StatusKanban";
import { TransactionLog } from "@/components/analytics/TransactionLog";

function RoleBasedContent() {
  const { activeView } = useWorkflow();

  switch (activeView) {
    case "request":
      return (
        <div className="space-y-4 sm:space-y-6">
          <PurchaseRequestForm />
          <RequesterDashboard />
        </div>
      );
    case "approval":
      return <ApproverActionCenter />;
    case "accounting":
      return <AccountantCenter />;
    case "analytics":
      return (
        <div className="space-y-4 sm:space-y-6">
          <StatusKanban />
          <TransactionLog />
        </div>
      );
    default:
      return null;
  }
}

function DashboardContent() {
  return (
    <div className="flex min-h-[100dvh] overflow-x-hidden bg-slate-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <RoleSwitcher />
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-3 pb-24 sm:p-4 md:p-6 md:pb-6">
          <RoleBasedContent />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}

export function Dashboard() {
  return (
    <WorkflowProvider>
      <DashboardContent />
    </WorkflowProvider>
  );
}
