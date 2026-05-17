import Image from "next/image";

export default function Customization() {
  return (
    <div className="mx-auto xl:px-10 2xl:px-14 lg:px-6  px-4 sm:px-0 py-16">
      <div className="grid items-center gap-8 md:grid-cols-2 xl:grid-cols-5">
        {/* Left side - Bubble diagram */}
        <div className=" xl:col-span-2">
          <Image
            src="/features/customization.png"
            width={417}
            height={350}
            alt="Customization"
          />
        </div>

        {/* Right side - Content */}
        <div className=" xl:col-span-3">
          <h2 className="mb-2 text-lg font-semibold uppercase text-[#003366]">
            CUSTOMIZATION
          </h2>
          <h3 className="mb-4 text-3xl sm:text-4xl font-bold">
            Customized solutions for your unique needs
          </h3>
          <p className=" text-gray-600 text-sm sm:text-base">
            Craft customized processes that cater specifically to your unique
            business requirements. With personalized settings, custom fields,
            custom templates and custom reports, you can adapt our system to
            suit your business needs.
          </p>
        </div>
      </div>
    </div>
  );
}
