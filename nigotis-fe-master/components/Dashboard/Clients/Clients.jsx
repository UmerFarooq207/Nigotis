import React from "react";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import { AllClients } from "./AllClients";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Users } from "lucide-react";

export default function Clients() {
  return (
    <MainDashboardContentSkeleton title={null}>
      <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
            <Users className="w-5 h-5 text-[#003667]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Clients</h2>
            <p className="text-sm text-gray-500">Manage your clients and their details</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-row-reverse">
          <Link href={"/dashboard/clients/new"}>
            <Button size="default">
              <Plus className="mr-2 h-4 w-4" /> Add Client
            </Button>
          </Link>
          <Link href={"/dashboard/clients/bulk-import"}>
            <Button variant="outline" size="default">
              <Upload className="mr-2 h-4 w-4" /> Bulk Import
            </Button>
          </Link>
        </div>
      </div>
      <AllClients />
    </MainDashboardContentSkeleton>
  );
}
