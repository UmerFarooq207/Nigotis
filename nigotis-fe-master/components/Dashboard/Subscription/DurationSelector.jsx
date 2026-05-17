"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import InputComp from "@/components/Utils/Input";

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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Duration</h2>
      <div
        className={`${
          selectCustom
            ? "opacity-60 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        } flex space-x-2`}
      >
        <Button
          variant="secondary"
          className=" w-full relative"
          onClick={() => {
            onSelect(1);
            setNoOfMonths(1);
          }}
        >
          1 Month
          {noOfMonths === 1 && (
            <Check size={32} className=" absolute top-1 right-1 text-white" />
          )}
        </Button>
        <Button
          variant="secondary"
          className=" w-full relative"
          onClick={() => {
            onSelect(3);
            setNoOfMonths(3);
          }}
        >
          3 Months{" "}
          {noOfMonths === 3 && (
            <Check size={32} className=" absolute top-1 right-1 text-white" />
          )}
        </Button>
        <Button
          variant="secondary"
          className=" w-full relative"
          onClick={() => {
            onSelect(6);
            setNoOfMonths(6);
          }}
        >
          6 Months{" "}
          {noOfMonths === 6 && (
            <Check size={32} className=" absolute top-1 right-1 text-white" />
          )}
        </Button>
        <Button
          variant="secondary"
          className=" w-full relative"
          onClick={() => {
            onSelect(12);
            setNoOfMonths(12);
          }}
        >
          1 Year{" "}
          {noOfMonths === 12 && (
            <Check size={32} className=" absolute top-1 right-1 text-white" />
          )}
        </Button>
      </div>
      <Separator />
      <h1 className=" text-lg text-center w-full text-gray-600">OR</h1>

      {selectCustom ? (
        <>
          <Separator />
          <h2 className="text-xl font-semibold mb-2 w-full flex items-center justify-between">
            Select Custom{" "}
            <X
              className="cursor-pointer"
              onClick={() => {
                setSelectCustom(false);
                onSelect(noOfMonths);
              }}
            />
          </h2>
          <div className="flex items-center space-x-2">
            <InputComp
              type="number"
              min="1"
              value={customMonths || ""}
              onChange={(e) => setCustomMonths(parseInt(e.target.value) || 0)}
              placeholder="Custom"
              //   className="w-24"
            />
            <Select
              defaultValue="months"
              onValueChange={(value) => setCustomUnit(value)}
            >
              <SelectTrigger className=" bg-gray-200">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="months">Months</SelectItem>
                <SelectItem value="years">Years</SelectItem>
              </SelectContent>
            </Select>
            <Button className=" w-full relative" onClick={handleCustomApply}>
              Apply
            </Button>
          </div>
        </>
      ) : (
        <p
          className=" cursor-pointer hover:underline text-primary-navy font-semibold text-center mx-auto"
          onClick={() => {
            setSelectCustom(true);
            onSelect(customMonths);
          }}
        >
          Select Custom ?
        </p>
      )}
    </div>
  );
}
