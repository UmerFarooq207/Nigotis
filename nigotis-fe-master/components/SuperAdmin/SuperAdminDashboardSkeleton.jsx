"use client";

import * as React from "react";
import {
  Settings,
  Menu,
  AlignJustify,
  ChevronLeft,
  ChevronRight,
  House,
  Receipt,
  Users,
  Bell,
  ChevronDown,
  MessageCirclePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutBtn from "../Utils/LogoutBtn";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import ButtonDashboard from "@/components/Buttons/ButtonDashboard";
import { usePathname } from "next/navigation";
import useUser from "@/hooks/useUser";

const generalLinks = [
  {
    title: "Home",
    icon: House,
    variant: "ghost",
    href: "",
  },
  {
    title: "Users",
    icon: Users,
    variant: "ghost",
    href: "/users",
  },
  {
    title: "Subscription Plans",
    icon: Receipt,
    variant: "ghost",
    href: "/plans",
  },
  {
    title: "WhatsApp Requests",
    icon: MessageCirclePlus,
    variant: "ghost",
    href: "/whatsapp-requests",
  },
  //   {
  //     title: "Notifications",
  //     icon: Bell,
  //     variant: "ghost",
  //     href: "/notifications",
  //   },
  {
    title: "Settings",
    icon: Settings,
    variant: "ghost",
    href: "/settings",
  },
];

function Sidebar({ className }) {
  const pathname = usePathname();

  const { user } = useUser();

  return (
    <div className=" bg-gray-300/60 h-full  ">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/assets/logo.png"
            alt="Nigotis"
            width={120}
            height={40}
            priority
          />
        </Link>
      </div>

      <div className={cn("pb-32", className)}>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-3 ">
              {generalLinks.map((link) => (
                <ButtonDashboard
                  key={link.title}
                  variant={link.variant}
                  active={`${
                    pathname === `/super-admin${link.href}` ||
                    pathname === `/super-admin${link.href}/new`
                  }`}
                  className="w-full justify-start shadow-md"
                  asChild
                >
                  <a href={`/super-admin${link.href}`}>
                    <link.icon className="mr-2 h-4 w-4" />
                    <span className="inline-flex">{link.title}</span>
                  </a>
                </ButtonDashboard>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className=" py-2 px-4 overflow-hidden fixed bottom-1 right-1 md:left-1 w-60 rounded-lg  bg-gradient flex items-center justify-between gap-2">
        <Image
          width={40}
          height={40}
          src={"/pricing/cus2.png"}
          className=" aspect-squar rounded-full w-12"
        />
        <div className=" h-full w-32 ">
          <h1 className=" font-medium text-sm ">
            {[user?.personalInfo?.title, user?.personalInfo?.firstName].join(
              " ",
            )}
          </h1>
          <p className=" text-[11px]">{user?.email}</p>
        </div>
        <DropdownMenu className="w-12 p-0 m-0 ">
          <DropdownMenuTrigger className=" ">
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href="/super-admin/profile">Profile</Link>
            </DropdownMenuItem>
            <LogoutBtn>
              <DropdownMenuItem className=" text-red-500 cursor-pointer">
                Logout
              </DropdownMenuItem>
            </LogoutBtn>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function SuperAdminDashboardSkeleton({ children }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <div className="flex min-h-screen relative">
      {/* Desktop Sidebar */}
      <div
        className={`${
          !isMenuOpen ? "md:block md:w-64" : "md:hidden"
        } hidden fixed h-screen top-0 left-0 z-50 `}
      >
        <Sidebar className={" overflow-auto custom-scrollbar h-full"} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="md:hidden fixed z-50 bg-white top-16 left-2"
          >
            <Menu /> Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64 p-0">
          <Sidebar className={" overflow-auto custom-scrollbar h-full"} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div
        className={`${
          isMenuOpen ? "md:ml-0" : "md:ml-64"
        } flex-1 bg-gray-200/30 overflow-auto relative`}
      >
        <div
          className="fixed opacity-50 -z-20 w-full h-full"
          style={{
            backgroundImage: "url('/assets/bg2.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "150px 300px", // Adjust this size to control the zoom level
            backgroundPosition: "top left", // Optional: ensures alignment
          }}
        ></div>
        {/* header  */}
        <div className=" flex items-center gap-2 pt-6 px-6">
          <div
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            className={`${
              isMenuOpen ? "flex-row-reverse" : "flex-row"
            } hidden md:flex items-center cursor-pointer `}
          >
            {isMenuOpen ? <ChevronRight /> : <ChevronLeft />} <AlignJustify />
          </div>
          {isMenuOpen && (
            <Link href="/" className=" ">
              <Image
                src="/assets/logo_trans.png"
                alt="Nigotis"
                width={150}
                height={150}
                priority
                className="aspect-auto"
              />
            </Link>
          )}
          <h1 className=" font-medium text-lg">Super Admin</h1>
        </div>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
