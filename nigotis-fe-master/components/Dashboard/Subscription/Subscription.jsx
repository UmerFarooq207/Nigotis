"use client";
import SubscriptionDetails from "@/components/Dashboard/Subscription/SubscriptionDetails";
import { toast } from "@/hooks/use-toast";
import useUser from "@/hooks/useUser";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { fetchCustom } from "@/lib/utils";
import { useCompany } from "@/contexts/company";
import { useNotifications } from "@/contexts/notifications";

export default function Subscription() {
  const { user, setUser } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { deleteCompany } = useCompany();
  const { deleteNotifications } = useNotifications();
  const hasHandledPayment = useRef(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Check if we're returning from a Ziina payment redirect
  const paymentStatus = searchParams.get("payment");
  const paymentRef = searchParams.get("ref");
  const isPaymentReturn = Boolean(paymentStatus && paymentRef);

  const handleLogout = async () => {
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    deleteCompany();
    deleteNotifications();
    setUser(null);
    window.location.href = "/auth/signin";
    toast({
      variant: "custom",
      description: "Kindly Login Again.",
    });
  };

  useEffect(() => {
    if (hasHandledPayment.current) return;
    const payment = searchParams.get("payment");
    const ref = searchParams.get("ref");
    const sub = searchParams.get("sub");

    if (!payment) return;
    hasHandledPayment.current = true;

    if (payment === "success" && ref) {
      setIsProcessingPayment(true);
      const verify = async () => {
        try {
          const res = await fetchCustom(`/ziina/verify/${ref}`, {
            method: "GET",
            token: user?.token,
          });
          const data = await res.json();

          if (data?.status === "completed") {
            if (sub) {
              let subscriptionData;
              try {
                subscriptionData = JSON.parse(atob(sub));
              } catch {
                subscriptionData = JSON.parse(
                  decodeURIComponent(escape(atob(sub)))
                );
              }

              const subRes = await fetchCustom("/plan/subscription", {
                method: subscriptionData.subscriptionId ? "PUT" : "POST",
                body: JSON.stringify({
                  ...subscriptionData,
                  transactionId: ref,
                }),
                token: user?.token,
              });
              const subData = await subRes.json();

              if (subData?.success) {
                toast({
                  variant: "custom",
                  description:
                    subData?.message || "Payment successful!",
                });
                await handleLogout();
              } else {
                toast({
                  variant: "destructive",
                  description:
                    subData?.message || "Subscription update failed.",
                });
                setIsProcessingPayment(false);
                router.replace("/dashboard/subscription");
              }
            }
          } else {
            toast({
              variant: "destructive",
              description:
                "Payment could not be verified. Please contact support.",
            });
            setIsProcessingPayment(false);
            router.replace("/dashboard/subscription");
          }
        } catch (err) {
          console.error("Ziina verify error:", err);
          toast({
            variant: "destructive",
            description: "Error verifying payment.",
          });
          setIsProcessingPayment(false);
          router.replace("/dashboard/subscription");
        }
      };

      verify();
    } else if (payment === "cancelled") {
      toast({
        variant: "destructive",
        description: "Payment was cancelled.",
      });
      router.replace("/dashboard/subscription");
    } else if (payment === "failed") {
      toast({
        variant: "destructive",
        description: "Payment failed. Please try again.",
      });
      router.replace("/dashboard/subscription");
    }
  }, []);

  // Show processing screen while verifying Ziina payment
  if (isProcessingPayment || isPaymentReturn) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        <p className="text-lg font-medium">Verifying your payment...</p>
        <p className="text-sm text-muted-foreground">
          Please do not close this page.
        </p>
      </div>
    );
  }

  if (!user?.subscriptionId) {
    window.location.href = "/pricing";
  } else {
    return (
      <div>
        <SubscriptionDetails />
      </div>
    );
  }
}

