"use client";
import React from "react";
import PriceSectionPricingPage from "../../components/pricing/PriceSectionPricingPage";
import RealExperts from "../../components/pricing/RealExperts";
import AllPlans from "../../components/pricing/AllPlans";
import Testimonials from "../../components/pricing/Testimonials";
import TestimonialsMob from "../../components/pricing/TestimonialsMob";
import FAQSection from "../../components/Faq";
import PricingSection from "@/components/Pricing";
import Link from "next/link";
import Image from "next/image";
import useUser from "@/hooks/useUser";
import { RefreshCw, Headphones, Rocket } from "lucide-react";

function page({ searchParams }) {
  const currentPlanId = searchParams.currentPlanId;
  const user = useUser();

  return (
    <main className="">
      {/* ── Pricing Header ── */}
      <section className="pt-32 pb-10 px-4 md:px-12 lg:px-24 bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Find a plan that&apos;s{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003B6D] to-[#26B9B3]">
              right for you
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Simple pricing for small businesses that want to manage orders,
            customers, invoices, and payments with ease.
          </p>

          {/* Benefit Pills */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
            {[
              { icon: RefreshCw, label: "Cancel Anytime" },
              { icon: Headphones, label: "Unlimited Support" },
              { icon: Rocket, label: "Free Guided Setup" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#26B9B3]/40 transition-all duration-200"
              >
                <Icon className="w-4 h-4 text-[#26B9B3] shrink-0" />
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PricingSection currentPlanId={currentPlanId} />
      <div className=" mx-8 md:mx-24 bg-gradient-to-b md:bg-gradient-to-l p-8 md:p-16 my-12 md:my-20 from-primary-navy/80 via-primary-navy/80 to-white rounded-3xl relative flex flex-col md:flex-row-reverse">
        <div className=" w-full md:w-[55%] ">
          <h1 className=" text-white text-2xl md:text-5xl font-medium mb-12">
            Get 14 Days Free Trial with Nigotis Business Management and
            Automation
          </h1>
          <Link
            href={"/auth/signup"}
            className=" rounded-xl bg-white text-primary-navy hover:text-white text-xl md:text-2xl py-2 px-4 hover:bg-primary-navy/80 border-2 duration-300 border-primary-navy/80 hover:border-white"
          >
            Get Free Trial
          </Link>
        </div>
        <div className=" w-full md:w-[45%] relative flex items- mt-24 md:m-0">
          <Image
            width={700}
            height={600}
            alt="trial"
            src={"/pricing/trial.png"}
            className=" aspect-auto md:absolute md:-top-56 md:right-4"
          />
        </div>
      </div>
      {/* <RealExperts /> */}
      <section className=" overflow-hidden">
        <AllPlans />
      </section>
      {/* <section className=" hidden md:block">
        <Testimonials />
      </section>
      <section className=" md:hidden">
        <TestimonialsMob />
      </section> */}
      <section className=" px-8md:px-24">
        <FAQSection pricingsection />
      </section>
    </main>
  );
}

export default page;
