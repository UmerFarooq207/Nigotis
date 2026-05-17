import Image from "next/image";

const TestimonialsMobile = () => {
  return <>.</>
  return (
    <section className="relative py-16">
      <HorizontalScrollCarousel />
    </section>
  );
};

const HorizontalScrollCarousel = () => {
  return (
    <div className="relative overflow-hidden">
      <div
        className="absolute z-20 left-0 top-0 h-full w-[100px] pointer-events-none"
        style={{
          background: "linear-gradient(to right, white, transparent)",
        }}
      />
      <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
        {testimonials.map((testimonial, index) => (
          <Testimonial key={index} testimonial={testimonial} />
        ))}
      </div>
      <div
        className="absolute z-20 right-0 top-0 h-full w-[100px] pointer-events-none"
        style={{
          background: "linear-gradient(to left, white, transparent)",
        }}
      />
    </div>
  );
};

const Testimonial = ({ testimonial }) => {
  return (
    <div className="flex-shrink-0 w-[80vw] px-4 snap-start">
      <div className="h-full">
        <div className="flex justify-center mb-4">
          <Image
            src={testimonial.image}
            alt={`${testimonial.name}'s profile picture`}
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <p className="text-gray-600 italic mb-4 text-center text-sm">
          {testimonial.quote}
        </p>
        <div className="text-center">
          <h4 className="font-bold text-sm">{testimonial.name}</h4>
          <p className="text-xs text-gray-500">
            {testimonial.position} @{testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsMobile;

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
