"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@heroui/react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useRedirectIfAuthenticated } from "@/components/auth/PrivateRoute";
import { FullPageSkeleton } from "@/components/auth/FullPageSkeleton";
import { AuthCard, FormAlert, OrDivider } from "@/components/auth/AuthCard";
import { GoogleAuthSection } from "@/components/auth/GoogleAuthSection";
import { SelectField, TextInputField } from "@/components/forms/fields";
import { ImageUploadField } from "@/components/forms/ImageUploadField";
import { PasswordStrength } from "@/components/forms/PasswordStrength";
import { applyApiErrors } from "@/lib/apiErrors";
import { PUBLIC_ROLES } from "@/lib/roles";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name is too long"),
  email: z.string().trim().min(1, "Enter your email").pipe(z.email("Enter a valid email address")),
  photo_url: z.union([z.url("Enter a valid image URL"), z.literal("")]),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password needs a lowercase letter")
    .regex(/[A-Z]/, "Password needs an uppercase letter")
    .regex(/\d/, "Password needs a number"),
  role: z.enum(["supporter", "creator"], { error: "Choose a role" }),
});

const FIELDS = ["name", "email", "photo_url", "password", "role"];

export default function RegisterPage() {
  const ready = useRedirectIfAuthenticated();
  const { login } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState(null);
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", photo_url: "", password: "", role: undefined },
  });
  const password = useWatch({ control, name: "password" });
  const name = useWatch({ control, name: "name" });

  if (!ready) return <FullPageSkeleton />;

  async function onSubmit(values) {
    setFormError(null);
    try {
      const { data } = await api.post("/auth/register", values);
      login(data.data.token, data.data.user);
      router.replace("/dashboard");
    } catch (err) {
      setFormError(applyApiErrors(err, setError, FIELDS));
    }
  }

  return (
    <AuthCard
      title="Create your Fundora account"
      subtitle="Join as a supporter or creator and get free starter credits."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-accent-ink underline-offset-2 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <GoogleAuthSection label="Sign up with Google" />
      <OrDivider />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormAlert>{formError}</FormAlert>
        <TextInputField
          control={control}
          name="name"
          label="Full name"
          placeholder="Sarah Ahmed"
          autoComplete="name"
        />
        <TextInputField
          control={control}
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Controller
          control={control}
          name="photo_url"
          render={({ field }) => (
            <ImageUploadField
              value={field.value}
              onChange={field.onChange}
              fallbackInitial={name?.[0]?.toUpperCase() || "?"}
            />
          )}
        />
        <TextInputField
          control={control}
          name="password"
          label="Password"
          type="password"
          placeholder="Create a strong password"
          autoComplete="new-password"
        />
        <PasswordStrength password={password} />
        <SelectField
          control={control}
          name="role"
          label="I want to join as a"
          placeholder="Choose a role"
          options={PUBLIC_ROLES}
        />
        <Button type="submit" fullWidth className="min-h-11" isPending={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
