import { Label } from "@/components/ui/label";
import InputComp from "@/components/Utils/Input";
import React, { useState } from "react";

export default function ScreenSelector({ baseScreens, onAdditionalScreens }) {
  const [additionalScreens, setAdditionalScreens] = useState(0);

  const handleChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setAdditionalScreens(value);
    onAdditionalScreens(value);
  };

  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold mb-2">Select Screens</h2>
      <p>Base screens: {baseScreens}</p>
      <Label className=" ">
        Additional screens:
        <InputComp
          type="number"
          min="0"
          value={additionalScreens}
          onChange={handleChange}
        />
      </Label>
    </div>
  );
}
