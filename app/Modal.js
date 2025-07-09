"use client"
import AirwallexFingerprint from './components/AirwallexFingerprint';
import { getOrderSessionId } from './components/AirwallexFingerprint';

import { useRouter } from 'next/navigation'
import React from 'react'
import ReactDom from 'react-dom'
import { useState, useContext, useEffect } from 'react';
import useCart from './(store)/store'
import { loadAirwallex, redirectToCheckout } from 'airwallex-payment-elements'


export default function Modal() {
    const closeModal = useCart(state => state.setOpenModal)
    const cartItems = useCart(state => state.cart)
    const getTotalCost = useCart(state => state.getTotalCost); // Get the total cost function
    console.log(cartItems)
    const router = useRouter()

    const [showCheckout, setShowCheckout] = useState(false);
    const [checkoutData, setCheckoutData] = useState(null);
    const [paymentIntentId, setPaymentIntentId] = useState(null);

    // Log the cart items to the browser console
    console.log("Cart Items in Modal:", cartItems);
    //Log the total cost to the browser console
    console.log("Total Cost:", getTotalCost()); // Call the function to get the total cost


    //Initialize Airwallex
    useEffect(() => {
        loadAirwallex({
            env: 'demo', // Setup which Airwallex env('demo' | 'prod') to integrate with
            /*
            Set up your event target to receive the browser events message
            By setting origin: window.location.origin, you are dynamically setting the origin based on where your frontend is currently running. 
            This ensures that during development, the origin will be something like http://localhost:3000, and in production, 
            it will automatically adjust to your live domain (e.g., https://www.yourwebsite.com).
            */
            origin: window.location.origin,
        });
    }, []);

    async function checkout() {
        try {
            const payload = {
                request_id: crypto.randomUUID(),
                amount: getTotalCost(), // adapt as needed
                currency: 'GBP',
                merchant_order_id: `Merchant_Order_${crypto.randomUUID()}`,
                return_url: 'https://your-return-url.com/checkout-result'
            };

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload) // payload includes amount, currency, merchant_order_id, etc.
            });

            if (!response.ok) throw new Error('Failed to create payment intent');

            const data = await response.json();
            setPaymentIntentId(data.id);
            setCheckoutData({
                ...payload,
                ...data // you may want to merge any useful response fields
            });
            setShowCheckout(true);
        } catch (error) {
            console.error('Error creating PaymentIntent:', error);
            alert('There was an error. Check console for details.');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const device_id = getOrderSessionId();

        const paymentData = {
            payment_intent_id: paymentIntentId, // Already in your state
            card_number: form.card_number.value,
            expiry_month: form.expiry.value.split('/')[0].trim(),
            expiry_year: '20' + form.expiry.value.split('/')[1].trim(),
            cvc: form.cvc.value,
            device_id,
        };

        const response = await fetch('/api/confirm-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData),
        });

        const result = await response.json();
        // Handle result: show user success, failure, close modal, etc.
        if (response.ok) {
            alert('Payment Success!');
            // optionally close modal or redirect
            setShowCheckout(false);
            closeModal();
        } else {
            alert('Payment failed: ' + (result?.message || JSON.stringify(result)));
        }
    };

    if (showCheckout && checkoutData) {
        return (
            <div className="fixed top-0 left-0 w-screen h-screen z-50 grid place-items-center bg-black/60">
                {/* Place the AirwallexFingerprint here */}
                <AirwallexFingerprint />
                <div className="bg-white p-8 rounded shadow-lg min-w-[350px]">
                    <h2 className="text-xl mb-4">Checkout Form</h2>
                    <div>Total amount: <b>£{getTotalCost().toFixed(2)}</b></div>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-3 mt-4"
                    >
                        <input required type="text" name="card_number" placeholder="Card number" className="border p-2" />
                        <input required type="text" name="expiry" placeholder="MM/YY" className="border p-2" />
                        <input required type="text" name="cvc" placeholder="CVC" className="border p-2" />
                        <input required type="text" name="billing_address" placeholder="Billing Address" className="border p-2" />
                        <input required type="text" name="billing_postcode" placeholder="Billing Postcode" className="border p-2" />
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit Payment</button>
                    </form>
                </div>
            </div>
        );
    }

    return ReactDom.createPortal(
        <div className='fixed top-0 left-0 w-screen h-screen z-50'>
            <div onClick={closeModal} className='bg-transparent absolute  inset-0'> </div>
            <div className='flex flex-col bg-white absolute right-0 top-0 h-screen shadow-lg w-screen sm:w-96 max-w-screen gap-4'>
                <div className='flex items-center p-6 justify-between text-xl relative'>
                    <h1>Cart</h1>
                    <i onClick={closeModal} className="fa-solid cursor-pointer hover:opacity-60 fa-xmark"></i>
                    <div className='absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-slate-300 w-2/3'></div>
                </div>
                <div className='p-4 overflow-scroll flex-1 flex flex-col gap-4'>
                    {cartItems.length === 0 ? (
                        <p>There is nothing in your cart :'(</p>
                    ) : (
                        <>
                            {cartItems.map((cartItem, itemIndex) => {
                                return (
                                    <div key={itemIndex} className="flex border-l border-solid border-slate-700 px-2 flex-col gap-2">
                                        <div className='flex items-center justify-between'>
                                            <h2>
                                                {cartItem.title}
                                            </h2>
                                            <p>${cartItem.price}</p>
                                        </div>
                                        <p className='text-slate-600 text-sm'>Quantity: 1</p>
                                    </div>
                                )
                            })}
                        </>
                    )}
                </div>
                <div onClick={checkout} className='border border-solid border-slate-700 text-xl m-4 p-6 uppercase grid place-items-center hover:opacity-60 cursor-pointer'>Checkout</div>
            </div>
        </div>,
        document.getElementById('portal')
    )
}
