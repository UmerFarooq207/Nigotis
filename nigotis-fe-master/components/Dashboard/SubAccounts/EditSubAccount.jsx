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
import EditRole from "./EditRole";
import { Separator } from "@/components/ui/separator";
import EditEmailAndPassword from "../Employees/EditEmailAndPassword";

export function EditSubAccount({ employee, onClose, isSubAccount = false }) {
  return (
    <>
      <div className="w-full">
        <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-4 mt-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
              <Edit3 className="w-5 h-5 text-[#003667]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Edit Sub Account</h2>
              <p className="text-sm text-gray-500">Update roles and credentials</p>
            </div>
          </div>
          <Button onClick={onClose} variant="destructive">
            Close
          </Button>
        </div>
        <div className="px-4 space-y-6">
          <EditRole _id={employee?._id} role={employee?.role} 
             />
          <Separator />
          <EditEmailAndPassword
            _id={employee?._id}
            email={employee?.email}
            employeeId={employee?.employeeId}
            isSubAccount={isSubAccount}
          />
        </div>
      </div>
    </>
  );
}
