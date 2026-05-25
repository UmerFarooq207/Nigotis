"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useCurrency from "@/hooks/useCurrency";
import { fetchCustom } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import Loading from "./Utils/Loading";
import { Check } from "lucide-react";
import PricingIncludeModal from "./PricingIncludeModal";

export default function PricingSection({
  featureSection = false,
  currentPlanId = "",
}) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [currencySelection, setCurrencySelection] = useState("USD");
  const currency = useCurrency(currencySelection);

  const [isLoading, setIsLoading] = useState(true);

  const [selectedInclude, setSelectedInclude] = useState({});
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCustom("/plan/get", {
        method: "GET",
      });
      const data = await response.json();
      if (data?.success) {
        setPlans(data?.data);
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading />;
  }
  

  return (
    <>
      <section
        className={`py-16 md:px-6 ${
          featureSection && "lg:px-6"
        } bg-gradient-center-image  px-4 lg:px-[70px] xl:px-20 2xl:px-24`}
      >
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8">
            There&apos;s a Nigotis for every business
          </h2>

          {/* Billing Toggle */}
          <div className="flex  justify-center items-center gap-4 mb-8 flex-col sm:flex-row">
            <div className="flex  justify-center items-center gap-4">
              <span
                className={`${
                  !isAnnual ? "text-gray-700 font-medium" : "text-gray-500"
                }`}
              >
                Pay Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#003366]"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    isAnnual ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`${
                  isAnnual ? "text-gray-700 font-medium" : "text-gray-500"
                }`}
              >
                Pay Annually
              </span>
            </div>
            <span className="ml-2 inline-block px-3 py-1 w-[70%] text-center sm:w-auto bg-[#FF9800] text-black font-semibold text-sm rounded-lg">
              14 Days Free Trial
            </span>
          </div>

          {/* Currency Selection */}
          <div className="bg-[#003B6D] text-white p-4 rounded-lg mb-24 text-center flex flex-col sm:flex-row gap-2 justify-center ">
            <span className="mr-4 text-sm sm:text-base">
              Billing will be processed in USD.
              {/* View prices in your local
              currency */}
            </span>
            {/* <div className="flex justify-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="currency"
                  value="USD"
                  checked={currencySelection === "USD"}
                  onChange={(e) => setCurrencySelection(e.target.value)}
                  className="mr-2"
                />
                USD
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="currency"
                  value="AED"
                  // checked={currencySelection === "AED"}
                  // onChange={(e) => setCurrencySelection(e.target.value)}
                  className="mr-2"
                />
                AED
              </label>
            </div> */}
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {plans.map((plan, index) => {
              const bgGradients = [
                "bg-gradient-to-b from-orange-50 via-white to-white",
                "bg-gradient-to-b from-indigo-50 via-white to-white",
                "bg-gradient-to-b from-cyan-50 via-white to-white"
              ];
              const buttonClasses = plan?.type === "pro" 
                ? "bg-[#5B6AD0] hover:bg-[#4a56b0] text-white" 
                : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-800";
              
              return (
              <div key={index} className="relative flex flex-col items-center">
                 {plan?.type === "pro" && (
                  <div className="absolute -top-4 bg-[#0B0F19] text-white text-xs font-semibold px-4 py-1.5 rounded-full z-[50] shadow-md">
                    Most Featured
                  </div>
                )}
              <div
                className={`w-full ${bgGradients[index % 3]} ${
                  plan?.type === "pro" ? "scale-105 shadow-2xl z-[49] hover:scale-[1.08]" : "border border-gray-100 shadow-xl z-[48] hover:scale-[1.03]"
                } ${
                  plan?._id === currentPlanId ? "opacity-90" : "opacity-100"
                } rounded-[2rem] p-8 transition-all duration-300 hover:shadow-2xl hover:z-[51] relative flex flex-col h-full overflow-hidden group`}
              >
                {plan?._id === currentPlanId && (
                  <div className="absolute top-6 right-6 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                    Current
                  </div>
                )}
                <h3 className="text-xl text-gray-800 mb-2 font-semibold">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-500 mb-6 min-h-[40px]">
                  Starts at
                </p>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl lg:text-5xl font-bold text-gray-900">
                    {currency?.symbol}{isAnnual ? Number(plan?.pricePerMonth * 12).toFixed(2) : Number(plan?.pricePerMonth).toFixed(2)}
                  </span>
                  <span className="text-gray-500 text-sm font-medium">
                    per {isAnnual ? "year" : "month"}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-8 min-h-[60px]">
                  {plan?.description || (
                    plan?.type === "basic"
                      ? "Perfect for individuals getting started with essential features."
                      : plan?.type === "pro"
                      ? "Designed for growing teams that need more power and flexibility."
                      : plan?.type === "premium"
                      ? "Built for businesses that demand full performance and advanced capabilities."
                      : "Highly recommended for teams looking to optimize their workflow and performance."
                  )}
                </p>
                
                <button
                  disabled={plan?._id === currentPlanId}
                  onClick={() => {
                    window.location.href = `/pricing/buy-subscription?id=${plan?._id}&currentPlanId=${currentPlanId}`;
                  }}
                  className={`w-full block font-semibold py-3.5 rounded-xl mb-8 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${buttonClasses}`}
                >
                  Buy now
                </button>
                
                <div className="h-px bg-gray-200 w-full mb-6"></div>
                
                <ul className="space-y-4 relative flex-1">
                  {plan.includes.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedInclude(item);
                      }}
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <Check className="w-5 h-5 text-gray-700 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{item?.title}</span>
                    </div>
                  ))}
                </ul>
              </div>
              </div>
            )})}
          </div>

          {/* Footer Links */}
          <div className="text-center mt-12 space-y-2">
            <p>
              <Link href="/pricing" className="text-[#003B6D] hover:underline">
                Important offers, pricing details & disclaimers
              </Link>
            </p>
            <p>
              <Link
                href="/terms-&-conditions"
                className="text-[#003B6D] hover:underline"
              >
                Bulk offer pricing Terms and Conditions
              </Link>
            </p>
          </div>
        </div>
      </section>
      {selectedInclude && (
        <PricingIncludeModal
          data={selectedInclude}
          isOpen={selectedInclude?.title}
          onClose={() => {
            setSelectedInclude({});
          }}
        />
      )}
    </>
  );
}
