"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PayrollRow from "./PayrollRow";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import { addDays, format, subDays, subMonths, startOfYear } from "date-fns";
import Link from "next/link";
import { Plus, Banknote } from "lucide-react";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/hooks/useUser";
import LoadingDots from "@/components/Utils/LoadingDots";
import ShowError from "@/components/Utils/ShowError";
import { toast } from "@/hooks/use-toast";
import { useCompany } from "@/contexts/company";
import SubscriptionUpgrade from "@/components/Utils/SubscriptionUpgrade";

export default function Payrolls() {
  const [payrolls, setPayrolls] = useState([]);
  const [filteredPayrolls, setFilteredPayrolls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isOpenId, setIsOpenId] = useState("");
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const { company } = useCompany();
  if (!company?.subscriptionId) {
    return <SubscriptionUpgrade />;
  }

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCustom("/payroll/runs/all", {
        method: "GET",
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setIsError(null);
        setPayrolls(data?.data);
      } else {
        setIsError(data?.message);
      }
    } catch (error) {
      console.error("Error fetching run payrolls:", error);
      setIsError(error?.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);




  useEffect(() => {
    const filtered = payrolls.filter((payroll) => {
      let nameMatch = true;
      let idMatch = true;
      if (payroll?.employeeId) {
        nameMatch =
          payroll?.employeeId?.personalInfo?.firstName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payroll?.employeeId?.personalInfo?.lastName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payroll?.employeeId?.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        idMatch = payroll?.employeeId?.jobInfo?.employeeId
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }

      const statusMatch =
        statusFilter === "" || payroll?.status === statusFilter;
      const dateMatch =
        (fromDate === "" || new Date(payroll?.from) >= new Date(fromDate)) &&
        (toDate === "" || new Date(payroll?.to) <= new Date(toDate));

      return (nameMatch && statusMatch && dateMatch) || idMatch;
    });
    setFilteredPayrolls(filtered);
  }, [payrolls, searchTerm, statusFilter, fromDate, toDate]);

  if (isLoading) {
    return <LoadingDots />;
  }

  const handleClearFilter = () => {
    setFromDate("");
    setToDate("");
    setStatusFilter("");
    setSearchTerm("");
  };

  const handleThisMonth = () => {
    const end = new Date();
    const start = new Date(end.getFullYear(), end.getMonth(), 1);
    setFromDate(format(start, "yyyy-MM-dd"));
    setToDate(format(end, "yyyy-MM-dd"));
  };
  const handleLastMonth = () => {
    const end = new Date();
    const start = subMonths(end, 1);
    setFromDate(format(start, "yyyy-MM-dd"));
    setToDate(format(end, "yyyy-MM-dd"));
  };
  const handleLast3Months = () => {
    const end = new Date();
    const start = subMonths(end, 3);
    setFromDate(format(start, "yyyy-MM-dd"));
    setToDate(format(end, "yyyy-MM-dd"));
  };

  const handleLast6Months = () => {
    const end = new Date();
    const start = subMonths(end, 6);
    setFromDate(format(start, "yyyy-MM-dd"));
    setToDate(format(end, "yyyy-MM-dd"));
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetchCustom(`/payroll/runs?payrollRunsId=${id}`, {
        method: "DELETE",
        token: user?.token,
      });
      const data = await response.json();
      if (data.success) {
        fetchItems();
        toast({
          variant: "custom",
          description: data?.message,
        });
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error deleting run payroll:", error);
    }
  };

  return (
    <MainDashboardContentSkeleton title={null}>
      <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
            <Banknote className="w-5 h-5 text-[#003667]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Payroll Runs</h2>
            <p className="text-sm text-gray-500">Manage and track employee payrolls</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-row-reverse">
          <Link href={"/dashboard/payrolls/new"}>
            <Button size="default">
              <Plus className="mr-2 h-4 w-4" /> Run a Payroll
            </Button>
          </Link>
        </div>
      </div>
      <div className="px-4 pb-4">
        {isError ? (
          <ShowError error={isError} />
        ) : (
          <div className="w-full">
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full overflow-hidden">
            <div className="col-span-1 sm:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
              <Input
                id="search"
                type="text"
                placeholder="Search by employee name, emp id or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status" className="bg-white">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">From Date</label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">To Date</label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                className="w-full"
                size="default"
                disabled={!fromDate && !toDate && !searchTerm && (!statusFilter || statusFilter === "all")}
                variant="destructive"
                onClick={handleClearFilter}
              >
                Clear Filters
              </Button>
            </div>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleThisMonth}>
              This month
            </Button>
            <Button variant="secondary" onClick={handleLastMonth}>
              Last Month
            </Button>
            <Button variant="secondary" onClick={handleLast3Months}>
              Last 3 Months
            </Button>
            <Button variant="secondary" onClick={handleLast6Months}>
              Last 6 Months
            </Button>
          </div>
          <div className="rounded-md border bg-white overflow-hidden w-full overflow-x-auto">
            <table className="w-full font-normal text-sm overflow-auto text-left">
              <thead className="border-b bg-gray-50/50 text-gray-500">
                <tr>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Salary Type</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Total Amount</th>
                  <th className="p-4 font-medium">From Date</th>
                  <th className="p-4 font-medium">To Date</th>
                  <th className="p-4 font-medium">Run By</th>
                  <th className="p-4 font-medium">Preview</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
            <tbody>
              {filteredPayrolls.map((payroll) => (
                <PayrollRow
                  handleDelete={handleDelete}
                  key={payroll?._id}
                  payroll={payroll}
                  isOpen={isOpenId === payroll?._id}
                  toggleOpen={() => {
                    if (isOpenId === payroll?._id) {
                      setIsOpenId("");
                    } else {
                      setIsOpenId(payroll?._id);
                    }
                  }}
                />
              ))}
            </tbody>
          </table>
          </div>
          </div>
        )}
      </div>
    </MainDashboardContentSkeleton>
  );
}
