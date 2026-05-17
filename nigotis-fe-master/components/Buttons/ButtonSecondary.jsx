import React from "react";
import Link from "next/link";
import "./button2.css";

function ButtonSecondary({ text, link, primary = false }) {
  return (
    <Link href={link || "#"} className=" font-semibold">
      <button className={`${primary ? "btn3":"btn2"}`} data={text}></button>
    </Link>
  );
}

export default ButtonSecondary;
