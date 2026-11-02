"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button, Label, ListBox, Select } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import api from "@/lib/api";
import { getGoogleIdToken } from "@/lib/firebase";
import { PUBLIC_ROLES } from "@/lib/roles";
import { useAuth } from "@/hooks/useAuth";

// Google popup -> server verifies -> existing users sign in; new users pick a role first.
export function GoogleAuthSection({ label = "Continue with Google" }) {
  const { login } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(null); // { idToken, profile }
  const [role, setRole] = useState(null);

  function finish(data) {
    login(data.token, data.user);
    router.replace("/dashboard");
  }

  async function start() {
    setError(null);
    setBusy(true);
    try {
      const idToken = await getGoogleIdToken();
      const { data } = await api.post("/auth/google", { idToken });
      if (data.data.needsRole) setPending({ idToken, profile: data.data.profile });
      else finish(data.data);
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request")
        setError(null);
      else setError(err.response?.data?.error?.message || err.message || "Google sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function complete() {
    setError(null);
    setBusy(true);
    try {
      const { data } = await api.post("/auth/google", { idToken: pending.idToken, role });
      finish(data.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Could not finish sign-up. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (pending) {
    return (
      <div className="space-y-4 rounded-2xl border border-divider p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            {pending.profile.photo_url && <Avatar.Image src={pending.profile.photo_url} alt="" />}
            <Avatar.Fallback>{pending.profile.name[0]}</Avatar.Fallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold">Welcome, {pending.profile.name}</p>
            <p className="truncate text-sm text-foreground/70">{pending.profile.email}</p>
          </div>
        </div>
        <Select
          value={role}
          onChange={setRole}
          placeholder="Choose how you will use Fundora"
          className="w-full"
        >
          <Label>I want to join as a</Label>
          <Select.Trigger className="min-h-11">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {PUBLIC_ROLES.map((r) => (
                <ListBox.Item key={r.id} id={r.id} textValue={r.label}>
                  <div className="flex flex-col">
                    <span className="font-medium">{r.label}</span>
                    <span className="text-xs text-foreground/70">{r.description}</span>
                  </div>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <Button className="min-h-11 flex-1" isDisabled={!role} isPending={busy} onPress={complete}>
            Create my account
          </Button>
          <Button variant="ghost" className="min-h-11" onPress={() => setPending(null)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button variant="outline" fullWidth className="min-h-11" isPending={busy} onPress={start}>
        <FcGoogle className="size-5" aria-hidden="true" />
        {label}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
