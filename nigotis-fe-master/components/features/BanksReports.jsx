import Image from "next/image";
import Link from "next/link";

const reportsFeatures = [
  {
    title: "Profit & Loss Insights",
    desc: "Nigotis AI tracks every income and expense in real time, so your profit picture is always sharp, current, and decision-ready.",
    highlights: ["Live income vs expense breakdown", "Filter by any date range", "Clear net profit visibility"],
  },
  {
    title: "Cash Flow Intelligence",
    desc: "See the money moving in and out of your business month over month — guided by intelligent summaries you can act on instantly.",
    highlights: ["Monthly inflow & outflow", "Net cash flow trends", "Running balance view"],
  },
  {
    title: "Balance Sheet at a Glance",
    desc: "Nigotis AI keeps your asset position up to date as of any chosen date — no spreadsheets, no manual reconciliation.",
    highlights: ["Real-time asset totals", "As-of-date snapshots", "Always audit-ready"],
  },
  {
    title: "Invoice Performance",
    desc: "Track total, paid, current, and overdue invoices in one intelligent dashboard. Spot what needs attention before it becomes a problem.",
    highlights: ["Paid vs pending split", "Overdue detection", "Total revenue captured"],
  },
  {
    title: "AR Aging Summary",
    desc: "Let Nigotis AI bucket your unpaid invoices by age — 1-30, 31-60, 61-90, and 91+ days — so collections become focused and strategic.",
    highlights: ["Auto-aged receivables", "Per-client breakdown", "Action-ready insights"],
  },
  {
    title: "Open Invoices Tracker",
    desc: "Stay aware of every outstanding amount — filtered by date, overdue status, or client — without leaving your workspace.",
    highlights: ["Outstanding amount per client", "Date-range filtering", "Overdue-only view"],
  },
];

export default function BanksReports() {
  return (
    <section className="py-24 px-4 lg:px-[70px] xl:px-20 2xl:px-24 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center mb-16 space-y-5">
          <span className="text-sm font-bold uppercase tracking-widest text-[#26B9B3]">
            Reports & Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Decisions made clearer with Nigotis AI
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Profit and loss, cash flow, balance sheet, invoice performance, and
            aging insights — every report is generated intelligently from your
            live business data, ready the moment you need it.
          </p>
        </div>

        {/* ── Feature cards ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reportsFeatures.map((feature, index) => (
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
