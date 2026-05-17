"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  Phone,
  Mail,
  User,
  Building2,
  MessageCircle,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/hooks/useUser";

export default function WhatsAppFeatureManagment() {
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [activatedCompanies, setActivatedCompanies] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingActivated, setLoadingActivated] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set());
  const { user } = useUser();

  // Fetch pending companies (those who requested WhatsApp feature)
  const fetchPendingCompanies = async () => {
    try {
      setLoadingPending(true);
      const response = await fetchCustom("/company/whatsapp-req", {
        method: "GET",
        token: user?.token,
      });
      if (!response.ok) throw new Error("Failed to fetch pending companies");
      const data = await response.json();

      toast({
        description: data?.message,
      });
      if (data?.success) {
        setPendingCompanies(data?.data);
      }else{
        setPendingCompanies([])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch pending companies",
        variant: "destructive",
      });
    } finally {
      setLoadingPending(false);
    }
  };

  // Fetch activated companies
  const fetchActivatedCompanies = async () => {
    try {
      setLoadingActivated(true);
      const response = await fetchCustom("/company/whatsapp-req/activate", {
        method: "GET",
        token: user?.token,
      });
      if (!response.ok) throw new Error("Failed to fetch activated companies");
      const data = await response.json();

      toast({
        description: data?.message,
      });
      if (data?.success) {
        setActivatedCompanies(data?.data);
      }else{
        setActivatedCompanies([])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch activated companies",
        variant: "destructive",
      });
    } finally {
      setLoadingActivated(false);
    }
  };

  // Activate company
  const handleActivate = async (companyId) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(companyId));

      const response = await fetchCustom("/company/whatsapp-req/activate", {
        method: "PUT",
        token: user?.token,
        body: JSON.stringify({ _id: companyId }),
      });

      if (!response.ok) throw new Error("Failed to activate company");
      const data = await response.json();

      toast({
        description: data?.message,
      });

      if (data?.success) {
        await Promise.all([fetchPendingCompanies(), fetchActivatedCompanies()]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate company",
        variant: "destructive",
      });
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(companyId);
        return newSet;
      });
    }
  };

  // Deactivate company
  const handleDeactivate = async (companyId) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(companyId));

      const response = await fetchCustom("/company/whatsapp-req/deactivate", {
        method: "PUT",
        token: user?.token,
        body: JSON.stringify({ _id: companyId }),
      });

      if (!response.ok) throw new Error("Failed to deactivate company");
      const data = await response.json();
      toast({
        description: data?.message,
      });

      if (data?.success) {
        await Promise.all([fetchPendingCompanies(), fetchActivatedCompanies()]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate company",
        variant: "destructive",
      });
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(companyId);
        return newSet;
      });
    }
  };

  // Copy WhatsApp number to clipboard
  const copyWhatsAppNumber = async (number) => {
    try {
      await navigator.clipboard.writeText(number);
      toast({
        title: "Copied!",
        description: "WhatsApp number copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy number",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchPendingCompanies();
      fetchActivatedCompanies();
    }
  }, [user]);

  const CompanyCard = ({ company, type, index }) => (
    <Card
      className={`${
        index % 2 == 0 && " bg-gray-200/50"
      } mb-4 hover:shadow-md transition-shadow`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            {index + 1}.
            <Building2 className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">{company?.displayName}</CardTitle>
          </div>
          <Badge variant={type === "pending" ? "secondary" : "default"}>
            {type === "pending" ? "Pending" : "Active"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Email */}
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Company Email</p>
              <p className="text-sm text-gray-600">{company?.email}</p>
            </div>
          </div>

          {/* Admin Name */}
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Admin Name</p>
              <p className="text-sm text-gray-600">
                {company?.adminId?.personalInfo?.firstName}
              </p>
            </div>
          </div>

          {/* Admin Email */}
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Admin Email</p>
              <p className="text-sm text-gray-600">{company?.adminId?.email}</p>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Phone Number</p>
              <p className="text-sm text-gray-600">{company?.phone}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* WhatsApp Number with Copy */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium">WhatsApp Number</p>
              <p className="text-sm text-gray-600">{company?.whatsAppNo}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyWhatsAppNumber(company?.whatsAppNo)}
            className="flex items-center gap-1"
          >
            <Copy className="h-3 w-3" />
            Copy
          </Button>
        </div>

        <Separator />

        {/* Action Button */}
        <div className="flex justify-end">
          {type === "pending" ? (
            <Button
              onClick={() => handleActivate(company?._id)}
              disabled={processingIds.has(company?._id)}
            >
              {processingIds.has(company?._id) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activate
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => handleDeactivate(company?._id)}
              disabled={processingIds.has(company?._id)}
              variant="destructive"
            >
              {processingIds.has(company?._id) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deactivating...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Deactivate
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`container mx-auto p-6 max-w-6xl`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          WhatsApp Feature Management
        </h1>
        <p className="text-gray-600">
          Manage company WhatsApp feature requests and activations
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Pending Requests ({pendingCompanies.length})
          </TabsTrigger>
          <TabsTrigger value="activated" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Activated ({activatedCompanies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-orange-600" />
                Pending WhatsApp Requests
              </CardTitle>
              <CardDescription>
                Companies that have requested WhatsApp feature activation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPending ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading pending requests...</span>
                </div>
              ) : pendingCompanies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No pending WhatsApp requests found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingCompanies.map((company, index) => (
                    <CompanyCard
                      index={index}
                      key={company?._id}
                      company={company}
                      type="pending"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activated" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Activated WhatsApp Features
              </CardTitle>
              <CardDescription>
                Companies with active WhatsApp feature
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingActivated ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading activated companies...</span>
                </div>
              ) : activatedCompanies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No activated WhatsApp features found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activatedCompanies.map((company, index) => (
                    <CompanyCard
                      key={company?._id}
                      company={company}
                      index={index}
                      type="activated"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
