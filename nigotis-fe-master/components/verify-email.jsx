"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCompany } from "@/contexts/company";
import { fetchCustom } from "@/lib/utils";
import { useNotifications } from "@/contexts/notifications";

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

export default function VerifyEmailPage({ email, userId }) {
  
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, setUser } = useUser();
  const { deleteCompany } = useCompany();
  const { deleteNotifications } = useNotifications();

  const handleLogout = async () => {
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    deleteCompany();
    deleteNotifications();
    setUser(null);

    // Then, call the backend logout endpoint

    // Finally, redirect to the login page
    router.push("/auth/signin");
    toast({
      variant: "custom",
      description: "Kindly Login Again.",
    });
  };

  const handleSubmit = async (e) => {
    if (code < 1000 || code > 999999) {
      toast({
        description: "Enter 6 digit code",
        variant: "destructive",
      });
      return;
    }
    e.preventDefault();
    setIsLoading(true);
    const response = await fetchCustom("/user/verify-code", {
      method: "PUT",
      body: JSON.stringify({
        email,
        code,
        userId
      }),
    });

    const data = await response.json();

    if (data?.success) {
      toast({
        variant: "custom",
        description: data?.message,
      });
      await handleLogout();
    } else {
      toast({
        variant: "destructive",
        description: data?.message,
      });
    }
    setIsLoading(false);
  };

  const handleResendCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await fetchCustom("/user/resend-code", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    });

    const data = await response.json();

    if (data?.success) {
      toast({
        variant: "custom",
        description: data?.message,
      });
    } else {
      toast({
        variant: "destructive",
        description: data?.message,
      });
    }
    setIsLoading(false);
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
              src="/assets/logo.png"
              alt="Nigotis Business Management"
              width={200}
              height={60}
              priority
            />
          </Link>
        </motion.div>

        {/* Heading */}
        <motion.div variants={fadeInVariants}>
          <h3 className="text-2xl font-bold text-center pt-2">
            Email Verification
          </h3>
          <p className="opacity-85 text-center text-sm font-light">
            Enter code which has been sent on your email ({email})
          </p>
        </motion.div>

        <motion.form
          className="space-y-4"
          variants={containerVariants} // Apply container-level animation for stagger effect
        >
          <motion.div variants={fadeInVariants}>
            <input
              type="number"
              min="100000"
              max="999999"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
              }}
              placeholder="Enter 6 digits code"
              className={`
        w-full px-4 py-3 rounded-lg border shadow-md shadow-gray-300 
        border-gray-300 
        focus:outline-none focus:ring-1 focus:ring-navy-500 focus:border-transparent 
        peer
      `}
              required
            />
          </motion.div>
          <div className=" w-full">
            <p
              onClick={handleResendCode}
              className=" float-right text-primary-navy mb-2 hover:underline cursor-pointer"
            >
              Resend Code?
            </p>
          </div>
          <motion.div variants={slideInVariants}>
            <button
              disabled={!code || isLoading}
              onClick={handleSubmit}
              className="w-full py-3 min-h-14 rounded-lg text-white shadow-md shadow-gray-300 font-medium  hover:text-[#26B9B3] hover:from-white hover:to-white  duration-300 hover:border-2 hover:border-[#26B9B3] bg-gradient-to-r from-[#003B6D] to-[#26B9B3] hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className=" animate-spin" />
              ) : (
                "Verify Email"
              )}
            </button>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}
