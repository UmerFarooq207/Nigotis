"use client";

import { useState, useEffect, useRef } from "react";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  subYears,
  endOfToday,
  subDays,
  differenceInMonths,
  addMonths,
} from "date-fns";
import { Check, ChevronDown, CalendarIcon, TrendingUp, Activity } from "lucide-react";
import { cn, fetchCustom, getFormattedFigures } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import useCurrency from "@/hooks/useCurrency";
import useUser from "@/hooks/useUser";
import { toast } from "@/hooks/use-toast";
import { motion } from "motion/react";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label, currencySymbol }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-3 text-sm">
        <p className="font-semibold text-gray-700 mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-500 capitalize">{entry.dataKey}:</span>
            <span className="font-semibold text-gray-800">
              {currencySymbol}&nbsp;{getFormattedFigures(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function FinancialGraph() {
  const currency = useCurrency();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const [toggles, setToggles] = useState({
    incoming: true,
    outgoing: true,
    balance: true,
  });

  const [selectedOption, setSelectedOption] = useState("this-year");
  const [cashFlowData, setCashFlowData] = useState(null);
  const [dateRange, setDateRange] = useState({
    fromDate: startOfYear(new Date()),
    toDate: endOfToday(),
  });
  const [customFromDate, setCustomFromDate] = useState(subYears(new Date(), 1));
  const [customToDate, setCustomToDate] = useState(new Date());
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const latestRequestRef = useRef(0);

  const dateRangeOptions = [
    { label: "Today", value: "today", getDateRange: () => ({ fromDate: startOfDay(new Date()), toDate: endOfDay(new Date()) }) },
    { label: "This Week", value: "this-week", getDateRange: () => ({ fromDate: startOfWeek(new Date(), { weekStartsOn: 1 }), toDate: endOfWeek(new Date(), { weekStartsOn: 1 }) }) },
    { label: "This Month", value: "this-month", getDateRange: () => ({ fromDate: startOfMonth(new Date()), toDate: endOfMonth(new Date()) }) },
    { label: "This Year", value: "this-year", getDateRange: () => ({ fromDate: startOfYear(new Date()), toDate: endOfToday() }) },
    { label: "Last 7 Days", value: "last-7-days", getDateRange: () => ({ fromDate: startOfDay(subDays(new Date(), 6)), toDate: endOfToday() }) },
    { label: "Last 30 Days", value: "last-30-days", getDateRange: () => ({ fromDate: startOfDay(subDays(new Date(), 29)), toDate: endOfToday() }) },
    { label: "Last 2 Months", value: "last-2-months", getDateRange: () => ({ fromDate: startOfMonth(subMonths(new Date(), 1)), toDate: endOfMonth(new Date()) }) },
    { label: "Last year", value: "last-year", getDateRange: () => { const ly = subYears(new Date(), 1); return { fromDate: startOfYear(ly), toDate: endOfYear(ly) }; } },
    { label: "Custom range", value: "custom", getDateRange: () => ({ fromDate: customFromDate, toDate: customToDate }) },
  ];

  const handleToggleChange = (toggleName) => {
    setToggles((prev) => ({ ...prev, [toggleName]: !prev[toggleName] }));
  };

  const handleDateRangeSelect = (option) => {
    if (option.value === selectedOption) return;
    setIsLoading(true);
    setSelectedOption(option.value);
    if (option.value === "custom") {
      setIsCustomRange(true);
      setCalendarOpen(true);
      setIsLoading(false);
    } else {
      setIsCustomRange(false);
      setDateRange(option.getDateRange());
    }
  };

  const applyCustomDateRange = () => {
    if (customFromDate && customToDate) {
      setIsLoading(true);
      setDateRange({ fromDate: startOfDay(customFromDate), toDate: endOfDay(customToDate) });
      setCalendarOpen(false);
    }
  };

  useEffect(() => {
    if (!user?.token) return;

    const controller = new AbortController();
    const requestId = latestRequestRef.current + 1;
    latestRequestRef.current = requestId;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchCustom(
          `/reports/cashflow?fromDate=${format(dateRange.fromDate, "yyyy-MM-dd")}&toDate=${format(dateRange.toDate, "yyyy-MM-dd")}`,
          { method: "GET", token: user?.token, signal: controller.signal }
        );
        const result = await response.json();
        if (latestRequestRef.current === requestId) {
          setCashFlowData(result?.data ?? null);
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

    return () => {
      controller.abort();
    };
  }, [dateRange, isCustomRange, user?.token]);

  const summaryItems = [
    { label: "Total Incoming", value: cashFlowData?.totalIncoming, color: "#16a34a", bg: "bg-green-50", text: "text-green-700" },
    { label: "Total Outgoing", value: cashFlowData?.totalOutgoing, color: "#dc2626", bg: "bg-red-50", text: "text-red-700" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
              <Activity className="w-5 h-5 text-[#003667]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Cash Flow</h2>
              <p className="text-sm text-gray-500">Income vs expenses over time</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Toggles */}
            {[
              { key: "incoming", label: "Incoming", color: "#16a34a" },
              { key: "outgoing", label: "Outgoing", color: "#dc2626" },
              { key: "balance", label: "Balance", color: "#475569" },
            ].map(({ key, label, color }) => (
              <div key={key} className="flex items-center gap-1.5">
                <Switch
                  className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-200 h-4 w-8"
                  id={key}
                  checked={toggles[key]}
                  onCheckedChange={() => handleToggleChange(key)}
                />
                <Label htmlFor={key} className="text-xs text-gray-600 cursor-pointer flex items-center gap-1">
                  {color && <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />}
                  {label}
                </Label>
              </div>
            ))}

            {/* Date Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200 gap-1.5">
                  {dateRangeOptions.find((o) => o.value === selectedOption)?.label || "Select range"}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[180px]">
                {dateRangeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    className={cn("flex items-center justify-between cursor-pointer text-sm", selectedOption === option.value && "bg-blue-50 text-blue-700")}
                    onClick={() => handleDateRangeSelect(option)}
                  >
                    {option.label}
                    {selectedOption === option.value && <Check className="h-3.5 w-3.5" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Custom Date Picker */}
            {isCustomRange && (
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200 gap-1.5">
                    <CalendarIcon className="h-3 w-3" />
                    {format(customFromDate, "MMM dd")} – {format(customToDate, "MMM dd, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="end">
                  <div className="space-y-3">
                    <div className="grid gap-1.5">
                      <Label className="text-xs text-gray-600">From</Label>
                      <input
                        type="date"
                        className="flex h-9 w-full rounded-lg border border-gray-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        value={format(customFromDate, "yyyy-MM-dd")}
                        onChange={(e) => setCustomFromDate(startOfDay(new Date(`${e.target.value}T00:00:00`)))}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label className="text-xs text-gray-600">To</Label>
                      <input
                        type="date"
                        className="flex h-9 w-full rounded-lg border border-gray-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        value={format(customToDate, "yyyy-MM-dd")}
                        onChange={(e) => {
                          const selectedToDate = startOfDay(new Date(`${e.target.value}T00:00:00`));
                          if (!customFromDate) { setCustomToDate(selectedToDate); return; }
                          const monthDiff = differenceInMonths(selectedToDate, customFromDate);
                          if (monthDiff > 12) {
                            setCustomToDate(addMonths(customFromDate, 12));
                            toast({ variant: "destructive", title: "Error", description: "Only 12 months allowed" });
                          } else {
                            setCustomToDate(selectedToDate);
                          }
                        }}
                      />
                    </div>
                    <Button size="sm" className="w-full" onClick={applyCustomDateRange}>Apply</Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>

      {/* Summary Badges */}
      {!isLoading && cashFlowData && (
        <div className="px-6 pb-4 flex flex-wrap gap-3">
          {summaryItems.map((item) => (
            <div key={item.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${item.bg} border border-gray-100`}>
              <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
              <span className="text-xs text-gray-500">{item.label}:</span>
              <span className={`text-xs font-semibold ${item.text}`}>
                {currency?.symbol}&nbsp;{getFormattedFigures(item.value?.toFixed(2))}
              </span>
            </div>
          ))}
          {cashFlowData?.cashAsDate && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
              <span className="text-xs text-gray-500">{cashFlowData.cashAsDate}</span>
            </div>
          )}
        </div>
      )}

      {/* Chart */}
      <div className="px-4 pb-6">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="space-y-3 w-full px-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-2.5 bg-gray-100 rounded-full animate-pulse" style={{ width: `${70 + Math.random() * 30}%` }} />
              ))}
            </div>
          </div>
        ) : !cashFlowData?.cashFlowData?.length ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-2">
            <TrendingUp className="w-10 h-10 text-gray-200" />
            <p className="text-sm">No cash flow data available for this period</p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cashFlowData?.cashFlowData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(v) => getFormattedFigures(v)}
                  width={48}
                />
                <Tooltip content={<CustomTooltip currencySymbol={currency?.symbol} />} />
                {toggles.incoming && (
                  <Bar dataKey="incoming" fill="#16a34a" radius={[0, 0, 0, 0]} barSize={12} animationDuration={220} />
                )}
                {toggles.outgoing && (
                  <Bar dataKey="outgoing" fill="#dc2626" radius={[0, 0, 0, 0]} barSize={12} animationDuration={220} />
                )}
                {toggles.balance && (
                  <Bar dataKey="balance" fill="#475569" radius={[0, 0, 0, 0]} barSize={12} animationDuration={220} />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
}
