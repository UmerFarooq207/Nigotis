import Image from "next/image";
import Link from "next/link";

const payablesFeatures = [
  {
    title: "Expense Tracking",
    desc: "Stay on top of your expenses with intelligent tracking and real-time financial awareness — categorized by bills, payroll, or others.",
    highlights: ["Smart categorization", "Date-range filtering", "Paid vs pending clarity"],
  },
  {
    title: "Asset Management",
    desc: "Capture every business asset with quantity, value, and acquisition date — and let Nigotis AI keep your balance sheet ready at all times.",
    highlights: ["Asset register", "Bulk asset import", "Real-time asset value"],
  },
  {
    title: "Payroll Made Effortless",
    desc: "Let Nigotis AI handle payroll calculations, salary flows, and employee payments with precision — fixed or hourly, every cycle.",
    highlights: ["Fixed & hourly salary support", "Overtime, bonus, tax built-in", "Auto-linked to expenses"],
  },
  {
    title: "Team & Role Management",
    desc: "Bring HR, Finance, Sales, and employees into one workspace — with clean role-based access for everyone on your team.",
    highlights: ["Admin, HR, Finance, Sales roles", "Secure credential delivery", "Centralized employee records"],
  },
  {
    title: "Income & Cash Awareness",
    desc: "Every paid invoice, every recorded inflow — Nigotis AI keeps your income view current and your reports ready when you need them.",
    highlights: ["Linked invoice income", "Manual income entries", "Filterable by period"],
  },
];

export default function Workflow() {
  return (
    <section className="py-20 px-4 lg:px-[70px] xl:px-20 2xl:px-24 bg-white">
      <div className="max-w-6xl mx-auto space-y-24">
        {/* ── Section 1: Workflow Automation — image left, text right ── */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="bg-slate-50 rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-center order-2 lg:order-1">
            <Image
              src="/features/workflow.png"
              width={400}
              height={400}
              alt="Workflow automation"
              className="w-full max-w-[340px] h-auto object-contain"
            />
          </div>

          {/* Text */}
          <div className="space-y-5 order-1 lg:order-2">
            <span className="text-sm font-bold uppercase tracking-widest text-[#26B9B3]">
              Intelligent Workflows
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              Effortless operations, guided by Nigotis AI
            </h2>
            <p className="text-gray-600 text-lg sm:text-xl leading-relaxed">
              From the first invoice to the last payroll run, Nigotis AI keeps
              every workflow connected — so income, expenses, payroll, and
              reports stay in perfect sync without you lifting a finger.
            </p>

            <div className="space-y-4 pt-2">
              <div className="bg-slate-50 rounded-2xl border border-gray-100 p-6 space-y-3">
                <h3 className="font-bold text-gray-900 text-base">
                  Automated by intelligence
                </h3>
                <ul className="space-y-2.5">
                  {[
                    "Invoices auto-linked to income records",
                    "Payroll runs auto-logged as expenses",
                    "Smart updates and real-time notifications",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                      <span className="w-2 h-2 rounded-full bg-[#26B9B3] shrink-0 shadow-sm" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-gray-100 p-6 space-y-3">
                <h3 className="font-bold text-gray-900 text-base">
                  In control, every step
                </h3>
                <ul className="space-y-2.5">
                  {[
                    "Role-based access for every team member",
                    "Secure, structured business data",
                    "Day-to-day operations made effortless",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                      <span className="w-2 h-2 rounded-full bg-[#26B9B3] shrink-0 shadow-sm" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 2: Payables — text left, images right ── */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="space-y-5">
            <span className="text-sm font-bold uppercase tracking-widest text-[#26B9B3]">
              Expenses, Payroll & Assets
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              Total command over what your business spends
            </h2>
            <p className="text-gray-600 text-lg sm:text-xl leading-relaxed">
              Nigotis AI captures every expense, every payroll run, and every
              asset — giving you a single, intelligent view of where your money
              moves and why.
            </p>
            <ul className="space-y-2.5 pt-2">
              {[
                "Smart expense categorization",
                "Fixed and hourly payroll runs",
                "Asset register with live valuation",
                "Bulk import for fast setup",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-base text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-[#26B9B3] shrink-0 shadow-sm" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Images */}
          <div className="space-y-3">
            <div className="bg-slate-50 rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-center">
              <Image
                src="/features/6.png"
                width={500}
                height={280}
                alt="Payables overview"
                className="w-full max-w-[420px] h-auto object-contain rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center justify-center">
                <Image
                  src="/features/4.png"
                  width={320}
                  height={220}
                  alt="Vendor bills"
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
              <div className="bg-slate-50 rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center justify-center">
                <Image
                  src="/features/5.png"
                  width={320}
                  height={220}
                  alt="Expense tracking"
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Payables feature cards ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {payablesFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-all duration-300 flex flex-col space-y-4"
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
