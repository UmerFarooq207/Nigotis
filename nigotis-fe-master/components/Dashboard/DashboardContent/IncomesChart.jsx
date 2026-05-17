import useCurrency from "@/hooks/useCurrency";
import { useEffect, useRef, useState } from "react";
import useUser from "@/hooks/useUser";
import { fetchCustom, getFormattedFigures } from "@/lib/utils";
import {
  endOfDay,
  endOfMonth,
  endOfToday,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend as RechartsLegend,
} from "recharts";
import { TrendingUp, PiggyBank } from "lucide-react";
import { motion } from "motion/react";

const CustomTooltip = ({ active, currencySymbol, allData }) => {
  if (active) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-3 text-sm min-w-[160px] z-50">
        <p className="font-semibold text-gray-700 mb-2">Income Breakdown</p>
        {allData.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4 mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-500 capitalize">{entry.name}</span>
            </div>
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

export default function IncomesChart() {
  const currency = useCurrency();
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const { user } = useUser();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const latestRequestRef = useRef(0);

  function getDateRange(selectedRange) {
    const today = new Date();
    let fromDate;
    let toDate;

    switch (selectedRange) {
      case "today":
        fromDate = startOfDay(today);
        toDate = endOfDay(today);
        break;
      case "thisWeek":
        fromDate = startOfWeek(today, { weekStartsOn: 1 });
        toDate = endOfWeek(today, { weekStartsOn: 1 });
        break;
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
          `/reports/income?fromDate=${fromDate}&toDate=${toDate}`,
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

    return () => {
      controller.abort();
    };
  }, [selectedPeriod, user?.token]);

  const handleChange = (value) => {
    if (value === selectedPeriod) return;
    setSelectedPeriod(value);
  };

  const getPeriodName = () => {
    const currentDate = new Date();
    switch (selectedPeriod) {
      case "today":
        return "Today";
      case "thisWeek":
        return "This Week";
      case "thisMonth":
        return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toLocaleString("default", { month: "long" });
      case "thisYear":
        return currentDate.getFullYear().toString();
      case "last7Days":
        return "Last 7 Days";
      case "last30Days":
        return "Last 30 Days";
      default:
        return "Selected Period";
    }
  };

  const fallbackData = {
    labels: ["Invoices", "Others"],
    datasets: [{ data: [30, 25], backgroundColor: ["#4ade80", "#16a34a"], borderWidth: 0, hoverOffset: 4 }],
  };

  const chartData = data?.chartData
    ? {
        ...data.chartData,
        datasets: data.chartData.datasets?.map((ds) => ({
          ...ds,
          backgroundColor: ["#16a34a", "#14532d", "#4ade80", "#bbf7d0"],
        })),
      }
    : fallbackData;

  const rechartsData = chartData.labels.map((label, index) => ({
    name: label,
    value: chartData.datasets[0].data[index],
    color: chartData.datasets[0].backgroundColor[index],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-green-50 border border-green-100">
            <PiggyBank className="w-4 h-4 text-green-600" />
          </div>
          <span className="font-semibold text-gray-900 text-sm">Income</span>
        </div>
        <Select value={selectedPeriod} onValueChange={handleChange}>
          <SelectTrigger className="w-[120px] h-7 text-xs border-gray-200 rounded-lg">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="thisWeek">This week</SelectItem>
            <SelectItem value="thisMonth">This month</SelectItem>
            <SelectItem value="thisYear">This year</SelectItem>
            <SelectItem value="last7Days">Last 7 days</SelectItem>
            <SelectItem value="last30Days">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-5 space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-12 rounded-xl bg-gray-100 animate-pulse" />
            <div className="h-44 rounded-xl bg-gray-100 animate-pulse" />
          </div>
        ) : (
          <>
            {/* Total */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Income for {getPeriodName()}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">
                  {currency?.symbol}&nbsp;{getFormattedFigures(data?.totalIncome)}
                </p>
              </div>
              <div className="p-2 rounded-xl bg-green-50">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>

            {/* Donut Chart */}
            <div className="relative w-full h-[220px] mx-auto flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip content={<CustomTooltip currencySymbol={currency?.symbol} allData={rechartsData} />} />
                  <Pie
                    data={rechartsData}
                    cx="50%"
                    cy="45%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {rechartsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsLegend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-gray-500 text-xs ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
