export default function Reports() {
  const features = [
    {
      title: "Profit and Loss Report",
      description:
        "Track income and expenses over a specific time period to evaluate your business performance and profitability.",
    },
    {
      title: "Balance Sheet",
      description:
        "Get a complete snapshot of your assets, liabilities, and equity to understand your business’s financial standing.",
    },
    {
      title: "Cash Flow Report",
      description:
        "Monitor inflow and outflow of cash to ensure liquidity and manage operating, investing, and financing activities effectively.",
    },
    {
      title: "A/R Aging Summary",
      description:
        "View outstanding receivables categorized by due periods to better manage collections and customer credit limits.",
    },
    {
      title: "Open Invoices",
      description:
        "Track all unpaid invoices to improve cash flow and follow up on overdue payments efficiently.",
    },
    {
      title: "Custom Reports with Nigotis AI",
      description:
        "Create tailor-made reports using Nigotis AI by applying smart filters, custom date ranges, and personalized fields to get data insights your way.",
    },
  ];

  return (
    <div className="mx-auto   px-4 xl:px-10 2xl:px-14 lg:px-6 sm:px-0 py-16">
      <div className="mb-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 text-lg font-semibold uppercase text-[#003366]">
            REPORTS
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold">
            Make informed business decisions with comprehensive reports
          </h3>
        </div>
        <p className=" my-auto text-gray-600 text-sm sm:text-base">
          Stay on top of finance and business operations with 70+ built-in and
          customizable reports and advanced analytics to understand the past,
          present, and future of your business performance.
        </p>
      </div>

      <div className="grid gap-8  pt-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div key={index} className="space-y-4">
            <div className="h-px bg-gray-300 w-full mb-5"></div>
            <h4 className="text-xl font-semibold">{feature.title}</h4>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
