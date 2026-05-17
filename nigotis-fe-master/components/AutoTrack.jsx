import Image from "next/image";

export default function AutoTrackSection() {
  return (
    <section className="py-16 md:py-24 px-8 lg:px-[70px] xl:px-20 2xl:px-24  bg-gray-50">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center  ">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-primary-navy">
              Auto-Track business income and expenses
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                Nigotis is a user-friendly, simple accounting software that
                tracks your business income and expenses, and organises your
                financial information for you, eliminating manual data entry.
              </p>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                Nigotis simplifies small business accounting and automates tasks
                such as; Bookkeeping, Invoicing, Time tracking, Sales tax
                management, Budgeting, Bank reconciliation and Inventory
                tracking.
              </p>
            </div>
          </div>

          {/* Right Images */}
          <div className="relative">
            {/* Main Dashboard Image */}
            <div className="rounded-2xl mx-6 sm:mx-auto overflow-hidden">
              <img
                src="/homeicons/auto-track.png"
                alt="Dashboard Analytics"
                className="w-full h-auto"
              />
            </div>

            {/* <div className="absolute   -bottom-4 -left-3  sm:-left-16 sm:-bottom-14 size-20  sm:size-[150px] object-cover p-2 sm:p-3 bg-white flex items-center justify-center rounded-full shadow-lg">
              <img
                src="/homeicons/rings.png"
                alt="Progress Circle"
                className=""
              />
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
