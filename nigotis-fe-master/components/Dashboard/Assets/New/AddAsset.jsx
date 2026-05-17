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
import { ArrowLeft, Box } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import AssetDetails from "./AssetDetails";
import useUser from "@/hooks/useUser";
import { fetchCustom } from "@/lib/utils";
import { useRouter } from "next/navigation";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";

export default function AddAsset() {
  
    const router = useRouter()
  const [assetDetails, setAssetDetails] = useState({
    title: "",
    desc: "",
    totalAmount: 0,
    date: new Date().toISOString().split("T")[0],
    quantity: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleAddAsset = async () => {
    setIsLoading(true);
    try {
      if (
        !assetDetails.title ||
        !assetDetails.desc ||
        assetDetails.totalAmount <= 0 ||
        assetDetails.quantity <= 0 ||
        !assetDetails.date
      ) {
        toast({
          title: "Field missing!",
          variant: "destructive",
          description: "One or more required fields are missing.",
        });
        return;
      }

      const response = await fetchCustom("/company/asset", {
        method: "POST",
        body: JSON.stringify(assetDetails),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
        router.push("/dashboard/assets");
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error creating asset:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainDashboardContentSkeleton title={null}>
      <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-2">
        <div className="flex items-center gap-3">
          <Link
            href={"/dashboard/assets"}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Back to assets"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
            <Box className="w-5 h-5 text-[#003667]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Add Asset</h2>
            <p className="text-sm text-gray-500">Record a new company asset</p>
          </div>
        </div>
      </div>
      <div className="px-4 space-y-6">
        <AssetDetails details={assetDetails} setDetails={setAssetDetails} />
      </div>
      <div className="px-4 pt-4 border-t border-gray-200 mt-6 pb-6">
        <Button
          className="w-full sm:w-auto px-8"
          onClick={handleAddAsset}
          disabled={isLoading}
        >
          {isLoading ? "Adding Asset..." : "Add Asset"}
        </Button>
      </div>
    </MainDashboardContentSkeleton>
  );
}
