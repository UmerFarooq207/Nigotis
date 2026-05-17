"use client";
import Image from "next/image";
import { motion } from "framer-motion";

/* ── Shared animation variants ── */
const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const popUp = {
  hidden: { opacity: 0, scale: 0.5, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
};

const fadeCard = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay },
  },
});

const headingVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function EmpoweringBusiness() {
  return (
    <section className="py-16 md:py-24 bg-gradient-left-image px-8 lg:px-[70px] xl:px-20 2xl:px-24 space-y-12">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* ── Text — fade in from left ── */}
          <motion.div
            className="space-y-6 order-2 lg:order-1"
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-navy">
              Empowering Businesses with Intelligent AI Assistance
            </h2>
            <div className="space-y-4">
              <p className="text-black text-lg md:text-xl">
                At Nigotis, our vision is to empower businesses by
                simplifying operations and enabling smarter decisions
                through Nigotis AI. Our intelligent assistant helps you
                manage income, expenses, invoices, customers, payments,
                and daily business activities with ease.
              </p>
              <p className="text-black text-lg md:text-xl md:text-lg">
                With Nigotis AI on WhatsApp, you can get important business
                information with just one message. Create invoices, check expenses,
                review income, analyze performance, and receive useful insights
                instantly — putting full control of your business at your fingertips.
              </p>
            </div>
          </motion.div>

          {/* ── Image — pop up ── */}
          <div className="relative order-1 lg:order-2">
            <motion.div
              className="mx-6 sm:mx-auto"
              variants={popUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <img
                src="/homeicons/empowering.png"
                alt="Dashboard Analytics"
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Features heading ── */}
      <div>
        <motion.h1
          className="text-center text-3xl sm:text-4xl md:text-5xl font-bold leading-tight pt-12 pb-12"
          variants={headingVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          Features That Help You Run Your Business
        </motion.h1>

        {/* ── Features grid row 1 ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Card 1 — Financial Reports */}
          <motion.div
            className="relative w-full p-6 bg-white shadow-xl h-full flex items-center justify-center rounded-xl my-[65px] pt-[65px] text-center"
            variants={fadeCard(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="absolute top-[-65px] w-full left-0 flex items-center justify-center">
              <motion.div
                variants={popUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.3 }}
              >
                <Image
                  src={"/homeicons/feature/1.png"}
                  alt={"Financial Reports"}
                  width={180}
                  height={180}
                />
              </motion.div>
            </div>
            <div className="w-full">
              <h3 className="text-lg md:text-2xl text-primary-navy font-bold">
                Financial Reports
              </h3>
              <p className="text-black text-sm md:text-base text-left">
                Get any-time access to balance sheets, cash flow statements,
                profit and loss statements, tax and VAT/GST information, and
                other customisable financial reports.
              </p>
            </div>
          </motion.div>

          <div className="md:hidden h-28"></div>

          {/* Card 2 — Data Security */}
          <motion.div
            className="relative w-full p-6 bg-white shadow-xl h-full flex items-center justify-center rounded-xl mt-20 mb-8 md:my-[65px] pt-[65px] md:pt-[65px] text-center"
            variants={fadeCard(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="absolute top-[-65px] w-full left-0 flex items-center justify-center">
              <motion.div
                variants={popUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.4 }}
              >
                <Image
                  src={"/homeicons/feature/2.png"}
                  alt={"Data Security"}
                  width={180}
                  height={180}
                />
              </motion.div>
            </div>
            <div className="w-full">
              <h3 className="text-lg md:text-2xl text-primary-navy font-bold">
                Data Security
              </h3>
              <p className="text-black text-sm md:text-base text-right">
                Nigotis uses advanced, industry-recognised security safeguards
                to keep all your financial data protected. Organise your
                finances in one secure, automatically backed up place and work
                anytime from any device.
              </p>
            </div>
          </motion.div>

          {/* Card 3 — Tax Ready */}
          <motion.div
            className="row-span-1 md:row-span-2 relative w-full p-6 bg-gradient-to-b from-primary-navy/80 to-white shadow-xl h-[85%] flex items-center justify-center flex-col rounded-xl mt-20 mb-8 md:my-[65px] pt-[65px] md:pt-[65px] text-center"
            variants={fadeCard(0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="absolutetop-[-65px] w-full left-0 flex items-center justify-center">
              <motion.div
                variants={popUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.5 }}
              >
                <Image
                  src={"/homeicons/feature/3.png"}
                  alt={"Tax Ready"}
                  width={260}
                  height={260}
                />
              </motion.div>
            </div>
            <div className="w-full">
              <h3 className="text-lg md:text-2xl text-primary-navy font-bold">
                Tax Ready
              </h3>
              <p className="text-black text-sm md:text-base text-right">
                Easier bookkeeping means less stress—and less work—when you file
                your tax. Snap and save receipts from our mobile app to maximise
                deductions and stay compliant.
              </p>
            </div>
          </motion.div>

          {/* Card 4 — Increased Accuracy */}
          <motion.div
            className="col-span-1 row-span-1 md:col-span-2 relative w-full p-6 bg-white shadow-xl h-fit flex items-center justify-center rounded-xl mt-20 mb-8 md:my-[65px] pt-[65px] md:pt-[65px] text-center flex-col md:flex-row-reverse"
            variants={fadeCard(0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="absolutetop-[-65px] w-full left-0 flex items-center justify-center">
              <motion.div
                variants={popUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.45 }}
              >
                <Image
                  src={"/homeicons/feature/4.png"}
                  alt={"Increased Accuracy"}
                  width={260}
                  height={260}
                />
              </motion.div>
            </div>
            <div className="w-full">
              <h3 className="text-lg md:text-2xl text-primary-navy font-bold">
                Increased Accuracy
              </h3>
              <p className="text-black text-sm md:text-base text-left">
                Automatically track and calculate sales tax in seconds with
                Nigotis Online. With our one-click tax reports, small businesses
                save hours each month.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Features grid row 2 ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Card 5 — 24/7 Support */}
          <motion.div
            className="md:row-span-2 relative w-full p-6 bg-gradient-to-b from-primary-navy/80 to-white shadow-xl h-[85%] flex items-center justify-center flex-col rounded-xl mt-20 mb-8 md:my-[65px] pt-[65px] md:pt-[65px] text-center"
            variants={fadeCard(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="absolutetop-[-65px] w-full left-0 flex items-center justify-center">
              <motion.div
                variants={popUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.3 }}
              >
                <Image
                  src={"/homeicons/feature/6.png"}
                  alt={"24/7 Customer Support"}
                  width={260}
                  height={260}
                />
              </motion.div>
            </div>
            <div className="w-full">
              <h3 className="text-lg md:text-2xl text-primary-navy font-bold">
                24/7 Customer Support
              </h3>
              <p className="text-black text-sm md:text-base text-left">
                Our team of experts are here to support you 24 hours a day,
                Monday to Friday. Get real time help via live chat where
                you&apos;ll get an instant reply from our support team.
              </p>
            </div>
          </motion.div>

          {/* Card 6 — GST & VAT */}
          <motion.div
            className="relative w-full p-6 bg-white shadow-xl h-full flex items-center justify-center rounded-xl mt-20 mb-8 md:my-[65px] pt-[65px] md:pt-[65px] text-center"
            variants={fadeCard(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="absolute top-[-65px] w-full left-0 flex items-center justify-center">
              <motion.div
                variants={popUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.4 }}
              >
                <Image
                  src={"/homeicons/feature/5.png"}
                  alt={"GST & VAT"}
                  width={180}
                  height={180}
                />
              </motion.div>
            </div>
            <div className="w-full">
              <h3 className="text-lg md:text-2xl text-primary-navy font-bold">
                GST &amp; VAT
              </h3>
              <p className="text-black text-sm md:text-base text-left">
                Easily manage taxes with built-in GST and VAT features.
                Automatically apply tax rates while generating invoices, setting
                up payrolls, or creating purchase orders. Add discounts, handle
                multiple tax rules, and stay compliant with local tax
                regulations—all from a single platform.
              </p>
            </div>
          </motion.div>

          <div className="md:hidden h-16" />

          {/* Card 7 — Easy Set Up */}
          <motion.div
            className="relative w-full p-6 bg-white shadow-xl h-full flex items-center justify-center rounded-xl mt-20 mb-8 md:my-[65px] pt-[65px] md:pt-[65px] text-center"
            variants={fadeCard(0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="absolute top-[-65px] w-full left-0 flex items-center justify-center">
              <motion.div
                variants={popUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.5 }}
              >
                <Image
                  src={"/homeicons/feature/8.png"}
                  alt={"Easy Set Up"}
                  width={180}
                  height={180}
                />
              </motion.div>
            </div>
            <div className="w-full">
              <h3 className="text-lg md:text-2xl text-primary-navy font-bold">
                Easy Set Up
              </h3>
              <p className="text-black text-sm md:text-base text-right">
                Nigotis is based in the cloud, simply sign-in and get started
                from any web browser. Unlike traditional accounting software,
                Nigotis Business Accounting and Automation does not require
                installation.
              </p>
            </div>
          </motion.div>

          {/* Card 8 — Collaboration */}
          <motion.div
            className="md:col-span-2 relative w-full p-6 bg-white shadow-xl h-fit flex flex-col md:flex-row items-center justify-center rounded-xl mt-20 mb-8 md:my-[65px] pt-[65px] md:pt-[65px] text-center"
            variants={fadeCard(0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="absolutetop-[-65px] w-full left-0 flex items-center justify-center">
              <motion.div
                variants={popUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.45 }}
              >
                <Image
                  src={"/homeicons/feature/7.png"}
                  alt={"Collaboration"}
                  width={260}
                  height={260}
                />
              </motion.div>
            </div>
            <div className="w-full">
              <h3 className="text-lg md:text-2xl text-primary-navy font-bold">
                Collaboration
              </h3>
              <p className="text-black text-sm md:text-base text-right">
                Invite your accountant to access your books for seamless
                collaboration. Give employees specific access to features and
                reduce errors with auto-syncing. Protect sensitive data with
                user-access levels and share reports without sharing a log-in.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
