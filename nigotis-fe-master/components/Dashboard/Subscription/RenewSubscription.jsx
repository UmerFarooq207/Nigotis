"use client";
import useCurrency from "@/hooks/useCurrency";
import React, { useEffect, useState } from "react";
import UpdateSubscription from "./UpdateSubscription";
import { ChevronRight } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import useUser from "@/hooks/useUser";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import PricingIncludeModal from "@/components/PricingIncludeModal";

export default function RenewSubscription({ plan, onClose, subscriptionId }) {
  const { user } = useUser();
  if (!user?.token) {
    toast({
      variant: "destructive",
      description: "Please Login First",
    });
    window.location.href = "/auth/signin";
    return <></>;
  }
  const [selectedInclude, setSelectedInclude] = useState({});
  const currency = useCurrency("USD");
  const [seeDetails, setSeeDetails] = useState(false);
  return (
    <>
      <div className=" max-w-3xl mx-auto container bg-white pt-20">
        <div>
          <h1 className="text-2xl text-custom-gradient font-bold">
            Renew Subscription
          </h1>
          <Button variant="destructive" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className=" rounded-lg p-6">
          <h3 className="text-2xl font-bold my-5 text-center">{plan?.name}</h3>
          {plan?.tagline !== "." && (
            <h3 className="text-lg font-bold my-5 text-center">
              {plan?.tagline}
            </h3>
          )}
          <div className=" flex justify-center items-center mb-6">
            {" "}
            <div className="h-px bg-gray-300 w-[95%]"></div>
          </div>
          <div className="mb-6 text-center">
            <span className="text-[#FF9800] text-3xl font-bold">
              {/* {currency == "USD" ? "US$" : "AED"} */}
              {currency?.symbol} {Number(plan?.pricePerMonth).toFixed(2)}/mo
            </span>
          </div>
          <Button
            variant="secondary"
            onClick={() => setSeeDetails(!seeDetails)}
            className="w-full"
          >
            {seeDetails ? "Hide Details" : "See Details"}
          </Button>
          <Separator />
          {seeDetails && (
            <ul className="space-y-3 pl-6 pt-6 relative ">
              {plan?.includes.map((item, i) => (
                <div
                  onClick={() => {
                    setSelectedInclude(item);
                  }}
                  className=" flex items-start gap-2 cursor-pointer hover:underline"
                >
                  <ChevronRight />
                  {item?.title}
                </div>
              ))}
            </ul>
          )}
        </div>
        <Separator />
        <UpdateSubscription subscriptionId={subscriptionId} plan={plan} />
      </div>
      {selectedInclude && (
        <PricingIncludeModal
          data={selectedInclude}
          isOpen={selectedInclude?.title}
          onClose={() => {
            setSelectedInclude({});
          }}
        />
      )}
    </>
  );
}
