"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePDF } from "react-to-pdf";
import Image from "next/image";
import { Download } from "lucide-react";
import { fetchCustom, formatDate, formatDateForInput } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import useCurrency from "@/hooks/useCurrency";
import useUser from "@/hooks/useUser";
import { toast } from "@/hooks/use-toast";
import { useCompany } from "@/contexts/company";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function InvoiceModal({
  invoice,
  onClose,
  setIsEdit,
  isEdit = false,
  onUpdated,
}) {
  const router = useRouter();
  const currency = useCurrency();
  const { company } = useCompany();
  const { toPDF, targetRef } = usePDF({
    filename: `invoice-${invoice?.invoiceNo}.pdf`,
    options: {
      canvas: { scale: 2 }, // improve quality
    },
  });

  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const [status, setStatus] = useState(invoice?.status);
  const [dueDate, setDueDate] = useState(invoice?.dueDate);

  const calculateSubtotal = () => {
    return invoice?.items.reduce(
      (total, item) => total + item?.salePrice * item?.quantity,
      0
    );
  };
  const subtotal = calculateSubtotal();
  const taxAmount = subtotal * (invoice?.tax / 100);
  const discountAmount = subtotal * (invoice?.discount / 100);
  const totalAmount = subtotal + taxAmount - discountAmount;

  const handleUpdateInvoice = async (fileName) => {
    try {
      const response = await fetchCustom("/client/invoice", {
        method: "PUT",
        token: user?.token,
        body: JSON.stringify({
          invoiceId: invoice?._id,
          status: status,
          paidAmount: status === "paid" ? totalAmount : invoice?.paidAmount,
          dueDate: dueDate,
          fileName,
        }),
      });
      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
        onClose();
        onUpdated?.();
        if (!isEdit) {
          router.push("/dashboard/invoices");
        }
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast({
        variant: "destructive",
        description: error?.message,
      });
    }
  };

  const handleDelete = async (fileName) => {
    try {
      const response = await fetch("/api/aws-s3-upload", {
        method: "DELETE",
        body: JSON.stringify({ fileName }),
      });
      await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const uploadInvoicePdf = async () => {
    const element = targetRef.current;
    if (!element) {
      throw new Error("Unable to prepare invoice PDF.");
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.7);
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

    const blob = pdf.output("blob");
    const file = new File([blob], "invoice.pdf", {
      type: "application/pdf",
    });

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/aws-s3-upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (!data?.success) {
      throw new Error(data?.message || "Unable to upload updated invoice PDF.");
    }

    if (invoice?.fileName) {
      await handleDelete(invoice.fileName);
    }

    return data?.fileName;
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const fileName = await uploadInvoicePdf();
      await handleUpdateInvoice(fileName);
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast({
        variant: "destructive",
        description: error?.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={true}
        onOpenChange={() => {
          if (isEdit) {
            setIsEdit(false);
          } else {
            onClose();
          }
        }}
      >
        <DialogContent className="w-full md:max-w-4xl max-h-screen overflow-auto ">
          <DialogHeader className=" ">
            <DialogTitle className="text-custom-gradient db-title">
              {isEdit ? "Update Invoice" : "Invoice Preview"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-end space-x-2 absolute top-10 right-10  ">
            <Button onClick={() => toPDF()}>
              PDF <Download />
            </Button>
            {isEdit && (
              <Button onClick={handleUpdate} disabled={isLoading}>
                {isLoading ? "Sending to client's email..." : "Update Invoice"}
              </Button>
            )}
          </div>
          <div
            ref={targetRef}
            className="space-y-4 bg-white p-8  "
            style={{ width: "210mm", height: "297mm" }}
          >
            <div className="flex justify-between items-start relative">
              <h2 className="text-2xl font-bold">
                {" "}
                {isEdit && "Editing"} Invoice
              </h2>
              <Image
                src={`${process.env.NEXT_PUBLIC_AWS_OBJECT_BASE_URL}${company?.logo}`}
                alt="Company Logo"
                width={100}
                height={60}
                priority
                className=" absolute top-6 w-[100px] aspect-auto right-32 rounded-full"
              />
              
              <div className=" w-24 h-24 absolute top-6 right-2">
                <QRCode
                  key={invoice?._id}
                  size={64}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={"https://nigotis.com/auth/signin"}
                  viewBox={`0 0 64 64`}
                />
              </div>
            </div>
            <div>
              <h1 className="font-semibold text-xl">
                Invoice # {invoice?.invoiceNo}
              </h1>
            </div>

            <div className="text-left">
              <p>
                <span className="font-semibold">Issue Date:</span>{" "}
                {formatDate(invoice?.issueDate)}
              </p>
              {isEdit ? (
                <div className="flex items-center gap-2">
                  <p>Due Date:</p>
                  <Input
                    type="date"
                    value={formatDateForInput(dueDate)}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-auto"
                  />
                </div>
              ) : (
                <p>
                  <span className="font-semibold">Due Date:</span>{" "}
                  {formatDate(dueDate)}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-lg">Billed By</h3>
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {company?.legalName} ({company?.displayName})
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {company?.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {company?.phone}
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {company?.address}
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg">Billed To</h3>
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {invoice?.clientId?.personalInfo.title}{" "}
                  {invoice?.clientId?.personalInfo.firstName}{" "}
                  {invoice?.clientId?.personalInfo.middleName}{" "}
                  {invoice?.clientId?.personalInfo.lastName}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {invoice?.clientId?.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {invoice?.clientId?.personalInfo.phone}
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {invoice?.clientId?.personalInfo.address}
                </p>
              </div>
            </div>
            <h1 className="text-lg font-semibold mt-4">Items</h1>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Description</th>
                  <th className="border p-2 text-right">Quantity</th>
                  <th className="border p-2 text-right">Rate</th>
                  <th className="border p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice?.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2">{item?.productId?.name}</td>
                    <td className="border p-2">{item?.productId?.desc}</td>
                    <td className="border p-2 text-right">{item?.quantity}</td>
                    <td className="border p-2 text-right">
                      {currency?.symbol}&nbsp;{item?.salePrice.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      {currency?.symbol}&nbsp;
                      {(item?.quantity * item?.salePrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right">
              <p>
                Subtotal: {currency?.symbol}&nbsp;{subtotal.toFixed(2)}
              </p>
              <p>
                Tax ({invoice?.tax}%): {currency?.symbol}&nbsp;
                {taxAmount.toFixed(2)}
              </p>
              <p>
                Discount ({invoice?.discount}%): {currency?.symbol}&nbsp;
                {discountAmount.toFixed(2)}
              </p>
              <p className="text-xl font-bold">
                Total: {currency?.symbol}&nbsp;{totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-3 items-center font-semibold">
              <div>Status:</div>
              {isEdit ? (
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div>
                  <span
                    className={`px-3 py-2 rounded-lg  ${
                      status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {status.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold">Additional Notes</h3>
              <p>{invoice?.notes}</p>
            </div>
            <p className="text-sm text-gray-500">
              This is an electronically generated document, no signature is
              required.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
