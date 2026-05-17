const ZIINA_BASE_URL =
  process.env.ZIINA_BASE_URL || "https://api-v2.ziina.com/api";

async function ziinaFetch(path, options = {}) {
  const res = await fetch(`${ZIINA_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.ZIINA_API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error?.message || `Ziina API error: ${res.status}`
    );
  }

  return res.json();
}

/**
 * Create a Ziina Payment Intent
 * @param {number} amountInBaseUnits - integer in fils, e.g. 2099 for AED 20.99
 * @param {string} currencyCode - e.g. 'AED'
 * @param {string} message - description shown on Ziina page
 * @param {string} successUrl - full URL with {PAYMENT_INTENT_ID} placeholder
 * @param {string} cancelUrl
 * @param {string} failureUrl
 * @param {boolean} isTest - true for test mode (no real charge)
 */
export async function createPaymentIntent({
  amountInBaseUnits,
  currencyCode = "USD",
  message = "",
  successUrl,
  cancelUrl,
  failureUrl,
  isTest = false,
}) {
  return ziinaFetch("/payment_intent", {
    method: "POST",
    body: JSON.stringify({
      amount: amountInBaseUnits,
      currency_code: currencyCode,
      message,
      success_url: successUrl,
      cancel_url: cancelUrl,
      failure_url: failureUrl,
      test: isTest,
      allow_tips: false,
    }),
  });
}

/**
 * Fetch a Ziina Payment Intent by ID (to verify status)
 */
export async function getPaymentIntent(paymentIntentId) {
  return ziinaFetch(`/payment_intent/${paymentIntentId}`);
}

/**
 * Create a Refund for a completed payment intent
 */
export async function createRefund({ paymentIntentId, amountInBaseUnits }) {
  const body = { payment_intent_id: paymentIntentId };
  if (amountInBaseUnits) body.amount = amountInBaseUnits;
  return ziinaFetch("/refund", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
