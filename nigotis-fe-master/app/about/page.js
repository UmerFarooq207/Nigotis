import {
  MessageSquare,
  Bot,
  FileText,
  Users,
  BarChart3,
  Zap,
  Lightbulb,
  ShieldCheck,
  Rocket,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Nigotis AI Assistant",
    desc: "Your intelligent business companion — guiding decisions, surfacing insights, and keeping every operation in sync.",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: FileText,
    title: "Smart Invoicing & Billing",
    desc: "Nigotis AI helps you create, send, and track invoices with complete clarity over your finances.",
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    icon: Users,
    title: "Clients, Team & Roles",
    desc: "Keep clients, employees, and team roles organized — admin, HR, finance, and sales, all in one intelligent workspace.",
    color: "bg-orange-50 text-orange-600 border-orange-100",
  },
  {
    icon: Zap,
    title: "Payroll & Expense Intelligence",
    desc: "Let Nigotis AI handle payroll calculations, expense tracking, and asset records with precision and speed.",
    color: "bg-yellow-50 text-yellow-600 border-yellow-100",
  },
  {
    icon: BarChart3,
    title: "Real-time Business Reports",
    desc: "Profit & loss, cash flow, balance sheet, and invoice insights — generated intelligently from your live data.",
    color: "bg-teal-50 text-teal-600 border-teal-100",
  },
  {
    icon: MessageSquare,
    title: "Connected Communication",
    desc: "Automated invoice emails, OTPs, credential delivery, and WhatsApp updates — your business stays in touch effortlessly.",
    color: "bg-green-50 text-green-600 border-green-100",
  },
];

const values = [
  {
    icon: Lightbulb,
    title: "Clarity",
    desc: "Complex operations should feel simple. Nigotis AI translates business complexity into clear, confident next steps.",
  },
  {
    icon: Zap,
    title: "Intelligence",
    desc: "Every workflow is enhanced by AI — quiet, precise, and always working in the background for you.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    desc: "Built for every business owner, in any currency, anywhere — not just finance experts.",
  },
  {
    icon: Rocket,
    title: "Control",
    desc: "One intelligent command layer for invoicing, payroll, expenses, clients, and reports — all unified.",
  },
];

export default function AboutUs() {
  return (
    <main className="w-full">
      {/* ── Hero ── */}
      <section
        className="pt-32 pb-20 px-4 lg:px-[70px] xl:px-20 2xl:px-24 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom right, #245985 -40%, #ffffff 45%, #245985 105%)",
        }}
      >
        {/* Decorative rings */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-20vw] left-1/2 -translate-x-1/2 z-0"
        >
          {[40, 70, 100].map((size) => (
            <div
              key={size}
              className="absolute rounded-full border border-white/10"
              style={{
                width: `${size}vw`,
                height: `${size}vw`,
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#003B6D]/10 border border-[#003B6D]/25 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#26B9B3] animate-pulse" />
            <span className="text-[#003B6D] font-bold tracking-widest text-xs uppercase">
              About Nigotis
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.1] text-gray-900 tracking-tight">
            A smarter way to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003B6D] to-[#26B9B3]">
              run your business
            </span>
            , guided by AI
          </h1>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Nigotis AI brings invoicing, payroll, expenses, clients, products,
            and reports into one intelligent workspace — assisting every
            decision, simplifying every workflow.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-20 px-4 lg:px-[70px] xl:px-20 2xl:px-24 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#26B9B3]">
              Our Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Put intelligence behind every business decision
            </h2>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              Running a business shouldn&apos;t mean juggling spreadsheets,
              chasing invoices, and reconciling expenses by hand. The mental
              load is real — and it slows everything down.
            </p>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              Nigotis AI is built to take that weight off your shoulders. One
              intelligent workspace where invoicing, payroll, expenses,
              clients, and reports all work together — assisted by AI,
              effortless by design.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Businesses Empowered", value: "10,000+" },
              { label: "Invoices Generated", value: "500K+" },
              { label: "Currencies Supported", value: "20+" },
              { label: "Hours Saved Weekly", value: "8 hrs" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-gray-100 bg-slate-50 p-6 text-center shadow-sm"
              >
                <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#003B6D] to-[#26B9B3]">
                  {value}
                </div>
                <div className="text-sm text-gray-500 mt-1 font-medium">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What Nigotis Does ── */}
      <section className="py-20 px-4 lg:px-[70px] xl:px-20 2xl:px-24 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#26B9B3]">
              What Nigotis AI Does
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Every business operation, intelligently unified
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Invoicing, payroll, expenses, clients, products, reports —
              connected by Nigotis AI into one effortless command layer.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-4"
              >
                <div
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border ${color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI + WhatsApp ── */}
      <section className="py-20 px-4 lg:px-[70px] xl:px-20 2xl:px-24 bg-[#003B6D] text-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#26B9B3]">
              Powered by Nigotis AI
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              An intelligent assistant for every business operation
            </h2>
            <p className="text-white/75 leading-relaxed text-base sm:text-lg">
              Nigotis AI works alongside you in real time — surfacing the
              numbers you need, guiding the workflows you run, and keeping
              every part of your business in perfect sync.
            </p>
            <ul className="space-y-3">
              {[
                "Smart invoicing, payroll, and expense flows",
                "Live business reports the moment you need them",
                "Centralized control over clients, team, and roles",
                "Built for businesses of any size, anywhere",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-[#26B9B3]/20 border border-[#26B9B3] flex items-center justify-center shrink-0">
                    <svg
                      className="w-3 h-3 text-[#26B9B3]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-white/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              {
                icon: "🤖",
                title: "Nigotis AI",
                desc: "An always-on intelligent assistant that interprets your data, answers questions, and guides every business move.",
              },
              {
                icon: "⚡",
                title: "Effortless Workflows",
                desc: "Invoices, payroll, expenses, and reports stay in sync automatically — no manual reconciliation required.",
              },
              {
                icon: "💬",
                title: "Connected Communication",
                desc: "Send invoices, OTPs, credentials, and team updates through email and WhatsApp — all from one place.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/10 border border-white/15 rounded-2xl p-5 space-y-2 hover:bg-white/15 transition-colors"
              >
                <div className="text-2xl">{icon}</div>
                <h3 className="font-bold text-base">{title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 px-4 lg:px-[70px] xl:px-20 2xl:px-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#26B9B3]">
              What we stand for
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              The principles guiding Nigotis AI
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="text-center space-y-4 p-6 rounded-2xl border border-gray-100 bg-slate-50 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#003B6D] to-[#26B9B3] text-white mx-auto">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
