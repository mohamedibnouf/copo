"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { RequestTable } from "@/components/requests/RequestTable";
import { Button } from "@/components/ui/button";
import { MODULE_CONFIGS } from "@/data/modules-mock";
import { useApp } from "@/context/AppContext";

export default function FinancialRequestsPage() {
  const { requests } = useApp();
  const config = MODULE_CONFIGS.financial;

  return (
    <>
      <Header
        title={`${config.titleEn} | ${config.titleAr}`}
        subtitle="Payment voucher request | طلب سداد قسيمة · Workflow · Approvals"
      />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-stretch sm:justify-end">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/financial-requests/new">
              <Plus size={16} />
              {config.newLabelEn} | {config.newLabelAr}
            </Link>
          </Button>
        </div>
        <RequestTable requests={requests} />
      </div>
    </>
  );
}
