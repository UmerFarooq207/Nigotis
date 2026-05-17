"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import ButtonSecondary from "./Buttons/ButtonSecondary";
import useUser from "@/hooks/useUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutBtn from "./Utils/LogoutBtn";

const MenuItem = ({ href, children, delay }) => (
  <motion.li
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.3, delay }}
  >
    <Link
      href={href}
      className="block py-2 text-lg text-gray-800 hover:text-[#26B9B3] transition-colors"
    >
      {children}
    </Link>
  </motion.li>
);

const Dropdown = ({ title, items, delay }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.li
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-lg text-gray-800 hover:text-[#26B9B3] transition-colors"
      >
        {title}
        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="ml-4 mt-2 space-y-2"
          >
            {items.map((item) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  className="block py-1 text-base text-gray-600 hover:text-[#26B9B3] transition-colors"
                >
                  <span onClick={() => setIsOpen(false)}>{item.label}</span>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "100%" },
  };

  const productItems = [
    { href: "/product1", label: "Product 1" },
    { href: "/product2", label: "Product 2" },
    { href: "/product3", label: "Product 3" },
  ];

  const companyItems = [
    { href: "/about", label: "About Us" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 right-4 z-[75] p-2"
        aria-label="Toggle menu"
      >
        <motion.div
          animate={isOpen ? "open" : "closed"}
          className="w-6 h-6 flex flex-col justify-around"
        >
          <motion.span
            variants={{
              closed: { rotate: 0, y: 0 },
              open: { rotate: 44, y: 15.5 },
            }}
            className="w-full h-0.5 bg-[#26B9B3] block origin-center"
          />
          <motion.span
            variants={{
              closed: { width: "100%" },
              open: { width: 0 },
            }}
            className="w-full h-0.5 bg-[#26B9B3] block"
          />
          <motion.span
            variants={{
              closed: { rotate: 0, y: 0 },
              open: { rotate: -45, y: 0 },
            }}
            className="w-full h-0.5 bg-[#26B9B3] block origin-center"
          />
        </motion.div>
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 w-64 h-screen bg-white z-[72] overflow-y-auto shadow-lg"
          >
            <div className="p-4">
              <span onClick={() => setIsOpen(false)}>
                <Link href="/" className="block mb-8">
                  <Image
                    src="/assets/logo.png"
                    alt="Nigotis"
                    width={120}
                    height={40}
                    priority
                  />
                </Link>
              </span>
              <nav>
                <motion.ul className="space-y-4">
                  {/* <Dropdown title="Products" items={productItems} delay={0.1} /> */}
                  <MenuItem href="/pricing" delay={0.2}>
                    <span onClick={() => setIsOpen(false)}>Pricing</span>
                  </MenuItem>
                  <MenuItem href="/features" delay={0.3}>
                    <span onClick={() => setIsOpen(false)}>Features</span>
                  </MenuItem>
                  <MenuItem href="/careers" delay={0.4}>
                    <span onClick={() => setIsOpen(false)}>Careers</span>
                  </MenuItem>
                  <MenuItem href="/contact" delay={0.4}>
                    <span onClick={() => setIsOpen(false)}>Contact</span>
                  </MenuItem>
                  <MenuItem href="/about" delay={0.4}>
                    <span onClick={() => setIsOpen(false)}>About</span>
                  </MenuItem>
                  {/* <Dropdown title="Company" items={companyItems} delay={0.5} /> */}
                </motion.ul>
              </nav>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="absolute bottom-4 left-4 right-4"
            >
              {user ? (
                <div className=" flex py-2 px-4 overflow-hidden rounded-lg  bg-gradient items-center justify-between gap-2">
                  <div className=" h-full ">
                    <h1 className=" font-medium ">
                      {[
                        user?.personalInfo?.title,
                        user?.personalInfo?.firstName,
                      ].join(" ")}
                    </h1>
                  </div>
                  <DropdownMenu className=" ">
                    <DropdownMenuTrigger className=" ">
                      <ChevronDown />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Link href="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/dashboard/profile">Profile</Link>
                      </DropdownMenuItem>
                      <LogoutBtn>
                        <DropdownMenuItem className=" text-red-500 cursor-pointer">
                          Logout
                        </DropdownMenuItem>
                      </LogoutBtn>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <>
                <Link
                  href="/auth/signin"
                  className="block w-full text-center text-primary-navy  font-semibold px-6 py-2 rounded-lg border-2 border-primary-navy mb-3"
                  >  
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="block w-full text-center bg-gradient-to-r from-[#003366] to-[#008080]  font-semibold text-white px-6 py-2 rounded-lg hover:bg-[#1fa19c] transition-colors"
                >
                  Sign up
                </Link></>
              )}
            </motion.div>
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="absolute bottom-4 left-4 right-4"
            >
              <Link
                href="/signup"
                className="block w-full text-center bg-gradient-to-r from-[#003366] to-[#008080]  font-semibold text-white px-6 py-2 rounded-lg hover:bg-[#1fa19c] transition-colors"
              >
                Sign up
              </Link>
            </motion.div> */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-30 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileSidebar;
