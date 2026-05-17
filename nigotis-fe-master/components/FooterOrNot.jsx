"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Footer from "./Footer";

function FooterOrNot() {
  const pathname = usePathname();
  const path = pathname.split("/")[1];

  if (path === "dashboard" || path === "super-admin" || path === "auth") {
    return null;
  }

  return (
    <>
      <Footer pricingsection={pathname == "/pricing"} />
    </>
  );
}

export default FooterOrNot;
