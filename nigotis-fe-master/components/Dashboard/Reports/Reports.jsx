"use client";
import React from "react";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import { FileText, BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Landmark, Building, CreditCard, Receipt, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const reports = [
  {
    name: "Financial Reports",
    icon: <DollarSign size={24} className="text-emerald-500" />,
    reports: [
      { name: "Profit and Loss", link: "/profit-and-loss" },
      { name: "Balance Sheet", link: "/balance-sheet" },
      { name: "Cash Flow", link: "/cash-flow" },
    ],
  },
  {
    name: "Accounts Receivable",
    icon: <CreditCard size={24} className="text-blue-500" />,
    reports: [
      { name: "A/R Aging Summary", link: "/ar-aging-summary" },
      { name: "Open Invoices", link: "/open-invoices" },
    ],
  },
  {
    name: "Accounts Payable",
    icon: <Receipt size={24} className="text-rose-500" />,
    reports: [
      { name: "A/P Aging Summary", link: "/ap-aging-summary" },
      { name: "Unpaid Bills", link: "/unpaid-bills" },
    ],
  },
  {
    name: "Sales Reports",
    icon: <TrendingUp size={24} className="text-purple-500" />,
    reports: [
      { name: "Sales by Customer Summary", link: "/sales-by-customer-summary" },
      { name: "Sales by Item Summary", link: "/sales-by-item-summary" },
    ],
  },
  {
    name: "Expense Reports",
    icon: <TrendingDown size={24} className="text-orange-500" />,
    reports: [
      { name: "Expense by Vendor Summary", link: "/expense-by-vendor-summary" },
      { name: "Expense by Category Report", link: "/expense-by-category" },
    ],
  },
  {
    name: "Payroll Reports",
    icon: <Users size={24} className="text-indigo-500" />,
    reports: [
      { name: "Payroll Summary Report", link: "/payroll-summary" },
      { name: "Employee Earnings Report", link: "/employee-earnings" },
    ],
  },
  {
    name: "Asset Reports",
    icon: <Building size={24} className="text-teal-500" />,
    reports: [
      { name: "Fixed Asset Listing", link: "/fixed-asset-listing" },
      { name: "Depreciation Schedule", link: "/depreciation-schedule" },
    ],
  },
  {
    name: "Tax Reports",
    icon: <Landmark size={24} className="text-yellow-500" />,
    reports: [
      { name: "Sales Tax Liability", link: "/sales-tax-liability" },
      { name: "Payroll Tax Liability", link: "/payroll-tax-liability" },
    ],
  },
  {
    name: "Performance Reports",
    icon: <BarChart3 size={24} className="text-cyan-500" />,
    reports: [
      { name: "Budget vs. Actual", link: "/budget-vs-actual" },
      { name: "Customizable Dashboards", link: "/customizable-dashboards" },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export function Reports() {
  return (
    <MainDashboardContentSkeleton title={null}>
      <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
            <FileText className="w-5 h-5 text-[#003667]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Reports</h2>
            <p className="text-sm text-gray-500">Access and generate comprehensive reports for your business</p>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {reports.map((category, index) => (
          <motion.div key={index} variants={itemVariants} className="bg-white dark:bg-[#1a1c23] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md transition-shadow duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{category.name}</h2>
            </div>
            <div className="space-y-3">
              {category.reports.map((report, i) => (
                <Link
                  href={`/dashboard/reports${report.link}`}
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary-navy hover:text-white dark:hover:bg-primary-navy transition-all duration-300 group/link"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-gray-400 group-hover/link:text-white/80 transition-colors" />
                    <span className="font-medium text-gray-700 dark:text-gray-300 group-hover/link:text-white transition-colors">
                      {report.name}
                    </span>
                  </div>
                  <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300" />
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
        </motion.div>
      </div>
    </MainDashboardContentSkeleton>
  );
}
