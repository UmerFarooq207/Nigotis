"use client";
import React from "react";
import { motion } from "framer-motion";
function SignUpImage() {
  return (
    // <img src='/assets/signupimg.png' alt='Sign In' className='  lg:w-[55%] xl:w-auto max-h-screen min-h-screen hidden lg:block' />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className=" lg:w-[55%] xl:w-auto max-h-screen min-h-screen hidden lg:block"
    >
      <img
        src="/assets/signupimg.png"
        alt="Sign Up"
        className="w-full h-full"
      />
    </motion.div>
  );
}

export default SignUpImage;
