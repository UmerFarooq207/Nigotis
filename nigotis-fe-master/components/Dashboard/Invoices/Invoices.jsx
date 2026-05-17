import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import AllInvoices from "@/components/Dashboard/Invoices/AllInvoices";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Receipt } from "lucide-react";
import Link from "next/link";

export default function Invoices() {
  return (
    <MainDashboardContentSkeleton title={null}>
      <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
            <Receipt className="w-5 h-5 text-[#003667]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
            <p className="text-sm text-gray-500">Manage and track your invoices</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-row-reverse">
          <Link href={"/dashboard/invoices/new"}>
            <Button size="default">
              <Plus className="mr-2 h-4 w-4" /> Create Invoice
            </Button>
          </Link>
        </div>
      </div>
      <AllInvoices />
    </MainDashboardContentSkeleton>
  );
}
