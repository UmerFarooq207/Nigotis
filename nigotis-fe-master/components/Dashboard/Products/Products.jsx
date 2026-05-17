"use client";

import { useState } from "react";
import AllProducts from "./AllProducts";
import AddProduct from "./AddProduct";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Package } from "lucide-react";
import useIsMobile from "@/hooks/useIsMobile";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";

export default function Products() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const refreshProducts = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowAddProduct(false);
  };
  const isMobile = useIsMobile();

  return (
    <MainDashboardContentSkeleton title={null}>
      <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-4 pt-2">
        {showAddProduct ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAddProduct(false)}
              className="text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Back to products"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
              <Package className="w-5 h-5 text-[#003667]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Add Product</h2>
              <p className="text-sm text-gray-500">Create a new product or service</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#003667]/10 border border-[#003667]/20">
              <Package className="w-5 h-5 text-[#003667]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Products</h2>
              <p className="text-sm text-gray-500">Manage your products and services</p>
            </div>
          </div>
        )}
        <div className=" flex items-center gap-4 flex-row-reverse">
          {!showAddProduct && (
            <Button
              size={isMobile ? "xs" : "default"}
              onClick={() => setShowAddProduct(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          )}
        </div>
      </div>
      {showAddProduct ? (
        <AddProduct onProductAdded={refreshProducts} />
      ) : (
        <AllProducts key={refreshTrigger} />
      )}
    </MainDashboardContentSkeleton>
  );
}
