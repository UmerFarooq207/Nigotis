"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Edit3, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditClient } from "./EditClient";
import InputComp from "@/components/Utils/Input";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import { fetchCustom, formatDate } from "@/lib/utils";
import ShowError from "@/components/Utils/ShowError";
import LoadingDots from "@/components/Utils/LoadingDots";
import { toast } from "@/hooks/use-toast";
import ConfirmationDialog from "@/components/Utils/ConfirmationDialog";

export function AllClients({ isSelectClient = false, setSelectedClient }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editClient, setEditClient] = useState(null);
  const [clients, setClients] = useState([]);

  const [filteredItems, setFilteredItems] = useState([]);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setIsFetching(true);
      const response = await fetchCustom("/client", {
        method: "GET",
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setIsError(null);
        setClients(data?.data);
      } else {
        setIsError(data?.message);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setIsError(error?.message);
    }
    setIsLoading(false);
  };

  // Update filteredItems whenever clients, searchTerm change
  useEffect(() => {
    if (!isLoading) {
      const newFilteredItems = clients.filter((item) => {
        const fullName = `${[
          item?.personalInfo?.title,
          item?.personalInfo?.firstName,
          item?.personalInfo?.middleName,
          item?.personalInfo?.lastName,
        ]
          .filter(Boolean)
          .join(" ")}`.toLowerCase();

        const matchesSearch =
          fullName.includes(searchTerm.toLowerCase()) ||
          item?.email.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
      });

      setFilteredItems(newFilteredItems);
      setIsFetching(false);
    }
  }, [clients, searchTerm, isLoading]);

  if (isLoading) {
    return <LoadingDots />;
  }

  if (editClient) {
    return (
      <EditClient
        obj={editClient}
        onClose={() => {
          setEditClient(null);
          fetchItems();
        }}
      />
    );
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetchCustom("/client", {
        method: "DELETE",
        token: user?.token,
        body: JSON.stringify({ clientId: id }),
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
      console.error("Error deleting client:", error);
    }
  };

  return (
    <>
      {isError ? (
        <ShowError error={isError} />
      ) : (
        <div className="px-4">
          <div className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search
              </label>
              <InputComp
                id="search"
                placeholder="Search by name, or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {isSelectClient && <TableHead className="font-bold">Actions</TableHead>}
                <TableHead className="font-bold">Name</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                {/* <TableHead>About</TableHead> */}
                <TableHead className="font-bold">Phone</TableHead>
                <TableHead className="font-bold">Address</TableHead>
                <TableHead className="font-bold">On Board Date</TableHead>
                {!isSelectClient && <TableHead className="font-bold text-center">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item?._id} className="hover:bg-muted/30 transition-colors">
                  {isSelectClient && (
                    <TableCell>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSelectedClient(item);
                        }}
                      >
                        Select
                      </Button>
                    </TableCell>
                  )}
                  <TableCell className="font-medium">
                    {[
                      item?.personalInfo?.title,
                      item.personalInfo?.firstName,
                      item.personalInfo?.middleName,
                      item.personalInfo?.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </TableCell>
                  <TableCell className="hover:underline text-blue-600">
                    <Link href={`mailto:${item.email}`}>{item.email}</Link>
                  </TableCell>
                  {/* <TableCell>{item?.about}</TableCell> */}
                  <TableCell className="hover:underline text-blue-600">
                    <Link href={`tel:${item.personalInfo?.phone}`}>
                      +{item.personalInfo?.phone}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{item.personalInfo?.address}</TableCell>
                  <TableCell>{`${formatDate(
                    item?.personalInfo?.joinDate
                  )}`}</TableCell>
                  {!isSelectClient && (
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditClient(item)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <ConfirmationDialog
                          trigger={
                            <Button variant="outline" size="icon">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          }
                          title="Are you sure?"
                          description="This action cannot be undone. This will permanently delete."
                          onConfirm={() => handleDelete(item?._id)}
                        />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {!isFetching && !isLoading && filteredItems.length <= 0 && (
                <TableRow className="text-red-500 w-full">
                  <TableCell colSpan={isSelectClient ? "6" : "6"} className="text-center py-4">
                    No data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
