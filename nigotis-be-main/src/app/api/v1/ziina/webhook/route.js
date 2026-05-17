import { NextResponse } from "next/server";
import crypto from "crypto";

const ZIINA_ALLOWED_IPS = [
  "3.29.184.186",
  "3.29.190.95",
  "20.233.47.127",
  "13.202.161.181",
];

export async function POST(req) {
  // IP Whitelist check
  const forwarded = req.headers.get("x-forwarded-for");
  const clientIp = forwarded
    ? forwarded.split(",")[0].trim()
    : "unknown";

  if (!ZIINA_ALLOWED_IPS.includes(clientIp)) {
    console.warn(`Ziina webhook: rejected request from IP ${clientIp}`);
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rawBody = await req.text();

  // HMAC Signature verification (if webhook secret is set)
  const secret = process.env.ZIINA_WEBHOOK_SECRET;
  if (secret) {
    const signature = req.headers.get("x-hmac-signature");
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSig) {
      console.warn("Ziina webhook: invalid HMAC signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  console.log("Ziina webhook received:", event.event, event.data);

  if (event.event === "payment_intent.status.updated") {
    const { id, status } = event.data;
    if (status === "completed") {
      // TODO: Mark invoice/subscription as paid in DB
      console.log(`Payment ${id} completed`);
    } else if (status === "failed") {
      console.log(`Payment ${id} failed`);
    }
  }

  if (event.event === "refund.status.updated") {
    const { id, status } = event.data;
    console.log(`Refund ${id} status: ${status}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
