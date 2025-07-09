import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();

  // Validate required fields
  if (!(body.amount && body.currency && body.merchant_order_id && body.return_url)) {
    return new Response('Error: Missing required fields for PaymentIntent creation', {
      status: 400,
    });
  }

  try {
    const response = await fetch('https://api-demo.airwallex.com/api/v1/pa/payment_intents/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AIRWALLEX_BEARER_TOKEN}`
      },
      body: JSON.stringify({
        request_id: `${Date.now()}`,
        amount: body.amount,
        currency: body.currency,
        merchant_order_id: body.merchant_order_id,
        return_url: body.return_url,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response('Failed to create PaymentIntent: ' + JSON.stringify(data), {
        status: response.status,
      });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    return new Response('Error creating PaymentIntent', {
      status: 500,
    });
  }
}