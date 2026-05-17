"use client";

import React, { useState } from "react";

import { ArrowLeft, Users } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import useCurrency from "@/hooks/useCurrency";
import { AllEmployees } from "../Employees/AllEmployees";
import EditRole from "./EditRole";
import EditEmailAndPassword from "../Employees/EditEmailAndPassword";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";

export default function AddSubAccount({ onBack }) {
  const currency = useCurrency();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [step, setStep] = useState(1);

  return (
    <MainDashboardContentSkeleton title={null}>
      <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Back to sub accounts"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
            <Users className="w-5 h-5 text-[#003667]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Create Sub Account</h2>
            <p className="text-sm text-gray-500">Add a new team member and set access</p>
          </div>
        </div>
      </div>
      <div className="px-4 space-y-6">
        <div className="space-y-4 ">
          {!selectedEmployee && (
            <AllEmployees
              isSelectEmp={true}
              isSubAccount={true}
              setSelectedEmp={setSelectedEmployee}
            />
          )}

          {selectedEmployee && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-custom-gradient flex gap-2">
                Selected Employee Details
              </h3>
              <Table>
                <TableBody className="grid grid-cols-1 md:grid-cols-2">
                  <TableRow>
                    <TableCell className="font-medium">Name</TableCell>
                    <TableCell>
                      {[
                        selectedEmployee?.personalInfo?.title,
                        selectedEmployee?.personalInfo?.firstName,
                        selectedEmployee?.personalInfo?.middleName,
                        selectedEmployee?.personalInfo?.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Email</TableCell>
                    <TableCell>{selectedEmployee?.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Address</TableCell>
                    <TableCell>
                      {selectedEmployee?.personalInfo.address}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Phone</TableCell>
                    <TableCell>
                      {selectedEmployee?.personalInfo.phone}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Salary Type</TableCell>
                    <TableCell>
                      {selectedEmployee?.jobInfo?.payrollId?.salaryType}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      {selectedEmployee?.jobInfo?.payrollId?.salaryType ===
                      "fixed"
                        ? "Monthly Salary"
                        : "Hourly Rate"}
                    </TableCell>
                    <TableCell>
                      {currency?.symbol}&nbsp;
                      {selectedEmployee?.jobInfo?.payrollId?.salaryType ===
                      "fixed"
                        ? selectedEmployee?.jobInfo?.payrollId?.salary
                        : selectedEmployee?.jobInfo?.payrollId?.hourlyRate}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Overtime Rate</TableCell>
                    <TableCell>
                      {currency?.symbol}&nbsp;
                      {selectedEmployee?.jobInfo?.payrollId?.overtimeHourlyRate}
                      /hour
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Bonus</TableCell>
                    <TableCell>
                      {selectedEmployee?.jobInfo?.payrollId?.bonus}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tax</TableCell>
                    <TableCell>
                      {selectedEmployee?.jobInfo?.payrollId?.tax}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {step === 1 ? (
                <EditRole
                  _id={selectedEmployee?._id}
                  role={selectedEmployee?.role}
                  isAddSubAccount={true}
                  setStep={(n) => {
                    setStep(n);
                  }}
                />
              ) : step === 2 ? (
                <EditEmailAndPassword
                  _id={selectedEmployee?._id}
                  email={selectedEmployee?.email}
                  employeeId={selectedEmployee?.employeeId}
                  isSubAccount={true}
                  isAddSubAccount={true}
                  setStep={(n) => {
                    setStep(n);
                  }}
                />
              ) : (
                <h1 className=" text-custom-gradient db-title flex gap-3 items-center">
                  Sub Account Has Been Created.
                </h1>
              )}
            </div>
          )}
        </div>
      </div>
    </MainDashboardContentSkeleton>
  );
}
