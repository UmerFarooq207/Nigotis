import Image from "next/image";

export default function Payables() {
  const payables = [
    {
      title: "Manage Vendor Bills",
      description:
        "Know exactly what you owe to whom. Convert vendor invoices to bills, record full or partial payments, apply vendor credits, and track the status of all your vendor payments seamlessly.",
    },
    {
      title: "Streamline your purchase order workflow",
      description:
        "Streamlines your purchasing process and strengthens vendor relationships, offering clear insights into orders, tracking deliveries and payments, and ensuring optimal inventory levels at all times.",
    },
    {
      title: "Simplify expense tracking",
      description:
        "Ditch the shoebox and capture all your business expenses digitally. Auto-scan expense receipts, set recurring expenses, and categorize them for better insights into your business spend.",
    },
    {
      title: "Store documents centrally",
      description:
        "Easily organize and access important documents for your business. Attach receipts to expenses or bills, enable auto-scan for quick transaction creation, and sort documents into custom folders for quick access.",
    },
    {
      title: "Verify purchases with purchase approvals",
      description:
        "Control and streamline purchases as you ensure accurate and prompt payments to your vendors by setting up single or multi-level purchase approval to bills, purchase orders, and vendor credits.",
    },
  ];

  return (
    <div className="mx-auto  xl:px-10 lg:px-6 px-4 sm:px-0 py-20">
      {/* <div className="mb-16 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-lg font-semibold text-[#008080]">PAYABLES</p>
            <h2 className=" text-3xl sm:text-4xl font-bold">
            Control spending with effective payables management
            </h2>
          </div>
          <p className="text-sm sm:text-lg text-gray-600">
          Have a command over your payables and vendor relationships. Manage vendor bill payments, track outstanding amounts, and easily record any incurred expense.
          </p>
        </div>
        
        <div className="  flex items-center  justify-center">
            <Image src="/features/receivables.png" width={1000} height={325} alt="Receivables" />
        </div> */}
      <div className="grid gap-8  lg:grid-cols-3">
        {payables.map((payable, index) => (
          <div key={index} className=" pt-8 ">
            <div className="h-px bg-gray-300 w-[97%] mx-auto mb-7"></div>
            <h3 className="mb-4 text-xl font-bold">{payable.title}</h3>
            <p className="mb-4 text-gray-600 text-sm sm:text-base">
              {payable.description}
            </p>
            <a href="#" className="text-[h#00AAFF] hover:text-blue-700 ">
              Learn More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
