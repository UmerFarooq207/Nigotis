"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const slideInVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function SignUpPage() {
  //design implemented for one input field extend as required
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, setUser } = useUser();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    terms: false,
  });

  // useEffect(() => {
  //   if (user) {
  //     if (user?.isVerified) {
  //       if (user?.role === "super-admin") {
  //         router.push("/super-admin");
  //       } else if (user?.role === "employee") {
  //         router.push("/");
  //       } else {
  //         router.push("/dashboard");
  //       }
  //     } else {
  //       router.push(`/auth/verify-email?email=${user?.email}`);
  //     }
  //   }
  // }, [isLoading]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure the content type matches your payload
        },
        body: JSON.stringify({ ...data, role: "admin" }),
      });
      const result = await res.json();
      console.log(result);

      if (result?.success) {
        setUser(result?.data);
        toast({
          variant: "custom",
          description: result?.message,
        });
        window.location.href = `/auth/verify-email?email=${data?.email}&userId=${result?.data?._id}`;
      } else {
        toast({
          variant: "destructive",
          description:
            result?.message || "Something went wrong. Please try again later.",
        });
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-white w-[80%]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="w-full max-w-md space-y-2"
        variants={fadeInVariants}
      >
        {/* Logo */}
        <motion.div className="flex justify-center" variants={fadeInVariants}>
          <Link href="/">
            <Image
              src="/portal/logo-trans.png"
              alt="Nigotis Business Management"
              width={200}
              height={60}
              priority
            />
          </Link>
        </motion.div>
        <motion.h3
          className="text-2xl font-bold text-center py-2"
          variants={fadeInVariants}
        >
          Create an account
        </motion.h3>

        {/* Form */}
        <motion.div className="space-y-4" variants={containerVariants}>


          <motion.div variants={fadeInVariants}>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-lg border shadow-md shadow-gray-300 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#26B9B3] focus:border-transparent"
              required
            />
          </motion.div>
                    <motion.div variants={fadeInVariants}>
            <input
              name="email"
              type="email"
              value={data.email}
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
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border shadow-md shadow-gray-300 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#26B9B3] focus:border-transparent"
              required
            />
          </motion.div>

          {/* <motion.div variants={fadeInVariants}>
            <input
              type="tel"
              placeholder="Phone (recommended)"
              className="w-full px-4 py-3 rounded-lg border shadow-md shadow-gray-300 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#26B9B3] focus:border-transparent"
            />
          </motion.div> */}

          <motion.div className="flex items-center" variants={fadeInVariants}>
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
              value={data.terms}
              onChange={(e) => {
                setData((prev) => {
                  return { ...prev, terms: e.target.checked };
                });
              }}
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to{" "}
              <Link href="/terms" className="font-semibold underline">
                terms and conditions
              </Link>
            </label>
          </motion.div>

          <motion.div variants={slideInVariants}>
            <button
              disabled={
                !data.terms ||
                !data.name ||
                !data.email ||
                !data.password ||
                isLoading
              }
              onClick={handleSubmit}
              className="w-full py-3 min-h-14 rounded-lg text-white shadow-md shadow-gray-300 font-medium  hover:text-[#26B9B3] hover:from-white hover:to-white  duration-300 hover:border-2 hover:border-[#26B9B3] bg-gradient-to-r from-[#003B6D] to-[#26B9B3] hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className=" animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </motion.div>
        </motion.div>

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
          variants={fadeInVariants}
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

        {/* Sign In Link */}
        <motion.p className="text-center" variants={fadeInVariants}>
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-[#26B9B3] hover:underline">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
