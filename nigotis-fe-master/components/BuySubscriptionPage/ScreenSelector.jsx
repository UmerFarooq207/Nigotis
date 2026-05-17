import React, { useState } from "react";
import InputComp from "../Utils/Input";
import { Monitor } from "lucide-react";

export default function ScreenSelector({ baseScreens, onAdditionalScreens }) {
  const [additionalScreens, setAdditionalScreens] = useState(0);

  const handleChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setAdditionalScreens(value);
    onAdditionalScreens(value);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Monitor size={18} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Base screens included:
          </span>
        </div>
        <span className="text-sm font-bold text-[#003B6D]">{baseScreens}</span>
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600 whitespace-nowrap">
          Add extra screens:
        </label>
        <InputComp
          type="number"
          min="0"
          value={additionalScreens}
          onChange={handleChange}
          className="w-24"
        />
        {additionalScreens > 0 && (
          <span className="text-xs text-gray-400">
            Total: {baseScreens + additionalScreens} screens
          </span>
        )}
      </div>
    </div>
  );
}
