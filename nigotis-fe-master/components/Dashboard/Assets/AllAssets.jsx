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
import { Edit3, Trash2 } from "lucide-react";
import EditAsset from "./EditAsset";
import { fetchCustom, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useCurrency from "@/hooks/useCurrency";
import { toast } from "@/hooks/use-toast";
import LoadingDots from "@/components/Utils/LoadingDots";
import ShowError from "@/components/Utils/ShowError";
import useUser from "@/hooks/useUser";
import ConfirmationDialog from "@/components/Utils/ConfirmationDialog";
import Link from "next/link";
import { Plus, Upload } from "lucide-react";

export function AllAssets() {
  const currency = useCurrency();
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isEdit, setIsEdit] = useState(null);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCustom("/company/asset", {
        method: "GET",
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setIsError(null);
        setAssets(data?.data);
      } else {
        setIsError(data?.message);
      }
    } catch (error) {
      console.error("Error fetching asset:", error);
      setIsError(error?.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const newFilteredItems = assets.filter((asset) => {
      const matchesSearch =
        asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.desc.toLowerCase().includes(searchTerm.toLowerCase());

      const assetDate = new Date(asset.date);

      const matchesDateRange =
        (!fromDate || assetDate >= new Date(fromDate)) &&
        (!toDate || assetDate <= new Date(toDate));

      return matchesSearch && matchesDateRange;
    });
    setFilteredItems(newFilteredItems);
  }, [searchTerm, fromDate, toDate, assets]);

  if (isLoading) {
    return <LoadingDots />;
  }

  if (isEdit !== null) {
    return (
      <EditAsset
        asset={isEdit}
        onClose={() => {
          setIsEdit(null);
          fetchItems();
        }}
      />
    );
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetchCustom("/company/asset", {
        method: "DELETE",
        token: user?.token,
        body: JSON.stringify({ assetId: id }),
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
      console.error("Error deleting asset:", error);
    }
  };

  const handleClearFilter = () => {
    setFromDate("");
    setToDate("");
    setSearchTerm("");
  };

  return (
    <>
      <div className="px-4 pb-4">
        {isError ? (
          <ShowError error={isError} />
        ) : (
          <div className="w-full">
            <div className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700"
                >
                  Search
                </label>
                <Input
                  id="search"
                  placeholder="Search by title or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-end col-span-2 w-full gap-4">
                <div className=" w-full">
                  <label
                    htmlFor="fromDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    From Date
                  </label>
                  <Input
                    type="date"
                    id="fromDate"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className=" w-full">
                  <label
                    htmlFor="toDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    To Date
                  </label>
                  <Input
                    type="date"
                    id="toDate"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
                <Button
                  className=" w-full"
                  size="lg"
                  disabled={!fromDate && !toDate && !searchTerm}
                  variant="destructive"
                  onClick={handleClearFilter}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.desc}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {currency?.symbol}&nbsp;{item.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell className="flex items-center gap-4">
                      <div
                        className="cursor-pointer"
                        onClick={() => setIsEdit(item)}
                      >
                        <Edit3 size={20} />
                      </div>
                      <ConfirmationDialog
                        trigger={
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-8 w-8 text-red-600" />
                          </Button>
                        }
                        title="Are you sure?"
                        description="This action cannot be undone. This will permanently delete."
                        onConfirm={() => handleDelete(item?._id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
