"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Description, Input, Label, Skeleton, Table, TextField, toast } from "@heroui/react";
import { Banknote, Hourglass, Wallet } from "lucide-react";
import api from "@/lib/api";
import { applyApiErrors } from "@/lib/apiErrors";
import { FormAlert } from "@/components/auth/AuthCard";
import { SelectField, TextInputField } from "@/components/forms/fields";
import { EmptyState, ErrorState } from "@/components/ui/EmptyState";
import { StatCard, StatGrid } from "@/components/ui/StatCard";
import { StatusChip } from "@/components/ui/StatusChip";
import { useFetch } from "@/hooks/useFetch";
import {
  CREDITS_PER_USD,
  MIN_WITHDRAWAL_CREDITS,
  PAYMENT_SYSTEMS,
  formatCredits,
  formatDate,
  formatUsd,
} from "@/lib/format";

function buildSchema(available) {
  return z.object({
    withdrawal_credit: z
      .string()
      .min(1, "Enter the credits to withdraw")
      .refine((v) => /^\d+$/.test(v), "Use whole credits only")
      .refine(
        (v) => Number(v) >= MIN_WITHDRAWAL_CREDITS,
        `The minimum is ${MIN_WITHDRAWAL_CREDITS} credits ($10)`
      )
      .refine((v) => Number(v) <= available, `You only have ${formatCredits(available)} credits available`),
    payment_system: z.enum(PAYMENT_SYSTEMS, { error: "Choose a payment system" }),
    account_number: z.string().trim().min(3, "Enter a valid account number").max(60),
  });
}

function WithdrawForm({ summary, onDone }) {
  const available = Math.max(0, summary.available_credits);
  const [formError, setFormError] = useState(null);
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(buildSchema(available)),
    defaultValues: { withdrawal_credit: "", payment_system: undefined, account_number: "" },
  });
  const typed = useWatch({ control, name: "withdrawal_credit" });

  const credits = /^\d+$/.test(typed || "") ? Number(typed) : 0;
  const dollars = credits / CREDITS_PER_USD;
  const belowMinimum = available < MIN_WITHDRAWAL_CREDITS;
  const outOfRange = Boolean(typed) && (credits < MIN_WITHDRAWAL_CREDITS || credits > available);
  const insufficient = belowMinimum || outOfRange;

  async function onSubmit(values) {
    setFormError(null);
    try {
      await api.post("/withdrawals", { ...values, withdrawal_credit: Number(values.withdrawal_credit) });
      toast.success("Withdrawal requested", {
        description: `${formatCredits(values.withdrawal_credit)} credits are reserved until an admin pays you.`,
      });
      reset();
      onDone();
    } catch (err) {
      setFormError(applyApiErrors(err, setError, ["withdrawal_credit", "payment_system", "account_number"]));
      onDone();
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-3xl border border-divider bg-surface p-5 sm:p-8"
    >
      <h2 className="text-xl font-bold">Request a withdrawal</h2>
      <FormAlert>{formError}</FormAlert>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextInputField
          control={control}
          name="withdrawal_credit"
          label="Credits to withdraw"
          type="number"
          placeholder={String(MIN_WITHDRAWAL_CREDITS)}
          description={`Minimum ${MIN_WITHDRAWAL_CREDITS} credits. ${CREDITS_PER_USD} credits = $1.`}
          inputProps={{ min: MIN_WITHDRAWAL_CREDITS, max: available, inputMode: "numeric" }}
        />
        <TextField value={dollars ? dollars.toFixed(2) : ""} isReadOnly className="w-full">
          <Label>Withdraw amount ($)</Label>
          <Input readOnly placeholder="0.00" className="min-h-11" aria-describedby="amount-hint" />
          <Description id="amount-hint">Calculated automatically.</Description>
        </TextField>
        <SelectField
          control={control}
          name="payment_system"
          label="Payment system"
          placeholder="Choose where to be paid"
          options={PAYMENT_SYSTEMS.map((p) => ({ id: p, label: p }))}
        />
        <TextInputField
          control={control}
          name="account_number"
          label="Account number"
          placeholder="Account, wallet or phone number"
        />
      </div>

      {insufficient ? (
        <p
          role="alert"
          className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          <strong>Insufficient credit.</strong>{" "}
          {belowMinimum
            ? `You need at least ${MIN_WITHDRAWAL_CREDITS} available credits (${formatUsd(MIN_WITHDRAWAL_CREDITS / CREDITS_PER_USD)}) to withdraw. You have ${formatCredits(available)}.`
            : credits < MIN_WITHDRAWAL_CREDITS
              ? `The minimum withdrawal is ${MIN_WITHDRAWAL_CREDITS} credits.`
              : `You only have ${formatCredits(available)} credits available.`}
        </p>
      ) : (
        <Button type="submit" className="min-h-11 w-full sm:w-auto" isPending={isSubmitting}>
          <Banknote className="size-4" aria-hidden="true" />
          Withdraw
        </Button>
      )}
    </form>
  );
}

function RequestsTable({ refreshKey }) {
  const { data, loading, error, refetch } = useFetch("/withdrawals/mine", { limit: 5, k: refreshKey });
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (loading && !data) return <Skeleton className="h-32 w-full rounded-2xl" />;
  if (!data?.length) {
    return (
      <EmptyState
        icon={Hourglass}
        title="No withdrawal requests yet"
        description="Your requests and their status will appear here."
      />
    );
  }
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Recent withdrawal requests" className="min-w-[560px]">
          <Table.Header>
            <Table.Column isRowHeader>Requested</Table.Column>
            <Table.Column>Credits</Table.Column>
            <Table.Column>Amount</Table.Column>
            <Table.Column>Payment system</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>
          <Table.Body>
            {data.map((w) => (
              <Table.Row key={w._id} id={w._id}>
                <Table.Cell>
                  <span className="whitespace-nowrap">{formatDate(w.withdraw_date)}</span>
                </Table.Cell>
                <Table.Cell>{formatCredits(w.withdrawal_credit)}</Table.Cell>
                <Table.Cell>{formatUsd(w.withdrawal_amount)}</Table.Cell>
                <Table.Cell>{w.payment_system}</Table.Cell>
                <Table.Cell>
                  <StatusChip status={w.status} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

export function CreatorWithdrawals() {
  const { data, loading, error, refetch } = useFetch("/withdrawals/summary", undefined, {
    liveRefresh: true,
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const onDone = () => {
    refetch();
    setRefreshKey((k) => k + 1);
  };

  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  return (
    <div className="space-y-8">
      <StatGrid>
        <StatCard
          icon={Wallet}
          label="Total raised"
          value={data && `${formatCredits(data.raised_credits)} credits`}
          loading={!data && loading}
          hint={data && `= ${formatUsd(data.raised_usd)}`}
        />
        <StatCard
          icon={Banknote}
          label="Available to withdraw"
          value={data && `${formatCredits(Math.max(0, data.available_credits))} credits`}
          loading={!data && loading}
          hint={data && `= ${formatUsd(data.available_usd)}`}
        />
        <StatCard
          icon={Hourglass}
          label="Pending requests"
          value={data && `${formatCredits(data.pending_credits)} credits`}
          loading={!data && loading}
          hint="Reserved until an admin pays"
        />
      </StatGrid>

      {data ? (
        <WithdrawForm summary={data} onDone={onDone} />
      ) : (
        <Skeleton className="h-80 w-full rounded-3xl" />
      )}

      <section aria-labelledby="requests-heading" className="space-y-3">
        <h2 id="requests-heading" className="text-xl font-bold">
          Recent requests
        </h2>
        <RequestsTable refreshKey={refreshKey} />
      </section>
    </div>
  );
}
