import React from "react";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import { AllPlans } from "./AllPlans";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SuperAdminPlans() {
  return (
    <MainDashboardContentSkeleton title="Plans">
      <Link href={"/super-admin/plans/new"} className=" absolute top-4 right-4">
        <Button>
          Add New Plan <Plus />
        </Button>
      </Link>
      <AllPlans />
    </MainDashboardContentSkeleton>
  );
}
