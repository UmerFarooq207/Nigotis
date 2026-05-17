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
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import useUser from "@/hooks/useUser";
import { fetchCustom } from "@/lib/utils";
import GetDataFromExcel from "@/components/Utils/GetDataFromExcel";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";

export default function BulkImport() {
  const { user } = useUser();
  
    const router = useRouter()
  const [expensesData, setExpensesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleBulkImport = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetchCustom("/company/expense/bulk-import", {
        method: "POST",
        body: JSON.stringify({ expenses: expensesData }),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setExpensesData([]);
        toast({
          variant: "custom",
          description: data?.message,
        });
        router.push("/dashboard/expenses");
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error importing bulk expenses:", error);
      toast({
        variant: "destructive",
        description: error?.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainDashboardContentSkeleton title={null}>
      <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-2">
        <div className="flex items-center gap-3">
          <Link
            href={"/dashboard/expenses"}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Back to expenses"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
            <Upload className="w-5 h-5 text-[#003667]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Bulk Import Expenses</h2>
            <p className="text-sm text-gray-500">Upload an Excel file to add multiple expenses</p>
          </div>
        </div>
      </div>
      <div className="px-4 space-y-6">
        <h1 className="font-semibold text-lg">Instructions:</h1>
        <div className=" w-full md:flex gap-3">
          <Image
            src={"/portal/expenses-sample.png"}
            width={900}
            height={600}
            alt="expenses-Sample-Image"
            className=" aspect-auto w-[74%] border-2 border-black"
          />
          <div className=" w-[26%] container text-sm rounded-lg shadow-lg">
            <h1 className="font-semibold">
              1. Columns Name must be same as shown.
            </h1>
            <h1 className="font-semibold">2. Required Attributes Are:</h1>
            <ul className="list-none pl-4">
              <li>i. Title</li>
              <li>ii. Total Amount</li>
              <li>iii. Type</li>
              <li>iv. Date(on paid), From, To</li>
            </ul>
            <h1 className="font-semibold">
              3. Select this (&quot;YYYY-MM-DD&quot;) format for join date.{" "}
              <Link
                className=" font-normal text-blue-600 hover:underline"
                href="https://support.microsoft.com/en-us/office/format-a-date-the-way-you-want-8e10019e-d5d8-47a1-ba95-db95123d273e"
                target="_blank"
              >
                (see how)
              </Link>
            </h1>
            <h1 className="font-semibold">4. Rest are optionals.</h1>
          </div>
        </div>
        <GetDataFromExcel
          setData={(data) => {
            setExpensesData(data);
          }}
        />
      </div>
      <div className="px-4 pt-4 border-t border-gray-200 mt-6 pb-6">
        <Button
          className="w-full sm:w-auto px-8"
          onClick={handleBulkImport}
          disabled={isLoading || expensesData.length === 0}
        >
          {isLoading ? "Importing Expenses..." : "Import Expenses"}
        </Button>
      </div>
    </MainDashboardContentSkeleton>
  );
}
