"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import UploadFileToAWS from "./Utils/UploadFileToAWS";
import { fetchCustom } from "@/lib/utils";

export function ApplicationForm({ position, onClose, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFile, setCVFile] = useState("");
  const [isError, setIsError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cvFile) {
      setIsError("Please upload cv/resume.");
      return;
    }
    setIsError("");
    setIsSubmitting(true);

    const res = await fetchCustom("/careers-apply", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        cv: `${process.env.NEXT_PUBLIC_AWS_OBJECT_BASE_URL}${cvFile}`,
        position,
      }),
    });
    const result = await res.json();
    console.log(result);

    if (result.success) {
      onSuccess();
      setIsError("");
    } else {
      setIsError(result.message);
    }
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        {isError && <p className=" text-red-500 w-full ">{isError}</p>}

        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          required
          value={formData?.name}
          onChange={(e) => {
            setFormData((prev) => {
              return {
                ...prev,
                name: e.target.value,
              };
            });
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData?.email}
          onChange={(e) => {
            setFormData((prev) => {
              return {
                ...prev,
                email: e.target.value,
              };
            });
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          value={formData?.message}
          onChange={(e) => {
            setFormData((prev) => {
              return {
                ...prev,
                message: e.target.value,
              };
            });
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cv">CV/Resume</Label>
        <UploadFileToAWS
          prevFileName={cvFile}
          setFileName={(file) => {
            setCVFile(file);
          }}
        />
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}
