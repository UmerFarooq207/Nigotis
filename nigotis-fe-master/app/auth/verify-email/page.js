"use client";
import VerifyEmailPage from "@/components/verify-email";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function page() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const userId = searchParams.get("userId");
  return <VerifyEmailPage email={email} userId={userId} />;
}
