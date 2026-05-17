"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InputComp from "../Utils/Input";
import { Check, X } from "lucide-react";

const presets = [
  { months: 1, label: "1 Month" },
  { months: 3, label: "3 Months" },
  { months: 6, label: "6 Months" },
  { months: 12, label: "1 Year" },
];

export default function DurationSelector({ onSelect, onCustom }) {
  const [customMonths, setCustomMonths] = useState(0);
  const [customUnit, setCustomUnit] = useState("months");
  const [noOfMonths, setNoOfMonths] = useState(1);
  const [selectCustom, setSelectCustom] = useState(false);

  const handleCustomApply = () => {
    const multiplier = customUnit === "years" ? 12 : 1;
    onCustom(customMonths * multiplier);
  };

  return (
    <div className="space-y-3">
      {/* Preset buttons */}
      <div
        className={`${
          selectCustom
            ? "opacity-40 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        } grid grid-cols-2 sm:grid-cols-4 gap-2`}
      >
        {presets.map(({ months, label }) => (
          <button
            key={months}
            onClick={() => {
              onSelect(months);
              setNoOfMonths(months);
            }}
            className={`relative rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
              noOfMonths === months
                ? "border-[#003B6D] bg-[#003B6D]/5 text-[#003B6D]"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {label}
            {noOfMonths === months && (
              <Check
                size={16}
                className="absolute top-1.5 right-1.5 text-[#003B6D]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Custom toggle */}
      {selectCustom ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
              Custom Duration
            </p>
            <button
              onClick={() => {
                setSelectCustom(false);
                onSelect(noOfMonths);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <InputComp
              type="number"
              min="1"
              value={customMonths || ""}
              onChange={(e) => setCustomMonths(parseInt(e.target.value) || 0)}
              placeholder="Enter number"
              className="flex-1"
            />
            <Select
              defaultValue="months"
              onValueChange={(value) => setCustomUnit(value)}
            >
              <SelectTrigger className="w-28 bg-white">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="months">Months</SelectItem>
                <SelectItem value="years">Years</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleCustomApply}
              size="sm"
              className="bg-[#003B6D] hover:bg-[#002d54]"
            >
              Apply
            </Button>
          </div>
        </div>
      ) : (
        <button
          className="text-sm font-medium text-[#003B6D] hover:text-[#26B9B3] transition-colors hover:underline"
          onClick={() => {
            setSelectCustom(true);
            onSelect(customMonths);
          }}
        >
          Need a custom duration?
        </button>
      )}
    </div>
  );
}
