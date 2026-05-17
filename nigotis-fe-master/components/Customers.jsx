import Image from "next/image";
import Link from "next/link";
import ButtonPrimary from "./Buttons/ButtonPrimary";

const customers = [
  {
    image: "/homeicons/cus1.png",
    tag: "SMALL BUSINESS",
    name: "Felicia Adderley",
    business: "Physiotherapist | Medical industry, Event planner",
    story:
      "Felicia Adderley was born in the Bahamas and grew up in family of hardworking, strong business minded people. At just 15 years old, Felicia knew that she was going to open her own physiotherapist practice.",
  },
  {
    image: "/homeicons/cus2.png",
    tag: "SMALL BUSINESS",
    name: "Michael Reyes",
    business: "Furniture business, Workshop",
    story:
      "The Reyes family have always had their own businesses - ranging from sports and food to new furniture and upholstery. Industrial Month in 2018 by Michael's brother, but after he moved to Canada, Michael took over and focused on growing the business.",
  },
  {
    image: "/homeicons/cus3.png",
    tag: "SMALL BUSINESS",
    name: "Nils Peters",
    business: "Retail, Bicycles",
    story:
      "Born and raised in Germany, Nils Peters moved to South America 18 years ago and never looked back. A big reason for anchoring down in Bolivia is because of Hiplus.",
  },
  {
    image: "/homeicons/cus1.png",
    tag: "STARTUP",
    name: "Emily Robertson",
    business: "Organic Skincare | Beauty Industry",
    story:
      "Emily Robertson started her journey in her home kitchen, blending organic ingredients to create skincare products. Today, she runs a thriving beauty startup, inspiring countless individuals to embrace natural self-care.",
  },
  {
    image: "/homeicons/cus2.png",
    tag: "FAMILY BUSINESS",
    name: "Rajesh Gupta",
    business: "Textiles | Clothing Industry",
    story:
      "Rajesh Gupta inherited his family's textile business and modernized it by integrating sustainable fabrics. Under his leadership, the business expanded globally, supporting fair trade initiatives.",
  },
  {
    image: "/homeicons/cus3.png",
    tag: "ENTREPRENEURSHIP",
    name: "Linda Brown",
    business: "Art Studio | Creative Arts",
    story:
      "Linda Brown transformed her love for painting into a profitable art studio, offering workshops and art exhibits. Her studio has become a cultural hub in her community.",
  },
  {
    image: "/homeicons/cus1.png",
    tag: "SMALL BUSINESS",
    name: "Carlos Mendoza",
    business: "Coffee Roasting | Food Industry",
    story:
      "Carlos Mendoza turned his passion for coffee into a thriving roasting business. His unique blends are now a favorite in cafes across the region.",
  },
  {
    image: "/homeicons/cus2.png",
    tag: "SMALL BUSINESS",
    name: "Aya Tanaka",
    business: "Travel Agency | Tourism",
    story:
      "Aya Tanaka's travel agency specializes in curating personalized travel experiences. Her attention to detail has garnered her a loyal clientele who trust her to deliver unforgettable trips.",
  },
  {
    image: "/homeicons/cus3.png",
    tag: "INNOVATION",
    name: "Samuel Johnson",
    business: "Tech Startup | Software Development",
    story:
      "Samuel Johnson founded a tech startup focused on creating innovative solutions for small businesses. His software platform has streamlined operations for hundreds of entrepreneurs.",
  },
];

export default function Customers({ isHome = false }) {
  return <>.</>;
  return (
    <section className="py-16 md:py-24 px-8 lg:px-[70px] xl:px-20 2xl:px-24 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meet our customers around the world
          </h2>
          <p className="text-gray-600">
            Hear from our customers who share their stories about how Nigotis
            helped them along their journey.
          </p>
        </div>

        <div
          className={` ${
            isHome && "lg:grid-cols-3"
          } grid md:grid-cols-2  gap-8`}
        >
          {customers.map((customer, index) => {
            if (index > 2 && isHome) {
              return;
            }
            return (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <Image
                  width={200}
                  height={200}
                  src={customer.image}
                  alt={customer.name}
                  className={`${
                    isHome ? "w-full" : "w-96"
                  }  mx-auto rounded-3xl`}
                />

                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-[#FF9800] text-black text-sm rounded-lg font-semibold mb-4">
                    {customer.tag}
                  </span>
                  <h3 className="text-xl font-semibold mb-2">
                    {customer.name}
                  </h3>
                  <p className="text-gray-600 font-medium mb-3">
                    {customer.business}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {customer.story}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          {/* <Link
            href="/stories"
            className="inline-block px-8 py-3  hover:text-[#26B9B3] hover:from-white hover:to-white  duration-300 hover:border-2 hover:border-[#26B9B3]  bg-gradient-to-r from-[#003B6D] to-[#26B9B3] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            See all stories
          </Link> */}
          {isHome && <ButtonPrimary text="See all stories" link="/stories" />}
        </div>
      </div>
    </section>
  );
}
