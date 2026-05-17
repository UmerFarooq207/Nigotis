"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronRight, Edit3, Trash2 } from "lucide-react";
import EditPlan from "./EditPlan";
import { fetchCustom, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import useCurrency from "@/hooks/useCurrency";
import useUser from "@/hooks/useUser";
import LoadingDots from "@/components/Utils/LoadingDots";
import ShowError from "@/components/Utils/ShowError";
import { Separator } from "@radix-ui/react-dropdown-menu";
import ConfirmationDialog from "@/components/Utils/ConfirmationDialog";
import { toast } from "@/hooks/use-toast";

export function AllPlans() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isEdit, setIsEdit] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const currency = useCurrency("USD");
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCustom("/plan", {
        method: "GET",
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setIsError(null);
        setPlans(data?.data);
      } else {
        setIsError(data?.message);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setIsError(error?.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const newFilteredItems = plans.filter((plan) => {
      const matchesSearch = plan.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesType =
        typeFilter === "all" || plan.type.toLowerCase() === typeFilter;

      return matchesSearch && matchesType;
    });

    setFilteredItems(newFilteredItems);
  }, [searchTerm, plans, typeFilter]);

  if (isLoading) {
    return <LoadingDots />;
  }
  if (isError) {
    return <ShowError error={isError} />;
  }

  if (isEdit !== null) {
    return (
      <EditPlan
        plan={isEdit}
        onClose={() => {
          setIsEdit(null);
          fetchItems();
        }}
      />
    );
  }

  const handleClearFilter = () => {
    setTypeFilter("all");
    setSearchTerm("");
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetchCustom("/plan", {
        method: "DELETE",
        token: user?.token,
        body: JSON.stringify({ planId: id }),
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
      console.error("Error deleting plan:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardContent>
        <div className=" py-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          <div className=" col-span-2">
            <Input
              id="search"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value)}
          >
            <SelectTrigger>
              <span>
                {typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          <Button
            className=" w-full col-span-1"
            size="lg"
            disabled={typeFilter === "all" && !searchTerm}
            variant="destructive"
            onClick={handleClearFilter}
          >
            Clear Filters
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Expand</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Tagline</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Screens</TableHead>
              <TableHead>Old Price/mn</TableHead>
              <TableHead>New Price/mn</TableHead>
              <TableHead>Price Per Screen</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <>
                <TableRow key={item?._id}>
                  <TableCell>
                    {selectedItem?._id !== item?._id ? (
                      <ChevronRight
                        className=" cursor-pointer"
                        onClick={() => {
                          setSelectedItem(item);
                        }}
                      />
                    ) : (
                      <ChevronDown
                        className=" cursor-pointer"
                        onClick={() => {
                          setSelectedItem(null);
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{item?.name}</TableCell>
                  <TableCell>{item?.tagline}</TableCell>
                  <TableCell className=" font-semibold text-xs">
                    {item?.type.toUpperCase()}
                  </TableCell>
                  <TableCell>{item?.screens}</TableCell>
                  <TableCell>
                    {currency?.symbol}{" "}
                    {Number(item?.oldPricePerMonth).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {currency?.symbol} {Number(item?.pricePerMonth).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {currency?.symbol} {Number(item?.pricePerScreen).toFixed(2)}
                  </TableCell>

                  <TableCell className=" flex items-center gap-4">
                    <Button
                      variant="outline"
                      className=" cursor-pointer"
                      onClick={() => setIsEdit(item)}
                    >
                      <Edit3 size={20} />
                    </Button>
                    <ConfirmationDialog
                      trigger={
                        <Button
                          disabled={item.type !== "custom"}
                          title={"Delete Plan"}
                          variant="outline"
                          size="icon"
                        >
                          <Trash2 className="h-8 w-8 text-red-600" />
                        </Button>
                      }
                      title="Are you sure?"
                      description="This action cannot be undone. This will permanently delete."
                      onConfirm={() => handleDelete(item?._id)}
                    />
                  </TableCell>
                </TableRow>
                {selectedItem?._id === item?._id && (
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell colSpan={8}>
                      <div>ID: {item?._id}</div>
                      <h1 className="font-semibold text-xl">Includes:</h1>
                      <div className="space-y-2">
                        {item?.includes.map((_item, i) => {
                          return (
                            <div
                              key={_item?.title}
                              className={`${
                                i % 2 == 0 ? "bg-gray-200" : "bg-white"
                              } pl-4 flex items-start gap-2 rounded-lg`}
                            >
                              <h1 className=" font-semibold text-lg">
                                {i + 1}.{" "}
                              </h1>
                              <div>
                                <h1 className=" font-semibold text-lg">
                                  Title: {_item?.title}
                                </h1>
                                <p className=" font-semibold">
                                  Tagline: {_item?.tagline}
                                </p>
                                <p className=" font-semibold">Points:</p>
                                <div className=" pl-4">
                                  {_item?.points.map((point, index) => {
                                    return (
                                      <p key={index}>
                                        {index + 1}. {point}
                                      </p>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
