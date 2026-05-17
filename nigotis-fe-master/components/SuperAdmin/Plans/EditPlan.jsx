"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import PlanDetails from "./New/PlanDetails";
import useUser from "@/hooks/useUser";
import { fetchCustom } from "@/lib/utils";

export default function EditPlan({ plan, onClose }) {
  const [planDetails, setPlanDetails] = useState(plan);

  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleEditPlan = async () => {
    setIsLoading(true);
    try {
      if (
        (!planDetails.name || !planDetails.type || planDetails.screens <= 0,
        planDetails.pricePerMonth <= 0,
        planDetails.oldPricePerMonth <= 0,
        planDetails.pricePerScreen <= 0)
      ) {
        toast({
          title: "Field missing!",
          variant: "destructive",
          description: "One or more required fields are missing.",
        });
        return;
      }

      const response = await fetchCustom("/plan", {
        method: "PUT",
        body: JSON.stringify({
          ...planDetails,
          planId: planDetails?._id,
        }),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
        onClose();
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error updating plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className=" text-custom-gradient db-title flex gap-3 items-center justify-between">
          Edit Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <PlanDetails details={planDetails} setDetails={setPlanDetails} />
      </CardContent>
      <CardFooter className=" flex gap-4">
        <Button
          onClick={onClose}
          className=" w-full"
          variant="destructive"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          className=" w-full"
          onClick={handleEditPlan}
          disabled={isLoading}
        >
          {isLoading ? "Updating Plan..." : "Update Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}
