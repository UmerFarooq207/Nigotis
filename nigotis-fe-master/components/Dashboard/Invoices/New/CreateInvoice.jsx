"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ItemList from "./ItemList";
import InvoiceDetails from "./InvoiceDetails";
import InvoiceSummary from "./InvoiceSummary";
import InvoiceModalPreview from "./InvoiceModalPreview";
import { ArrowLeft, Receipt } from "lucide-react";
import Link from "next/link";
import { fetchCustom, formatDate } from "@/lib/utils";
import useUser from "@/hooks/useUser";
import { toast } from "@/hooks/use-toast";
import { AllClients } from "../../Clients/AllClients";
import { useRouter } from "next/navigation";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";

export default function CreateInvoice() {
  
  const router = useRouter()
  const [items, setItems] = useState([]);
  const [invoiceDetails, setInvoiceDetails] = useState({
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
    tax: 0,
    discount: 0,
    status: "pending",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingToClient, setIsSendingToClient] = useState(false);
  const { user } = useUser();
  const [invoicePreviewData, setInvoicePreviewData] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleCreateInvoice = async () => {
    setIsLoading(true);
    try {
      const invoiceDataForPreview = {
        ...invoiceDetails,
        items,
        clientId: selectedClient,
      };

      console.log(invoiceDataForPreview);
      setInvoicePreviewData(invoiceDataForPreview);
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createInvoiceReq = async (body) => {
    try {
      setIsSendingToClient(true);
      const response = await fetchCustom("/client/invoice", {
        method: "POST",
        body: JSON.stringify(body),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
        router.push("/dashboard/invoices");
      } else {
        setIsSendingToClient(false);
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error(error);
      setIsSendingToClient(false);
    }
  };

  if (isSendingToClient) {
    return (
      <Card className="w-full mx-auto min-h-[60vh] flex items-center justify-center">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
          <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-[#003366] animate-spin" />
          <p className="text-lg font-semibold text-custom-gradient">
            Sending to client&apos;s email...
          </p>
          <p className="text-sm text-gray-500 animate-pulse">
            Preparing invoice and redirecting to invoices
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <MainDashboardContentSkeleton title={null}>
      <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-2">
        <div className="flex items-center gap-3">
          <Link
            href={"/dashboard/invoices"}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Back to invoices"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
            <Receipt className="w-5 h-5 text-[#003667]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Create Invoice</h2>
            <p className="text-sm text-gray-500">Draft a new invoice for your client</p>
          </div>
        </div>
      </div>
      <div className="px-4 space-y-6">
        {selectedClient ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={selectedClient?._id}>
                  <TableCell>
                    {[
                      selectedClient?.personalInfo?.title,
                      selectedClient.personalInfo?.firstName,
                      selectedClient.personalInfo?.middleName,
                      selectedClient.personalInfo?.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </TableCell>
                  <TableCell className=" hover:underline">
                    <Link href={`mail:${selectedClient.email}`}>
                      {selectedClient.email}
                    </Link>
                  </TableCell>
                  <TableCell className=" hover:underline">
                    <Link href={`tel:${selectedClient.personalInfo?.phone}`}>
                      {selectedClient.personalInfo?.phone}
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>On Board Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{selectedClient.personalInfo?.address}</TableCell>
                  <TableCell>{`${formatDate(
                    selectedClient?.personalInfo?.joinDate
                  )}`}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Client
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">OR</span>
                <Link href={"/dashboard/clients/new"}>
                  <Button>Create new client</Button>
                </Link>
              </div>
            </div>
            <AllClients
              isSelectClient={true}
              setSelectedClient={setSelectedClient}
            />
          </>
        )}
        {selectedClient && (
          <>
            <ItemList items={items} setItems={setItems} />
            <InvoiceDetails
              details={invoiceDetails}
              setDetails={setInvoiceDetails}
            />
            <InvoiceSummary
              items={items}
              tax={invoiceDetails.tax}
              discount={invoiceDetails.discount}
            />{" "}
          </>
        )}
      </div>
      <div className="px-4 pt-4 border-t border-gray-200 mt-6 pb-6">
        {selectedClient && (
          <Button
            className="w-full sm:w-auto px-8"
            onClick={handleCreateInvoice}
            disabled={isLoading}
          >
            {isLoading ? "Creating Invoice..." : "Create Invoice"}
          </Button>
        )}
      </div>
      {invoicePreviewData !== null && (
        <InvoiceModalPreview
          onConfirm={(name, selectedStatus) => {
            setInvoicePreviewData(null);
            setIsSendingToClient(true);

            const subtotal = items.reduce(
              (acc, item) => acc + item.quantity * item.salePrice,
              0
            );
            const taxAmount = subtotal * (invoiceDetails.tax / 100);
            const discountAmount = subtotal * (invoiceDetails.discount / 100);
            const totalAmount = subtotal + taxAmount - discountAmount;

            const body = {
              ...invoiceDetails,
              status: selectedStatus || invoiceDetails.status,
              items,
              clientId: selectedClient?._id,
              paidAmount:
                (selectedStatus || invoiceDetails.status) === "paid"
                  ? totalAmount
                  : 0,
              fileName: name,
            };
            createInvoiceReq(body);
          }}
          invoice={invoicePreviewData}
          onClose={() => {
            setInvoicePreviewData(null);
          }}
        />
      )}
    </MainDashboardContentSkeleton>
  );
}
