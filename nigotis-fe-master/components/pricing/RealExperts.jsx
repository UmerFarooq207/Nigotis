import React from "react";

function RealExperts() {
  return (
    <section className=" mb-10">
      <div className=" bg-[#003366] w-full md:w-[80%] xl:w-[65%] mx-auto p-4 md:p-6 lg:py-7  md:rounded-lg  flex gap-3 md:gap-7 lg:gap-14 xl:gap-16">
        <img
          src="/pricing/realexperts.png"
          alt=""
          className=" w-[30%] object-cover sm:w-[50%] lg:w-auto"
        />
        <div className="  text-white my-auto">
          <h3 className=" text-base sm:text-xl font-semibold mb-4">
            Real Experts. Real Confidence
          </h3>
          <p className=" text-xs sm:text-base">
            All Nigotis plans include a complimentary 1-to-1 onboarding session
            with our team. We'll guide you through setting up Nigotis to
            streamline your business operations effortlessly.
          </p>
        </div>
      </div>
    </section>
  );
}

export default RealExperts;
