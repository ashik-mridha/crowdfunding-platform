"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, toast } from "@heroui/react";
import { Info } from "lucide-react";
import api from "@/lib/api";
import { applyApiErrors } from "@/lib/apiErrors";
import { CATEGORIES, endOfDayISO, tomorrowInputValue } from "@/lib/format";
import { FormAlert } from "@/components/auth/AuthCard";
import { SelectField, TextAreaField, TextInputField } from "@/components/forms/fields";
import { ImageUploadField } from "@/components/forms/ImageUploadField";

const number = (label) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine((v) => /^\d+$/.test(v) && Number(v) > 0, `${label} must be a whole number above 0`);

const schema = z
  .object({
    title: z.string().trim().min(5, "Title must be at least 5 characters").max(120, "Title is too long"),
    story: z.string().trim().min(30, "Tell your story in at least 30 characters").max(5000),
    category: z.enum(CATEGORIES, { error: "Choose a category" }),
    funding_goal: number("Funding goal"),
    minimum_contribution: number("Minimum contribution"),
    deadline: z
      .string()
      .min(1, "Choose a deadline")
      .refine((v) => v >= tomorrowInputValue(), "Deadline must be in the future"),
    reward_info: z.string().trim().min(3, "Describe the reward for supporters").max(500),
    image_url: z.url("Add a cover image by uploading one or pasting a URL"),
  })
  .refine((v) => Number(v.minimum_contribution) <= Number(v.funding_goal), {
    path: ["minimum_contribution"],
    message: "Minimum contribution cannot exceed the funding goal",
  });

const FIELDS = [
  "title",
  "story",
  "category",
  "funding_goal",
  "minimum_contribution",
  "deadline",
  "reward_info",
  "image_url",
];

const defaults = {
  title: "",
  story: "",
  category: undefined,
  funding_goal: "",
  minimum_contribution: "",
  deadline: "",
  reward_info: "",
  image_url: "",
};

export function AddCampaignForm() {
  const router = useRouter();
  const [formError, setFormError] = useState(null);
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: defaults });

  async function onSubmit(values) {
    setFormError(null);
    try {
      await api.post("/campaigns", {
        ...values,
        funding_goal: Number(values.funding_goal),
        minimum_contribution: Number(values.minimum_contribution),
        deadline: endOfDayISO(values.deadline),
      });
      toast.success("Campaign submitted", {
        description: "It will appear on Explore once an admin approves it.",
      });
      router.push("/dashboard/my-campaigns");
    } catch (err) {
      setFormError(applyApiErrors(err, setError, FIELDS));
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-3xl border border-divider bg-surface p-5 sm:p-8"
    >
      <div className="flex gap-3 rounded-2xl bg-accent/10 p-4 text-sm">
        <Info className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
        <p>
          New campaigns are reviewed by an admin before they go live. You can follow the status under My
          Campaigns.
        </p>
      </div>
      <FormAlert>{formError}</FormAlert>

      <TextInputField
        control={control}
        name="title"
        label="Campaign title"
        placeholder="Solar water pump for Rahim village"
      />
      <TextAreaField
        control={control}
        name="story"
        label="Your story"
        rows={7}
        placeholder="Explain the problem, who you are, and exactly how the credits will be used."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          control={control}
          name="category"
          label="Category"
          placeholder="Choose a category"
          options={CATEGORIES.map((c) => ({ id: c, label: c }))}
        />
        <TextInputField
          control={control}
          name="deadline"
          label="Deadline"
          type="date"
          description="The last day supporters can contribute."
          inputProps={{ min: tomorrowInputValue() }}
        />
        <TextInputField
          control={control}
          name="funding_goal"
          label="Funding goal (credits)"
          type="number"
          placeholder="5000"
          inputProps={{ min: 1, inputMode: "numeric" }}
        />
        <TextInputField
          control={control}
          name="minimum_contribution"
          label="Minimum contribution (credits)"
          type="number"
          placeholder="10"
          inputProps={{ min: 1, inputMode: "numeric" }}
        />
      </div>
      <TextAreaField
        control={control}
        name="reward_info"
        label="Reward for supporters"
        rows={3}
        placeholder="For example: your name on the supporters wall and monthly progress updates."
      />
      <Controller
        control={control}
        name="image_url"
        render={({ field, fieldState }) => (
          <ImageUploadField
            cover
            label="Cover image"
            value={field.value}
            onChange={field.onChange}
            fieldError={fieldState.error?.message}
          />
        )}
      />

      <Button type="submit" className="min-h-11 w-full sm:w-auto" isPending={isSubmitting}>
        Submit for approval
      </Button>
    </form>
  );
}
