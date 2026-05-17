"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
const features = [
  {
    icon: "/fcards/fr.png",
    title: "Financial Reports",
    description:
      "Get an overview of your balance sheets, cash flow statements, profit and loss statements, tax and VAT/GST information, and other customisable financial reports.",
  },
  {
    icon: "/fcards/ds.png",
    title: "Data Security",
    description:
      "Nigotis uses advanced industry-recognised security safeguards to keep all your financial data protected. Organise your finances in one secure, automatically backed up place and work anytime from any device.",
  },
  {
    icon: "/fcards/tr.png",
    title: "Tax Reports",
    description:
      "Easier bookkeeping means less stress—and less work— when you file your tax. Snap and save receipts from our web app to maximise deductions and stay compliant.",
  },
  {
    icon: "/fcards/acc.png",
    title: "Increased Accuracy",
    description:
      "Manual calculations, accounting rules and formulas are all taken care of for you and financial reports are available at the click of a button.",
  },
  {
    icon: "/fcards/gst.png",
    title: "GST & VAT",
    description:
      "Automatically track and calculate sales tax in seconds with Nigotis Online. With our one-click tax reports, small businesses save hours each month.",
  },
  {
    icon: "/fcards/setup.png",
    title: "Easy Set Up",
    description:
      "Nigotis is based in the cloud, simply sign-in and get started from any web browser. Unlike traditional accounting software, Nigotis Business Accounting and Automation does not require installation.",
  },
  {
    icon: "/fcards/collab.png",
    title: "Collaboration",
    description:
      "Invite your accountant to access your financial records for seamless collaboration. Give employees specific access to features and reduce errors with auto-syncing. Protect sensitive data with user-access levels and share reports without sharing a log-in.",
  },
  {
    icon: "/fcards/support.png",
    title: "24/7 Customer Support",
    description:
      "Our team of experts are here to support you 24 hours a day, Monday to Friday. Get real time help via live chat where you'll get an instant reply from our support team.",
  },
];

export default function FeatureCards() {
  const sectionRef = useRef(null);

  // Animation variants for stepwise fade-in
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.2, // Staggered delay for each card
        duration: 0.5,
      },
    }),
  };

  return (
    <section className="py-16 md:py-24 " ref={sectionRef}>
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Features that help you run your business
        </h2>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }} // Animation triggers when 20% of section is in view
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg p-6 border hover:shadow-lg transition-shadow"
              variants={cardVariants}
              custom={index} // Pass index for staggered animation
            >
              <div className="mb-4">
                <div className="bg-[#FF9800] rounded-full w-16 h-16 flex items-center justify-center">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={32}
                    height={32}
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                {feature.description}
              </p>
              {/* <Link
                href="#"
                className="text-[#26B9B3]  hover:underline inline-block"
              >
                Learn more
              </Link> */}
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link
            href="/features"
            className="inline-flex items-center text-[#26B9B3] hover:underline"
          >
            See all features
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
