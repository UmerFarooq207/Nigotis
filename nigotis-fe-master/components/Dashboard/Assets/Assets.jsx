import React from "react";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import { AllAssets } from "./AllAssets";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Box } from "lucide-react";

export default function Assets() {
  return (
    <MainDashboardContentSkeleton title={null}>
      <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
            <Box className="w-5 h-5 text-[#003667]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Assets</h2>
            <p className="text-sm text-gray-500">Manage and track company assets</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-row-reverse">
          <Link href={"/dashboard/assets/new"}>
            <Button size="default">
              <Plus className="mr-2 h-4 w-4" /> Add Asset
            </Button>
          </Link>
          <Link href={"/dashboard/assets/bulk-import"}>
            <Button variant="outline" size="default">
              <Upload className="mr-2 h-4 w-4" /> Bulk Import
            </Button>
          </Link>
        </div>
      </div>
      <AllAssets />
    </MainDashboardContentSkeleton>
  );
}
