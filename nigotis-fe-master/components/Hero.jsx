"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import useIsMobile from "../hooks/useIsMobile";
import ButtonPrimary from "./Buttons/ButtonPrimary";

export default function Hero() {
  const isMobile = useIsMobile();
  return (
    <div className="relative min-h-[calc(100vh_+_300px)] lg:min-h-screen bg-slate-100 px-8 lg:px-[70px] xl:px-20 2xl:px-24 overflow-hidden pt-20 lg:pt-24">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)]">
          {/* Left Column - Text Content */}
          <div className="space-y-8 lg:mt-16 relative z-30">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#003B6D]/10 border border-[#003B6D]/20 backdrop-blur-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="w-2 h-2 rounded-full bg-[#26B9B3] animate-pulse"></span>
              <span className="text-[#003B6D] font-bold tracking-widest text-xs md:text-sm uppercase">
                WhatsApp + AI for Small Business
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[1.1] text-gray-900 tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
            >
              Run orders, customers{" "}<br className="hidden sm:block" />
              and invoices from{" "}<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003B6D] to-[#26B9B3]">
                WhatsApp + AI
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              The easiest way for small businesses to manage customers, payments, invoices, and daily tasks from WhatsApp — with AI helping you stay organised and in control.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6 }}
            >
              {/* <Link
                                href="/pricing"
                                className="inline-block px-8 py-4 min-h-14  bg-gradient-to-r from-[#003B6D] to-[#26B9B3] hover:text-[#26B9B3] hover:from-white hover:to-white duration-300 hover:border-2 hover:border-[#26B9B3] text-white rounded-lg font-medium hover:opacity-90 transition-all mb-24 lg:mb-1"
                            >
                                See plans & pricing
                            </Link> */}
              <ButtonPrimary
                bggray
                text="Get Started Free"
                link="/auth/signup"
              />
            </motion.div>
          </div>

          {/* Right Column - Image with Floating Elements */}
          <div className="relative flex items-center justify-center h-full mt-32 md:mt-10">
            <motion.div
              className="relative w-full h-full max-w-[600px] mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 4 }}
            >
              {/* Container for blob and person */}
              <div className="relative w-full h-full">
                {/* Blob background */}
                <Image
                  src="/hero/blob.png"
                  alt="Background shape"
                  fill
                  className="object-contain"
                  priority
                />

                {/* Person image */}
                <motion.div
                  initial={{ opacity: 0.5, scale: 0.9, x: -70 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image
                    src={isMobile ? "/hero/combo.png" : "/hero/men.png"}
                    alt="Business professional"
                    width={500}
                    height={500}
                    className="object-contain z-10"
                    priority
                  />
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute top-[-80px] lg:top-[80px] xl:top-[40px] 2xl:top-[70px] right-0  lg:right-[-5%] z-20"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.img
                    src="/hero/sales.png"
                    alt="Sales analytics"
                    className="w-[140px] sm:w-[180px] h-auto"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>

                <motion.div
                  className="absolute top-[40%] sm:left-[-10%] z-20"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.img
                    src="/hero/order.png"
                    alt="Order statistics"
                    className="w-[140px] sm:w-[180px] h-auto"
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>

                <motion.div
                  className="absolute bottom-[-200px] sm:bottom-[-100%] lg:bottom-[5%]  right-[-80px]  lg:right-[-13%] z-20"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.2, delay: 0.7 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.img
                    src="/hero/performance.png"
                    alt="Performance dashboard"
                    className="w-[calc(120px_+_12%)] sm:w-[200px] h-auto"
                    animate={{ y: [0, -20, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.5,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
