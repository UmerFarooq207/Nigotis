import { formatDate } from "@/lib/utils";
import React from "react";
import { Calendar, Monitor, Receipt } from "lucide-react";

export default function Summary({
  plan,
  startDate,
  endDate,
  noOfMonths,
  totalScreens,
  additionalScreens,
  totalFee,
}) {
  const basePrice = (parseFloat(plan.pricePerMonth) * noOfMonths).toFixed(2);
  const screenPrice = (
    parseFloat(plan.pricePerScreen) *
    additionalScreens *
    noOfMonths
  ).toFixed(2);

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-b from-gray-50/80 to-white overflow-hidden">
      {/* Header row */}
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Receipt size={16} className="text-gray-400" />
          Order Details
        </h4>
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* Plan */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Plan</span>
          <span className="font-medium text-gray-800">{plan.name}</span>
        </div>

        {/* Duration */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 flex items-center gap-1.5">
            <Calendar size={14} /> Duration
          </span>
          <span className="font-medium text-gray-800">
            {noOfMonths} month{noOfMonths > 1 ? "s" : ""}
          </span>
        </div>

        {/* Dates */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Period</span>
          <span className="text-gray-600 text-xs">
            {formatDate(startDate)} — {formatDate(endDate)}
          </span>
        </div>

        {/* Screens */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 flex items-center gap-1.5">
            <Monitor size={14} /> Screens
          </span>
          <span className="text-gray-800">
            {totalScreens}{" "}
            {additionalScreens > 0 && (
              <span className="text-gray-400 text-xs">
                ({totalScreens - additionalScreens} + {additionalScreens})
              </span>
            )}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 my-1" />

        {/* Base price */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Base ({noOfMonths} × ${Number(plan.pricePerMonth).toFixed(2)})
          </span>
          <span className="text-gray-700">${basePrice}</span>
        </div>

        {/* Screen price */}
        {additionalScreens > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              Extra screens ({additionalScreens} × ${Number(plan.pricePerScreen).toFixed(2)} × {noOfMonths}mo)
            </span>
            <span className="text-gray-700">${screenPrice}</span>
          </div>
        )}

        {/* Total */}
        <div className="h-px bg-gray-200 my-1" />
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-800">Total</span>
          <span className="text-xl font-bold text-[#003B6D]">
            ${parseFloat(totalFee).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
