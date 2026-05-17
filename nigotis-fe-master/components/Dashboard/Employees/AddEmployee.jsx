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
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { EmployeeDetails } from "./EmployeeDetails";
import CreatePayroll from "./Payroll/CreatePayroll";
import useUser from "@/hooks/useUser";
import { fetchCustom } from "@/lib/utils";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";

export default function AddEmployee() {
  const [employeeCreated, setEmployeeCreated] = useState("");
  const { user } = useUser();
  const [employeeDetails, setEmployeeDetails] = useState({
    email: "",
    password: "12345678",
    role: "employee",
    personalInfo: {
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      address: "",
      phone: "",
      avatar: "",
    },
    jobInfo: {
      employeeId: "",
      department: "",
      jobRole: "",
      joinDate: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!employeeDetails.email || !employeeDetails.personalInfo.firstName) {
        toast({
          title: "Field missing!",
          variant: "destructive",
          description: "One or more required fields are missing.",
        });
        return;
      }
      const body = {
        ...employeeDetails,
        companyId: user?.companyId,
        name: employeeDetails.personalInfo.firstName,
      };
      const response = await fetchCustom("/user/create-user", {
        method: "POST",
        body: JSON.stringify(body),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setEmployeeDetails({});
        toast({
          variant: "custom",
          description: data?.message,
        });
        setEmployeeCreated(data?.data?._id);
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

  if (employeeCreated) {
    return <CreatePayroll navigation employeeId={employeeCreated} />;
  }

  return (
    <MainDashboardContentSkeleton title={null}>
      <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-2">
        <div className="flex items-center gap-3">
          <Link
            href={"/dashboard/employees"}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Back to employees"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
            <Users className="w-5 h-5 text-[#003667]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Add Employee</h2>
            <p className="text-sm text-gray-500">Add a new member to your team</p>
          </div>
        </div>
      </div>
      <div className="px-4 space-y-6">
        <EmployeeDetails
          details={employeeDetails}
          setDetails={setEmployeeDetails}
        />
      </div>
      <div className="px-4 pt-4 border-t border-gray-200 mt-6 pb-6">
        <Button
          className="w-full sm:w-auto px-8"
          onClick={handleAddEmployee}
          disabled={isLoading}
        >
          {isLoading ? "Adding Employee..." : "Add Employee"}
        </Button>
      </div>
    </MainDashboardContentSkeleton>
  );
}
