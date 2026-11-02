"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, buttonVariants, toast } from "@heroui/react";
import { Coins } from "lucide-react";
import api from "@/lib/api";
import { applyApiErrors } from "@/lib/apiErrors";
import { useAuth } from "@/hooks/useAuth";
import { FormAlert } from "@/components/auth/AuthCard";
import { TextAreaField, TextInputField } from "@/components/forms/fields";
import { formatCredits } from "@/lib/format";

function buildSchema(min, balance) {
  return z.object({
    contribution_amount: z
      .string()
      .min(1, "Enter an amount")
      .refine((v) => /^\d+$/.test(v), "Use whole credits only")
      .refine((v) => Number(v) >= min, `The minimum is ${formatCredits(min)} credits`)
      .refine((v) => Number(v) <= balance, `You only have ${formatCredits(balance)} credits`),
    message: z.string().max(300, "Keep your message under 300 characters"),
  });
}

export function ContributionForm({ campaign, onDone }) {
  const { user, refreshUser } = useAuth();
  const [formError, setFormError] = useState(null);
  const min = campaign.minimum_contribution;
  const schema = useMemo(() => buildSchema(min, user.credits), [min, user.credits]);
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { contribution_amount: "", message: "" } });

  const canAfford = user.credits >= min;

  async function onSubmit(values) {
    setFormError(null);
    try {
      await api.post("/contributions", {
        campaign_id: campaign._id,
        contribution_amount: Number(values.contribution_amount),
        message: values.message,
      });
      toast.success("Contribution sent", {
        description: `${values.contribution_amount} credits are reserved until ${campaign.creator_name} reviews it.`,
      });
      reset();
      await refreshUser();
      onDone?.();
    } catch (err) {
      setFormError(applyApiErrors(err, setError, ["contribution_amount", "message"]));
      refreshUser().catch(() => {});
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      <div className="flex items-center justify-between rounded-xl bg-accent/10 px-3 py-2 text-sm">
        <span className="flex items-center gap-2 text-foreground/70">
          <Coins className="size-4 text-accent-ink" aria-hidden="true" />
          Your balance
        </span>
        <strong>{formatCredits(user.credits)} credits</strong>
      </div>
      <FormAlert>{formError}</FormAlert>
      <TextInputField
        control={control}
        name="contribution_amount"
        label="Contribution amount (credits)"
        type="number"
        placeholder={String(min)}
        description={`Minimum ${formatCredits(min)} credits. Credits are held until the creator approves.`}
        inputProps={{ min, max: user.credits, inputMode: "numeric" }}
      />
      <TextAreaField
        control={control}
        name="message"
        label="Message (optional)"
        rows={2}
        placeholder="Say something encouraging to the creator"
      />
      <Button type="submit" fullWidth className="min-h-11" isPending={isSubmitting} isDisabled={!canAfford}>
        Contribute
      </Button>
      {!canAfford && (
        <p className="text-sm text-foreground/70">
          You need at least {formatCredits(min)} credits to back this campaign.{" "}
          <Link
            href="/dashboard/purchase-credit"
            className={`${buttonVariants({ variant: "ghost", size: "sm" })} min-h-11`}
          >
            Purchase credits
          </Link>
        </p>
      )}
    </form>
  );
}
