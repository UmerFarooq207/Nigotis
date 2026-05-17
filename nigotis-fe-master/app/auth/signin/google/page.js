import React from "react";
import GoogleAuth from "@/components/Auth/GoogleAuth";
export default function page({ searchParams }) {
  const token = searchParams?.token;
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Invalid or missing token
          </h2>
          <p className="text-gray-600">Please try signing in again.</p>
        </div>
      </div>
    );
  }

  return <GoogleAuth token={token} />;
}
