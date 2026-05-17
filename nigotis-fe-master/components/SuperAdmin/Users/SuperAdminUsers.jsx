import React from "react";
import AllUsers from "./AllUsers";
import { Card } from "@/components/ui/card";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";

export default function SuperAdminUsers() {
  return (
    <MainDashboardContentSkeleton title="Users">
      <AllUsers />
    </MainDashboardContentSkeleton>
  );
}
