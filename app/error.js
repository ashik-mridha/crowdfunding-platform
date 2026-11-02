"use client";

import { Button } from "@heroui/react";

export default function Error({ error, reset }) {
  return (
    <main
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-24 text-center"
      role="alert"
    >
      <p className="font-heading text-5xl font-extrabold text-danger">Oops</p>
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="max-w-md text-foreground/70">
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button onPress={reset} className="min-h-11">
        Try again
      </Button>
    </main>
  );
}
