"use client";
import { motion, useTransform, useScroll } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const Example = () => {
  return <HorizontalScrollCarousel />;
};

const HorizontalScrollCarousel = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);
return <>.</>
  return (
    <section ref={targetRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <img
          src="/pricing/fadeleft.png"
          alt="Left Fade"
          className="absolute z-20   w-[150px] md:w-[190px] lg:w-[210px] xl:w-[250px]   object-cover -left-10 sm:-left-0 h-full"
        />
        <motion.div
          style={{ x }}
          className="flex lg:w-[70%] gap-4 mx-3 sm:mx-7 md:mx-10 lg:mx-28"
        >
          {testimonials.map((card, index) => {
            return <Testimonial testimonial={card} key={index} />;
          })}
        </motion.div>
        <img
          src="/pricing/faderight.png"
          alt="Right Fade"
          className="absolute z-20   w-[150px] md:w-[190px] lg:w-[210px] xl:w-[250px]   object-cover -right-10 sm:-right-0 h-full"
        />
      </div>
    </section>
  );
};

const Testimonial = ({ testimonial }) => {
  return (
    <div className="flex-shrink-0 w-1/2 lg:w-1/3 px-4 snap-start">
      <div className="  h-full lg:w-[80%]">
        <div className="flex justify-center mb-4">
          <Image
            src={testimonial.image}
            alt=""
            width={140}
            height={140}
            className=" rounded-full"
          />
        </div>
        <p className="text-gray-600 italic mb-4 mx-auto lg:w-[90%] text-center">
          {testimonial.quote}
        </p>
        <div className="text-center">
          <h4 className="font-bold">{testimonial.name}</h4>
          <p className="text-sm text-gray-500">
            {testimonial.position} @{testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Example;
const testimonials = [
  {
    image: "/pricing/cus1.png",
    quote:
      "This is a customer quote - to Nioatis, you can take care of each task once and data goes where it needs to, from time tracking to payroll to reports.",
    name: "Name Lastname",
    position: "Position",
    company: "Youtube",
  },
  {
    image: "/pricing/cus2.png",
    quote:
      "This is a customer quote - to Nioatis, you can take care of each task once and data goes where it needs to, from time tracking to payroll to reports.",
    name: "Name Lastname",
    position: "Position",
    company: "Google",
  },
  {
    image: "/pricing/cus3.png",
    quote:
      "This is a customer quote - to Nioatis, you can take care of each task once and data goes where it needs to, from time tracking to payroll to reports.",
    name: "Name Lastname",
    position: "Position",
    company: "Microsoft",
  },
  {
    image: "/pricing/cus1.png",
    quote:
      "This is a customer quote - to Nioatis, you can take care of each task once and data goes where it needs to, from time tracking to payroll to reports.",
    name: "Name Lastname",
    position: "Position",
    company: "Apple",
  },
  {
    image: "/pricing/cus2.png",
    quote:
      "This is a customer quote - to Nioatis, you can take care of each task once and data goes where it needs to, from time tracking to payroll to reports.",
    name: "Name Lastname",
    position: "Position",
    company: "Google",
  },
  {
    image: "/pricing/cus3.png",
    quote:
      "This is a customer quote - to Nioatis, you can take care of each task once and data goes where it needs to, from time tracking to payroll to reports.",
    name: "Name Lastname",
    position: "Position",
    company: "Microsoft",
  },
];
