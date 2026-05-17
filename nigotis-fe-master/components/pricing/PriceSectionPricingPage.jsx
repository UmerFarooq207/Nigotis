"use client";

import { useState } from "react";
import Link from "next/link";

const pricingPlans = [
  {
    name: "Basic",
    price: {
      monthly: 10,
      annual: 120,
    },
    features: [
      "For small companies size 1 - 20",
      "Add upto 20 employees",
      "Create free invoices",
      "Create pay-slips",
      "Track monthly performance",
    ],
  },
  {
    name: "Pro",
    price: {
      monthly: 25,
      annual: 300,
    },
    features: [
      "For medium size companies size 20 - 50",
      "Add upto 50 employees",
      "Create free invoices",
      "Create pay-slips",
      "Track monthly performance",
      "Get access to Business analysis AI",
      "Get marketing insights",
    ],
  },
  {
    name: "Premium",
    price: {
      monthly: 50,
      annual: 600,
    },
    features: [
      "For medium size companies size 50+",
      "Add to 500 employees",
      "Create free invoices",
      "Create pay-slips",
      "Track monthly performance",
      "Get access to Business analysis AI",
      "Get marketing insights",
      "Recieve payments via ApplePay & G-Pay",
      "Analise your customer behaviour",
    ],
  },
];
const featurePricingWithIcons = [
  {
    text: "Cancel anytime",
    icon: "/pricing/cancel.png",
  },

  {
    text: "Unlimited Support",
    icon: "/pricing/unlimited.png",
  },
  {
    text: "Free guided",
    icon: "/pricing/freeguided.png",
  },
];
export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [currency, setCurrency] = useState("USD");

  return (
    <section className="py-16 md:py-24   px-4 md:px-7 lg:px-14 xl:px-18 2xl:px-20">
      <div className="container mx-auto mt-6 px-3 lg:px-8 xl:px-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Find a plan that’s right for you
        </h2>
        <div className=" flex justify-center items-center gap-1 sm:gap-5 mb-4">
          <img src="/pricing/rating.png" alt="" className=" w-1/3 sm:w-auto" />
          <p className=" text-sm sm:text-base">6,240+ reviews Capterra</p>
        </div>
        <div className=" flex justify-center items-center gap-4 lg:gap-8 mb-10 lg:mb-14">
          {featurePricingWithIcons.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row gap-3 lg:gap-6 text-xs sm:text-base items-center"
            >
              <img src={feature.icon} alt="" />
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
        {/* Billing Toggle */}
        <div className="flex  justify-center items-center gap-4 mb-8 flex-col sm:flex-row">
          <div className="flex  justify-center items-center gap-4">
            <span
              className={`${!isAnnual ? "text-gray-700 font-medium" : "text-gray-500"}`}
            >
              Pay Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#003366] "
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ${
                  isAnnual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`${isAnnual ? "text-gray-700 font-medium" : "text-gray-500"}`}
            >
              Pay Annually
            </span>
          </div>
          <span className="ml-2 inline-block px-3 py-1 w-[70%] text-center sm:w-auto bg-[#FF9800] text-black font-semibold text-sm rounded-lg">
            14 Days Free Trial
          </span>
        </div>

        {/* Currency Selection */}
        <div className="bg-[#003B6D] text-white p-4 rounded-lg mb-8 text-center flex flex-col sm:flex-row gap-2 justify-center">
          <span className="mr-4 text-sm sm:text-base">
            Billing will be processed in USD. View prices in your local currency
          </span>
          <div className="flex justify-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="currency"
                value="USD"
                checked={currency === "USD"}
                onChange={(e) => setCurrency(e.target.value)}
                className="mr-2"
              />
              USD
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="currency"
                value="AED"
                checked={currency === "AED"}
                onChange={(e) => setCurrency(e.target.value)}
                className="mr-2"
              />
              AED
            </label>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 border hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-bold my-5">{plan.name}</h3>
              <div className=" flex justify-center items-center mb-6">
                {" "}
                <div className="h-px bg-gray-300 w-[95%]"></div>
              </div>
              <div className="mb-6 text-center">
                <span className="text-[#FF9800] text-3xl font-bold">
                  {currency == "USD" ? "US$" : "AED"}
                  {isAnnual
                    ? currency == "USD"
                      ? plan.price.annual
                      : plan.price.annual * 3.67
                    : currency == "USD"
                      ? plan.price.monthly
                      : plan.price.monthly * 3.67}
                  /
                </span>
                <span className="text-[#FF9800] font-semibold ">
                  {isAnnual ? "year" : "mo"}
                </span>
              </div>
              <button className="w-[90%] block mx-auto bg-[#003B6D] text-white font-bold py-3 rounded-lg mb-6 hover:opacity-90 transition-opacity">
                Buy now
              </button>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#26B9B3] mt-1">+</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Links */}
        <div className="text-center mt-12 space-y-2">
          <p>
            <Link href="#" className="text-[#003B6D] hover:underline">
              Important offers, pricing details & disclaimers
            </Link>
          </p>
          <p>
            <Link href="#" className="text-[#003B6D] hover:underline">
              Bulk offer pricing Terms and Conditions
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
