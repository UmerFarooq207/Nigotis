import React from "react";
import { Button } from "../ui/button";

export default function ButtonDashboard(props) {
  return (
    <Button
      {...props}
      className={` ${props?.active === "true" ? "text-white bg-gradient-to-r from-primary-navy to-primary-teal " : " hover:text-white hover:bg-gradient-to-r from-primary-navy to-primary-teal "}
     duration-300 transition-all text-[13px]
    ${props?.className}`}
    >
      {props?.children}
    </Button>
  );
}
