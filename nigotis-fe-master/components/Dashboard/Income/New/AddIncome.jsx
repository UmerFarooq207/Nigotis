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
import { ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import IncomeDetails from "./IncomeDetails";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";

export default function AddIncome() {
  const [details, setDetails] = useState({
    notes: "",
    type: "others",
    totalAmount: 0,
    date: new Date().toISOString().split("T")[0],
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleAdd = async () => {
    setIsLoading(true);
    try {
      if (!details.notes || !details.totalAmount || !details.date) {
        toast({
          title: "Field missing!",
          variant: "destructive",
          description: "One or more required fields are missing.",
        });
        return;
      }

      const response = await fetchCustom("/income", {
        method: "POST",
        body: JSON.stringify(details),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
        router.push("/dashboard/incomes");
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error creating income:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainDashboardContentSkeleton title={null}>
      <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-2">
        <div className="flex items-center gap-3">
          <Link
            href={"/dashboard/incomes"}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Back to incomes"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
            <TrendingUp className="w-5 h-5 text-[#003667]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Add Income</h2>
            <p className="text-sm text-gray-500">Record a new income entry</p>
          </div>
        </div>
      </div>
      <div className="px-4 space-y-6">
        <IncomeDetails details={details} setDetails={setDetails} />
      </div>
      <div className="px-4 pt-4 border-t border-gray-200 mt-6 pb-6">
        <Button className="w-full sm:w-auto px-8" onClick={handleAdd} disabled={isLoading}>
          {isLoading ? "Adding Income..." : "Add Income"}
        </Button>
      </div>
    </MainDashboardContentSkeleton>
  );
}
