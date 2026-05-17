export default function ManageBusiness() {
  return (
    <section className="py-10 md:py-24 px-2 sm:px-4 md:px-7 lg:px-10 xl:px-14 2xl:px-16 ">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Images */}
          <div className="relative col-span-2">
            {/* Main Dashboard Image */}
            <div className="rounded-2xl mx-6 sm:mx-auto shadow-2xl overflow-hidden">
              <img
                src="/homeicons/managemain.png"
                alt="Dashboard Analytics"
                className="w-full h-auto"
              />
            </div>

            <div className="absolute   -bottom-4 -left-3  sm:-left-16 sm:-bottom-14 size-20  sm:size-[150px] object-cover p-2 sm:p-3 bg-white flex items-center justify-center rounded-full shadow-lg">
              <img
                src="/homeicons/managecircle.png"
                alt="Progress Circle"
                className=""
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 col-span-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Manage Your Business from Anywhere in the World
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                With Nigotis, take full control of your business operations no
                matter where you are. Stay connected and make informed decisions
                with real-time insights into every aspect of your business.
              </p>
              <ul className="list-disc pl-5 text-gray-600 text-sm sm:text-base md:text-lg">
                <li>
                  <span className="font-bold">Invoicing Made Easy:</span>{" "}
                  Generate and send invoices effortlessly with AI-powered
                  invoicing.
                </li>
                <li>
                  <span className="font-bold">Simplified Payrolls:</span> Manage
                  employee payrolls with just a few clicks.
                </li>
                <li>
                  <span className="font-bold">AI Business Assistant:</span> Ask
                  our intelligent AI bot anything about your business and get
                  instant, accurate answers.
                </li>
                <li>
                  <span className="font-bold">Daily Updates:</span> Receive
                  regular updates to track progress and stay ahead.
                </li>
                <li>
                  <span className="font-bold">WhatsApp Integration:</span> Get
                  instant notifications and manage key tasks directly through
                  WhatsApp.
                </li>
              </ul>

              <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                From tracking sales and inventory to monitoring employee
                performance, Nigotis ensures your business runs smoothly and
                efficiently—whether you're in the office, on the go, or working
                remotely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
