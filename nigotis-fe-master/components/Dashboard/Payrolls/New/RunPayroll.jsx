"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Banknote } from "lucide-react";
import PayrollModal from "../PayrollModal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import Link from "next/link";
import { AllEmployees } from "../../Employees/AllEmployees";
import useCurrency from "@/hooks/useCurrency";
import useUser from "@/hooks/useUser";
import { fetchCustom } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function RunPayroll() {
  const currency = useCurrency();
  const [payrollCreated, setPayrollCreated] = useState({});
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const [payrollData, setPayrollData] = useState({
    from: "",
    to: "",
    noOfWorkingHours: "",
    overtimeHours: "",
    status: "paid",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [calculationDetails, setCalculationDetails] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    if (selectedEmployee) {
      const details = calculatePayroll();
      setCalculationDetails(details);
    }
  }, [selectedEmployee, payrollData]);

  if (payrollCreated?._id) {
    return (
      <PayrollModal
        payroll={payrollCreated}
        onClose={() => {
          setPayrollCreated({});
          setSelectedEmployee(null);
          router.push("/dashboard/payrolls");
        }}
      />
    );
  }
  const runPayroll = async () => {
    setIsLoading(true);
    try {
      if (!selectedEmployee || !calculationDetails) return;

      const payrollBody = {
        employeeId: selectedEmployee?._id,
        overtimeHours: Number(payrollData.overtimeHours),
        status: payrollData.status,
        totalAmount: calculationDetails.totalAmount,
        noOfWorkingHours: Number(payrollData.noOfWorkingHours),
        notes: payrollData.notes,
        from: new Date(payrollData.from).toISOString(),
        to: new Date(payrollData.to).toISOString(),
        date: new Date(payrollData.date).toISOString(),
      };

      const response = await fetchCustom("/payroll/runs", {
        method: "POST",
        body: JSON.stringify(payrollBody),
        token: user?.token,
      });
      const data = await response.json();
      console.log(data);
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
        setPayrollCreated(data?.data);
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error running payrol:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayrollData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "to" && new Date(newData.to) < new Date(newData.from)) {
        alert("'To' date must be after 'From' date");
        return prev;
      }
      return newData;
    });
  };
  function countMonths(from, to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const diffTime = toDate.getTime() - fromDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    // If total duration is less than 28 days, return 0
    if (diffDays < 28) return 0;

    // Get difference in calendar months
    let months =
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (toDate.getMonth() - fromDate.getMonth());

    // If the day portion covers at least 28 days in the final month, count it
    const tempDate = new Date(fromDate);
    tempDate.setMonth(tempDate.getMonth() + months);

    const remainingDays = (toDate - tempDate) / (1000 * 60 * 60 * 24);

    if (remainingDays >= 28) months += 1;

    return months;
  }

  const calculatePayroll = () => {
    if (!selectedEmployee) return null;

    const { salaryType, salary, hourlyRate, bonus, tax, overtimeHourlyRate } =
      selectedEmployee?.jobInfo?.payrollId;
    const { from, to, noOfWorkingHours, overtimeHours } = payrollData;

    let baseSalary = 0;
    if (salaryType === "fixed") {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      const monthsDiff = countMonths(fromDate, toDate);
      console.log(fromDate, toDate, monthsDiff);

      // const monthsDiff =
      //   (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      //   (toDate.getMonth() - fromDate.getMonth()) +
      //   1;
      baseSalary = salary * monthsDiff;
    } else {
      baseSalary = hourlyRate * noOfWorkingHours;
    }

    const overtimePay = overtimeHourlyRate * overtimeHours;
    const subtotal = baseSalary + overtimePay;
    const bonusAmount = subtotal * (bonus / 100);
    const taxAmount = subtotal * (tax / 100);
    const totalAmount = subtotal + bonusAmount - taxAmount;

    return {
      baseSalary,
      overtimePay,
      bonusAmount,
      taxAmount,
      totalAmount,
    };
  };

  return (
    <MainDashboardContentSkeleton title={null}>
      <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-2">
        <div className="flex items-center gap-3">
          <Link
            href={"/dashboard/payrolls"}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Back to payrolls"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
            <Banknote className="w-5 h-5 text-[#003667]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Run Payroll</h2>
            <p className="text-sm text-gray-500">Calculate and record employee compensation</p>
          </div>
        </div>
      </div>
      <div className="px-4 space-y-6">
        <div className="space-y-4 ">
          {!selectedEmployee && (
            <AllEmployees
              isSelectEmp={true}
              setSelectedEmp={setSelectedEmployee}
            />
          )}

          {selectedEmployee && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-custom-gradient flex gap-2">
                <ArrowLeft
                  stroke="#003366"
                  className=" cursor-pointer"
                  onClick={() => setSelectedEmployee(null)}
                />{" "}
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

              <h3 className="text-lg font-semibold text-custom-gradient">
                Payroll Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="from">From</label>
                  <Input
                    type={"date"}
                    // type={
                    //   selectedEmployee?.jobInfo?.payrollId?.salaryType === "fixed"
                    //     ? "month"
                    //     : "date"
                    // }
                    id="from"
                    name="from"
                    value={payrollData.from}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="to">To</label>
                  <Input
                    type={"date"}
                    // type={
                    //   selectedEmployee?.jobInfo?.payrollId?.salaryType === "fixed"
                    //     ? "month"
                    //     : "date"
                    // }
                    id="to"
                    name="to"
                    value={payrollData.to}
                    onChange={handleInputChange}
                  />
                </div>
                {selectedEmployee?.jobInfo?.payrollId?.salaryType ===
                  "hourly" && (
                  <div>
                    <label htmlFor="noOfWorkingHours">
                      Number of Working Hours
                    </label>
                    <Input
                      type="number"
                      id="noOfWorkingHours"
                      name="noOfWorkingHours"
                      value={payrollData.noOfWorkingHours}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="overtimeHours">Overtime Hours</label>
                  <Input
                    type="number"
                    id="overtimeHours"
                    name="overtimeHours"
                    value={payrollData.overtimeHours}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="date">Paid Date</label>
                  <Input
                    type={"date"}
                    id="date"
                    name="date"
                    value={payrollData.date}
                    onChange={handleInputChange}
                  />
                </div>
                {/* <div>
                  <label htmlFor="status">Payment Status</label>
                  <Select
                    name="status"
                    value={payrollData.status}
                    onValueChange={(value) =>
                      setPayrollData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
                <div className="col-span-2">
                  <label htmlFor="notes">Notes</label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={payrollData.notes}
                    onChange={handleInputChange}
                    placeholder="Enter any additional notes here..."
                    rows={4}
                  />
                </div>
              </div>

              {calculationDetails && (
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Payroll Calculation Details
                  </h3>
                  <div className="rounded-md border bg-white">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            Base Salary
                          </TableCell>
                          <TableCell>
                            {currency?.symbol}&nbsp;
                            {calculationDetails.baseSalary.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Overtime Pay
                          </TableCell>
                          <TableCell>
                            {currency?.symbol}&nbsp;
                            {calculationDetails.overtimePay.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Bonus</TableCell>
                          <TableCell>
                            {currency?.symbol}&nbsp;
                            {calculationDetails.bonusAmount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Tax</TableCell>
                          <TableCell className="text-red-600">
                            -{currency?.symbol}&nbsp;
                            {calculationDetails.taxAmount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Total Amount
                          </TableCell>
                          <TableCell>
                            {currency?.symbol}&nbsp;
                            {calculationDetails.totalAmount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <Button
                disabled={isLoading || payrollCreated?._id}
                className="w-full"
                onClick={runPayroll}
              >
                {isLoading ? "Running Payroll..." : "Run Payroll"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainDashboardContentSkeleton>
  );
}
