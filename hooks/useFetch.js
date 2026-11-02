"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";

// GET helper. `loading` is derived (no setState in the effect body), so switching params
// shows the skeleton immediately. Call `refetch()` after a mutation.
export const ACTIVITY_EVENT = "fundora:activity";

export function useFetch(path, params, { enabled = true, liveRefresh = false } = {}) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState({ id: null, data: null, meta: null, error: null });

  const requestKey = enabled && path ? JSON.stringify([path, params ?? null]) : null;
  const requestId = requestKey ? `${requestKey}#${version}` : null;

  useEffect(() => {
    if (!requestKey) return;
    const [url, query] = JSON.parse(requestKey);
    let cancelled = false;
    api
      .get(url, { params: query ?? undefined })
      .then((res) => {
        if (!cancelled)
          setResult({ id: requestId, data: res.data.data, meta: res.data.meta ?? null, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        const message =
          err.response?.data?.error?.message ||
          (err.code === "ERR_NETWORK" ? "We could not reach the server." : "Something went wrong.");
        setResult({
          id: requestId,
          data: null,
          meta: null,
          error: { status: err.response?.status, message },
        });
      });
    return () => {
      cancelled = true;
    };
  }, [requestKey, requestId]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  // Views that depend on other people's actions (reviews, stats) refetch when new notifications arrive.
  useEffect(() => {
    if (!liveRefresh) return;
    window.addEventListener(ACTIVITY_EVENT, refetch);
    return () => window.removeEventListener(ACTIVITY_EVENT, refetch);
  }, [liveRefresh, refetch]);
  const settled = Boolean(requestId) && result.id === requestId;

  return {
    data: result.data,
    meta: result.meta,
    error: settled ? result.error : null,
    loading: Boolean(requestId) && !settled,
    refetch,
  };
}
