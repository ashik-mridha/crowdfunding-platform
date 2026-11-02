"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@heroui/react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useRedirectIfAuthenticated } from "@/components/auth/PrivateRoute";
import { FullPageSkeleton } from "@/components/auth/FullPageSkeleton";
import { AuthCard, FormAlert, OrDivider } from "@/components/auth/AuthCard";
import { GoogleAuthSection } from "@/components/auth/GoogleAuthSection";
import { TextInputField } from "@/components/forms/fields";
import { applyApiErrors } from "@/lib/apiErrors";

const schema = z.object({
  email: z.string().trim().min(1, "Enter your email").pipe(z.email("Enter a valid email address")),
  password: z.string().min(1, "Enter your password"),
});

export default function LoginPage() {
  const ready = useRedirectIfAuthenticated();
  const { login } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState(null);
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  if (!ready) return <FullPageSkeleton />;

  async function onSubmit(values) {
    setFormError(null);
    try {
      const { data } = await api.post("/auth/login", values);
      login(data.data.token, data.data.user);
      router.replace("/dashboard");
    } catch (err) {
      setFormError(applyApiErrors(err, setError, ["email", "password"]));
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to follow your campaigns and contributions."
      footer={
        <>
          New to Fundora?{" "}
          <Link href="/register" className="font-semibold text-accent-ink underline-offset-2 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormAlert>{formError}</FormAlert>
        <TextInputField
          control={control}
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />
        <TextInputField
          control={control}
          name="password"
          label="Password"
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
        />
        <Button type="submit" fullWidth className="min-h-11" isPending={isSubmitting}>
          Sign in
        </Button>
      </form>
      <OrDivider />
      <GoogleAuthSection label="Sign in with Google" />
    </AuthCard>
  );
}
