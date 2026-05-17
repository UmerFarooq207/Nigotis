"use client";
import axios from "axios";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const stripeSupportedCountries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IN", name: "India" },
  { code: "PK", name: "Pakistan" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "NZ", name: "New Zealand" },
  { code: "FI", name: "Finland" },
  { code: "DK", name: "Denmark" },
  { code: "BE", name: "Belgium" },
  { code: "AT", name: "Austria" },
  { code: "CH", name: "Switzerland" },
  { code: "IE", name: "Ireland" },
  { code: "PT", name: "Portugal" },
  { code: "PL", name: "Poland" },
  { code: "CZ", name: "Czech Republic" },
  { code: "LU", name: "Luxembourg" },
  { code: "GR", name: "Greece" },
  { code: "EE", name: "Estonia" },
  { code: "LT", name: "Lithuania" },
  { code: "LV", name: "Latvia" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "HU", name: "Hungary" },
  { code: "BG", name: "Bulgaria" },
  { code: "RO", name: "Romania" },
  { code: "HR", name: "Croatia" },
  { code: "CY", name: "Cyprus" },
  { code: "MT", name: "Malta" },
  { code: "HK", name: "Hong Kong" },
  { code: "MY", name: "Malaysia" },
  { code: "TH", name: "Thailand" },
  { code: "PH", name: "Philippines" },
  { code: "VN", name: "Vietnam" },
  { code: "CL", name: "Chile" },
  { code: "AR", name: "Argentina" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  { code: "KR", name: "South Korea" },
  { code: "TW", name: "Taiwan" },
  { code: "ZA", name: "South Africa" },
  { code: "IS", name: "Iceland" },
  { code: "IL", name: "Israel" },
  { code: "TR", name: "Turkey" },
  { code: "UA", name: "Ukraine" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "EG", name: "Egypt" },
  { code: "KE", name: "Kenya" },
  { code: "NG", name: "Nigeria" },
  { code: "GH", name: "Ghana" },
];

function StripePaymentForm({ amount, onSuccess, className }) {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [cardHolderName, setCardHolderName] = useState("");
  const [email, setEmail] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const cardElement = elements?.getElement(CardNumberElement);
    try {
      if (!stripe || !cardElement) return null;
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/process-payment`,
        {
          data: { amount: Math.round(Number(amount) * 100) },
        }
      );
      console.log(data);

      const client_secret = data;

      // const { paymentIntent } = await stripe?.confirmCardPayment(

      //   client_secret,
      //   {
      //     payment_method: { card: cardElement },
      //   }
      // );
      const { paymentIntent } = await stripe?.confirmCardPayment(
        client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardHolderName || undefined,
              email: email || undefined,
              address: {
                line1: line1 || undefined,
                city: city || undefined,
                postal_code: postalCode || undefined,
                country: country || undefined,
              },
            },
          },
        }
      );

      console.log("from confirm card payment", paymentIntent?.status);

      switch (paymentIntent?.status) {
        case "canceled":
          toast({
            variant: "destructive",
            description: `Sorry, your transaction could not be processed...${paymentIntent?.status}`,
          });
          break;
        case "succeeded":
          toast({
            variant: "custom",
            description: `Your payment was successfull.`,
          });
          onSuccess(paymentIntent?.id);
          break;
        default:
          toast({
            variant: "destructive",
            description: "Please check the card details.",
          });
          break;
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const options = {
    style: {
      base: {
        color: "#fff",
        fontSize: "18px",
        "::placeholder": { color: "#cbd5e0" },
      },
      invalid: {
        color: "#ff6b6b",
      },
    },
  };

  return (
    <div
      className={`  w-full relative md:h-full mt-12 md:m-0 grid gap-6 ${className}`}
    >
      <div className="relative">
        <form onSubmit={onSubmit} className=" grid gap-6">
          {/* <CardElement /> */}
          <div
            className="text-white p-5 w-full shadow-lg relative rounded-3xl"
            style={{
              backgroundImage: `
                linear-gradient(to bottom right, rgba(0, 128, 128, 0.9), rgba(0, 51, 102, 0.9)), 
                url("/signup/logoback.png")
              `,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundBlendMode: "overlay", // <-- this is key
            }}
          >
            {/* Logos */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <img src="/visa.png" className="h-5 w-auto" />
                <img src="/mastercard.png" className="h-8 w-auto" />
              </div>
              <div className="font-bold text-xl bg-white/60 rounded-xl p-2">
                <img src="/stripe.png" className="w-16" />
              </div>
            </div>
            <label className="text-xs text-gray-200">Email</label>
            <input
              className="bg-white/20 text-white placeholder:text-gray-300 p-1.5 rounded w-full mb-3"
              placeholder="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Card Holder */}
            <label className="text-xs text-gray-200">Card Holder Name</label>
            <input
              className="bg-white/20 text-white placeholder:text-gray-300 p-1.5 rounded w-full mb-3"
              placeholder="CARD HOLDER NAME"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
            />

            <label className="text-xs text-gray-200">Address Line 1</label>
            <input
              className="bg-white/20 text-white placeholder:text-gray-300 p-1.5 rounded w-full mb-3"
              placeholder="ADDRESS LINE 1"
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
            />

            <div className=" grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-200">City</label>
                <input
                  className="bg-white/20 text-white placeholder:text-gray-300 p-1.5 rounded w-full mb-3"
                  placeholder="CITY"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-200">Postal Code</label>
                <input
                  className="bg-white/20 text-white placeholder:text-gray-300 p-1.5 rounded w-full mb-3"
                  placeholder="POSTAL CODE"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-200">Country</label>
                <select
                  className="bg-white/20 text-white placeholder:text-gray-300 p-1.5 rounded w-full mb-3"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="" className=" text-black">
                    Select country
                  </option>
                  {stripeSupportedCountries.map((c) => (
                    <option key={c.code} value={c.code} className=" text-black">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Card Number */}
            <label className="text-xs text-gray-200">Card Number</label>
            <CardNumberElement
              className="bg-white/20 p-1.5 rounded text-white mb-3"
              options={options}
            />

            {/* MM/YY and CVV */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-200">Expiry</label>
                <CardExpiryElement
                  className="bg-white/20 p-1.5 rounded text-white"
                  options={options}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-200">CVV</label>
                <CardCvcElement
                  className="bg-white/20 p-1.5 rounded text-white"
                  options={options}
                />
              </div>
            </div>
          </div>
          <Button disabled={loading} className="w-full" type="submit">
            {loading ? "Please wait..." : "Pay"}
          </Button>
        </form>
      </div>
    </div>
  );
}

const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PK}`);

export default function StripePayment({ amount, onSuccess, className }) {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm
        amount={amount}
        onSuccess={onSuccess}
        className={className}
      />
    </Elements>
  );
}
