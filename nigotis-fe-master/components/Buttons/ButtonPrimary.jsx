import Link from "next/link";
import "./button1.css";

function ButtonPrimary({ text, link, bggray = false, footer = false }) {
  return (
    <Link href={link || "#"} className=" font-semibold z-[100]">
      <button
        className={bggray ? "btn" : footer ? "footerbtn" : "buttonvar2"}
        data={text}
      ></button>
    </Link>
  );
}

export default ButtonPrimary;

{
  /* <Link
            href={link || "#"}
            className=""
        >
            <button className="btn" data={text}></button>
        </Link> */
}
