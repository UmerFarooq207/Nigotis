"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/* ── Shared variants ── */
const cardVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay },
  }),
};

const imageVariant = {
  hidden: { opacity: 0, scale: 0.5, y: 10 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 18, delay },
  }),
};

const headingVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function FeaturesGrid() {
  return (
    <main className="px-8 lg:px-[70px] xl:px-20 2xl:px-24 bg-gradient-center-image">
      <section className="py-16 md:py-24">
        {/* ── Section heading ── */}
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-primary-navy text-center mb-4"
          variants={headingVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          Explore Features That Elevate Your Business
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* ── Left column: 2 stacked cards ── */}
          <div className="space-y-12 w-full flex flex-col justify-between">
            {/* Card 1 — AI Business Analytics */}
            <motion.div
              className="relative w-full p-12 bg-white shadow-xl rounded-xl my-[90px] pt-[90px] text-center"
              variants={cardVariant}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div
                className="absolute top-[-90px] w-full left-0 flex items-center justify-center"
                variants={imageVariant}
                custom={0.3}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <Image
                  src={"/homeicons/ai-business.png"}
                  alt={"AI Business Analytics"}
                  width={150}
                  height={150}
                />
              </motion.div>
              <h3 className="text-xl md:text-2xl font-semibold">
                AI Business Analytics
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Let AI Solve your Business queries and give you ideas for
                Marketing and Business growth by analysing your business{" "}
              </p>
            </motion.div>

            {/* Card 2 — Invoice Generation */}
            <motion.div
              className="relative w-full p-12 bg-white shadow-xl rounded-xl my-[90px] pt-[90px] text-center"
              variants={cardVariant}
              custom={0.15}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div
                className="absolute top-[-90px] w-full left-0 flex items-center justify-center"
                variants={imageVariant}
                custom={0.45}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <Image
                  src={"/homeicons/invoice.png"}
                  alt={"Invoice Generation"}
                  width={150}
                  height={150}
                />
              </motion.div>
              <h3 className="text-xl md:text-2xl font-semibold">
                Invoice Generation
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Create invoices get paid by sending paylinks keep a track of
                your products, services and sales
              </p>
            </motion.div>
          </div>

          {/* ── Center card — WhatsApp Assistant ── */}
          <motion.div
            className="relative w-full p-8 bg-white shadow-xl self-center flex items-center rounded-xl my-[90px] pt-[90px] text-center"
            variants={cardVariant}
            custom={0.1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div
              className="absolute top-[-90px] w-full left-0 flex items-center justify-center"
              variants={imageVariant}
              custom={0.4}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Image
                src={"/homeicons/whatsapp.png"}
                alt={"WhatsApp Assistant"}
                width={180}
                height={180}
              />
            </motion.div>
            <div className="w-full">
              <h3 className="text-xl md:text-2xl font-semibold">
                WhatsApp Assistant for Business Automation
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage your business effortlessly with our smart WhatsApp
                Assistant. Get instant insights, track income and expenses, or
                view client info—all through a simple message. Create invoices,
                log expenses, and manage data without apps or complex systems.
                Stay in control, anytime, anywhere.
              </p>
            </div>
          </motion.div>

          {/* ── Right column: 2 stacked cards ── */}
          <div className="space-y-12 w-full flex flex-col items-center justify-between mt-20 md:m-0">
            {/* Card 3 — Financial Management */}
            <motion.div
              className="relative w-full p-12 bg-white shadow-xl rounded-xl my-[90px] pt-[90px] text-center"
              variants={cardVariant}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div
                className="absolute top-[-90px] w-full left-0 flex items-center justify-center"
                variants={imageVariant}
                custom={0.3}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <Image
                  src={"/homeicons/finance.png"}
                  alt={"Financial Management"}
                  width={150}
                  height={150}
                />
              </motion.div>
              <h3 className="text-xl md:text-2xl font-semibold">
                Financial Management
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage your Assets and liabilities get your balance sheet and
                monthly tracking of your financial growth
              </p>
            </motion.div>

            {/* Card 4 — Pay Slip Generation */}
            <motion.div
              className="relative w-full p-12 bg-white shadow-xl rounded-xl my-[90px] pt-[90px] text-center"
              variants={cardVariant}
              custom={0.15}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div
                className="absolute top-[-90px] w-full left-0 flex items-center justify-center"
                variants={imageVariant}
                custom={0.45}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <Image
                  src={"/homeicons/pay-slip.png"}
                  alt={"Pay Slip Generation"}
                  width={150}
                  height={150}
                />
              </motion.div>
              <h3 className="text-xl md:text-2xl font-semibold">
                Pay Slip Generation
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Create payslips and manage your employees track your employees
                work-hours and more
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <motion.div
        className=" bg-gradient-to-b md:bg-gradient-to-r p-8 md:p-16 my-12 md:my-20 from-primary-navy/80 via-primary-navy/80 to-white rounded-3xl relative flex flex-col md:flex-row"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <div className=" w-full md:w-[70%] ">
          <h1 className=" text-white text-2xl md:text-5xl font-medium mb-12">
            Ready? Let&apos;s start with{" "}
            <span className="font-semibold">Nigotis</span> and get 14 Days Free
            Trial
          </h1>
          <Link
            href={"/auth/signup"}
            className=" rounded-xl bg-white text-primary-navy/80 hover:text-white text-xl md:text-2xl py-2 px-4 hover:bg-primary-navy/70 border-2 duration-300 border-primary-navy/80 hover:border-white"
          >
            Get Free Trial
          </Link>
        </div>
        <div className=" w-full md:w-[30%] relative flex items-center justify-center mt-12 md:m-0">
          <Image
            width={600}
            height={600}
            alt="mobile pic"
            src={"/homeicons/mobile_pic.png"}
            className=" aspect-auto md:absolute md:-top-28 md:right-4"
          />
        </div>
      </motion.div>

    </main>
  );
}
