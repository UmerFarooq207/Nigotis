import { NextResponse } from "next/server";
import { createRefund } from "@/lib/ziina";

export async function POST(req) {
  try {
    const { paymentIntentId, amount } = await req.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "paymentIntentId is required" },
        { status: 400 }
      );
    }

    const refund = await createRefund({
      paymentIntentId,
      amount: amount ? Math.round(parseFloat(amount) * 100) : undefined,
    });

    return NextResponse.json({ success: true, refund });
  } catch (err) {
    console.error(
      "Ziina refund error:",
      err?.response?.data || err.message
    );
    return NextResponse.json(
      { error: "Failed to create refund" },
      { status: 500 }
    );
  }
}
