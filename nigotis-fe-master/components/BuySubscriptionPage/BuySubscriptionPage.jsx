"use client";
import React, { useState } from "react";
import BuySubscription from "./BuySubscription";
import PricingIncludeModal from "../PricingIncludeModal";
import useUser from "@/hooks/useUser";
import {
  Shield,
  Clock,
  Headphones,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const trustPoints = [
  { icon: Shield, label: "Secure Checkout", desc: "256-bit SSL encrypted" },
  { icon: Sparkles, label: "Free Guided Setup", desc: "We'll help you start" },
  { icon: Headphones, label: "Unlimited Support", desc: "24/7 expert help" },
];

export default function BuySubscriptionPage({ plan, currentPlanId = "" }) {
  const { user } = useUser();
  const [selectedInclude, setSelectedInclude] = useState({});
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* ── Hero Header ── */}
        <div className="relative overflow-hidden bg-white">
          <div className="relative max-w-5xl mx-auto px-4 pt-28 pb-12 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Complete Your Subscription
            </h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Choose your plan and start managing your business with Nigotis —
              invoices, payments, customers, orders, and daily operations, all
              in one place.
            </p>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="max-w-5xl mx-auto px-4 -mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* ─── Left: Plan Card ─── */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
                {/* Plan Badge */}
                <div className="bg-gradient-to-r from-[#003B6D] to-[#1a6b8a] px-6 py-4">
                  <p className="text-xs font-semibold text-[#26B9B3] uppercase tracking-wider mb-1">
                    Selected Plan
                  </p>
                  <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                  {plan.tagline !== "." && (
                    <p className="text-sm text-white/70 mt-1">{plan.tagline}</p>
                  )}
                </div>

                {/* Price */}
                <div className="px-6 py-6 border-b border-gray-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-[#003B6D]">
                      ${Number(plan?.pricePerMonth).toFixed(2)}
                    </span>
                    <span className="text-gray-500 text-sm font-medium">
                      / month
                    </span>
                  </div>
                  {plan?.pricePerScreen && Number(plan.pricePerScreen) > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      + ${Number(plan.pricePerScreen).toFixed(2)}/mo per extra
                      screen
                    </p>
                  )}
                </div>

                {/* Features Toggle */}
                <div className="px-6 py-4">
                  <button
                    onClick={() => setShowFeatures(!showFeatures)}
                    className="flex items-center justify-between w-full text-sm font-semibold text-[#003B6D] hover:text-[#26B9B3] transition-colors"
                  >
                    <span>
                      What&apos;s included ({plan.includes?.length || 0}{" "}
                      features)
                    </span>
                    {showFeatures ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                  {showFeatures && (
                    <ul className="mt-4 space-y-3">
                      {plan.includes?.map((item, i) => (
                        <li
                          key={i}
                          onClick={() => setSelectedInclude(item)}
                          className="flex items-start gap-3 cursor-pointer group"
                        >
                          <CheckCircle2
                            size={18}
                            className="text-[#26B9B3] mt-0.5 flex-shrink-0"
                          />
                          <span className="text-sm text-gray-600 group-hover:text-[#003B6D] group-hover:underline transition-colors">
                            {item?.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* ─── Right: Checkout ─── */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Configure & Pay
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Select your duration, add extra screens if needed, then
                  proceed to payment.
                </p>
                <BuySubscription plan={plan} currentPlanId={currentPlanId} />
              </div>
            </div>
          </div>

          {/* ── Trust Badges ── */}
          <div className="mt-10 mb-16 rounded-2xl bg-gradient-to-r from-[#003B6D] to-[#1a6b8a] p-[1px]">
            <div className="rounded-2xl bg-gradient-to-r from-[#003B6D]/95 to-[#1a6b8a]/95 backdrop-blur-sm px-6 py-8">
              <div className="flex flex-col md:flex-row items-center justify-around gap-6 md:gap-0">
                {trustPoints.map(({ icon: Icon, label, desc }, idx) => (
                  <div key={label} className="flex items-center gap-0">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-lg shadow-black/10">
                        <Icon size={22} className="text-[#26B9B3]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{label}</p>
                        <p className="text-xs text-white/50">{desc}</p>
                      </div>
                    </div>
                    {idx < trustPoints.length - 1 && (
                      <div className="hidden md:block w-px h-10 bg-white/15 ml-8" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature detail modal */}
      {selectedInclude && (
        <PricingIncludeModal
          data={selectedInclude}
          isOpen={selectedInclude?.title}
          onClose={() => setSelectedInclude({})}
        />
      )}
    </>
  );
}
