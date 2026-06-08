"use client";

import { Header } from "@/components/layout/Header";
import { RequestForm } from "@/components/requests/RequestForm";

export default function NewFinancialRequestPage() {
  return (
    <>
      <Header
        title="New Payment Request | طلب سداد جديد"
        subtitle="Payment voucher request | طلب سداد قسيمة"
      />
      <div className="p-4 sm:p-6 lg:p-8">
        <RequestForm />
      </div>
    </>
  );
}
