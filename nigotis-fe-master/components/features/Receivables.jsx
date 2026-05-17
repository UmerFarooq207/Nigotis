import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Effortless Invoicing",
    desc: "Nigotis AI helps you draft, send, and track professional invoices in moments — with full visibility from issue to payment.",
    highlights: [
      "Auto-numbered, branded invoices",
      "Built-in tax and discount handling",
      "Live status: pending, paid, overdue",
    ],
  },
  {
    title: "Smart Client Records",
    desc: "Every client, every interaction, every invoice — kept structured and instantly searchable so nothing slips through the cracks.",
    highlights: [
      "Unified client profiles",
      "Complete invoice history per client",
      "Bulk import for quick onboarding",
    ],
  },
  {
    title: "Product & Sales Tracking",
    desc: "Maintain a clean product catalogue and let Nigotis AI capture every sale, quantity, and price the moment an invoice is issued.",
    highlights: [
      "Centralized product catalogue",
      "Per-invoice sales snapshots",
      "Real-time sales visibility",
    ],
  },
  {
    title: "Income at a Glance",
    desc: "Stay aware of every dollar coming in. Nigotis AI links each paid invoice to your income records automatically.",
    highlights: [
      "Auto-recorded invoice income",
      "Filter by date range or category",
      "Clear paid vs pending separation",
    ],
  },
  {
    title: "Role-Based Sales Control",
    desc: "Empower your sales team with the right access — admins, sales reps, and finance roles each see exactly what they need.",
    highlights: [
      "Granular role permissions",
      "Activity tracked by team member",
      "Safer, structured collaboration",
    ],
  },
];

export default function Receivables() {
  return (
    <section className="py-20 px-4 lg:px-[70px] xl:px-20 2xl:px-24 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* ── Header: text left, images right ── */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-5">
            <span className="text-sm font-bold uppercase tracking-widest text-[#26B9B3]">
              Invoicing & Clients
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              Clarity over every invoice, every client
            </h2>
            <p className="text-gray-600 text-lg sm:text-xl leading-relaxed">
              Nigotis AI keeps your client relationships organized and your
              income flow transparent — every invoice, every status, every
              outstanding balance in one intelligent view.
            </p>
            <ul className="space-y-2.5 pt-2">
              {[
                "See unpaid and overdue invoices instantly",
                "Track each client's full history",
                "Send and resend invoices in seconds",
                "Stay in control of your cash position",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-base text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-[#26B9B3] shrink-0 shadow-sm" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-center">
              <Image
                src="/features/1.png"
                width={450}
                height={280}
                alt="Invoice overview"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center justify-center">
              <Image
                src="/features/2.png"
                width={320}
                height={220}
                alt="Payment tracking"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center justify-center">
              <Image
                src="/features/3.png"
                width={320}
                height={220}
                alt="Cash flow report"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* ── Feature cards ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col space-y-4"
            >
              <h3 className="text-xl font-bold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-base text-gray-600 leading-relaxed">
                {feature.desc}
              </p>
              <ul className="space-y-2.5 pt-2">
                {feature.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-[#26B9B3] shrink-0 shadow-sm" />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="pt-4 mt-auto">
                <Link
                  href="/auth/signup"
                  className="inline-block text-sm font-bold text-[#003B6D] hover:text-[#26B9B3] transition-colors"
                >
                  Learn more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
