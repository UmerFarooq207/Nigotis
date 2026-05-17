import Automation from "../../components/features/Automation";
import FeatureHeroSection from "../../components/features/FeatureHeroSection";
import Receivables from "../../components/features/Receivables";
import Payables from "../../components/features/Payables";
import Workflow from "../../components/features/Workflow";
import Banks from "../../components/features/Banks";
import Customization from "../../components/features/Customization";
import Reports from "../../components/features/Reports";
import React from "react";
import PricingSection from "../../components/Pricing";
import FeaturePage from "@/components/Pages/Features/FeaturePage";
import BanksReports from "@/components/features/BanksReports";

function page() {
  return (
    <main className=" pt-">
      <FeaturePage />
      <Automation />
      <Receivables />
      <Workflow />
      <BanksReports />
      <section className=" px-4 md:px-7 lg:px-14  2xl:px-18">
        {/* <Banks /> */}
        {/* <Payables /> */}
        {/* <Customization/> */}
        {/* <Reports /> */}
      </section>
        <PricingSection featureSection />
    </main>
  );
}

export default page;
