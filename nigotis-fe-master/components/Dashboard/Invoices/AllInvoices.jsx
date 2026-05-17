"use client";
import React, { useState, useEffect } from "react";
import InvoiceRow from "./InvoiceRow";
import { Button } from "@/components/ui/button";
import LoadingDots from "@/components/Utils/LoadingDots";
import ShowError from "@/components/Utils/ShowError";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/hooks/useUser";
import { toast } from "@/hooks/use-toast";

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateType, setDateType] = useState("issueDate");
  const [isOpenId, setIsOpenId] = useState("");

  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCustom("/client/invoice", {
        method: "GET",
        token: user?.token,
      });

      const data = await response.json();
      if (data?.success) {
        setIsError(null);
        setInvoices(data?.data);
      } else {
        setIsError(data?.message);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setIsError(error?.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const filtered = invoices.filter((invoice) => {
      const nameMatch =
        invoice.clientId.personalInfo?.firstName
          ?.toLowerCase()
          ?.includes(searchTerm.toLowerCase()) ||
        false ||
        invoice.clientId.personalInfo?.lastName
          ?.toLowerCase()
          ?.includes(searchTerm.toLowerCase()) ||
        false;
      const invoiceNoMatch =
        invoice.invoiceNo
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) || false;

      const statusMatch =
        statusFilter === "" || invoice.status === statusFilter;
      const dateMatch =
        (fromDate === "" ||
          new Date(invoice[dateType]) >= new Date(fromDate)) &&
        (toDate === "" || new Date(invoice[dateType]) <= new Date(toDate));
      return (nameMatch || invoiceNoMatch) && statusMatch && dateMatch;
    });
    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, statusFilter, fromDate, toDate, dateType]);

  if (isLoading) {
    return <LoadingDots />;
  }
  if (isError) {
    return <ShowError error={isError} />;
  }

  const handleClearFilter = () => {
    setFromDate("");
    setToDate("");
    setStatusFilter("");
    setSearchTerm("");
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetchCustom("/client/invoice", {
        method: "DELETE",
        token: user?.token,
        body: JSON.stringify({ invoiceId: id }),
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
      console.error("Error deleting invoice:", error);
    }
  };

  return (
    <div className="px-4 pb-4">
      <div className="mb-4 flex flex-wrap gap-4 w-full">
        <input
          type="text"
          placeholder="Search by client name"
          className="border border-gray-300 p-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#003667]/20 focus:border-[#003667]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border border-gray-300 p-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#003667]/20 focus:border-[#003667]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
        <select
          className="border border-gray-300 p-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#003667]/20 focus:border-[#003667]"
          value={dateType}
          onChange={(e) => setDateType(e.target.value)}
        >
          <option value="issueDate">Issue Date</option>
          <option value="dueDate">Due Date</option>
        </select>
        <input
          type="date"
          className="border border-gray-300 p-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#003667]/20 focus:border-[#003667]"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          className="border border-gray-300 p-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#003667]/20 focus:border-[#003667]"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <Button
          size="default"
          disabled={!fromDate && !toDate && !searchTerm && !statusFilter}
          variant="destructive"
          onClick={handleClearFilter}
          className="h-10"
        >
          Clear Filters
        </Button>
      </div>
      <div className=" w-full overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full font-normal text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-600">
              <th className="p-3 text-left font-medium">Invoice #</th>
              <th className="p-3 text-left font-medium">Client Name</th>
              <th className="p-3 text-left font-medium">No. of Products</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Generated By</th>
              <th className="p-3 text-left font-medium">Total Amount</th>
              <th className="p-3 text-left font-medium">Issue Date</th>
              <th className="p-3 text-left font-medium">Due Date</th>
              <th className="p-3 text-left font-medium">Preview</th>
              <th className="p-3 text-left font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <InvoiceRow
                isOpen={isOpenId === invoice._id}
                toggleOpen={() => {
                  if (isOpenId === invoice._id) {
                    setIsOpenId("");
                  } else {
                    setIsOpenId(invoice._id);
                  }
                }}
                key={invoice._id}
                invoice={invoice}
                handleDelete={handleDelete}
                onUpdated={fetchItems}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllInvoices;
