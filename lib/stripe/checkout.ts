"use server";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { getURL } from "@/lib/helpers";
import { getCustomer, insertCustomer } from "@/lib/store/customer";
import { insertCheckout } from "@/lib/store/checkout";

const CREDIT_PRICE_ID = process.env.STRIPE_CREDIT_PRICE_ID!;

export async function checkoutWithStripe(
  user: { id: string; email: string },
  quantity: number,
): Promise<string> {
  "use server";

  // try to get customer id from supabase
  let customer = await getCustomer();
  if (!customer) {
    // create customer to stripe and save to supabase
    const newCustomer = await stripe.customers.create({
      metadata: { supabaseUUID: user.id },
      email: user.email,
    });
    customer = await insertCustomer(newCustomer.id);
  }

  // create checkout params
  const params: Stripe.Checkout.SessionCreateParams = {
    customer: customer.customer_id,
    line_items: [
      {
        price: CREDIT_PRICE_ID,
        quantity: quantity,
      },
    ],
    mode: "payment",
    cancel_url: getURL("/pricing"),
    success_url: getURL("/pricing"),
  };

  // Create a checkout session in Stripe
  try {
    const session = await stripe.checkout.sessions.create(params);
    await insertCheckout(
      CREDIT_PRICE_ID,
      quantity,
      (quantity + Math.floor(quantity / 5)) * 10,
      session.id,
    );
    return session.id;
  } catch (err) {
    console.error(err);
    throw new Error("Unable to create checkout session.");
  }
}
