"use client";
import React, { useState } from "react";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import { AllSubAccounts } from "./AllSubAccounts";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import AddSubAccount from "./AddSubAccount";
import { useCompany } from "@/contexts/company";
import Link from "next/link";
import SubscriptionUpgrade from "@/components/Utils/SubscriptionUpgrade";

export default function SubAccounts() {
  const [createSubAccount, setCreateSubAccount] = useState(false);

  const [currentSubAccounts, setCurrentSubAccounts] = useState(0);
  const { company } = useCompany();
  const allowedSubAccounts = company?.subscriptionId?.screens;

  if (!company?.subscriptionId) {
    return (
      <SubscriptionUpgrade />
    );
  }

  return (
    <MainDashboardContentSkeleton title={null}>
      {!createSubAccount && (
        <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
              <Users className="w-5 h-5 text-[#003667]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sub Accounts</h2>
              <p className="text-sm text-gray-500">Manage your team members and access</p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-row-reverse">
            {currentSubAccounts >= allowedSubAccounts ? (
              <Link href={"/dashboard/settings"}>
                <Button size="default">
                  Upgrade the Package
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => {
                  setCreateSubAccount(true);
                }}
                size="default"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Sub-Account
              </Button>
            )}
          </div>
        </div>
      )}
      {createSubAccount ? (
        <AddSubAccount onBack={() => setCreateSubAccount(false)} />
      ) : (
        <AllSubAccounts
          setCurrentSubAccounts={(n) => {
            setCurrentSubAccounts(n);
          }}
          allowedSubAccounts={company?.subscriptionId?.screens}
        />
      )}
    </MainDashboardContentSkeleton>
  );
}
