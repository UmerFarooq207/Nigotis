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
import { fetchCustom, formatDate } from "@/lib/utils";
import useUser from "@/hooks/useUser";
import { Input } from "@/components/ui/input";
import { useCompany } from "@/contexts/company";
import useCurrency from "@/hooks/useCurrency";
import { Separator } from "@/components/ui/separator";
import DownloadReportBtn from "../DownloadReportBtn";
import Link from "next/link";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BalanceSheet() {
  const [date, setDate] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const { company } = useCompany();
  const contentRef = useRef(null);
  const currency = useCurrency();
  const fetchData = async () => {
    if (!date) return;

    setIsLoading(true);
    try {
      const response = await fetchCustom(
        `/reports/balance-sheet?date=${date}`,
        {
          method: "GET",
          token: user?.token,
        },
      );
      const result = await response.json();
      setData(result?.data);
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
            Balance Sheet
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View your company's financial position at a specific point in time.
          </p>
        </div>
      </div>

      <Card className="border-none shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 space-y-2 w-full max-w-md">
              <label htmlFor="date" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Calendar size={16} className="text-primary-navy" />
                As of Date
              </label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 focus-visible:ring-primary-navy"
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto mt-4 md:mt-0">
              <Button
                onClick={fetchData}
                disabled={!date || isLoading}
                className="flex-1 md:flex-none bg-primary-navy hover:bg-primary-navy/90 text-white min-w-[140px]"
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
                    name={`Balance-Sheet-As-of-${formatDate(date)}-${company?.displayName}.pdf`}
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
                          Balance Sheet
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
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                        Assets
                      </h3>
                      <div className="space-y-3 pl-4">
                        {data.assets.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                          >
                            <span>{item.title}</span>
                            <span className="font-medium">
                              {currency.symbol} {item.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-12 pt-6 border-t-4 border-gray-900 dark:border-gray-100 flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                        Total Assets
                      </span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                        {currency.symbol} {data.totalAssets}
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
