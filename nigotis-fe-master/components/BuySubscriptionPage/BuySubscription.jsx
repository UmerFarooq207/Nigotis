"use client";

import React, { useState } from "react";
import DurationSelector from "./DurationSelector";
import ScreenSelector from "./ScreenSelector";
import Summary from "./Summary";
import ZiinaPayment from "./ZiinaPayment";
import { addMonths, fetchCustom } from "@/lib/utils";
import { Button } from "../ui/button";
import useUser from "@/hooks/useUser";
import { toast } from "@/hooks/use-toast";
import { useCompany } from "@/contexts/company";
import { useNotifications } from "@/contexts/notifications";
import { CreditCard } from "lucide-react";

export default function BuySubscription({ plan, currentPlanId = "" }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addMonths(new Date(), 1));
  const [noOfMonths, setNoOfMonths] = useState(1);
  const [additionalScreens, setAdditionalScreens] = useState(0);
  const [totalScreens, setTotalScreens] = useState(parseInt(plan.screens));
  const [totalFee, setTotalFee] = useState(plan?.pricePerMonth);
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useUser();
  const { deleteCompany } = useCompany();
  const { deleteNotifications } = useNotifications();

  const handleLogout = async () => {
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    deleteCompany();
    deleteNotifications();
    setUser(null);

    // Finally, redirect to the login page
    window.location.href = "/auth/signin";
    toast({
      variant: "custom",
      description: "Kindly Login Again.",
    });
  };

  const updateDates = (months) => {
    const start = new Date();
    setStartDate(start);
    setEndDate(addMonths(start, months));
    setNoOfMonths(months);
    calculateTotalFee(months, additionalScreens);
  };

  const handleCustomDuration = (months) => {
    updateDates(months);
  };

  const handleAdditionalScreens = (screens) => {
    setAdditionalScreens(screens);
    setTotalScreens(parseInt(plan.screens) + screens);
    calculateTotalFee(noOfMonths, screens);
  };

  const calculateTotalFee = (months, additionalScreens) => {
    const basePrice = parseFloat(plan.pricePerMonth) * months;
    const additionalScreenPrice =
      parseFloat(plan.pricePerScreen) * additionalScreens * months;
    setTotalFee(basePrice + additionalScreenPrice);
  };

  const handlePaymentSuccess = async (transactionId) => {
    // Make POST request with subscription details
    const subscriptionData = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      noOfMonths,
      transactionId,
      totalScreens,
      totalFee: parseFloat(totalFee).toFixed(2),
      planId: plan?._id,
    };
    setIsLoading(true);

    const response = await fetchCustom("/plan/subscription", {
      method: currentPlanId ? "PUT" : "POST",
      body: JSON.stringify(subscriptionData),
      token: user?.token,
    });
    const data = await response.json();
    if (data?.success) {
      toast({
        variant: "custom",
        description: data?.message,
      });
      await handleLogout();
    } else {
      toast({
        variant: "destructive",
        description: data?.message,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Step 1 — Duration */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#003B6D] text-white text-xs font-bold">
            1
          </span>
          <h3 className="font-semibold text-gray-800">Choose Duration</h3>
        </div>
        <DurationSelector onSelect={updateDates} onCustom={handleCustomDuration} />
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Step 2 — Screens */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#003B6D] text-white text-xs font-bold">
            2
          </span>
          <h3 className="font-semibold text-gray-800">Additional Screens</h3>
        </div>
        <ScreenSelector
          baseScreens={parseInt(plan.screens)}
          onAdditionalScreens={handleAdditionalScreens}
        />
      </div>

      {/* Step 3 — Summary & Pay */}
      {noOfMonths > 0 && (
        <>
          <div className="h-px bg-gray-100" />
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#003B6D] text-white text-xs font-bold">
                3
              </span>
              <h3 className="font-semibold text-gray-800">Order Summary</h3>
            </div>
            <Summary
              plan={plan}
              startDate={startDate}
              endDate={endDate}
              noOfMonths={noOfMonths}
              totalScreens={totalScreens}
              additionalScreens={additionalScreens}
              totalFee={totalFee}
            />
          </div>
        </>
      )}

      {noOfMonths > 0 && !showPayment && (
        <Button
          onClick={() => setShowPayment(true)}
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#003B6D] to-[#26B9B3] hover:from-[#002d54] hover:to-[#1fa39d] shadow-md hover:shadow-lg transition-all"
        >
          <CreditCard className="mr-2 h-5 w-5" />
          Proceed to Payment — ${parseFloat(totalFee).toFixed(2)}
        </Button>
      )}

      {showPayment && (
        <div>
          <div className="h-px bg-gray-100 mb-4" />
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#26B9B3] text-white text-xs font-bold">
              4
            </span>
            <h3 className="font-semibold text-gray-800">Complete Payment</h3>
          </div>
          <ZiinaPayment
            className={`${
              isLoading
                ? "opacity-60 pointer-events-none"
                : "opacity-100 pointer-events-auto"
            }`}
            amount={parseFloat(totalFee).toFixed(2)}
            planId={plan?._id}
            subscriptionData={{
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              noOfMonths,
              totalScreens,
              totalFee: parseFloat(totalFee).toFixed(2),
              planId: plan?._id,
            }}
          />
        </div>
      )}
    </div>
  );
}
