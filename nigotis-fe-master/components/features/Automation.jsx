"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const cards = [
  {
    title: "Nigotis AI Assistant",
    desc: "Your intelligent business companion — surfacing the right numbers, the right alerts, and the right next steps the moment you need them.",
    highlights: [
      "Real-time business intelligence",
      "Smart trends and performance signals",
      "Context-aware summaries on demand",
    ],
    image: "/features/automation1.png",
    accent: "from-[#003B6D] to-[#26B9B3]",
  },
  {
    title: "Smart Invoicing & Billing",
    desc: "Nigotis AI helps you create, send, and track invoices with complete clarity — every issued invoice flows straight into your income records.",
    highlights: [
      "Auto-generated, branded invoices",
      "Live status and payment tracking",
      "Tax, discount & total handled for you",
    ],
    image: "/features/automation2.png",
    accent: "from-[#26B9B3] to-[#003B6D]",
  },
  {
    title: "Connected Communication",
    desc: "Send invoices, credentials, OTPs, and updates to clients and team members automatically — no manual follow-ups, no missed messages.",
    highlights: [
      "Automated client & team emails",
      "WhatsApp-enabled business updates",
      "Stay aligned without leaving the dashboard",
    ],
    image: "/features/automation3.png",
    accent: "from-[#003B6D] to-[#26B9B3]",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Automation() {
  return (
    <section className="py-20 px-4 lg:px-[70px] xl:px-20 2xl:px-24 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 space-y-5">
          <span className="text-sm font-bold uppercase tracking-widest text-[#26B9B3]">
            Intelligent Automation
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Let Nigotis AI run the busywork
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Invoicing, follow-ups, calculations, and updates — handled
            intelligently in the background, so you can focus on the decisions
            that move your business forward.
          </p>
        </div>

        {/* Cards grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
              variants={cardVariants}
            >
              {/* Image container */}
              <div className="bg-slate-50 flex items-center justify-center p-8">
                <Image
                  src={card.image}
                  width={160}
                  height={160}
                  alt={card.title}
                  className="w-[120px] sm:w-[140px] h-auto object-contain drop-shadow-md"
                />
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col space-y-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {card.title}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  {card.desc}
                </p>

                <ul className="space-y-2.5 mt-auto pt-4">
                  {card.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm font-medium text-gray-700">
                      <span className="mt-1 w-2 h-2 rounded-full bg-[#26B9B3] shrink-0 shadow-sm" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
