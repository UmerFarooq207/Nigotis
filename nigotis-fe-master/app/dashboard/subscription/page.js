import Subscription from "@/components/Dashboard/Subscription/Subscription";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import React from "react";

export default function page() {
  return (
    <>
      <MainDashboardContentSkeleton title={null}>
        <Subscription />
      </MainDashboardContentSkeleton>
    </>
  );
}
