"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/hooks/useUser";

export default function ZiinaPayment({
  amount,
  subscriptionData,
  className = "",
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleZiinaPayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetchCustom("/ziina/create-payment-intent", {
        method: "POST",
        body: JSON.stringify({
          amount,
          currency: "AED",
          message: `Nigotis Subscription Update - ${subscriptionData?.planId ?? ""}`,
          subscriptionData,
        }),
        token: user?.token,
      });

      const data = await response.json();

      if (data?.success && data?.redirectUrl) {
        // Redirect user to Ziina's hosted payment page
        window.location.href = data.redirectUrl;
      } else {
        toast({
          variant: "destructive",
          description:
            data?.error ||
            "Failed to initiate Ziina payment. Please try again.",
        });
      }
    } catch (err) {
      console.error("Ziina payment error:", err);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full mt-4 ${className}`}>
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground text-center">
          You will be redirected to Ziina&apos;s secure payment page to complete
          your payment.
        </p>
        <Button
          onClick={handleZiinaPayment}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 font-semibold h-12"
        >
          {isLoading ? (
            "Redirecting to Ziina..."
          ) : (
            <>
              <span>Pay AED {parseFloat(amount).toFixed(2)} with Ziina</span>
              <img src="/assets/Ziina.jpeg" alt="Ziina" className="h-6 object-contain" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
