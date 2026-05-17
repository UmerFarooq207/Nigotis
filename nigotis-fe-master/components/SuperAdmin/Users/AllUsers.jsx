"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, Trash2 } from "lucide-react";
import InputComp from "@/components/Utils/Input";
import Link from "next/link";
import LoadingDots from "@/components/Utils/LoadingDots";
import ShowError from "@/components/Utils/ShowError";
import useCurrency from "@/hooks/useCurrency";
import useUser from "@/hooks/useUser";
import { fetchCustom } from "@/lib/utils";
import ConfirmationDialog from "@/components/Utils/ConfirmationDialog";
import { toast } from "@/hooks/use-toast";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [expandedUser, setExpandedUser] = useState(null);
  const currency = useCurrency("USD");
  const [filteredItems, setFilteredItems] = useState([]);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);

      const response = await fetchCustom("/user/superadmin", {
        method: "GET",
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setIsError(null);
        setUsers(data?.data);
        setFilteredItems(data?.data);
      } else {
        setIsError(data?.message);
      }
    } catch (error) {
      console.error("Error fetching users :", error);
      setIsError(error?.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const newFilteredItems = users.filter((user) => {
      const searchMatch =
        user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user?.personalInfo?.firstName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ??
          false) ||
        (user?.personalInfo?.lastName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ??
          false) ||
        user?.subscriptionId?.planTrack.some((track) =>
          track.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const subscriptionMatch =
        subscriptionFilter === "all" ||
        (subscriptionFilter === "active" &&
          (checkStatus(user?.subscriptionId?.endDate) ||
            isWithinFirst14Days(user?.createdAt))) ||
        (subscriptionFilter === "expired" &&
          (!checkStatus(user?.subscriptionId?.endDate) ||
            !isWithinFirst14Days(user?.createdAt))) ||
        (subscriptionFilter === "free" && !user?.subscriptionId);

      // const subscriptionMatch =
      //   subscriptionFilter === "all" ||
      //   (subscriptionFilter === "active" &&
      //     user?.subscriptionId?.status === "active") ||
      //   (subscriptionFilter === "expired" &&
      //     user?.subscriptionId?.status === "expired");

      return searchMatch && subscriptionMatch;
    });

    setFilteredItems(newFilteredItems);
  }, [searchTerm, users, subscriptionFilter]);

  if (isLoading) {
    return <LoadingDots />;
  }
  if (isError) {
    return <ShowError error={isError} />;
  }
  const getRemainingTrialDays = (createdAt) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(createdAt).getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.floor(14 - diffInDays));
  };

  const isWithinFirst14Days = (createdAt) => {
    return getRemainingTrialDays(createdAt) > 0;
  };

  // if (isEdit !== null) {
  //   return (
  //     <EditExpense
  //       expense={isEdit}
  //       onClose={() => {
  //         setIsEdit(null);
  //         fetchItems();
  //       }}
  //     />
  //   );
  // }

  const clearFilters = () => {
    setSearchTerm("");
    setSubscriptionFilter("all");
  };

  const isFilterApplied = searchTerm !== "" || subscriptionFilter !== "all";

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  function checkStatus(inputDate) {
    const today = new Date();
    const targetDate = new Date(inputDate);

    // Normalize both dates to ignore time
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    return today <= targetDate;
  }

  const toggleExpandUser = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetchCustom("/user/superadmin", {
        method: "DELETE",
        token: user?.token,
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.success) {
        fetchItems();
        toast({
          variant: "custom",
          description: data?.message,
        });
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="">
      <h1 className=" text-lg md:text-2xl font-bold mb-4 text-custom-gradient">
        All Users
      </h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <InputComp
          type="text"
          placeholder="Search by email, name, or transaction ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={subscriptionFilter}
          onChange={(e) => setSubscriptionFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Subscriptions</option>
          <option value="free">Free</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
        <Button
          variant="destructive"
          onClick={clearFilters}
          disabled={!isFilterApplied}
        >
          Clear Filters
        </Button>
      </div>
      <div>Total: {filteredItems.length}</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Expand</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subscription Plan</TableHead>
            <TableHead>Total Screens</TableHead>
            <TableHead>Subscription Status</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((user) => (
            <>
              <TableRow key={user?._id}>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => toggleExpandUser(user?._id)}
                  >
                    {expandedUser === user?._id ? (
                      <ChevronDownIcon />
                    ) : (
                      <ChevronRightIcon />
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  {[
                    user?.personalInfo?.title,
                    user?.personalInfo?.firstName,
                    user?.personalInfo?.middleName,
                    user?.personalInfo?.lastName,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </TableCell>
                <TableCell>
                  <Link href={`mail:${user?.email}`}>{user?.email}</Link>
                </TableCell>
                <TableCell>
                  {user?.subscriptionId ? (
                    user?.subscriptionId?.planId?.name
                  ) : (
                    <span className="text-orange-600">Free</span>
                  )}
                </TableCell>
                <TableCell>
                  {user?.subscriptionId ? (
                    user?.subscriptionId?.screens
                  ) : (
                    <span className="text-orange-600">Free</span>
                  )}
                </TableCell>
                <TableCell
                  className={`${
                    checkStatus(user?.subscriptionId?.endDate) ||
                    isWithinFirst14Days(user?.createdAt)
                      ? " text-green-600 "
                      : " text-red-600 "
                  }  font-semibol`}
                >
                  {checkStatus(user?.subscriptionId?.endDate) ||
                  isWithinFirst14Days(user?.createdAt)
                    ? "Active"
                    : "Expired"}
                </TableCell>
                <TableCell>
                  {user?.subscriptionId ? (
                    formatDate(user?.subscriptionId?.endDate)
                  ) : (
                    <span className="text-orange-600">
                      {formatDate(
                        new Date(
                          new Date(user?.createdAt).setDate(
                            new Date(user?.createdAt).getDate() + 14
                          )
                        ).toISOString()
                      )}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {formatDate(
                    user?.createdAt || user?.subscriptionId?.createdAt
                  )}
                </TableCell>
                <TableCell className="flex items-center gap-4">
                  <ConfirmationDialog
                    trigger={
                      <Button
                        variant="outline"
                        size="icon"
                      >
                        <Trash2 className="h-8 w-8 text-red-600" />
                      </Button>
                    }
                    title="Are you sure?"
                    description="This action cannot be undone. This will permanently delete user and all its associated data."
                    onConfirm={() => handleDelete(user?._id)}
                  />
                </TableCell>
              </TableRow>
              {expandedUser === user?._id && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-2">
                          User Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p>
                              <strong>Address:</strong>{" "}
                              {user?.personalInfo.address || "N/A"}
                            </p>
                            <p>
                              <strong>Phone:</strong>{" "}
                              {user?.personalInfo.phone || "N/A"}
                            </p>
                            <p>
                              <strong>Role:</strong> {user?.role}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Subscription Status:</strong>{" "}
                              {user?.subscriptionId?.status}
                            </p>
                            <p>
                              <strong>Current Plan Fee:</strong> $
                              {user?.subscriptionId?.totalFee}
                            </p>
                            <p>
                              <strong>Subscription Period:</strong>{" "}
                              {user?.subscriptionId?.noOfMonths} months
                            </p>
                          </div>
                        </div>
                        <h4 className="text-md font-semibold mt-4 mb-2">
                          Plan Track History
                        </h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Start Date</TableHead>
                              <TableHead>End Date</TableHead>
                              <TableHead>Fee</TableHead>
                              <TableHead>Screens</TableHead>
                              <TableHead>Transaction ID</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {user?.subscriptionId?.planTrack.map(
                              (track, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    {formatDate(track.startDate)}
                                  </TableCell>
                                  <TableCell>
                                    {formatDate(track.endDate)}
                                  </TableCell>
                                  <TableCell>${track.totalFee}</TableCell>
                                  <TableCell>{track.screens}</TableCell>
                                  <TableCell>{track.transactionId}</TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
