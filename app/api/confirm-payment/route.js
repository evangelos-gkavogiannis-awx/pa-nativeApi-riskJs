import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();

  // Validate required fields
  if (!(body.payment_intent_id && body.card_number && body.expiry_month && body.expiry_year && body.cvc)) {
    return new Response('Error: Missing required fields for PaymentIntent confirmation', {
      status: 400,
    });
  }

  try {
    const response = await fetch(
      `https://api-demo.airwallex.com/api/v1/pa/payment_intents/${body.payment_intent_id}/confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.AIRWALLEX_BEARER_TOKEN}`
        },
        body: JSON.stringify({
          request_id: `${Date.now()}`,
          payment_method: {
            type: "card",
            card: {
              number: body.card_number,
              expiry_month: body.expiry_month,
              expiry_year: body.expiry_year,
              cvc: body.cvc
            }
          }
        })
      }
    );

    const data = await response.json();
    console.log(data)

    if (!response.ok) {
      return new Response('Failed to confirm PaymentIntent: ' + JSON.stringify(data), {
        status: response.status,
      });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error confirming PaymentIntent:', error);
    return new Response('Error confirming PaymentIntent', {
      status: 500,
    });
  }
}