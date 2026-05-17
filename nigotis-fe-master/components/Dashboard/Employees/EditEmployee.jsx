"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EditPayroll from "./Payroll/EditPayroll";
import CreatePayroll from "./Payroll/CreatePayroll";
import useUser from "@/hooks/useUser";
import EditEmailAndPassword from "./EditEmailAndPassword";
import EditPersonalInfo from "./EditPersonalInfo";
import EditJobInfo from "./EditJobInfo";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit3 } from "lucide-react";

export function EditEmployee({ employee, onClose }) {
  const { user } = useUser();

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-4 mt-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Cancel editing"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
              <Edit3 className="w-5 h-5 text-[#003667]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Edit Employee</h2>
              <p className="text-sm text-gray-500">Update employee details</p>
            </div>
          </div>
        </div>
        <div className="px-4 space-y-6">
          <EditEmailAndPassword
            _id={employee?._id}
            email={employee?.email}
            employeeId={employee?.employeeId}
          />
          <Separator />
          <EditPersonalInfo personalInfo={employee?.personalInfo} />
          <EditJobInfo jobInfo={employee?.jobInfo} />
        </div>
      </div>
      <br />

      {employee.jobInfo?.payrollId?._id ? (
        <EditPayroll payroll={employee.jobInfo?.payrollId} />
      ) : (
        <CreatePayroll employeeId={employee?._id} />
      )}
    </>
  );
}
