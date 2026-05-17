"use client";

import useUser from "@/hooks/useUser";
import React, { useState } from "react";
import EditPersonalInfo from "../Employees/EditPersonalInfo";
import ChangePassword from "./ChangePassword";
import { Button } from "@/components/ui/button";
import { KeyRound, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Profile() {
  const { user } = useUser();
  const [isChangePW, setIsChangePW] = useState(false);
  return (
    <div className="w-full space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-5 md:p-6">
          <EditPersonalInfo forProfile personalInfo={user?.personalInfo} />
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
              <ShieldCheck className="w-5 h-5 text-[#003667]" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              Security Settings
            </h3>
          </div>
          {isChangePW ? (
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <ChangePassword onClose={() => setIsChangePW(false)} />
            </div>
          ) : (
            <Button className="mt-1 shadow-sm" onClick={() => setIsChangePW(true)}>
              Change Password <KeyRound />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
