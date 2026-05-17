"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, SearchX } from "lucide-react";

const ShowError = ({ error }) => {
  const router = useRouter();

  const handleReload = () => {
    window.location.reload();
  };

  // Determine if this is an "empty state" rather than a real error
  const errorLower = error?.toLowerCase() || "";
  const isNoData = errorLower.includes("no ") || errorLower.includes("not found") || errorLower.includes("empty");

  return (
    <div className="flex flex-col items-center justify-center bg-white text-center p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[350px] w-full mt-4">
      {isNoData ? (
        <>
          <div className="p-5 bg-gray-50 rounded-full mb-5">
            <SearchX className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">No Data Found</h2>
        </>
      ) : (
        <>
          <div className="p-5 bg-red-50 rounded-full mb-5">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-sm text-red-600 mb-8 max-w-sm">{error || "An unexpected error occurred."}</p>
          <Button onClick={handleReload} variant="destructive" className="min-w-[120px]">
            Try Again
          </Button>
        </>
      )}
    </div>
  );
};

export default ShowError;
