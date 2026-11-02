"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// false on the server and during hydration, true afterwards; avoids setState-in-effect.
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
