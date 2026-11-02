"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { Toast } from "@heroui/react";
import { AuthProvider } from "@/providers/AuthProvider";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute={["class", "data-theme"]} defaultTheme="light" enableSystem={false}>
      <Toast.Provider />
      <MotionConfig reducedMotion="user">
        <AuthProvider>{children}</AuthProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
