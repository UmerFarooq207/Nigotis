"use client";

import Image from "next/image";
import Link from "next/link";
import MobileSidebar from "./MobileSidebar";
import { usePathname } from "next/navigation";
import ButtonSecondary from "./Buttons/ButtonSecondary";
import useUser from "@/hooks/useUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutBtn from "./Utils/LogoutBtn";
import { ChevronDown } from "lucide-react";

const ProductsDropdown = () => (
  <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg py-2 mt-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
    <Link href="/product1" className="block px-4 py-2 hover:bg-gray-50">
      Product 1
    </Link>
    <Link href="/product2" className="block px-4 py-2 hover:bg-gray-50">
      Product 2
    </Link>
    <Link href="/product3" className="block px-4 py-2 hover:bg-gray-50">
      Product 3
    </Link>
  </div>
);

const CompanyDropdown = () => (
  <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg py-2 mt-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
    <Link href="/about" className="block px-4 py-2 hover:bg-gray-50">
      About Us
    </Link>
    <Link href="/careers" className="block px-4 py-2 hover:bg-gray-50">
      Careers
    </Link>
    <Link href="/contact" className="block px-4 py-2 hover:bg-gray-50">
      Contact
    </Link>
  </div>
);

export default function Navbar() {
  const path = usePathname();
  const isthisCurrentpath = (pathname) => path == pathname;
  const { user } = useUser();

  return (
    <nav
      className={`fixed w-full  z-[70] transition-all px-4 md:px-8 lg:px-[70px] xl:px-20 2xl:px-24 duration-300 backdrop-blur-lg`}
    >
      <div className="container mx-auto ">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 w-[90px] aspect-auto md:w-[120px]">
            <Image
              src="/portal/logo-trans.png"
              alt="Nigotis"
              width={120}
              height={40}
              priority
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Products Dropdown */}
            {/* <div className="relative group">
              <button className="flex items-center space-x-1 text-black hover:text-[#26B9B3]  hover:underline  hover:underline-offset-2  transition-all duration-300">
                <span>Products</span>
                <svg
                  className="w-4 h-4"
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
              </button>
              <ProductsDropdown />
            </div> */}

            <Link
              href="/pricing"
              className={`${
                isthisCurrentpath("/pricing") ? " text-[#26B9B3]" : "text-black"
              }  hover:text-[#26B9B3]  hover:underline  hover:underline-offset-2  transition-all duration-300`}
            >
              Pricing
            </Link>

            <Link
              href="/features"
              className={`${
                isthisCurrentpath("/features")
                  ? " text-[#26B9B3]"
                  : "text-black"
              }  hover:text-[#26B9B3]  hover:underline  hover:underline-offset-2  transition-all duration-300`}
            >
              Features
            </Link>

            {/* <Link
              href="/resources"
              className={`${
                isthisCurrentpath("/resources")
                  ? " text-[#26B9B3]"
                  : "text-black"
              }  hover:text-[#26B9B3]  hover:underline  hover:underline-offset-2  transition-all duration-300`}
            >
              Resources
            </Link> */}

            <Link
              href="/careers"
              className={`${
                isthisCurrentpath("/careers") ? " text-[#26B9B3]" : "text-black"
              }  hover:text-[#26B9B3]  hover:underline  hover:underline-offset-2  transition-all duration-300`}
            >
              Careers
            </Link>
            <Link
              href="/contact"
              className={`${
                isthisCurrentpath("/contact") ? " text-[#26B9B3]" : "text-black"
              }  hover:text-[#26B9B3]  hover:underline  hover:underline-offset-2  transition-all duration-300`}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className={`${
                isthisCurrentpath("/about") ? " text-[#26B9B3]" : "text-black"
              }  hover:text-[#26B9B3]  hover:underline  hover:underline-offset-2  transition-all duration-300`}
            >
              About
            </Link>

            {/* Company Dropdown */}
            {/* <div className="relative group">
              <button className="flex items-center space-x-1 text-black hover:text-[#26B9B3]  hover:underline  hover:underline-offset-2  transition-all duration-300">
                <span>Company</span>
                <svg
                  className="w-4 h-4"
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
              </button>
              <CompanyDropdown />
            </div> */}
          </div>

          {/* Sign Up Button */}
          {/* <Link
            href="/signup"
            className="hidden lg:inline-block border-2 hover:bg-gradient-to-r from-[#003B6D] to-[#26B9B3] border-[#26B9B3] text-[#26B9B3] px-6 py-2 rounded-lg hover:bg-[#26B9B3] hover:text-white transition-colors"
          >
            Sign up
          </Link> */}
          {/* <Link
            href="/signup"
            className="hidden lg:inline-block px-[2px] py-[2px] rounded-lg bg-gradient-to-r hover:border-none  min-w-[120px] from-[#003B6D] to-[#008080]"
          >
            <div className="bg-[#ffffff] hover:bg-gradient-to-r from-[#003366] hover:border-none  to-[#008080] rounded-md border-2 border-transparent font-semibold text-[#008080] px-6 py-2 hover:text-white transition-colors">
              Sign up
            </div>
          </Link> */}
          {user ? (
            <div className=" hidden lg:flex py-2 px-4 overflow-hidden rounded-lg  bg-gradient items-center justify-between gap-2">
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
           <div className=" flex gap-4">
            <span className=" hidden lg:inline-block">
              <ButtonSecondary text="Login" link="/auth/signin" />
            </span>
            <span className=" hidden lg:inline-block">
              <ButtonSecondary primary text="Sign up" link="/auth/signup" />
            </span>
            </div>
          )}

          {/* Mobile Sidebar */}
          <MobileSidebar />
        </div>
      </div>
    </nav>
  );
}
