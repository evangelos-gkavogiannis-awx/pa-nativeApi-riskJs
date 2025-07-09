
It's a simple [Next.js](https://nextjs.org/) ecommerce demo app that integrates **natively** with the [Airwallex Payments API](https://www.airwallex.com/docs/api#/Payment_Acceptance/Payment_Intents/) for direct payment intent creation and confirmation  
Additionally, the app implements `device fingerprint` for enhanced payment fraud prevention as recommended by Airwallex ([Device Fingerprint docs](https://www.airwallex.com/docs/payments__native-api__device-fingerprinting))

## Getting Started

1. Update the `.env` file with a valid Bearer token from your Airwallex account.
2. In the project root, run `npm install` to install dependencies.
3. Run `npm run dev` to start the Next.js development server.
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## E2E Flow

1. Add products to your cart.
2. Click the cart icon to open the Cart Modal (`Modal.js`).
3. In the modal, click `Checkout`, which triggers the `checkout()` function.
4. `checkout()` calculates the total and currency, then calls the backend API (`api/checkout/route.js`) to create a payment intent using the **native Airwallex Payments API**.
5. The backend returns the payment intent ID and client secret, which are used on the frontend to collect payment details and make the payment confirmation request directly via your backend (`api/confirm-payment/route.js`).


## Device Fingerprinting (Fraud Prevention)

Device fingerprinting is implemented according to Airwallex guidelines:
- On checkout, the app injects the official Airwallex device fingerprint script with a session ID (`data-order-session-id`).
- A unique session ID is generated on the client for each checkout attempt using a UUID, and is stored in `sessionStorage` for the duration of the checkout.
- This ID is injected into both:
    - The fingerprinting script (passed as `data-order-session-id`)
    - The payment confirmation API request (`device_data.device_id`) to Airwallex for end-to-end tracking and fraud protection.

You can find the fingerprint integration in `components/AirwallexFingerprint.js`, which is loaded only during checkout.

You can use the device-id to retrieve the logs in splun

