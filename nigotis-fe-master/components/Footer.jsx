import Image from "next/image";
import Link from "next/link";
import ButtonPrimary from "./Buttons/ButtonPrimary";
import { FacebookIcon, InstagramIcon } from "lucide-react";

const footerLinks = {
  smallBusiness: {
    title: "Small Business",
    links: [
      "Features",
      "Plans & Pricing",
      "Compare Products",
      "Small Business Accounting Software",
    ],
  },
  featuresAndBenefits: {
    title: "Features & Benefits",
    links: [
      "Cloud Accounting",
      "Invoicing",
      "Accounting Reports",
      "Inventory Management",
      "Connect Your Apps",
      "Spreadsheets Alternative",
    ],
  },
  accountantsAndBookkeepers: {
    title: "Accountants & Bookkeepers",
    links: [
      "Grow Your Practice Online",
      "Nigotis Online Accountant Features",
      "Upcoming Events",
      "Helpful Resources",
    ],
  },
  learnAndSupport: {
    title: "Learn & Support",
    links: [
      "Nigotis Online Support",
      "Contact Nigotis online Support",
      "Nigotis Online FAQs",
      "Nigotis Accounting Glossary",
      "Nigotis Resources",
      "Accounting and Business Tools and Templates",
      "Make a Complaint",
    ],
  },
};

export default function Footer({ pricingsection = false }) {
  return (
    <main className=" ">
      <footer className="relative   ">
        <div className={` relative     `}>
          {/* Curved CTA Section */}

          <div
            className={`"  overflow-hidden z-30  h-[800px] grid place-items-center ${
              pricingsection && "bg-white"
            }`}
          >
            <div className=" bg-white border-t-4border-dottedborder-primary-navy w-[119vw] sm:w-[calc(115vw_-_20px)] overflow-hidden z-50 relative right-[7%] h-[400px] sm:h-[500px] rounded-[60%] sm:rounded-[75%]">
              <div className="container mx-auto px-4 py-20  sm:pt-32 sm:pb-28 space-y-5 text-center">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#003366] mb-6 mt-5 sm:mt-3">
                  See how Nigotis Online can
                  <br />
                  work for your business
                </h2>
                {/* <button
                className="bg-gradient-to-r  min-h-14 from-[#003B6D] to-[#26B9B3]   hover:text-[#26B9B3] hover:from-transparent hover:to-transparent  duration-300  hover:border hover:border-[#26B9B3] text-white px-8 py-3 rounded-lg hover:opacity-90  mb-4">
                Get Started
              </button> */}
                <ButtonPrimary
                  link={"/auth/signup"}
                  text="Get Started"
                  footer
                />

                <p className="px-4">
                  <Link
                    href={"/terms-&-conditions"}
                    className="text-[#003366] hover:underline  inline-flex items-center text-sm sm:text-base "
                  >
                    Important offers, pricing details and disclaimers
                    <svg
                      className="w-4 h-4 ml-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="bg-[#003366]   absolute  top-[490px]  pt-52 w-full z-0 text-white  pb-12">
            <div className=" mx-auto ">
              {/* Links Grid */}
              {/* <div className="grid md:grid-cols-2  px-6 md:px-8 lg:px-[80px] xl:px-[90px] lg:grid-cols-4 gap-8 mb-12">
              {Object.values(footerLinks).map((section) => (
                <div key={section.title}>
                  <h3 className="font-semibold mb-4">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link}>
                        <Link target="_blank" href="#" className="text-gray-300 hover:text-white transition-colors">
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div> */}

              {/* Sitemap and Social */}
              <div className="border-t border-b border-gray-50 px-6 md:px-8 lg:px-[80px] xl:px-[90px] py-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <Link target="_blank" href="/" className="text-gray-300 hover:text-white">
                  Nigotis
                </Link>
                <div className="flex space-x-6">
                  <Link target="_blank" href="https://www.facebook.com/share/1FJcikzvp5" className="text-gray-300 hover:text-white">
                  <FacebookIcon />
                  </Link>
                     <Link target="_blank" href="https://www.instagram.com/nigotis.ai" className="text-gray-300 hover:text-white">
                  <InstagramIcon />
                  </Link>

                  {/* <Link target="_blank" href="#" className="text-gray-300 hover:text-white">
                    <Image
                      src="/socials/twitter.png"
                      alt="Twitter"
                      width={24}
                      height={24}
                    />
                  </Link> */}
                  {/* <Link target="_blank" href="#" className="text-gray-300 hover:text-white">
                    <Image
                      src="/socials/youtube.png"
                      alt="YouTube"
                      width={30}
                      height={30}
                    />
                  </Link> */}
                  {/* <Link target="_blank" href="#" className="text-gray-300 hover:text-white">
                    <Image
                      src="/socials/linkedin.png"
                      alt="LinkedIn"
                      width={24}
                      height={24}
                    />
                  </Link> */}
                </div>
              </div>

              {/* Bottom Section */}
              <div className="pt-12 grid md:flex px-6 md:px-8 lg:px-[80px] xl:px-[90px]  justify-between gap-8 ">
                <div>
                  <Image
                    src="/portal/footer-logo.png"
                    alt="Nigotis"
                    width={100}
                    height={40}
                    className="mb-4"
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-gray-300">
                    © 2025 Nigotis a project of{" "}
                    <a
                      href={"https://www.raqqamiyya.com"}
                      className="text-gray-300 hover:text-white"
                      target="_blank"
                    >
                      Raqqamiyya
                    </a>{" "}
                    All rights reserved.
                  </p>
                  <p className="text-sm text-gray-300">
                    Terms and conditions, features, support, pricing, and
                    service options subject to change without notice.
                  </p>
                  <p className="text-sm text-gray-300">
                    By accessing and using this page you agree to the Terms and
                    Conditions.
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <Link
                      href="/terms-&-conditions"
                      className="text-gray-300 hover:text-white"
                    >
                      Terms of Service
                    </Link>
                    <span className="text-gray-600">|</span>
                    <Link
                      href="/contact"
                      className="text-gray-300 hover:text-white"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm ">
                  <Link
                    href="/terms-&-conditions/legal"
                    className="text-gray-300 hover:text-white"
                  >
                    Legal
                  </Link>
                  <span className="text-gray-600">|</span>
                  <Link
                    href="/terms-&-conditions/privacy"
                    className="text-gray-300 hover:text-white"
                  >
                    Privacy
                  </Link>
                  <span className="text-gray-600">|</span>
                  <Link
                    href="/terms-&-conditions/security"
                    className="text-gray-300 hover:text-white"
                  >
                    Security
                  </Link>
                  <span className="text-gray-600">|</span>
                  <Link
                    href="/terms-&-conditions/compliance"
                    className="text-gray-300 hover:text-white"
                  >
                    Compliance
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
