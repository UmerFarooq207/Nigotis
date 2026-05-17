"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Create Context
const CompanyContext = createContext();

// Provider Component
export function CompanyProvider({ children }) {
  const [companyData, setCompanyData] = useState(null);
  // Load persisted data from localStorage on initial render
  useEffect(() => {
    const storedCompany = localStorage.getItem("companyData");
    if (storedCompany !== "undefined") {
      setCompanyData(JSON.parse(storedCompany));
    }
  }, []);

  const setCompany = (data) => {
    setCompanyData(data);
    localStorage.setItem("companyData", JSON.stringify(data));
  };

  const updateCompany = (data) => {
    setCompanyData((prev) => {
      const nextCompanyData = prev ? { ...prev, ...data } : { ...data };
      localStorage.setItem("companyData", JSON.stringify(nextCompanyData));
      return nextCompanyData;
    });
  };

  const deleteCompany = () => {
    setCompanyData(null);
    localStorage.removeItem("companyData");
  };

  const getCompanyData = () => companyData;

  return (
    <CompanyContext.Provider
      value={{
        company: companyData,
        setCompany,
        updateCompany,
        deleteCompany,
        getCompanyData,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

// Hook for accessing CompanyContext
export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}
