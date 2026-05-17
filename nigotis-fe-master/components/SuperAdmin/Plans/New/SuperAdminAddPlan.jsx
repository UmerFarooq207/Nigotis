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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import PlanDetails from "./PlanDetails";
import useUser from "@/hooks/useUser";
import { fetchCustom } from "@/lib/utils";

export default function SuperAdminAddPlan() {
  const [planDetails, setPlanDetails] = useState({
    type: "custom",
    name: "JustxTech",
    tagline: "JustxTech Tagline",
    screens: 5,
    pricePerScreen: 2,
    pricePerMonth: 20,
    oldPricePerMonth: 28,
    includes: [
      {
        title: "5 Users",
        tagline:
          "Add up to 5 users with different roles to manage your company.",
        points: [
          "HR User for employee and their payrolls management",
          "Finanace User to ....",
          "Sales User to ....",
        ],
      },
    ],
  });

  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleAddExpense = async () => {
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
        method: "POST",
        body: JSON.stringify(planDetails),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
        window.location.href = "/super-admin/plans";
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error creating plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className=" text-custom-gradient db-title flex gap-3 items-center">
          <Link href={"/super-admin/plans"}>
            <ArrowLeft stroke="#003366" size={28} />
          </Link>{" "}
          Add Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <PlanDetails details={planDetails} setDetails={setPlanDetails} />
      </CardContent>
      <CardFooter>
        <Button
          className=" w-full"
          onClick={handleAddExpense}
          disabled={isLoading}
        >
          {isLoading ? "Adding Plan..." : "Add Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}
