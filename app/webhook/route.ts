import Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { finishCheckout } from "@/lib/store/checkout";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret)
      return new Response("Webhook secret not found.", { status: 400 });
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`🔔  Webhook received: ${event.type}`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(`❌ Error message: ${err.message}`);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
    return new Response("Unknown error occurred", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await finishCheckout((event.data.object as Stripe.Checkout.Session).id);
        break;
    }
  } catch (error) {
    console.log(error);
    return new Response(
      "Webhook handler failed. View your Next.js function logs.",
      {
        status: 400,
      },
    );
  }
  return new Response(JSON.stringify({ received: true }));
}
