import React, { useState } from "react";
import DurationSelector from "./DurationSelector";
import ScreenSelector from "./ScreenSelector";
import Summary from "./Summary";
import ZiinaPayment from "./ZiinaPayment";
import { addMonths, fetchCustom } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";
import useUser from "@/hooks/useUser";
import { toast } from "@/hooks/use-toast";
import { useCompany } from "@/contexts/company";
import { useNotifications } from "@/contexts/notifications";
import { Button } from "@/components/ui/button";

export default function UpdateSubscription({ plan, subscriptionId }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addMonths(new Date(), 1));
  const [noOfMonths, setNoOfMonths] = useState(1);
  const [additionalScreens, setAdditionalScreens] = useState(0);
  const [totalScreens, setTotalScreens] = useState(parseInt(plan.screens));
  const [totalFee, setTotalFee] = useState(plan?.pricePerMonth);
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const { deleteCompany } = useCompany();
  const { deleteNotifications } = useNotifications();

  const handleLogout = async () => {
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    deleteCompany();
    deleteNotifications();

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
console.log(user);

  const handlePaymentSuccess = async (transactionId) => {
    // Make PUT request with subscription details to renew the subscription
    const subscriptionData = {
      subscriptionId,
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
      method: "PUT",
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
    <div className="w-full p-6">
      <DurationSelector
        onSelect={updateDates}
        onCustom={handleCustomDuration}
      />
      <Separator />
      <ScreenSelector
        baseScreens={parseInt(plan.screens)}
        onAdditionalScreens={handleAdditionalScreens}
      />
      <Separator />

      {noOfMonths > 0 && (
        <Summary
          plan={plan}
          startDate={startDate}
          endDate={endDate}
          noOfMonths={noOfMonths}
          totalScreens={totalScreens}
          additionalScreens={additionalScreens}
          totalFee={totalFee}
        />
      )}

      {noOfMonths > 0 && !showPayment && (
        <Button onClick={() => setShowPayment(true)} className="w-full">
          Proceed to Payment
        </Button>
      )}

      {showPayment && (
        <div className="mt-4">
          <ZiinaPayment
            className={`${
              isLoading
                ? "opacity-60 pointer-events-none"
                : "opacity-100 pointer-events-auto"
            }`}
            amount={parseFloat(totalFee).toFixed(2)}
            planId={plan?._id}
            subscriptionData={{
              subscriptionId,
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
