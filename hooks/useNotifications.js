"use client";

import { useCallback, useEffect, useRef } from "react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { ACTIVITY_EVENT, useFetch } from "@/hooks/useFetch";

const POLL_MS = 45_000;

// Polls the notifications list and refetches when the tab regains focus (no websockets needed).
// When new unread items arrive the user's credits are refreshed too, since approvals and refunds change them.
export function useNotifications() {
  const { user, refreshUser } = useAuth();
  const { data, meta, loading, error, refetch } = useFetch(
    "/notifications",
    { limit: 20 },
    { enabled: Boolean(user) }
  );
  const unread = meta?.unread ?? 0;
  const lastUnread = useRef(null);

  useEffect(() => {
    if (!user) return;
    const refresh = () => document.visibilityState === "visible" && refetch();
    const timer = setInterval(refresh, POLL_MS);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [user, refetch]);

  useEffect(() => {
    if (!meta) return;
    if (lastUnread.current !== null && meta.unread > lastUnread.current) {
      refreshUser().catch(() => {});
      window.dispatchEvent(new Event(ACTIVITY_EVENT));
    }
    lastUnread.current = meta.unread;
  }, [meta, refreshUser]);

  const markRead = useCallback(
    async (id) => {
      await api.patch(`/notifications/${id}/read`);
      refetch();
    },
    [refetch]
  );

  const markAllRead = useCallback(async () => {
    await api.patch("/notifications/read-all");
    refetch();
  }, [refetch]);

  return { items: data, unread, loading, error, refetch, markRead, markAllRead };
}
