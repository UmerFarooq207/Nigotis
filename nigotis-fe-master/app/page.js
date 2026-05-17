import Image from "next/image";
import Hero from "../components/Hero";
import FeaturesGrid from "../components/FeaturesGrid";
import ManageBusiness from "../components/ManageBusiness";
import CardsFeature from "../components/CardsFeature";
import Customers from "../components/Customers";
import PricingSection from "../components/Pricing";
import HeroSection from "../components/HomePage/HeroSection";
import FAQSection from "../components/Faq";
export default function Home() {
  return (
    // className=" px-2 sm:px-4 md:px-7 lg:px-10 xl:px-14 2xl:px-16"
    <main className="pt">
      <HeroSection />
      {/* <Hero /> */}
      <FeaturesGrid />
      <Customers isHome />
      <PricingSection />
      {/* <section className="px-8 lg:px-[70px] xl:px-20 2xl:px-24">
      </section> */}
      <FAQSection pricingsection />
    </main>
  );
}
