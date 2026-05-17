"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import ButtonPrimary from "../Buttons/ButtonPrimary";

export default function AllPlans() {
  const features = [
    {
      title: "Use From Any Device",
      description:
        "Access real-time financial data on any device, anytime, anywhere.",
      icon: "/pricing/device.png",
    },
    {
      title: "Free support",
      description:
        "We have experts who can help you with your account through live chat or phone",
      icon: "/pricing/freesupport.png",
    },
    {
      title: "Secure cloud storage",
      description:
        "Nigotis security keeps your data stored safely in the cloud.",
      icon: "/pricing/cloud.png",
    },
    {
      title: "Accountant access",
      description:
        "Invite your accountant or bookkeeper to share your books.",
      icon: "/pricing/accountant.png",
    },
    {
      title: "Reports and dashboards",
      description: "See how your business is doing with customisable reports.",
      icon: "/pricing/report.png",
    },
    {
      title: "Unlimited invoices",
      description:
        "Send unlimited invoices and let nothing stand between you and your money.",
      icon: "/pricing/invoices.png",
    },
  ];

  const fadeInUpVariants = {
    hidden: { opacity: 0, x: 50 }, // Start faded and slightly to the right
    visible: { opacity: 1, x: 0, transition: { duration: 0.9 } }, // Fade in and slide to position
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3, // Stagger delay for child elements
      },
    },
  };
  return (
    <section className="py-16 px-8 md:px-24 bg-gradient-center-image">
      {/* <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
        All plans include
      </h2> */}

      <div className="max-w-7xlmx-auto">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }} // Trigger only once
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className=" relative w-full p-12 bg-white shadow-xl rounded-xl my-[90px] pt-[90px] text-center"
              variants={fadeInUpVariants}
            >
              <motion.div
                className="absolute top-[-90px] w-full left-0 flex items-center justify-center"
                variants={fadeInUpVariants}
              >
                <Image src={feature.icon} alt="" width={180} height={180} />
              </motion.div>

              <motion.h3
                className="text-xl md:text-2xl font-semibold text-primary-navy"
                variants={fadeInUpVariants}
              >
                {feature.title}
              </motion.h3>

              <motion.p
                className="text-black text-sm sm:text-base ]"
                variants={fadeInUpVariants}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* <div className="mt-20 bg-gray-100 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="bg-orange-500 text-black px-3 py-1 rounded-lg font-semibold text-sm mb-4 inline-block">
            Sale
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4">14 Days Free Trial</h2>
          <p className="text-sm sm:text-lg  text-blue-900 mb-8">
            Secure online accounting that saves you time
          </p>
          {/* <button className="bg-gradient-to-r px-8 py-3 rounded-md  min-h-14 from-[#003B6D] to-[#26B9B3]   hover:text-[#26B9B3] hover:from-transparent hover:to-transparent  duration-300  hover:border hover:border-[#26B9B3] text-white transition-colors">
            Get Started
          </button> 
          <ButtonPrimary text="Get Started" bggray />
        </div>
      </div> */}
    </section>
  );
}
