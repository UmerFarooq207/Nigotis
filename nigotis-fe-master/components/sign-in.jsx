"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCompany } from "@/contexts/company";
import { createClientInBot } from "@/lib/chatbot";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/hooks/useUser";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Delay between each child animation
    },
  },
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};

const slideInVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

export default function SignInPage() {
  //design implemented for one input field extend as required
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAsSubAccount, setLoginAsSubAccount] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, setUser } = useUser();
  const { setCompany } = useCompany();

  const validateEmail = (value) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    // Set error state based on validation
    setIsError(value === "" || !validateEmail(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const body = {
        email,
        password,
        loginAs: loginAsSubAccount ? "sub-account" : "admin",
      };

      const res = await fetchCustom("/user/login", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const result = await res.json();

      if (result?.success) {
        toast({
          title: "Login Success",
          description: "You have successfully logged in.",
          variant: "custom",
        });
        setUser(result?.data);
        const role = result?.data?.role;
        const companyId = result?.data?.companyId;
        if (role === "super-admin") {
          router.push("/super-admin");
        } else if (role === "employee") {
          router.push("/");
        } else {
          if (companyId) {
            setCompany(companyId);
            router.push("/dashboard");
          } else if (!result?.data?.subscriptionId) {
            router.push("/pricing");
          } else {
            router.push("/dashboard/settings");
            toast({
              description: "Create company first.",
            });
          }

          if (role === "admin") {
            createClientInBot(email, password)
              .then((botClientData) => {
                if (!botClientData) return;
                setUser({
                  ...result?.data,
                  botClientId: botClientData?.id,
                  botAuthToken: botClientData?.auth_token,
                });
              })
              .catch((err) =>
                console.error("Background bot-client setup failed:", err)
              );
          }
        }
      } else {
        toast({
          variant: "destructive",
          description: result?.message,
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error during login:", error);
      toast({
        variant: "destructive",
        description: error?.message
          ? error?.message
          : "Sign in failed. Try Again",
      });
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-white"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div
        className="w-full max-w-md space-y-8"
        variants={fadeInVariants}
      >
        {/* Logo */}
        <motion.div className="flex justify-center" variants={slideInVariants}>
          <Link href={"/"}>
            <Image
              src="/portal/logo-trans.png"
              alt="Nigotis Business Management"
              width={200}
              height={60}
              priority
            />
          </Link>
        </motion.div>

        {/* Heading */}
        <motion.div variants={fadeInVariants}>
          <h3 className="text-2xl font-bold text-center pt-2">Welcome back</h3>
          <p className="opacity-90 font-light">
            One account connected to everything including Nigotis
          </p>
        </motion.div>

        <motion.form
          className="space-y-4"
          variants={containerVariants} // Apply container-level animation for stagger effect
        >
          <motion.div variants={fadeInVariants}>
            <input
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="Email"
              className={`
        w-full px-4 py-3 rounded-lg border shadow-md shadow-gray-300 
        border-gray-300 
        focus:outline-none focus:ring-1 focus:ring-navy-500 focus:border-transparent 
        peer
        ${
          isError
            ? "border-red-600 ring-1 shadow- shadow-red-200 ring-red-600"
            : " focus:ring-2 focus:ring-[#26B9B3] focus:border-transparent"
        }
      `}
              required
              data-error={isError.toString()}
            />
          </motion.div>

          <motion.div variants={fadeInVariants}>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border shadow-md shadow-gray-300 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#26B9B3] focus:border-transparent"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </motion.div>

          <motion.div className="flex items-center" variants={fadeInVariants}>
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
              value={loginAsSubAccount}
              onChange={(e) => {
                setLoginAsSubAccount(e.target.checked);
              }}
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              Login as Sub-Account
            </label>
          </motion.div>

          <motion.div variants={slideInVariants}>
            <button
              disabled={!email || !password || isLoading}
              onClick={handleSubmit}
              className="w-full py-3 min-h-14 rounded-lg text-white shadow-md shadow-gray-300 font-medium  hover:text-[#26B9B3] hover:from-white hover:to-white  duration-300 hover:border-2 hover:border-[#26B9B3] bg-gradient-to-r from-[#003B6D] to-[#26B9B3] hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <Loader2 className=" animate-spin" /> : "Login"}
            </button>
          </motion.div>
        </motion.form>

        {/* Divider */}
        <motion.div
          className="flex items-center justify-center space-x-4"
          variants={fadeInVariants}
        >
          <div className="h-px bg-gray-300 w-3/4"></div>
          <span className="text-gray-500">or</span>
          <div className="h-px bg-gray-300 w-3/4"></div>
        </motion.div>

        {/* Social Login */}
        <motion.div
          className="flex justify-between gap-5 text-sm items-center"
          variants={slideInVariants}
        >
          <button
            onClick={
              () => {
                window.location.href = "/api/auth/google";
              } // Redirect to Google Sign-In
            }
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Image src="/svg/google.svg" alt="Google" width={20} height={20} />
            <span>Sign in with Google</span>
          </button>
        </motion.div>

        {/* Sign Up Link */}
        <motion.p className="text-center" variants={fadeInVariants}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-[#26B9B3] hover:underline ">
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
