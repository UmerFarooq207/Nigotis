import ButtonPrimary from "../Buttons/ButtonPrimary";
import React from "react";

export default function FeatureHeroSection() {
  return (
    <div className="relative h-[616px] w-full  pt-4 md:px-7 lg:px-14 xl:px-18 2xl:px-20 ">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/features/heroimg.png)",
        }}
      >
        <div className="absolute inset-0 bg-black/60" /> {/* Dark overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto px-4 lg:px-10 xl:14 pt-24">
        <p className="mb-9 text-sm font-semibold uppercase tracking-wider text-white">
          ACCOUNTING SOFTWARE FEATURES
        </p>
        <h1 className="mb-9 max-w-2xl text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
          Explore smarter tools for a better way of doing business
        </h1>
        <p className="mb-9 max-w-xl text-sm  sm:text-lg text-gray-200">
          Simplify how you track your business finances, so you can focus on the
          bigger picture.
        </p>
        {/* <Link 
          href="#"
          className="inline-block rounded-md  min-h-10  hover:text-[#26B9B3] hover:from-white hover:to-white  duration-300 hover:border-2 hover:border-[#26B9B3] bg-gradient-to-r from-[#003B6D] to-[#26B9B3] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0891b2]/90"
        >
          See how it works
        </Link> */}
        <ButtonPrimary link={"/auth/signup"} text="Get Started" bggray />
      </div>
    </div>
  );
}
