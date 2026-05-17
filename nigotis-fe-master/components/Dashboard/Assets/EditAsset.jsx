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
import { Edit3 } from "lucide-react";
import AssetDetails from "./New/AssetDetails";
import useUser from "@/hooks/useUser";
import { toast } from "@/hooks/use-toast";
import { fetchCustom } from "@/lib/utils";

export default function EditAsset({ asset, onClose }) {
  const [assetDetails, setAssetDetails] = useState(asset);
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);

  const handleEditAsset = async () => {
    setIsLoading(true);
    try {
      console.log(assetDetails);

      if (
        !assetDetails.title ||
        !assetDetails.desc ||
        assetDetails.totalAmount <= 1 ||
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
        method: "PUT",
        body: JSON.stringify({
          ...assetDetails,
          assetId: assetDetails?._id,
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
      console.error("Error updating asset:", error);
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
            <h2 className="text-lg font-semibold text-gray-900">Edit Asset</h2>
            <p className="text-sm text-gray-500">Update asset details</p>
          </div>
        </div>
      </div>
      <div className="px-4 space-y-6">
        <AssetDetails details={assetDetails} setDetails={setAssetDetails} />
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
        <Button
          className="w-full sm:w-auto px-8"
          onClick={handleEditAsset}
          disabled={isLoading}
        >
          {isLoading ? "Updating Asset..." : "Update Asset"}
        </Button>
      </div>
    </div>
  );
}
