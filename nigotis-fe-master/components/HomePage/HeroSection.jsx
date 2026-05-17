"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ButtonPrimary from "../Buttons/ButtonPrimary";

export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden pt-28 lg:pt-32 px-4 lg:px-[70px] xl:px-20 2xl:px-24"
      style={{
        background:
          "linear-gradient(to bottom right, #245985 -40%, #ffffff 45%, #245985 105%)",
      }}
    >
      {/* ── Decorative concentric rings (non-interactive, behind content) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 z-0"
      >
        {[10, 30, 50, 70, 90, 110].map((size, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white/15"
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

      {/* ── Main two-column grid ── */}
      <div
        className="
          relative z-10 container mx-auto
          grid grid-cols-1 lg:grid-cols-2
          gap-4 lg:gap-12
          lg:min-h-[calc(100vh-80px)]
          items-end
        "
      >
        {/* ── LEFT: Text content — vertically centred on desktop ── */}
        <div className="flex flex-col gap-6 lg:gap-7 max-w-xl pb-4 lg:pb-20 self-center">

          {/* Eyebrow */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#003B6D]/10 border border-[#003B6D]/25 backdrop-blur-md self-start"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <span className="w-2 h-2 rounded-full bg-[#26B9B3] animate-pulse" />
            <span className="text-[#003B6D] font-bold tracking-widest text-xs md:text-sm uppercase">
              Business Accounting &amp; Automation Software
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-4xl sm:text-5xl xl:text-[3.4rem] font-extrabold leading-[1.1] text-gray-900 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
          >
            Run your business{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003B6D] to-[#26B9B3]">
              from WhatsApp
            </span>{" "}
            with AI assistant
          </motion.h1>

          {/* Sub-heading */}
          <motion.p
            className="text-base md:text-lg text-gray-600 leading-relaxed max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
          >
            The easiest way for businesses to manage orders, customers,
            invoices, payments, and daily tasks — all in one place.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.32 }}
          >
            <ButtonPrimary bggray text="Start Free Trial" link="/auth/signup" />
          </motion.div>

          {/* Feature pills */}
          <motion.div
            className="flex flex-wrap gap-3 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.75, delay: 0.48 }}
          >
            {[
              "✓ Orders & Invoices",
              "✓ Customer Management",
              "✓ AI-Powered Insights",
              "✓ No Accountant Needed",
            ].map((pill) => (
              <span
                key={pill}
                className="text-xs sm:text-sm font-medium text-[#003B6D] bg-[#003B6D]/8 border border-[#003B6D]/20 px-3 py-1.5 rounded-full whitespace-nowrap"
              >
                {pill}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT: Image flush with section bottom ── */}
        <motion.div
          className="relative flex items-end justify-center w-full self-end"
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.18 }}
        >
          {/* Floating graph — top-left */}
          <motion.div
            className="absolute top-8 left-0 sm:left-[-20px] lg:left-[-40px] z-20 drop-shadow-xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          >
            <Image
              src="/hero/graph1.png"
              width={180}
              height={120}
              alt="Sales graph"
              className="w-[110px] sm:w-[150px] md:w-[180px] h-auto rounded-xl"
            />
          </motion.div>

          {/* Floating graph — mid-right */}
          <motion.div
            className="absolute top-1/3 right-0 sm:right-[-20px] lg:right-[-40px] z-20 drop-shadow-xl"
            animate={{ y: [0, -14, 0] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
          >
            <Image
              src="/hero/graph2.png"
              width={180}
              height={120}
              alt="Orders graph"
              className="w-[110px] sm:w-[150px] md:w-[190px] h-auto rounded-xl"
            />
          </motion.div>

          {/* Main character — sits on the section floor */}
          <Image
            src="/hero/men.png"
            width={640}
            height={800}
            alt="Business owner managing business on WhatsApp"
            className="
              object-contain object-bottom
              z-10
              w-[280px] sm:w-[400px] md:w-[500px] lg:w-[560px] xl:w-[620px]
              h-auto
              block
              drop-shadow-2xl
            "
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
