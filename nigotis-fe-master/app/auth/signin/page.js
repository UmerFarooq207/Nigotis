"use client";
import SignInPage from "@/components/sign-in";
import { motion } from "framer-motion";

export default function SignIn() {
  return (
    <main className=" lg:grid grid-cols-2">
      {/* <img  src='/assets/signupimg.png' alt='Sign In' className='  lg:w-[55%] xl:w-auto max-h-screen min-h-screen hidden lg:block'  /> */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="  xl:w-auto  hidden lg:block "
      >
        {/* background image div */}
        <div
          className="w-full bg-cover bg-center bg-no-repeat flex items-center h-screen"
          // style={{ backgroundImage: "url(/signin/logoback.png)" }}
        >
          <img src="/auth_signin.png" alt="Sign In" className=" h-screen" />
        </div>
      </motion.div>

      <section className=" flex items-center justify-center ">
        <SignInPage />
      </section>
    </main>
  );
}
