"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useCurrency from "@/hooks/useCurrency";
import { useEffect, useRef, useState } from "react";
import useUser from "@/hooks/useUser";
import { fetchCustom, getFormattedFigures } from "@/lib/utils";
import LoadingDots from "@/components/Utils/LoadingDots";
import { Scale, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "motion/react";
import { endOfMonth, endOfYear, format, startOfMonth, startOfYear, subDays, endOfToday, startOfDay } from "date-fns";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProfitAndLoss() {
  const currency = useCurrency();
  const { user } = useUser();
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const latestRequestRef = useRef(0);

  function getDateRange(selectedRange) {
    const today = new Date();
    let fromDate;
    let toDate;

    switch (selectedRange) {
      case "thisMonth":
        fromDate = startOfMonth(today);
        toDate = endOfMonth(today);
        break;
      case "thisYear":
        fromDate = startOfYear(today);
        toDate = endOfYear(today);
        break;
      case "last7Days":
        fromDate = startOfDay(subDays(today, 6));
        toDate = endOfToday();
        break;
      case "last30Days":
        fromDate = startOfDay(subDays(today, 29));
        toDate = endOfToday();
        break;
      default:
        fromDate = startOfMonth(today);
        toDate = endOfMonth(today);
    }

    return {
      fromDate: format(fromDate, "yyyy-MM-dd"),
      toDate: format(toDate, "yyyy-MM-dd"),
    };
  }

  useEffect(() => {
    if (!user?.token) return;

    const { fromDate, toDate } = getDateRange(selectedPeriod);
    const controller = new AbortController();
    const requestId = latestRequestRef.current + 1;
    latestRequestRef.current = requestId;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchCustom(
          `/reports/profit-loss?fromDate=${fromDate}&toDate=${toDate}`,
          { method: "GET", token: user?.token, signal: controller.signal }
        );
        const result = await response.json();
        if (latestRequestRef.current === requestId) {
          setData(result?.data ?? null);
        }
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error("Error fetching data:", error);
        }
      } finally {
        if (latestRequestRef.current === requestId) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, [selectedPeriod, user?.token]);

  const handleChange = (value) => {
    if (value === selectedPeriod) return;
    setSelectedPeriod(value);
  };

  const getPeriodName = () => {
    const currentDate = new Date();
    switch (selectedPeriod) {
      case "thisMonth": return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toLocaleString("default", { month: "long" });
      case "thisYear": return currentDate.getFullYear().toString();
      case "last7Days": return "Last 7 Days";
      case "last30Days": return "Last 30 Days";
      default: return "Selected Period";
    }
  };

  const totalIncomeValue = Number(data?.totalIncome ?? 0);
  const totalExpensesValue = Number(data?.totalExpenses ?? 0);
  const netValue = Number(data?.net ?? 0);
  const isProfit = netValue >= 0;

  // Scale bars by max amount so width reflects amount.
  const maxAmount = Math.max(totalIncomeValue, totalExpensesValue, 1);
  const incomeBar = Math.max(3, Math.round((totalIncomeValue / maxAmount) * 100));
  const expenseBar = Math.max(3, Math.round((totalExpensesValue / maxAmount) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#003667]/10 border border-[#003667]/20">
            <Scale className="w-4 h-4 text-[#003667]" />
          </div>
          <span className="font-semibold text-gray-900 text-sm">Profit & Loss</span>
        </div>
        <Select value={selectedPeriod} onValueChange={handleChange}>
          <SelectTrigger className="w-[120px] h-7 text-xs border-gray-200 rounded-lg">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="thisMonth">This month</SelectItem>
            <SelectItem value="thisYear">This year</SelectItem>
            <SelectItem value="last7Days">Last 7 days</SelectItem>
            <SelectItem value="last30Days">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-5 space-y-5">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-16 rounded-xl bg-gray-100 animate-pulse" />
            <div className="h-8 rounded-lg bg-gray-100 animate-pulse" />
            <div className="h-8 rounded-lg bg-gray-100 animate-pulse" />
          </div>
        ) : (
          <>
            {/* Net Result */}
            <div className={`rounded-xl p-4 ${isProfit ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Net {isProfit ? "profit" : "loss"} · {getPeriodName()}
                  </p>
                  <p className={`text-2xl font-bold ${isProfit ? "text-emerald-700" : "text-red-700"}`}>
                    {currency?.symbol}&nbsp;{getFormattedFigures(netValue)}
                  </p>
                </div>
                <div className={`p-2 rounded-xl ${isProfit ? "bg-emerald-100" : "bg-red-100"}`}>
                  {isProfit
                    ? <TrendingUp className="w-6 h-6 text-emerald-600" />
                    : <TrendingDown className="w-6 h-6 text-red-600" />
                  }
                </div>
              </div>
            </div>

            {/* Income vs Expense Bars */}
            <div className="space-y-3">
              {/* Income Row */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs font-medium text-gray-600">Income</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-800">
                    {currency?.symbol}&nbsp;{getFormattedFigures(totalIncomeValue)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${incomeBar}%` }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="h-full rounded-full bg-green-600"
                  />
                </div>
              </div>

              {/* Expense Row */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-600" />
                    <span className="text-xs font-medium text-gray-600">Expenses</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-800">
                    {currency?.symbol}&nbsp;{getFormattedFigures(totalExpensesValue)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${expenseBar}%` }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="h-full rounded-full bg-red-600"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}