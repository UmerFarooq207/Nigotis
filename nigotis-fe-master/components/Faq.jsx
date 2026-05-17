"use client";

import Image from "next/image";
import { useState } from "react";

const faqs = [
  {
    question: "What is Nigotis, and how does it benefit my business?",
    answer:
      "Answer: Nigotis is a comprehensive business management software that offers solutions for employee management, payroll automation, inventory tracking, financial management, and AI-powered business analytics. It helps streamline operations, improve productivity, and provide real-time insights for smarter decision-making.",
  },
  {
    question: "How does Nigotis handle payroll and employee management?",
    answer:
      "Nigotis automates payroll processing by calculating salaries based on work hours, overtime, and other factors. It also tracks employee attendance, performance, and pay status, making it easy to manage HR tasks and payroll in one platform.",
  },
  {
    question: "Is Nigotis customizable to fit my specific business needs?",
    answer:
      "Absolutely. Nigotis offers customizable modules and dashboards, allowing you to tailor the software to meet your unique business requirements. You can choose which features to use and adjust settings for maximum efficiency.",
  },
  {
    question:
      "What makes Nigotis different from other business management software?",
    answer:
      "Nigotis stands out due to its AI-powered business analytics, real-time monitoring capabilities, and comprehensive approach that covers everything from payroll to inventory management. Its user-friendly design and customizability make it suitable for businesses of all sizes.",
  },
  {
    question:
      "Can Nigotis integrate with other software or eCommerce platforms?",
    answer:
      "Yes, Nigotis integrates with various third-party applications and eCommerce platforms like Shopify, eBay, BigCommerce, and more. This allows you to sync inventory, orders, and other business activities seamlessly.",
  },
];

export default function FAQSection({ pricingsection = false }) {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section
      className={` ${pricingsection && "bg-white md:bg-gradient-right-image-faq"} py-16 md:py-24 px-4 md:px-24`}
    >
      <div className="container mx-auto ">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 lg:mb-20">
          Frequently Asked Questions (FAQs)
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <span className="font-bold text-base md:text-2xl mr-2 border-b-2 border-primary-navy text-primary-navy w-full">{faq.question}</span>

                <span
                  className={`min-w-[30px] min-h-[30px] sm:min-w-[40px] sm:min-h-[40px] transition-transform ${
                    openIndex === index ? "rotate-0" : "rotate-180"
                  }`}
                >
                  <Image
                    alt="accordion-button"
                    src="/pricing/accordion-button.png"
                    width={40}
                    height={40}
                  />
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="p-4 border-t bg-gray-50">
                  <p className="text-black text-base md:text-lg">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
