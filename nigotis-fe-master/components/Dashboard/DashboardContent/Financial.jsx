"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "motion/react";
import ProfitAndLoss from "./ProfitAndLoss";
import IncomesChart from "./IncomesChart";
import ExpensesChart from "./ExpensesChart";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Financial() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="grid gap-4 grid-cols-1 md:grid-cols-3 items-stretch"
    >
      {/* Profit & Loss Card */}
      <ProfitAndLoss />
      {/* Income Card */}
      <IncomesChart />
      {/* Expenses Card */}
      <ExpensesChart />
    </motion.div>
  );
}
