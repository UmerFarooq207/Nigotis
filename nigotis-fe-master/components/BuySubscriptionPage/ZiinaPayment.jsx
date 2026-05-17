"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/hooks/useUser";
import { Lock, ShieldCheck } from "lucide-react";

const CURRENCY = "USD";

export default function ZiinaPayment({
  amount,
  subscriptionData,
  className = "",
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleZiinaPayment = async () => {
    // ── Validate amount ──
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0 || !isFinite(numericAmount)) {
      toast({
        variant: "destructive",
        description: "Invalid payment amount. Please try again.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchCustom("/ziina/create-payment-intent", {
        method: "POST",
        body: JSON.stringify({
          amount: numericAmount,
          currency: CURRENCY,
          message: `Nigotis Subscription - ${subscriptionData?.planId ?? ""}`,
          subscriptionData: {
            ...subscriptionData,
            amount: numericAmount,
            currency: CURRENCY,
          },
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
    <div className={`w-full ${className}`}>
      <div className="rounded-xl border border-gray-200 bg-gradient-to-b from-gray-50/80 to-white p-6 space-y-4">
        {/* Security note */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Lock size={14} className="text-[#26B9B3]" />
          <span>
            You&apos;ll be redirected to Ziina&apos;s secure payment page to
            complete your subscription.
          </span>
        </div>

        {/* Pay button */}
        <Button
          onClick={handleZiinaPayment}
          disabled={isLoading}
          className="w-full h-14 text-base font-semibold bg-gradient-to-r from-[#003B6D] to-[#26B9B3] hover:from-[#002d54] hover:to-[#1fa39d] shadow-lg hover:shadow-xl transition-all rounded-xl flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              Redirecting to Ziina...
            </span>
          ) : (
            <>
              <span>Pay ${Number(amount).toFixed(2)} USD</span>
              <img
                src="/assets/Ziina.jpeg"
                alt="Ziina"
                className="h-6 rounded object-contain"
              />
            </>
          )}
        </Button>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 pt-1">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <ShieldCheck size={14} className="text-green-500" />
            Secure payment
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Lock size={14} className="text-green-500" />
            SSL encrypted
          </div>
        </div>
      </div>
    </div>
  );
}
