"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api, { TOKEN_KEY } from "@/lib/api";

export const AuthContext = createContext(null);

const AUTH_PATHS = ["/auth/login", "/auth/register", "/auth/google"];

function sessionErrorMessage(err) {
  if (err.response?.status === 429) return "The server is busy right now. Please try again in a moment.";
  if (err.code === "ERR_NETWORK")
    return "We could not reach the server. Check your connection and try again.";
  return "We could not verify your session. Please try again.";
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  // true until the stored token has been checked against /auth/me; guards must wait for it.
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const login = useCallback((token, nextUser) => {
    window.localStorage.setItem(TOKEN_KEY, token);
    setUser(nextUser);
  }, []);

  const refreshUser = useCallback(async () => {
    const { data } = await api.get("/auth/me");
    setUser(data.data.user);
    return data.data.user;
  }, []);

  // An expired or revoked token anywhere logs the user out and sends them to /login.
  useEffect(() => {
    const id = api.interceptors.response.use(
      (res) => res,
      (error) => {
        const url = error.config?.url || "";
        const hadToken = Boolean(window.localStorage.getItem(TOKEN_KEY));
        if (error.response?.status === 401 && hadToken && !AUTH_PATHS.includes(url)) {
          logout();
          router.replace("/login");
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(id);
  }, [logout, router]);

  // Restores the session from the stored token. Only a 401 means "logged out"; a busy server (429), a
  // network blip or a 5xx is retried twice and then reported as sessionError so the guard can offer
  // a retry instead of bouncing a signed-in user to /login.
  useEffect(() => {
    let cancelled = false;
    async function restore() {
      const token = window.localStorage.getItem(TOKEN_KEY);
      try {
        if (!token) return;
        let failure = null;
        for (let i = 0; i < 3; i++) {
          try {
            const { data } = await api.get("/auth/me");
            if (!cancelled) {
              setUser(data.data.user);
              setSessionError(null);
            }
            failure = null;
            break;
          } catch (err) {
            failure = err;
            if (err.response?.status === 401) break;
            if (i < 2) await new Promise((resolve) => setTimeout(resolve, 1200 * (i + 1)));
            if (cancelled) return;
          }
        }
        if (!failure || cancelled) return;
        if (failure.response?.status === 401) window.localStorage.removeItem(TOKEN_KEY);
        else setSessionError({ message: sessionErrorMessage(failure) });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    restore();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retrySession = useCallback(() => {
    setSessionError(null);
    setLoading(true);
    setAttempt((a) => a + 1);
  }, []);

  const value = useMemo(
    () => ({ user, loading, sessionError, retrySession, login, logout, refreshUser }),
    [user, loading, sessionError, retrySession, login, logout, refreshUser]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
