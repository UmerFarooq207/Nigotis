"use client";

import * as React from "react";
import {
  UsersRound,
  Banknote,
  Receipt,
  ReceiptText,
  Wallet,
  BadgeDollarSign,
  BarChart3,
  Bell,
  HelpCircle,
  Settings,
  Menu,
  Building2,
  ChevronDown,
  Sparkles,
  AlignJustify,
  ChevronLeft,
  ChevronRight,
  Grid2x2,
  House,
  Users,
  Grip,
  Search,
  User2,
  Tickets,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LogoutBtn from "@/components/Utils/LogoutBtn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import ButtonDashboard from "@/components/Buttons/ButtonDashboard";
import { usePathname } from "next/navigation";
import useUser from "@/hooks/useUser";
import { useCompany } from "@/contexts/company";
import InputComp from "../Utils/Input";
import useIsMobile from "@/hooks/useIsMobile";
import { useNotifications } from "@/contexts/notifications";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const generalLinks = [
  {
    title: "Home",
    icon: House,
    variant: "ghost",
    href: "",
    role: "",
  },
  {
    title: "Products",
    icon: Grid2x2,
    variant: "ghost",
    href: "products",
    role: "sales",
  },
  {
    title: "Clients",
    icon: UsersRound,
    variant: "ghost",
    href: "clients",
    role: "sales",
  },
  {
    title: "Invoices",
    icon: ReceiptText,
    variant: "ghost",
    href: "invoices",
    role: "sales",
  },
  {
    title: "Employees",
    icon: UsersRound,
    variant: "ghost",
    href: "employees",
    role: "hr",
  },
  {
    title: "Income",
    icon: Banknote,
    variant: "ghost",
    href: "incomes",
    role: "finance",
  },
  {
    title: "Expenses",
    icon: Receipt,
    variant: "ghost",
    href: "expenses",
    role: "finance",
  },
  {
    title: "Assets",
    icon: Wallet,
    variant: "ghost",
    href: "assets",
    role: "finance",
  },
  {
    title: "Sub Accounts",
    icon: UsersRound,
    variant: "ghost",
    href: "sub-accounts",
    role: "admin",
  },
  {
    title: "Payrolls",
    icon: BadgeDollarSign,
    variant: "ghost",
    href: "payrolls",
    role: "hr",
  },
  {
    title: "Reports",
    icon: BarChart3,
    variant: "ghost",
    href: "reports",
    role: "finance",
  },
  {
    title: "Nigotis AI",
    icon: Sparkles,
    variant: "ghost",
    href: "nigotis-ai",
    role: "admin",
  },
  {
    title: "WhatsApp Integration",
    icon: MessageCircle,
    variant: "ghost",
    href: "whatsapp",
    role: "admin",
  },
];

const supportLinks = [
  {
    title: "Notifications",
    icon: Bell,
    variant: "ghost",
    href: "/notifications",
    role: "admin",
  },
  {
    title: "Support",
    icon: HelpCircle,
    variant: "ghost",
    href: "/support",
    role: "",
  },
  {
    title: "Subscription",
    icon: Tickets,
    variant: "ghost",
    href: "/subscription",
    role: "admin",
  },
  {
    title: "Settings",
    icon: Settings,
    variant: "ghost",
    href: "/settings",
    role: "admin",
  },
];

const dashboardLinks = [
  {
    title: "Create New Invoice",
    link: "invoices/new",
    desc: "Generate and send professional invoices quickly",
  },
  {
    title: "Add Business Expense",
    link: "expenses/new",
    desc: "Record and categorize various business expenses efficiently",
  },
  {
    title: "Register Company Asset",
    link: "assets/new",
    desc: "Log and track new company assets and equipment",
  },
  {
    title: "Record Additional Income",
    link: "incomes/new",
    desc: "Document miscellaneous income and revenue streams",
  },
  {
    title: "View Profit & Loss",
    link: "reports/profit-and-loss",
    desc: "Analyze comprehensive profit and loss statement for insights",
  },
  {
    title: "Check Balance Sheet",
    link: "reports/balance-sheet",
    desc: "Review detailed balance sheet for financial position",
  },
  {
    title: "Check Open Invoices Sheet",
    link: "reports/open-invoices",
    desc: "See over due or all open invoices.",
  },
  {
    title: "Explore Nigotis AI",
    link: "nigotis-ai",
    desc: "Leverage AI-powered analytics for strategic business decisions",
  },
  {
    title: "Add New Client",
    link: "clients/new",
    desc: "Register and manage new client information seamlessly",
  },
  {
    title: "Onboard New Employee",
    link: "employees/new",
    desc: "Streamline the process of adding new team members",
  },
  {
    title: "Setup Employee Payroll",
    link: "employees",
    desc: "Configure and customize employee payroll systems",
  },
  {
    title: "Process Payroll Payments",
    link: "payrolls/new",
    desc: "Execute and manage employee payment transactions securely",
  },
];

const searchLinks = [
  {
    title: "Create New Invoice",
    link: "invoices/new",
    desc: "Generate and send professional invoices quickly",
    seeAll: "invoices",
    edit: "invoices",
    tags: ["invoice", "billing", "create", "new"],
  },
  {
    title: "Add Business Expense",
    link: "expenses/new",
    desc: "Record and categorize various business expenses efficiently",
    seeAll: "expenses",
    edit: "expenses",
    tags: ["expense", "finance", "business", "record"],
  },
  {
    title: "Register Company Asset",
    link: "assets/new",
    desc: "Log and track new company assets and equipment",
    seeAll: "assets",
    edit: "assets",
    tags: ["asset", "equipment", "company", "register"],
  },
  {
    title: "Record Additional Income",
    link: "incomes/new",
    desc: "Document miscellaneous income and revenue streams",
    seeAll: "incomes",
    edit: "incomes",
    tags: ["income", "revenue", "finance", "record"],
  },
  {
    title: "View Profit & Loss",
    link: "reports/profit-and-loss",
    desc: "Analyze comprehensive profit and loss statement for insights",
    tags: ["report", "profit", "loss", "finance"],
  },
  {
    title: "Check Balance Sheet",
    link: "reports/balance-sheet",
    desc: "Review detailed balance sheet for financial position",
    tags: ["report", "balance", "sheet", "finance"],
  },
  {
    title: "Check Open Invoices Sheet",
    link: "reports/open-invoices",
    desc: "See overdue or all open invoices.",
    tags: ["report", "invoice", "open", "finance"],
  },
  {
    title: "Explore Nigotis AI",
    link: "nigotis-ai",
    desc: "Leverage AI-powered analytics for strategic business decisions",
    tags: ["AI", "analytics", "business", "strategy"],
  },
  {
    title: "Add New Client",
    link: "clients/new",
    desc: "Register and manage new client information seamlessly",
    seeAll: "clients",
    edit: "clients",
    tags: ["client", "customer", "manage", "add"],
  },
  {
    title: "Onboard New Employee",
    link: "employees/new",
    desc: "Streamline the process of adding new team members",
    seeAll: "employees",
    edit: "employees",
    tags: ["employee", "team", "onboard", "add"],
  },
  {
    title: "Setup Employee Payroll",
    link: "employees",
    desc: "Configure and customize employee payroll systems",
    tags: ["payroll", "salary", "employee", "setup"],
  },
  {
    title: "Process Payroll Payments",
    link: "payrolls/new",
    desc: "Execute and manage employee payment transactions securely",
    seeAll: "payrolls",
    edit: "payrolls",
    tags: ["payroll", "payment", "employee", "process"],
  },
  {
    title: "Settings",
    link: "settings",
    desc: "Manage account and system settings",
    seeAll: null,
    edit: null,
    tags: ["settings", "account", "system", "manage"],
  },
  {
    title: "Profile",
    link: "profile",
    desc: "View and edit personal profile",
    seeAll: null,
    edit: "profile",
    tags: ["profile", "personal", "view", "edit"],
  },
  {
    title: "Notifications",
    link: "notifications",
    desc: "Check recent alerts and updates",
    seeAll: null,
    edit: null,
    tags: ["notifications", "alerts", "updates", "view"],
  },
  {
    title: "Home",
    link: "dashboard/home",
    desc: "Go to dashboard homepage",
    seeAll: null,
    edit: null,
    tags: ["home", "dashboard", "main", "start"],
  },
  {
    title: "Reports (Main)",
    link: "reports",
    desc: "Access all major report types",
    seeAll: null,
    edit: null,
    tags: ["report", "main", "summary", "overview"],
  },
  {
    title: "Reports - AR Aging Summary",
    link: "reports/ar-aging-summary",
    desc: "Detailed account receivables aging summary",
    seeAll: null,
    edit: null,
    tags: ["report", "aging", "summary", "AR"],
  },
];

function Sidebar({
  className,
  user,
  newNotifications,
  setIsMenuOpen = () => { },
}) {
  let pathname = usePathname();
  pathname = pathname.split("/")[2];
  const [showGeneralBtns, setShowGeneralBtns] = React.useState(true);
  const [showSupportBtns, setShowSupportBtns] = React.useState(true);

  return (
    <div className=" bg-gray-200/40 h-full  ">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/" className="flex-shrink-0 mx-auto mt-2">
          <Image
            src="/portal/logo-trans.png"
            alt="Nigotis"
            width={120}
            height={40}
            priority
          />
        </Link>
      </div>

      <div className={cn("pb-32", className)}>
        <div className="space-y-4 py-4">
          <div className="px-3py-2 pr-2">
            <h2 className="mb-2 px-1 text-lg font-semibold flex items-center gap-3">
              {showGeneralBtns ? (
                <ChevronDown
                  onClick={() => setShowGeneralBtns(!showGeneralBtns)}
                  className=" cursor-pointer "
                />
              ) : (
                <ChevronRight
                  onClick={() => setShowGeneralBtns(!showGeneralBtns)}
                  className=" cursor-pointer "
                />
              )}{" "}
              General
            </h2>
            {showGeneralBtns && (
              <div className=" space-y-1 ">
                {generalLinks.map((link) => {
                  const isAllowed = link.role === "";
                  if (
                    link.role === user?.role ||
                    isAllowed ||
                    user?.role === "admin"
                  ) {
                    return (
                      <ButtonDashboard
                        key={link.title}
                        variant={link.variant}
                        active={`${pathname ? pathname === link.href : link.href === ""
                          }`}
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full justify-start shado-md rounded-none rounded-br-full px-6"
                        asChild
                      >
                        <Link href={`/dashboard/${link.href}`}>
                          <link.icon className="mr-2 h-3 w-3" />
                          <span className="inline-flex">{link.title}</span>
                        </Link>
                      </ButtonDashboard>
                    );
                  }
                })}
              </div>
            )}
          </div>
          <div className="px-3py-2 pr-2">
            <h2 className="mb-2 px-1 text-lg font-semibold flex items-center gap-3">
              {" "}
              {showSupportBtns ? (
                <ChevronDown
                  onClick={() => setShowSupportBtns(!showSupportBtns)}
                  className=" cursor-pointer "
                />
              ) : (
                <ChevronRight
                  onClick={() => setShowSupportBtns(!showSupportBtns)}
                  className=" cursor-pointer "
                />
              )}{" "}
              Support
            </h2>
            {showSupportBtns && (
              <div className="space-y-1">
                {supportLinks.map((link) => {
                  const isAllowed = link.role === "";
                  if (
                    link.role === user?.role ||
                    isAllowed ||
                    user?.role === "admin"
                  ) {
                    return (
                      <ButtonDashboard
                        variant={link.variant}
                        active={`${"/" + pathname === link.href}`}
                        key={link.title}
                        className="w-full justify-start shado-md rounded-none rounded-br-full px-6"
                        asChild
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link href={`/dashboard${link.href}`}>
                          <link.icon className="mr-2 h-3 w-3" />
                          <span className="inline-flex">{link.title}</span>
                          {link.title === "Notifications" &&
                            newNotifications > 0 && (
                              <span className="mx-auto p-2 w-7 h-7 min-h-2 min-w-2 rounded-full bg-orange-500 flex items-center justify-center text-sm">
                                {newNotifications > 9 ? "9+" : newNotifications}
                              </span>
                            )}
                        </Link>
                      </ButtonDashboard>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className=" py-2 px-4 overflow-hidden fixed bottom-1 right-1 md:left-1 w-60 rounded-lg  bg-gradient flex items-center justify-between gap-2">
        {user?.personalInfo?.avatar ? (
          <Image
            width={60}
            height={60}
            src={
              user?.provider !== "local"
                ? user?.personalInfo?.avatar
                : `${process.env.NEXT_PUBLIC_AWS_OBJECT_BASE_URL}${user?.personalInfo?.avatar}`
            }
            className=" aspect-square rounded-full w-12"
          />
        ) : (
          <User2 size={34} className=" " />
        )}
        <div className=" h-full w-32 ">
          <h1 className=" font-medium text-sm ">
            {[user?.personalInfo?.title, user?.personalInfo?.firstName].join(
              " "
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
    </div>
  );
}

export function DashboardSkeleton({ children }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isPCMenuOpen, setIsPCMenuOpen] = React.useState(false);
  const [isOptionsGridOpen, setIsOptionsGridOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showTrialUpgradeModal, setShowTrialUpgradeModal] = React.useState(false);
  const isMoblie = useIsMobile();

  const filteredLinks = React.useMemo(() => {
    if (!searchQuery.trim()) return [];

    return searchLinks
      .filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.link.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
      .slice(0, isMoblie ? 2 : 6);
  }, [searchQuery]);

  const { user } = useUser();
  const { company } = useCompany();
  const { newNotifications } = useNotifications();

  const isFreeTrialActive = React.useMemo(() => {
    if (!user || user?.role !== "admin") return false;

    const hasPaidSubscription = Boolean(
      user?.subscriptionId || user?.companyId?.subscriptionId
    );
    if (hasPaidSubscription || !user?.createdAt) return false;

    const createdAt = new Date(user.createdAt);
    if (Number.isNaN(createdAt.getTime())) return false;

    const trialDays = 14;
    const elapsedDays =
      (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return elapsedDays < trialDays;
  }, [user]);

  React.useEffect(() => {
    setShowTrialUpgradeModal(isFreeTrialActive);
  }, [isFreeTrialActive]);

  return (
    <div className="flex min-h-screen relative">
      <Dialog
        open={showTrialUpgradeModal}
        onOpenChange={setShowTrialUpgradeModal}
      >
        <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden [&>button]:hidden">
          <div className="relative h-[220px] sm:h-[260px] w-full overflow-hidden">
            <Image
              src="/assets/FreeTrial.PNG"
              alt="Nigotis Free Trial"
              width={900}
              height={900}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="p-6 pt-5">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl">
                Your Business Is Running. But Is It Growing?
              </DialogTitle>
              <DialogDescription>
                You’ve already started with Nigotis — now unlock the tools that actually save you time, increase profits, and automate your entire workflow.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:justify-start mt-4">
              <Button
                asChild
                className="bg-gradient-to-r from-[#003B6D] to-[#26B9B3] hover:from-[#003B6D] hover:to-[#26B9B3]"
              >
                <Link href="/pricing">Upgrade now</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowTrialUpgradeModal(false)}
              >
                Skip for now
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      {/* Desktop Sidebar */}
      <div
        className={`${!isPCMenuOpen ? "md:block md:w-64" : "md:hidden"
          } hidden fixed h-screen top-0 left-0 z-50 `}
      >
        {user && (
          <Sidebar
            newNotifications={newNotifications}
            user={user}
            className={" overflow-auto custom-scrollbar h-full"}
          />
        )}
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMenuOpen} onOpenChange={() => setIsMenuOpen(!isMenuOpen)}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="md:hidden fixed z-[100] bg-white top-6 left-2"
          >
            <Menu /> Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64 p-0">
          <Sidebar
            setIsMenuOpen={setIsMenuOpen}
            newNotifications={newNotifications}
            user={user}
            className={" overflow-auto custom-scrollbar h-full"}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      {!user && (
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#26B9B3] rounded-full animate-spin" />
        </div>
      )}
      {user && (
        <div
          className={`${isPCMenuOpen ? "md:ml-0" : "md:ml-64"
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
          <div className="h-20" />
          <div
            className={`flex items-center gap-2 py-2 z-[50] px-2 md:px-6 justify-between fixed ${isPCMenuOpen ? "w-full" : "w-full md:w-[calc(100%-256px)]"
              } top-0 bg-white`}
          >
            <div className="flex items-center gap-2">
              <div
                onClick={() => {
                  setIsPCMenuOpen(!isPCMenuOpen);
                }}
                className={`${isPCMenuOpen ? "flex-row-reverse" : "flex-row"
                  } opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto mr-10 md:m-0 flex items-center cursor-pointer `}
              >
                {!isPCMenuOpen ? <ChevronLeft /> : <ChevronRight />}{" "}
                <AlignJustify />
              </div>
              {company?.logo && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_AWS_OBJECT_BASE_URL}${company?.logo}`}
                  alt="company-logo"
                  width={70}
                  height={70}
                  priority
                  className="aspect-auto rounded-full"
                />
              )}
              <h1 className="font-medium text-lg md:text-2xl">
                {company?.displayName}
              </h1>
            </div>
            <div className="flex items-center gap-3 md:gap-6   ">
              <Link className="hidden md:block" href={"/dashboard/support"}>
                <HelpCircle className="  m-1" />
              </Link>
              <div
                onMouseEnter={() => setIsOptionsGridOpen(true)}
                onMouseLeave={() => setIsOptionsGridOpen(false)}
                className="relative group"
              >
                <Grip className=" cursor-pointer m-1" />
                <div
                  className={`${isOptionsGridOpen
                    ? "opacity-100 pointer-events-auto "
                    : "opacity-0 pointer-events-none"
                    }  duration-300 transition-opacity w-[90vw] md:w-[1000px] h-[130vw] overflow-y-scroll md:h-fit  absolute top-7 z-[100] -right-8 md:right-0`}
                >
                  <Card className=" ">
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-3 gap-2">
                        {dashboardLinks.map((link, index) => (
                          <Link
                            key={index}
                            href={`/dashboard/${link.link}`}
                            className=" hover:bg-gray-300/40 duration-200 transition-all py-2 px-4 rounded-lg"
                          >
                            <h1 className="font-semibold text-left hover:underline">
                              {link.title}
                            </h1>
                            <p className="text-sm text-gray-500  mt-1 text-left">
                              {link.desc}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div
                onMouseEnter={() => {
                  setIsSearchOpen(true);
                  setSearchQuery("");
                }}
                onMouseLeave={() => setIsSearchOpen(false)}
                className="relative group"
              >
                <Search className=" cursor-pointer m-1" />
                <div
                  className={`${isSearchOpen
                    ? "opacity-100 pointer-events-auto "
                    : "opacity-0 pointer-events-none"
                    }  duration-300 transition-opacity w-[90vw] md:w-[700px] h-fit  absolute top-7 z-[100] right-0`}
                >
                  <Card className=" ">
                    <CardContent className="p-6">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <InputComp
                          type="text"
                          placeholder="Search dashboard links..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="py-4" />
                      {searchQuery.trim() !== "" && (
                        <div className="grid gap-4 md:grid-cols-2">
                          {filteredLinks.map((item, index) => (
                            <Card key={index}>
                              <CardHeader>
                                <CardTitle>{item.title}</CardTitle>
                                <CardDescription>{item.desc}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  <Button variant="secondary" asChild>
                                    <Link href={`/dashboard/${item.link}`}>
                                      New
                                    </Link>
                                  </Button>
                                  {item?.seeAll && (
                                    <Button variant="secondary" asChild>
                                      <Link href={`/dashboard/${item?.seeAll}`}>
                                        See All
                                      </Link>
                                    </Button>
                                  )}
                                  {item?.edit && (
                                    <Button variant="secondary" asChild>
                                      <Link href={`/dashboard/${item?.edit}`}>
                                        Edit
                                      </Link>
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                      {searchQuery.trim() !== "" &&
                        filteredLinks.length === 0 && (
                          <p className="text-center text-gray-500">
                            No results found.
                          </p>
                        )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              {user?.role === "admin" && (
                <Link
                  className="hidden md:block"
                  href={"/dashboard/notifications"}
                >
                  <div className=" relative">
                    {newNotifications > 0 && (
                      <span className=" absolute -top-4 -right-2 bg-orange-500 text-white h-7 w-7 flex items-center justify-center rounded-full text-sm">
                        {newNotifications > 9 ? "9+" : newNotifications}
                      </span>
                    )}
                    <Bell className="  m-1" />
                  </div>
                </Link>
              )}
              {user?.role === "admin" && (
                <Link className="hidden md:block" href={"/dashboard/settings"}>
                  <Settings className=" m-1" />
                </Link>
              )}
            </div>
          </div>
          <main className="p-2 md:p-6 text-xs md:text-sm">{children}</main>
        </div>
      )}
    </div>
  );
}
