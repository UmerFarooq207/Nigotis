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
import { Edit3 } from "lucide-react";
import IncomeDetails from "./New/IncomeDetails";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/hooks/useUser";

export default function EditIncome({ income, onClose }) {
  const [details, setDetails] = useState(income);
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      if (
        !details.notes ||
        !details.type ||
        !details.totalAmount ||
        !details.date
      ) {
        toast({
          title: "Field missing!",
          variant: "destructive",
          description: "One or more required fields are missing.",
        });
        return;
      }

      const response = await fetchCustom("/income", {
        method: "PUT",
        body: JSON.stringify({
          ...details,
          incomeId: details?._id,
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
      console.error("Error updating income:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-4 mt-6 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
            <Edit3 className="w-5 h-5 text-[#003667]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Edit Income</h2>
            <p className="text-sm text-gray-500">Update income details</p>
          </div>
        </div>
      </div>
      <div className="px-4 space-y-6">
        <IncomeDetails details={details} setDetails={setDetails} />
      </div>
      <div className="px-4 pt-4 border-t border-gray-200 mt-6 pb-6 flex gap-4">
        <Button
          onClick={onClose}
          className="w-full sm:w-auto px-8"
          variant="destructive"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button className="w-full sm:w-auto px-8" onClick={handleEdit} disabled={isLoading}>
          {isLoading ? "Updating Income..." : "Update Income"}
        </Button>
      </div>
    </div>
  );
}
