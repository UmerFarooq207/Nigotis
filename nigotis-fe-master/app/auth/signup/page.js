"use client";
import SignUpPage from "@/components/sign-up";
import { motion } from "framer-motion";

export default function SignUp() {
  return (
    <main className=" lg:grid grid-cols-2">
      {/* <img  src='/assets/signupimg.png' alt='Sign In' className='  lg:w-[55%] xl:w-auto max-h-screen min-h-screen hidden lg:block'  /> */}

      <section className=" flex items-center justify-center ">
        <SignUpPage />
      </section>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="  xl:w-auto  hidden lg:block "
      >
        {/* background image div */}
        <div
          className="w-full bg-cover bg-center bg-no-repeat flex items-center justify-end h-screen"
        >
          <img src="/auth_signup.png" alt="Sign In" className=" h-screen" />
        </div>
      </motion.div>
    </main>
  );
}
