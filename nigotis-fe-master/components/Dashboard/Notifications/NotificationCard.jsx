import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import useUser from "@/hooks/useUser";
import { fetchCustom, formatDateAndTime } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export function NotificationCard({
  title,
  message,
  link,
  createdAt,
  isViewed,
  _id,
  onMarkedAsViewed,
  isMovingToAll = false,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleMarkAsViewed = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCustom(`/notification?_id=${_id}`, {
        method: "PUT",
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
        onMarkedAsViewed?.(_id);
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error updating notification status:", error);
      toast({
        variant: "destructive",
        description: error?.message,
      });
    }
    setIsLoading(false);
  };

  return (
    <Card
      className={`mb-4 relative border-gray-100 shadow-sm transition-all duration-500 ${
        isViewed ? "bg-slate-50/80" : "bg-white"
      } ${
        isMovingToAll
          ? "translate-x-16 opacity-0 scale-[0.98]"
          : "translate-x-0 opacity-100 scale-100"
      }`}
    >
      <CardHeader>
        {link ? (
          <Link href={link}>
            <CardTitle className="text-lg">{title}</CardTitle>
          </Link>
        ) : (
          <CardTitle className="text-lg">{title}</CardTitle>
        )}
        <CardDescription>{formatDateAndTime(createdAt)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-slate-600">{message}</p>
        {!isViewed && (
          <>
            <button
              disabled={isLoading}
              onClick={handleMarkAsViewed}
              className="inline-flex absolute top-4 right-20 items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-600 ring-1 ring-inset ring-orange-200 cursor-pointer disabled:opacity-50 disabled:cursor-progress"
            >
              {isLoading ? "Marking..." : "Mark as Read"}
            </button>
            <span className="inline-flex absolute top-4 right-4 items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
              New
            </span>
          </>
        )}
      </CardContent>
    </Card>
  );
}
