export default function BankReconciliation() {
  const features = [
    {
      title: "WhatsApp-powered business insights",
      description:
        "Instantly request reports, summaries, and key metrics by simply chatting with your AI assistant on WhatsApp.",
    },
    {
      title: "AI-assisted transactions & entries",
      description:
        "Record business expenses, incomes, and create invoices — all through WhatsApp chat using smart AI prompts.",
    },
    {
      title: "Real-time status updates",
      description:
        "Get automated updates on order status, pending payments, and due invoices right in your WhatsApp, powered by AI tracking.",
    },
    {
      title: "Smart reminders & notifications",
      description:
        "Receive AI-generated reminders for due tasks, payments, or report generation — without leaving WhatsApp.",
    },
    {
      title: "Seamless client communication",
      description:
        "Share quotes, invoices, payment links, and transaction updates directly with clients via WhatsApp.",
    },
    {
      title: "Data access on the go",
      description:
        "Ask anything — from customer records to balance summaries — and get instant replies from your integrated AI assistant.",
    },
  ];

  return (
    <div className="mx-auto xl:px-102xl:px-10 px-4 md:px-24 py-16">
      <div className="mb-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 text-lg font-semibold uppercase text-green-600">
            Nigotis WhatsApp AI
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold">
            Smart business automation with WhatsApp AI
          </h3>
        </div>
        <p className="text-sm sm:text-base text-gray-600 ">
          Achieve next-level convenience and automation by integrating AI
          directly into your WhatsApp chat. Let your business operations run
          smoothly with simple chat-based interactions, eliminating the need to
          switch platforms. Access insights, perform tasks, and retrieve data
          effortlessly — all from your WhatsApp.
        </p>
      </div>

      <div className="grid gap-8  pt-8 md:grid-cols-3">
        {features.map((feature, index) => (
          <div key={index} className="space-y-4 w-[95%]">
            <div className="h-px bg-gray-300 w-full mb-3"></div>

            <h4 className="text-xl font-semibold">{feature.title}</h4>
            <p className="text-gray-600">{feature.description}</p>
            {/* <a
              href="/nigotis-ai"
              className="inline-block text-[#003366] hover:text-blue-700 hover:underline"
            >
              Learn More
            </a> */}
          </div>
        ))}
      </div>
    </div>
  );
}
