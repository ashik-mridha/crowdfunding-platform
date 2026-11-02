import { loadStripe } from "@stripe/stripe-js";

export const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Only created when a publishable key exists; imported solely by the checkout dialog.
export const stripePromise = STRIPE_KEY ? loadStripe(STRIPE_KEY) : null;
