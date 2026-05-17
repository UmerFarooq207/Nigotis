"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useCompany } from "@/contexts/company";
import {
  BadgeCheck,
  BadgeXIcon,
  CalendarClock,
  CircleDollarSign,
  CreditCard,
  LayoutGrid,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import RenewSubscription from "./RenewSubscription.jsx";

export default function SubscriptionDetails() {
  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }
    return format(new Date(dateString), "MMMM d, yyyy");
  };
  const [renewSubscription, setRenewSubscription] = useState(false);
  const [isChangePlan, setIsChangePlan] = useState("");
  const { company } = useCompany();

  useEffect(() => {
    if (isChangePlan) {
      window.location.href = `/pricing?currentPlanId=${isChangePlan}`;
    }
  }, [isChangePlan]);

  return renewSubscription ? (
    <RenewSubscription
      subscriptionId={company?.subscriptionId?._id}
      plan={company?.subscriptionId?.planId}
      onClose={() => setRenewSubscription(false)}
    />
  ) : (
    <div className="w-full space-y-6">
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="bg-gradient-to-r from-[#003667] to-[#007b7e] p-6 md:p-7 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-100 font-semibold">
                Subscription Center
              </p>
              <h1 className="text-2xl md:text-3xl font-bold mt-1">Manage Your Plan</h1>
              <p className="text-sm text-blue-100 mt-2">
                View plan details, status, and complete history in one place.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() => {
                  setIsChangePlan(company?.subscriptionId?.planId?._id);
                }}
                className="bg-white text-[#003667] hover:bg-slate-100 shadow-sm"
              >
                Change Plan
              </Button>
              {company?.subscriptionId?.status !== "active" && (
                <Button
                  onClick={() => setRenewSubscription(true)}
                  className="bg-amber-400 text-slate-900 hover:bg-amber-300 shadow-sm"
                >
                  Renew
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <ShieldCheck size={18} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Plan Track</h3>
          </div>
          <div className="space-y-3">
            {[...(company?.subscriptionId?.planTrack || [])]
              .reverse()
              .map((track) => (
                <div
                  key={track._id}
                  className="rounded-xl border border-slate-200 bg-white p-4 relative"
                >
                  {company?.subscriptionId?.planId?._id === track?.planId && (
                    <span
                      className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full border font-semibold inline-flex items-center gap-1 ${
                        company?.subscriptionId?.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {company?.subscriptionId?.status === "active" ? (
                        <BadgeCheck size={14} />
                      ) : (
                        <BadgeXIcon size={14} />
                      )}
                      {company?.subscriptionId?.status.toUpperCase()}
                    </span>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                        Period
                      </p>
                      <p className="text-sm font-medium text-slate-800 mt-1">
                        {formatDate(track.startDate)} - {formatDate(track.endDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                        Fee
                      </p>
                      <p className="text-sm font-medium text-slate-800 mt-1">${track.totalFee}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                        Transaction ID
                      </p>
                      <p className="text-sm font-medium text-slate-800 mt-1 break-all">
                        {track.transactionId}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                        Screens
                      </p>
                      <p className="text-sm font-medium text-slate-800 mt-1">{track.screens}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="border-slate-200 shadow-sm xl:col-span-2">
          <CardContent className="p-5 md:p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Current Plan Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 p-4 bg-white">
                <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">
                  Plan Name
                </p>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-[#003667]">
                    <Layers size={18} />
                  </div>
                  <p className="text-xl font-semibold text-slate-900">
                    {company?.subscriptionId?.planId?.name}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 bg-white">
                <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">
                  Total Fee
                </p>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                    <CircleDollarSign size={18} />
                  </div>
                  <p className="text-xl font-semibold text-slate-900">
                    ${company?.subscriptionId?.totalFee}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 bg-white">
                <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">
                  Screens
                </p>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-50 text-violet-700">
                    <LayoutGrid size={18} />
                  </div>
                  <p className="text-xl font-semibold text-slate-900">
                    {company?.subscriptionId?.screens}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 bg-white">
                <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">
                  Duration
                </p>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                    <CalendarClock size={18} />
                  </div>
                  <p className="text-xl font-semibold text-slate-900">
                    {company?.subscriptionId?.noOfMonths} month
                    {company?.subscriptionId?.noOfMonths > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-5 md:p-6 space-y-5">
            <h2 className="text-lg font-semibold text-slate-900">Billing Dates</h2>
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/70">
              <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Start Date</p>
              <p className="text-base font-semibold text-slate-900 mt-1">
                {formatDate(company?.subscriptionId?.startDate)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/70">
              <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">End Date</p>
              <p className="text-base font-semibold text-slate-900 mt-1">
                {formatDate(company?.subscriptionId?.endDate)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
