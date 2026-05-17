"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageCircle, Phone, Clock, Trash2, X } from "lucide-react";
import { useCompany } from "@/contexts/company";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/hooks/useUser";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import SubscriptionUpgrade from "@/components/Utils/SubscriptionUpgrade";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";

export default function WhatsApp() {
  const { company, setCompany } = useCompany();
  const [whatsAppNo, setWhatsAppNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useUser();
  if (!company?.subscriptionId) {
      return (
        <SubscriptionUpgrade />
      );
    }

  const handleDeactivate = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetchCustom("/company/whatsapp-req/deactivate", {
        method: "PUT",
        token: user?.token,
        body: JSON.stringify({ _id: company?._id }),
      });

      if (!response.ok) {
        throw new Error("Failed to deactivate WhatsApp feature");
      }

      const data = await response.json();
      if (data?.success) {
        setSuccess(data?.message);
        setWhatsAppNo("");
        setCompany((prev) => ({ ...prev, isWhatsAppActive: false }));
      } else {
        setError(data?.message);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetchCustom("/company/whatsapp-req", {
        method: "DELETE",
        token: user?.token,
        body: JSON.stringify({ _id: company?._id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete WhatsApp request");
      }

      const data = await response.json();
      if (data?.success) {
        setSuccess(data?.message);
        setWhatsAppNo("");
        setCompany((prev) => ({ ...prev, isReqWhatsApp: false }));
      } else {
        setError(data?.message);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!whatsAppNo.trim()) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetchCustom("/company/whatsapp-req", {
        method: "POST",
        token: user?.token,
        body: JSON.stringify({
          whatsAppNo: whatsAppNo.trim(),
          _id: company?._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit WhatsApp request");
      }
      const data = await response.json();
      if (data?.success) {
        setSuccess(data?.message);
        setWhatsAppNo("");
        // Update local state
        setCompany((prev) => ({ ...prev, isReqWhatsApp: true }));
      } else {
        setError(data?.message);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const renderActiveState = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-green-600">
        <MessageCircle className="h-5 w-5" />
        <span className="font-medium">WhatsApp feature is active</span>
      </div>
      <p className="text-sm text-muted-foreground">
        Your WhatsApp integration is currently active and ready to use.
      </p>
      <Button
        variant="destructive"
        onClick={handleDeactivate}
        disabled={loading}
        className="w-full"
      >
        <X className="h-4 w-4 mr-2" />
        {loading ? "Deactivating..." : "Deactivate WhatsApp Feature"}
      </Button>
    </div>
  );

  const renderPendingState = () => (
    <div className="space-y-4">
        <p>WhatsApp Number: +{company?.whatsAppNo}</p>
      <div className="flex items-center space-x-2 text-amber-600">
        <Clock className="h-5 w-5" />
        <span className="font-medium">Request pending</span>
      </div>
      <Alert>
        <Clock className="h-4 w-4" />
   

        <AlertDescription>
         
          We have received your WhatsApp feature request and will process it
          shortly. You'll be notified once it's activated. 
            <br/>
             Reload the page to check if its activated.
        </AlertDescription>
      </Alert>
      <Button
        variant="outline"
        onClick={handleDeleteRequest}
        disabled={loading}
        className="w-full"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        {loading ? "Deleting..." : "Delete Request"}
      </Button>
    </div>
  );

  const renderRequestForm = () => (
    <form onSubmit={handleSubmitRequest} className="space-y-4">
      <div className="flex items-center space-x-2 text-blue-600">
        <MessageCircle className="h-5 w-5" />
        <span className="font-medium">Request WhatsApp Feature</span>
      </div>
      <p className="text-sm text-muted-foreground">
        Enter your WhatsApp number to request activation of the WhatsApp
        feature.
      </p>
      <div className="space-y-2">
        <Label htmlFor="whatsapp-number">WhatsApp Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <PhoneInput
            className={" w-full bg-gray-200 disabled:opacity-65"}
            value={whatsAppNo}
            disabled={loading}
            onChange={(phone) => {
              setWhatsAppNo(phone);
            }}
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading || !whatsAppNo.trim()}
        className="w-full"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        {loading ? "Submitting..." : "Request WhatsApp Feature"}
      </Button>
    </form>
  );

  const getContent = () => {
    if (company?.isWhatsAppActive) {
      return renderActiveState();
    } else if (company?.isReqWhatsApp) {
      return renderPendingState();
    } else {
      return renderRequestForm();
    }
  };

  return (
    <MainDashboardContentSkeleton title={null}>
      <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
            <MessageCircle className="w-5 h-5 text-[#003667]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">WhatsApp Integration</h2>
            <p className="text-sm text-gray-500">Manage your WhatsApp business integration</p>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {getContent()}
        </div>
      </div>
    </MainDashboardContentSkeleton>
  );
}
