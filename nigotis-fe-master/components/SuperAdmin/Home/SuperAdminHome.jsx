"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import PlanDisplay from "./PlanDisplay";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import { Users2 } from "lucide-react";
import useUser from "@/hooks/useUser";
import { fetchCustom } from "@/lib/utils";
import LoadingDots from "@/components/Utils/LoadingDots";
import ShowError from "@/components/Utils/ShowError";

export default function SuperAdminHome() {
  const [users, setUsers] = useState({
    totalUsers: 0,
    totalActiveUsers: 0,
    totalInactiveUsers: 0,
    totalFreeUsers: 0,
    totalInactiveFreeUsers: 0,
    totalActiveFreeUsers: 0,
  });
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);

      const response = await fetchCustom("/user/superadmin/figures", {
        method: "GET",
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setIsError(null);
        setUsers(data?.data);
      } else {
        setIsError(data?.message);
      }
    } catch (error) {
      console.error("Error fetching users figures:", error);
      setIsError(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <MainDashboardContentSkeleton title="Home">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent className=" grid grid-cols-2 ">
          <div className="text-2xl md:text-5xl font-bold">
            {users.totalUsers}
          </div>
          <Users2 size={60} strokeWidth={2} />
        </CardContent>
      </Card>
      {isLoading && <LoadingDots />}
      {isError && <ShowError error={isError} />}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium text-orange-500">
              14 Days Free Trial Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.totalFreeUsers}</div>
            <Progress
              value={(users.totalFreeUsers / users.totalUsers) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {((users.totalFreeUsers / users.totalUsers) * 100).toFixed(1)}% of
              total users
            </p>
            <div className=" grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
              <div>
                <h2 className="text-sm font-medium text-green-500">
                  Active
                </h2>
                <div className="text-2xl font-bold">
                  {users.totalActiveFreeUsers}
                </div>
              </div>
              <div>
                <h2 className="text-sm font-medium text-red-500">
                  Expired
                </h2>
                <div className="text-2xl font-bold">
                  {users.totalInactiveFreeUsers}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.totalActiveUsers}</div>
            <Progress
              value={(users.totalActiveUsers / users.totalUsers) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {((users.totalActiveUsers / users.totalUsers) * 100).toFixed(1)}%
              of total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium text-red-500">
              Expired Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.totalInactiveUsers}</div>
            <Progress
              value={(users.totalInactiveUsers / users.totalUsers) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {((users.totalInactiveUsers / users.totalUsers) * 100).toFixed(1)}
              % of total users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* <h2 className="text-2xl font-bold mb-4">Plans</h2>
      <PlanDisplay plans={plans.planDetails} /> */}
    </MainDashboardContentSkeleton>
  );
}
