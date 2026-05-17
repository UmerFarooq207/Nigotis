"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Building2, Loader2Icon, PenBoxIcon, ShieldAlert } from "lucide-react";
import InputComp from "@/components/Utils/Input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currencies, fetchCustom } from "@/lib/utils";
import useUser from "@/hooks/useUser";
import { toast } from "@/hooks/use-toast";
import Loading from "@/components/Utils/Loading";
import { useCompany } from "@/contexts/company";
import ShowError from "@/components/Utils/ShowError";
import Image from "next/image";
import UploadFileToAWS from "@/components/Utils/UploadFileToAWS";

export default function CompanyDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { company, updateCompany, deleteCompany } = useCompany();
  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.companyId) {
      setCompanyData(company);
      setIsCreating(false);
      setIsEditing(false);
    } else {
      if (company?._id) {
        setCompanyData(company);
        setIsCreating(false);
        setIsEditing(false);
      } else {
        setIsCreating(true);
        setIsEditing(false);
      }
    }
  }, [user, company]);

  if (!isCreating && !isEditing && !companyData) {
    return <Loading />;
  }

  // if (isCreating && !user?.subscriptionId) {
  //   return <ShowError error={"Buy a subscription plan first :)"} />;
  // }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetchCustom("/company", {
        method: isCreating ? "POST" : "PUT",
        body: JSON.stringify(companyData),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        const newUser = { ...user, companyId: data?.data };
        updateCompany(data?.data);
        if (isEditing) {
          setIsEditing(false);
        } else {
          setUser(newUser);
          router.refresh();
        }
        toast({
          variant: "custom",
          description: data?.message,
        });
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
        console.error(data?.message);
      }
    } catch (error) {
      console.error("Error updating company details:", error);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetchCustom("/company", {
        method: "DELETE",
        body: JSON.stringify({ companyId: company?._id }),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setIsEditing(false);
        setIsCreating(true);
        setCompanyData(null);
        deleteCompany();
        setUser({ ...user, companyId: null });
        toast({
          variant: "custom",
          description: data?.message,
        });
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
        console.error(data?.message);
      }
    } catch (error) {
      console.error("Error deleting company details:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete company. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-0 shadow-none bg-transparent">
      <CardContent className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 md:p-6">
        <div className="flex justify-between md:items-center mb-6 flex-col md:flex-row gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
              <Building2 className="w-5 h-5 text-[#003667]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Company Details</h2>
              {isCreating ? (
                <p className="text-sm text-gray-500">Enter your company details</p>
              ) : (
                <p className="text-sm text-gray-500">Manage your company information</p>
              )}
            </div>
          </div>
          {user?.role === "admin" && !isCreating && (
            <Button
              variant={isEditing ? "destructive" : "default"}
              onClick={() => {
                setIsEditing(!isEditing);
              }}
              className="shadow-sm"
              size="default"
            >
              {isEditing ? "Cancel" : <>Edit <PenBoxIcon className="ml-2 h-4 w-4" /></>}
            </Button>
          )}
        </div>
        <form className="space-y-4">
          <div
            className={`${
              !isEditing && !isCreating
                ? "pointer-events-none opacity-70"
                : "pointer-events-auto opacity-100"
            } w-full flex flex-col md:flex-row items-center justify-between gap-5 py-4`}
          >
            {/* {!isLoading ? ( */}
            <Image
              src={`${process.env.NEXT_PUBLIC_AWS_OBJECT_BASE_URL}${companyData?.logo}`}
              width={200}
              height={200}
              className="aspect-square rounded-full mx-auto border-4 border-white shadow-md"
              alt="logo"
              // onLoad={() => {
              //   if (!isLoading) {
              //     setIsLoading(true);
              //   }
              // }}
              // onLoadingComplete={() => setIsLoading(false)}
              // onError={() => setIsLoading(false)}
            />
            {/* ) : (
              <div>Loading...</div>
            )} */}
            <UploadFileToAWS
              prevFileName={companyData?.logo}
              setFileName={(fileName) => {
                setCompanyData((prev) => {
                  return {
                    ...prev,
                    logo: fileName,
                  };
                });
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <InputComp
                id="displayName"
                name="displayName"
                value={companyData?.displayName}
                onChange={handleInputChange}
                disabled={!isEditing && !isCreating}
              />
            </div>
            <div>
              <Label htmlFor="legalName">Legal Name</Label>
              <InputComp
                id="legalName"
                name="legalName"
                value={companyData?.legalName}
                onChange={handleInputChange}
                disabled={!isEditing && !isCreating}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <InputComp
                id="type"
                name="type"
                value={companyData?.type}
                onChange={handleInputChange}
                disabled={!isEditing && !isCreating}
              />
            </div>
            <div>
              <Label htmlFor="ein">EIN</Label>
              <InputComp
                id="ein"
                name="ein"
                value={companyData?.ein}
                onChange={handleInputChange}
                disabled={!isEditing && !isCreating}
              />
            </div>
            <div>
              <Label htmlFor="ssn">SSN</Label>
              <InputComp
                id="ssn"
                name="ssn"
                value={companyData?.ssn}
                onChange={handleInputChange}
                disabled={!isEditing && !isCreating}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                className="bg-slate-100 border-slate-200 focus-visible:ring-[#003667]/30"
                id="address"
                name="address"
                value={companyData?.address}
                onChange={handleInputChange}
                disabled={!isEditing && !isCreating}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <PhoneInput
                className={"w-full bg-slate-100 disabled:opacity-65 rounded-md"}
                value={companyData?.phone}
                disabled={!isEditing && !isCreating}
                onChange={(phone) => {
                  setCompanyData((prev) => {
                    return {
                      ...prev,
                      phone: phone,
                    };
                  });
                }}
              />
            </div>
            <div />
            <div>
              <Label htmlFor="email">Email</Label>
              <InputComp
                id="email"
                name="email"
                value={companyData?.email}
                onChange={handleInputChange}
                disabled={!isEditing && !isCreating}
              />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={companyData?.currencyCode}
                onValueChange={(value) => {
                  setCompanyData((prev) => ({ ...prev, currencyCode: value }));
                }}
              >
                <SelectTrigger
                  disabled={!isEditing && !isCreating}
                  className="w-full"
                >
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center">
                        <span className="mr-2">{currency?.symbol}&nbsp;</span>
                        <span>{currency.name}</span>
                        <span className="ml-auto text-gray-500">
                          ({currency.code})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {(isEditing || isCreating) && (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2Icon className=" animate-spin" />
              ) : isCreating ? (
                "Create"
              ) : (
                "Save Changes"
              )}
            </Button>
          )}
        </form>
      </CardContent>
      <CardFooter className="my-6 rounded-2xl border border-red-200 bg-red-50/40 flex flex-col items-start gap-4 p-5 md:p-6">
        <AlertDialog>
          <h1 className="font-semibold text-lg text-red-600 flex items-center gap-2">
            <ShieldAlert size={18} />
            Delete Company & all of it's data
          </h1>
          <AlertDialogTrigger asChild>
            <Button
              disabled={user?.role !== "admin"}
              variant="destructive"
              className=" mx-auto w-56"
            >
              Delete Company
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                company account and remove all associated data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} variant="destructive">
                Delete Company
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
