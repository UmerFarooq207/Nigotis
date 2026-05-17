import LoadingDots from "@/components/Utils/LoadingDots";
import useCurrency from "@/hooks/useCurrency";
import { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { fetchCustom, getFormattedFigures } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "motion/react";
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Receipt,
} from "lucide-react";

export default function InvoicesFigures() {
  const currency = useCurrency();
  const [selectedPeriod, setSelectedPeriod] = useState("lastYear");
  const { user } = useUser();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleChange("thisMonth");
  }, []);

  const fetchData = async (fromDate, toDate) => {
    setIsLoading(true);
    try {
      const response = await fetchCustom(
        `/reports/invoices?fromDate=${fromDate}&toDate=${toDate}`,
        { method: "GET", token: user?.token }
      );
      const result = await response.json();
      setData(result?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function getDateRange(selectedRange) {
    const today = new Date();
    let fromDate, toDate;
    switch (selectedRange) {
      case "thisMonth":
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "lastMonth":
        fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        toDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "lastQuarter":
        const currentQuarter = Math.floor((today.getMonth() + 2) / 3);
        let lastQuarterYear = today.getFullYear();
        let lastQuarterEndMonth = (currentQuarter - 1) * 3;
        if (currentQuarter === 1) { lastQuarterYear -= 1; lastQuarterEndMonth = 12; }
        fromDate = new Date(lastQuarterYear, lastQuarterEndMonth - 2, 1);
        toDate = new Date(lastQuarterYear, lastQuarterEndMonth + 1, 0);
        break;
      case "lastYear":
        fromDate = new Date(today.getFullYear() - 1, 0, 1);
        toDate = new Date(today.getFullYear() - 1, 11, 31);
        break;
      case "listAll":
        return { fromDate: "", toDate: "" };
      default:
        throw new Error("Invalid date range selected");
    }
    fromDate.setDate(fromDate.getDate() + 1);
    toDate.setDate(toDate.getDate() + 1);
    return {
      fromDate: fromDate.toISOString().split("T")[0],
      toDate: toDate.toISOString().split("T")[0],
    };
  }

  const handleChange = (value) => {
    setSelectedPeriod(value);
    const { fromDate, toDate } = getDateRange(value);
    fetchData(fromDate, toDate);
  };

  const getPeriodName = () => {
    const currentDate = new Date();
    switch (selectedPeriod) {
      case "thisMonth": return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toLocaleString("default", { month: "long" });
      case "lastMonth": return new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).toLocaleString("default", { month: "long" });
      case "lastQuarter": {
        const cq = Math.floor((currentDate.getMonth() + 3) / 3);
        const qsm = (cq - 2) * 3;
        return Array.from({ length: 3 }, (_, i) =>
          new Date(currentDate.getFullYear(), qsm + i, 1).toLocaleString("default", { month: "long" })
        ).join(", ");
      }
      case "lastYear": return (currentDate.getFullYear() - 1).toString();
      case "listAll": return "All Time";
      default: throw new Error("Invalid period");
    }
  };

  const stats = [
    {
      label: "Pending",
      count: data?.currentInvoices,
      amount: data?.currentAmount,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      dot: "bg-amber-400",
    },
    {
      label: "Overdue",
      count: data?.overDueInvoices,
      amount: data?.overDueAmount,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
      dot: "bg-red-400",
    },
    {
      label: "Paid",
      count: data?.paidInvoices,
      amount: data?.paidAmount,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      dot: "bg-emerald-400",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
            <Receipt className="w-5 h-5 text-[#003667]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Invoice Overview</h2>
            <p className="text-sm text-gray-500">{isLoading ? "Loading..." : `${getPeriodName()} · ${data?.totalInvoices ?? 0} invoices`}</p>
          </div>
        </div>
        <Select defaultValue="thisMonth" onValueChange={handleChange}>
          <SelectTrigger className="w-[140px] h-9 text-sm border-gray-200 bg-white shadow-sm rounded-lg">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="thisMonth">This month</SelectItem>
            <SelectItem value="lastMonth">Last month</SelectItem>
            <SelectItem value="lastQuarter">Last quarter</SelectItem>
            <SelectItem value="lastYear">Last year</SelectItem>
            <SelectItem value="listAll">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-1 bg-gradient-to-br from-[#003667] to-[#007b7e] rounded-2xl p-5 text-white shadow-lg shadow-[#003667]/20 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-200 uppercase tracking-wide">Total Amount</span>
              <div className="p-1.5 rounded-lg bg-white/10">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <div title={data?.totalAmount} className="text-2xl font-bold mt-3">
                {currency?.symbol}&nbsp;{getFormattedFigures(data?.totalAmount)}
              </div>
              <div className="text-xs text-blue-200 mt-1">
                Unpaid: {currency?.symbol}&nbsp;{getFormattedFigures((data?.currentAmount ?? 0) + (data?.overDueAmount ?? 0))}
              </div>
            </div>
          </motion.div>

          {/* Stat Cards */}
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (i + 1) * 0.08 }}
                className={`bg-white rounded-2xl p-5 border ${stat.border} shadow-sm hover:shadow-md transition-shadow duration-200`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</span>
                  <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div className={`text-2xl font-bold ${stat.color}`} title={stat.amount}>
                  {currency?.symbol}&nbsp;{getFormattedFigures(stat.amount)}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className={`w-2 h-2 rounded-full ${stat.dot}`} />
                  <span className="text-xs text-gray-500">{stat.count ?? 0} invoices</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
