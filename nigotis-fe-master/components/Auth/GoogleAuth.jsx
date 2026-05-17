"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/hooks/useUser";
import { toast } from "@/hooks/use-toast";
import { createClientInBot } from "@/lib/chatbot";
import { useCompany } from "@/contexts/company";
let isRun = false;

export default function GoogleAuth({ token }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user, setUser } = useUser();
  const { setCompany } = useCompany();

  useEffect(() => {
    const authenticateWithGoogle = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Make POST request to backend
        const response = await fetchCustom("/user/login/google", {
          method: "POST",
          token: token,
        });

        const data = await response.json();
        console.log("Authentication response:", data);
        if (!response.ok) {
          throw new Error(data.message || "Authentication failed");
        }
        if (data?.success) {
          setIsLoading(false);
          setUser(data?.data);
          const role = data?.data?.role;
          const companyId = data?.data?.companyId;
          if (role === "admin") {
            console.log("creating client for bot");
            const botClientData = await createClientInBot(
              data?.data?.email,
              data?.data?.providerId + "nigotis"
            );
            setUser({
              ...data?.data,
              botClientId: botClientData?.id,
              botAuthToken: botClientData?.auth_token,
            });
          }

          if (companyId) {
            router.push("/dashboard");
            setCompany(companyId);
          } else if (!data?.data?.subscriptionId) {
            router.push("/pricing");
          } else {
            router.push("/dashboard/settings");
            toast({
              description: "Create company first.",
            });
          }
        } else {
          setError(data?.message);
        }
      } catch (err) {
        console.error("Authentication error:", err);
        setError(err.message || "Something went wrong during authentication");
      } finally {
        setIsLoading(false);
      }
    };
    if (!user) {
      if (!isRun) {
        isRun = true;
        authenticateWithGoogle();
      }
    } else if (isLoading) {
      toast({
        description: "You are already logged in",
      });
      setIsLoading(false);
      router.push("/dashboard");
    }
  }, [user]);

  const handleTryAgain = () => {
    router.push("/auth/signin");
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Authentication Failed
            </h2>
            <p className="mb-6 text-sm text-gray-600">{error}</p>
            <Button onClick={handleTryAgain} className="w-full ">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          {/* Animated Google Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <div className="relative">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
              {/* Google Icon */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
                <svg className="h-8 w-8" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            {isLoading ? " Please wait..." : "Logged in Redirecting..."}
          </h2>
          <p className="mb-6 text-gray-600">
            Your continue with Google is in process
          </p>

          {/* Animated dots */}
          <div className="flex justify-center space-x-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600"></div>
          </div>

          {/* Progress bar */}
          <div className="mt-6 w-full rounded-full bg-gray-200">
            <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
