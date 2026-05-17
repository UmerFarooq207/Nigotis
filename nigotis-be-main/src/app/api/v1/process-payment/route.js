import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  typescript: false,
  apiVersion: "2022-11-15",
});

export async function POST(req) {
  const { data } = await req.json();
  const { amount } = data;
  const intentObj = {
    amount: Number(amount),
    currency: "USD",
  };

  // console.log("intent object data ", intentObj);

  try {
    const paymentIntent = await stripe.paymentIntents.create(intentObj);
    console.log("From Backend /api/v1/payment-process", paymentIntent);

    return new NextResponse(paymentIntent.client_secret, { status: 200 });
  } catch (error) {
    console.log(error);

    return new NextResponse(error, {
      status: 400,
    });
  }
}
