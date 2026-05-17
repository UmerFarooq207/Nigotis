"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchCustom, formatDate } from "@/lib/utils";
import useUser from "@/hooks/useUser";
import { Input } from "@/components/ui/input";
import { useCompany } from "@/contexts/company";
import useCurrency from "@/hooks/useCurrency";
import { Separator } from "@/components/ui/separator";
import DownloadReportBtn from "../DownloadReportBtn";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ARAgingSummary() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const { company } = useCompany();
  const contentRef = useRef(null);
  const currency = useCurrency();
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchCustom(
        `/reports/ar-aging-summary?date=${new Date()}`,
        {
          method: "GET",
          token: user?.token,
        },
      );
      const result = await response.json();
      if (result?.success) {
        setData(result?.data);
      } else {
        toast({
          variant: "destructive",
          description: result?.message,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href={"/dashboard/reports"} 
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all duration-300 group"
        >
          <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Accounts Receivable Aging Summary
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Summary of unpaid invoices organized by date ranges.
          </p>
        </div>
      </div>

      <Card className="border-none shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Generate the A/R Aging Summary as of today.
            </p>
            <div className="flex gap-4 w-full sm:w-auto">
              <Button 
                onClick={fetchData} 
                disabled={isLoading} 
                className="flex-1 sm:flex-none bg-primary-navy hover:bg-primary-navy/90 text-white min-w-[160px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating
                  </>
                ) : (
                  "Generate Report"
                )}
              </Button>
              {data && (
                <div className="flex-none">
                  <DownloadReportBtn
                    contentRef={contentRef}
                    name={`AR-Aging-Summary-As-of-${formatDate(new Date())}-${company?.displayName}.pdf`}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="shadow-xl border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-navy/5 to-transparent h-2 w-full"></div>
              <CardContent className="p-0">
                <div className="overflow-x-auto p-8 flex justify-center bg-gray-50/50 dark:bg-[#1a1c23]">
                  <div
                    ref={contentRef}
                    style={{ width: "210mm", minHeight: "297mm" }}
                    className="bg-white dark:bg-black px-14 py-16 shadow-sm border border-gray-100 dark:border-gray-800 mx-auto"
                  >
                    <div className="flex justify-between items-start mb-12">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {company?.displayName}
                        </h1>
                        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                          A/R Aging Summary
                        </h2>
                        <p className="text-gray-500 dark:text-gray-500 mt-1 font-medium">
                          As of {formatDate(data.date)}
                        </p>
                      </div>
                      
                      <div className="text-right text-sm text-gray-600 dark:text-gray-400 space-y-1 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <p><strong>EIN:</strong> {company?.ein}</p>
                        <p><strong>SSN:</strong> {company?.ssn}</p>
                        <p><strong>Phone:</strong> {company?.phone}</p>
                        <p><strong>Email:</strong> {company?.email}</p>
                        <p><strong>Address:</strong> {company?.address}</p>
                      </div>
                    </div>

                    <Separator className="my-8" />
                    
                    <div className="mb-10">
                      <Table>
                        <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                          <TableRow className="border-b-2 border-gray-200 dark:border-gray-800 hover:bg-transparent">
                            <TableHead className="font-bold text-gray-900 dark:text-gray-100">Invoice No</TableHead>
                            <TableHead className="font-bold text-gray-900 dark:text-gray-100">Name</TableHead>
                            <TableHead className="font-bold text-gray-900 dark:text-gray-100 hidden sm:table-cell">Email</TableHead>
                            <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-right">Due Date</TableHead>
                            <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-right">Total Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.invoices.map((type, i) => (
                            <React.Fragment key={i}>
                              <TableRow className="hover:bg-transparent border-none">
                                <TableCell colSpan={5} className="pb-2 pt-6">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-5 bg-primary-navy rounded-full"></div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                      {type.category} <span className="text-gray-500 text-sm font-normal ml-2">({type.count})</span>
                                    </h3>
                                  </div>
                                </TableCell>
                              </TableRow>
                              {type?.invoices.map((item, index) => (
                                <TableRow
                                  className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                  key={index}
                                >
                                  <TableCell className="font-medium text-gray-700 dark:text-gray-300">{item?.invoiceNo}</TableCell>
                                  <TableCell className="text-gray-600 dark:text-gray-400">{item?.firstName}</TableCell>
                                  <TableCell className="text-gray-600 dark:text-gray-400 hidden sm:table-cell">{item?.email}</TableCell>
                                  <TableCell className="text-gray-600 dark:text-gray-400 text-right">
                                    {formatDate(item?.dueDate)}
                                  </TableCell>
                                  <TableCell className="font-medium text-gray-900 dark:text-gray-100 text-right">
                                    {currency.symbol} {item?.totalAmount}
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow className="border-b-2 border-gray-200 dark:border-gray-800 hover:bg-transparent bg-gray-50/30 dark:bg-gray-900/30">
                                <TableCell colSpan={4} className="text-right font-bold text-gray-700 dark:text-gray-300">
                                  Subtotal
                                </TableCell>
                                <TableCell className="font-bold text-gray-900 dark:text-white text-right">
                                  {currency.symbol} {type?.totalAmount}
                                </TableCell>
                              </TableRow>
                              <TableRow className="border-none hover:bg-transparent">
                                <TableCell colSpan={5} className="h-4"></TableCell>
                              </TableRow>
                            </React.Fragment>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="mt-12 pt-6 border-t-4 border-gray-900 dark:border-gray-100 flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                        Total Amount
                      </span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currency.symbol} {data.netTotal}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
