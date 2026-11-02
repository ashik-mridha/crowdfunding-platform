"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button, Modal, Skeleton, buttonVariants } from "@heroui/react";
import { CheckCircle2, FlaskConical, Lock } from "lucide-react";
import api from "@/lib/api";
import { stripePromise } from "@/lib/stripe";
import { useAuth } from "@/hooks/useAuth";
import { formatCredits, formatUsd } from "@/lib/format";
import { FormAlert } from "@/components/auth/AuthCard";

const errorText = (err, fallback) => err.response?.data?.error?.message || err.message || fallback;

// Tells the server to verify the payment with Stripe and add the credits (idempotent on the server).
async function confirmOnServer(paymentIntentId, refreshUser) {
  const { data } = await api.post("/payments/confirm", { paymentIntentId });
  await refreshUser();
  return data.data;
}

function PaymentSummary({ pkg }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-accent/10 p-4">
      <div>
        <p className="text-sm text-foreground/70">You are buying</p>
        <p className="font-heading text-2xl font-extrabold">{formatCredits(pkg.credits)} credits</p>
      </div>
      <p className="font-heading text-2xl font-extrabold text-accent-ink">{formatUsd(pkg.price_usd)}</p>
    </div>
  );
}

function StripeForm({ pkg, paymentIntentId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const { refreshUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/dashboard/purchase-credit` },
      redirect: "if_required",
    });
    if (stripeError) {
      setError(stripeError.message || "Your card could not be charged.");
      setBusy(false);
      return;
    }
    try {
      if (paymentIntent?.status === "succeeded")
        onSuccess(await confirmOnServer(paymentIntentId, refreshUser));
      else setError("Your payment is still processing. Check Payment History in a moment.");
    } catch (err) {
      setError(
        errorText(err, "We could not confirm the payment. You have not been charged twice; try again.")
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <PaymentSummary pkg={pkg} />
      <FormAlert>{error}</FormAlert>
      <PaymentElement />
      <Button type="submit" fullWidth className="min-h-11" isPending={busy} isDisabled={!stripe || !elements}>
        <Lock className="size-4" aria-hidden="true" />
        Pay {formatUsd(pkg.price_usd)}
      </Button>
      <p className="text-center text-xs text-foreground/70">
        Secure payment by Stripe. Test mode: use card 4242 4242 4242 4242 with any future date and CVC.
      </p>
    </form>
  );
}

function DummyForm({ pkg, paymentIntentId, onSuccess }) {
  const { refreshUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function pay() {
    setBusy(true);
    setError(null);
    try {
      onSuccess(await confirmOnServer(paymentIntentId, refreshUser));
    } catch (err) {
      setError(errorText(err, "The test payment failed."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <PaymentSummary pkg={pkg} />
      <div className="flex gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm">
        <FlaskConical className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
        <p>
          <strong>Test payment mode.</strong> This server is running without Stripe. No card is charged; the
          credits are added through the same verified, once-only flow as a real payment.
        </p>
      </div>
      <FormAlert>{error}</FormAlert>
      <Button fullWidth className="min-h-11" isPending={busy} onPress={pay}>
        Complete test payment
      </Button>
    </div>
  );
}

function Success({ result, pkg, onClose }) {
  return (
    <div className="space-y-4 py-2 text-center" role="status">
      <CheckCircle2 className="mx-auto size-14 text-success" aria-hidden="true" />
      <div>
        <h3 className="text-xl font-extrabold">
          {result.already_processed
            ? "Payment already applied"
            : `${formatCredits(pkg.credits)} credits added`}
        </h3>
        <p className="mt-1 text-foreground/70">
          Your new balance is <strong>{formatCredits(result.credits)} credits</strong>.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link href="/dashboard/explore" className={`${buttonVariants({ variant: "primary" })} min-h-11`}>
          Explore campaigns
        </Link>
        <Link
          href="/dashboard/payment-history"
          className={`${buttonVariants({ variant: "secondary" })} min-h-11`}
        >
          Payment history
        </Link>
        <Button variant="ghost" className="min-h-11" onPress={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

function Body({ pkg, onClose }) {
  const [intent, setIntent] = useState(null);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const started = useRef(-1);

  useEffect(() => {
    if (started.current === attempt) return; // StrictMode runs effects twice; create one intent per attempt
    started.current = attempt;
    api
      .post("/payments/create-intent", { packageId: pkg.id })
      .then((res) => setIntent(res.data.data))
      .catch((err) => setError(errorText(err, "Could not start the payment.")));
  }, [pkg.id, attempt]);

  if (result) return <Success result={result} pkg={pkg} onClose={onClose} />;

  if (error) {
    return (
      <div className="space-y-3">
        <FormAlert>{error}</FormAlert>
        <Button
          className="min-h-11"
          onPress={() => {
            setError(null);
            setAttempt((a) => a + 1);
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  if (!intent) {
    return (
      <div className="space-y-3" role="status" aria-label="Preparing checkout">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    );
  }

  if (intent.mode === "dummy") {
    return <DummyForm pkg={pkg} paymentIntentId={intent.paymentIntentId} onSuccess={setResult} />;
  }

  if (!stripePromise) {
    return (
      <FormAlert>
        Card payments are not available because the Stripe publishable key is not set for this site.
      </FormAlert>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: intent.clientSecret,
        appearance: { theme: "stripe", variables: { colorPrimary: "#ee7a1c" } },
      }}
    >
      <StripeForm pkg={pkg} paymentIntentId={intent.paymentIntentId} onSuccess={setResult} />
    </Elements>
  );
}

// The flow (Stripe or test payment) is decided by the server's create-intent response, never the client.
export function CheckoutDialog({ pkg, state }) {
  return (
    <Modal.Backdrop isDismissable={false}>
      <Modal.Container scroll="inside">
        <Modal.Dialog className="sm:max-w-lg">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Purchase credits</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <Body pkg={pkg} onClose={state.close} />
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
