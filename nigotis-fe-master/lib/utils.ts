import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  // Ensure the input is treated as a Date object
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid input

  // Format the date
  const day = date.getDate().toString().padStart(2, "0"); // e.g., '31'
  const month = date.toLocaleString("en-US", { month: "short" }); // e.g., 'Dec'
  const year = date.getFullYear(); // e.g., '2024'

  return `${day}-${month}-${year}`;
}

export function formatDateAndTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateForInput(date: string) {
  if (!date) {
    const today = new Date();
    const formatted = today.toISOString().split("T")[0];
    return formatted;
  }
  return date.toString().split("T")[0];
}

export function addMonths(date: Date, months: number): Date {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}

export const currencies = [
  { code: "USD", name: "United States Dollar", symbol: "$" }, // Global Reserve Currency
  { code: "EUR", name: "Euro", symbol: "€" }, // European Union Currency
  { code: "JPY", name: "Japanese Yen", symbol: "¥" }, // Widely used in Asia
  { code: "GBP", name: "British Pound Sterling", symbol: "£" }, // UK and globally accepted
  { code: "AUD", name: "Australian Dollar", symbol: "A$" }, // Major trade currency
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" }, // Major trade currency
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" }, // Stable currency globally accepted
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" }, // Influential in global trade
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" }, // Used in international finance
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" }, // Widely accepted in Asia
  // Top Arab Currencies
  { code: "AED", name: "United Arab Emirates Dirham", symbol: "AED" }, // UAE Currency
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" }, // Saudi Arabia Currency
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼" }, // Qatar Currency
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "KWD" }, // Kuwait Currency
  { code: "OMR", name: "Omani Rial", symbol: "﷼" }, // Oman Currency
  { code: "BHD", name: "Bahraini Dinar", symbol: "BHD" }, // Bahrain Currency
  { code: "EGP", name: "Egyptian Pound", symbol: "£" }, // Egypt Currency
  { code: "LYD", name: "Libyan Dinar", symbol: "LYD" }, // Libya Currency
  { code: "JOD", name: "Jordanian Dinar", symbol: "JOD" }, // Jordan Currency
  //south aisa
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨" }, // Pakistan Currency
  { code: "INR", name: "Indian Rupee", symbol: "₹" }, // India Currency
];

type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  credentials?: "include" | "same-origin" | "omit";
  [key: string]: any; // Allows additional optional properties
  token?: string;
};

export const fetchCustom = async (url: string, options: FetchOptions) => {
  const { token, headers, ...restOptions } = options;

  const updatedHeaders: Record<string, string> = {
    "Content-Type": "application/json", // Default Content-Type
    ...headers, // Include custom headers
    ...(token && { Authorization: `Bearer ${token}` }), // Add Bearer token
  };

  try {
    return await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
      ...restOptions,
      headers: updatedHeaders,
      // cache: 'force-cache',
    });
  } catch (error: any) {
    // Browser/network level failures do not return an HTTP response.
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw new Error(
        "Network issue detected. Please check your internet connection and try again."
      );
    }

    const message = String(error?.message || "").toLowerCase();
    if (
      message.includes("failed to fetch") ||
      message.includes("networkerror") ||
      message.includes("econnreset") ||
      message.includes("err_connection_reset") ||
      message.includes("load failed")
    ) {
      throw new Error(
        "Network issue detected. Please check your internet connection and try again."
      );
    }

    throw error;
  }
};

export function getFormattedFigures(
  num: number | string | null | undefined
): string {
  if (num === null || num === undefined) return "";

  const number = typeof num === "number" ? num : Number(num);
  if (isNaN(number)) return "";

  const absNum = Math.abs(number);

  // For numbers less than 10,000, show the exact amount with commas
  if (absNum < 10000) {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: Number.isInteger(number) ? 0 : 2,
      maximumFractionDigits: 2,
    });
  }

  const suffixes: { value: number; symbol: string }[] = [
    { value: 1e12, symbol: "T" }, // Trillion
    { value: 1e9, symbol: "B" }, // Billion
    { value: 1e6, symbol: "M" }, // Million
    { value: 1e3, symbol: "K" }, // Thousand
  ];

  for (const { value, symbol } of suffixes) {
    if (absNum >= value) {
      return (
        (number / value).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1") +
        symbol
      );
    }
  }

  return number.toString();
}
