import connectDB from "@/lib/db";
import { userFinanceGuard } from "@/middleware/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";
let token;

/**
 * Helper to generate month range between two dates.
 */
function getMonthRange(fromDate, toDate) {
  const start = new Date(fromDate);
  const end = new Date(toDate);
  const months = [];

  start.setDate(1); // Set to first day of month
  while (start <= end) {
    const monthStart = new Date(start);
    const monthEnd = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    months.push({
      label: monthStart.toLocaleString("default", { month: "short" }),
      from: new Date(monthStart),
      to: new Date(monthEnd),
    });
    start.setMonth(start.getMonth() + 1);
  }
  return months;
}

/**
 * Hit income or expense report API for a given month range.
 */
async function fetchReport(endpoint, from, to) {
  const url = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/api/v1/reports/${endpoint}?fromDate=${
    from.toISOString().split("T")[0]
  }&toDate=${to.toISOString().split("T")[0]}`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if(!data?.success){
    throw new Error(data?.message)
  }
  return (
    data?.data?.[endpoint === "income" ? "totalIncome" : "totalExpenses"] || 0
  );
}

export async function GET(req) {
  try {
    await connectDB();
    const authData = await userFinanceGuard(req);
    if (!authData?.success) return resError(authData?.message);
    const headers = req.headers;
    token = headers.get("authorization").split(" ")[1];

    const { searchParams } = new URL(req.url);
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    if (!fromDate || !toDate) {
      return resError("The 'fromDate' and 'toDate' are required.");
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (from > to)
      return resError("The 'fromDate' cannot be greater than 'toDate'.");

    const months = getMonthRange(fromDate, toDate);

    let balance = 0;
    let totalIncoming = 0;
    let totalOutgoing = 0;
    const cashFlowData = [];

    for (let m of months) {
      const [incomeStr, expensesStr] = await Promise.all([
        fetchReport("income", m.from, m.to),
        fetchReport("expenses", m.from, m.to),
      ]);

      const incoming = parseFloat(incomeStr);
      const outgoing = parseFloat(expensesStr);
      const netCashFlow = incoming - outgoing;
      balance += netCashFlow;

      cashFlowData.push({
        month: m.label,
        incoming,
        outgoing,
        netCashFlow,
        balance,
      });

      totalIncoming += incoming;
      totalOutgoing += outgoing;
    }

    return NextResponse.json({
      success: true,
      data: { cashFlowData, cashAsDate: toDate, totalIncoming, totalOutgoing },
    });
  } catch (error) {
    console.error(error);
    return resError(error?.message || "Something went wrong");
  }
}
