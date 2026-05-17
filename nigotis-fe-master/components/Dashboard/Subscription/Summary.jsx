import { formatDate } from "@/lib/utils";
import React from "react";

export default function Summary({
  plan,
  startDate,
  endDate,
  noOfMonths,
  totalScreens,
  additionalScreens,
  totalFee,
}) {
  return (
    <div className="bg-gray-100 container  rounded-lg mb-4">
      <h2 className="text-xl font-semibold mb-2">Summary</h2>
      <p>Plan: {plan.name}</p>
      <p>Duration: {noOfMonths} month(s)</p>
      <p>Start Date: {formatDate(startDate)}</p>
      <p>End Date: {formatDate(endDate)}</p>
      <p>
        Total Screens: {totalScreens} (Base: {totalScreens - additionalScreens},
        Additional: {additionalScreens})
      </p>
      <p>
        Base Price: ${(parseFloat(plan.pricePerMonth) * noOfMonths).toFixed(2)}
      </p>
      <p>
        Additional Screens Price: $
        {(
          parseFloat(plan.pricePerScreen) *
          additionalScreens *
          noOfMonths
        ).toFixed(2)}
      </p>
      <p className="font-bold">Total Fee: ${parseFloat(totalFee).toFixed(2)}</p>
    </div>
  );
}
