"use client";

import { usePathname } from "next/navigation";
import React from "react";

function NavbarOrNot({ children }) {
  const pathname = usePathname();
  const path = pathname.split("/")[1];

  if (path === "dashboard" || path === "super-admin" || path === "auth") {
    return null;
  }

  return <>{children}</>;
}

export default NavbarOrNot;
