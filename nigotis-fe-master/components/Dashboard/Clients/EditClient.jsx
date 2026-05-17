"use client";

import { Button } from "@/components/ui/button";
import EditEmailAndAbout from "./EditEmailAndAbout";
import { Separator } from "@/components/ui/separator";
import EditPersonalInfo from "../Employees/EditPersonalInfo";
import { ArrowLeft, Edit3 } from "lucide-react";

export function EditClient({ obj, onClose }) {
  return (
    <div className="w-full">
      <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-4 mt-6 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Cancel editing"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
            <Edit3 className="w-5 h-5 text-[#003667]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Edit Client</h2>
            <p className="text-sm text-gray-500">Update client details</p>
          </div>
        </div>
      </div>
      
      <div className="px-4 space-y-6">
        <EditEmailAndAbout _id={obj?._id} email={obj?.email} />
        <Separator />
        <EditPersonalInfo personalInfo={obj?.personalInfo} />
      </div>
    </div>
  );
}
