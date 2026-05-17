"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { ClientDetails } from "./ClientDetails";
import useUser from "@/hooks/useUser";
import { fetchCustom } from "@/lib/utils";
import { useRouter } from "next/navigation";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";

export default function AddClient() {
  const { user } = useUser();
  const router = useRouter()
  const [clientDetails, setClientDetails] = useState({
    email: "",
    about: "",
    personalInfo: {
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      address: "",
      phone: "",
      avatar: "",
      joinDate: new Date().toISOString().split("T")[0],
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleAddClient = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!clientDetails.email || !clientDetails.personalInfo.firstName) {
        toast({
          title: "Field missing!",
          variant: "destructive",
          description: "One or more required fields are missing.",
        });
        return;
      }
      const body = {
        ...clientDetails,
        companyId: user?.companyId,
        ...clientDetails.personalInfo,
      };
      const response = await fetchCustom("/client", {
        method: "POST",
        body: JSON.stringify(body),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setClientDetails({});
        toast({
          variant: "custom",
          description: data?.message,
        });
        router.push("/dashboard/clients");
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error creating employee:", error);
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
            href={"/dashboard/clients"}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Back to clients"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
            <Users className="w-5 h-5 text-[#003667]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Add Client</h2>
            <p className="text-sm text-gray-500">Create a new client profile</p>
          </div>
        </div>
      </div>
      
      <div className="px-4 space-y-6">
        <ClientDetails details={clientDetails} setDetails={setClientDetails} />
        
        <div className="pt-4 border-t border-gray-200 mt-6">
          <Button
            className="w-full sm:w-auto px-8"
            onClick={handleAddClient}
            disabled={isLoading}
          >
            {isLoading ? "Adding Client..." : "Add Client"}
          </Button>
        </div>
      </div>
    </MainDashboardContentSkeleton>
  );
}
