import { NextResponse } from "next/server";
import { createPaymentIntent } from "@/lib/ziina";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      amount,
      currency = "USD",
      message = "Nigotis Subscription",
      subscriptionData,
    } = body;

    if (!amount || isNaN(parseFloat(amount))) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Ziina requires amount in base units (fils) — multiply by 100
    // e.g. AED 20.99 → 2099
    const amountInBaseUnits = Math.round(parseFloat(amount) * 100);

    // Minimum is $2.00 = 200 cents
    if (amountInBaseUnits < 200) {
      return NextResponse.json(
        { error: "Minimum payment amount is $2.00" },
        { status: 400 }
      );
    }

    const isTest = process.env.NODE_ENV !== "production";

    // Encode subscriptionData as base64url and append to success URL
    // so we can process the subscription after Ziina redirects back
    const encodedData = subscriptionData
      ? Buffer.from(JSON.stringify(subscriptionData)).toString("base64url")
      : "";

    const successUrl = `${process.env.ZIINA_SUCCESS_URL}&ref={PAYMENT_INTENT_ID}&sub=${encodedData}`;
    const cancelUrl = `${process.env.ZIINA_CANCEL_URL}&ref={PAYMENT_INTENT_ID}`;
    const failureUrl = `${process.env.ZIINA_FAILURE_URL}&ref={PAYMENT_INTENT_ID}`;

    const paymentIntent = await createPaymentIntent({
      amountInBaseUnits,
      currencyCode: currency,
      message,
      successUrl,
      cancelUrl,
      failureUrl,
      isTest,
    });

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      redirectUrl: paymentIntent.redirect_url,
    });
  } catch (err) {
    console.error(
      "Ziina create-payment-intent error:",
      err?.response?.data || err.message
    );
    return NextResponse.json(
      { error: "Failed to create Ziina payment intent" },
      { status: 500 }
    );
  }
}
