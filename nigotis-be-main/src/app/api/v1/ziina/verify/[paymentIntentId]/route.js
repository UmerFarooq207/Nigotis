import { NextResponse } from "next/server";
import { getPaymentIntent } from "@/lib/ziina";

export async function GET(req, { params }) {
  try {
    const { paymentIntentId } = params;
    const paymentIntent = await getPaymentIntent(paymentIntentId);

    // paymentIntent.status options:
    // 'requires_payment_instrument' | 'pending' | 'requires_user_action' | 'completed' | 'failed' | 'canceled'

    if (paymentIntent.status === "completed") {
      return NextResponse.json({
        success: true,
        status: "completed",
        paymentIntent,
      });
    }

    return NextResponse.json({
      success: false,
      status: paymentIntent.status,
      paymentIntent,
    });
  } catch (err) {
    console.error(
      "Ziina verify error:",
      err?.response?.data || err.message
    );
    return NextResponse.json(
      { error: "Failed to verify payment intent" },
      { status: 500 }
    );
  }
}
