"use client";
import { useCompany } from "@/contexts/company";
import { currencies } from "@/lib/utils";

export default function useCurrency(currencyCodeParam) {
  const { company } = useCompany();
  const currencyCode = currencyCodeParam
    ? currencyCodeParam
    : company?.currencyCode;
  const currency = currencies.filter(
    (item) => item.code === currencyCode?.toUpperCase(),
  );
  return currency[0];
}
