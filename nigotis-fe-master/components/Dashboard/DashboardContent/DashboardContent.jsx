"use client";
import React from "react";
import Financial from "./Financial";
import FinancialGraph from "./FinancialGraph";
import useUser from "@/hooks/useUser";
import InvoicesFigures from "./InvoicesFigures";
import { motion } from "motion/react";

export default function DashboardContent() {
  const { user } = useUser();
  return (
    <div className="w-full">
      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {(user?.role === "admin" || user?.role === "sales") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <InvoicesFigures />
          </motion.div>
        )}
        {(user?.role === "admin" || user?.role === "finance") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <FinancialGraph />
            <Financial />
          </motion.div>
        )}
      </div>
    </div>
  );
}
