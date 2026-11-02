"use client";

import { useState } from "react";
import {
  Avatar,
  Button,
  Chip,
  Label,
  ListBox,
  Modal,
  Select,
  Skeleton,
  Table,
  toast,
  useOverlayState,
} from "@heroui/react";
import { Coins, UserCog, Users, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useFetch } from "@/hooks/useFetch";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, ErrorState } from "@/components/ui/EmptyState";
import { Pager } from "@/components/ui/Pager";
import { SearchField } from "@/components/ui/SearchField";
import { formatCredits } from "@/lib/format";

const ROLES = [
  { id: "supporter", label: "Supporter" },
  { id: "creator", label: "Creator" },
  { id: "admin", label: "Admin" },
];
const ROLE_COLOR = { admin: "danger", creator: "success", supporter: "default" };

const apiMessage = (err, fallback) => err.response?.data?.error?.message || fallback;

function RoleModal({ user, onDone }) {
  const state = useOverlayState();
  const [role, setRole] = useState(user.role);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await api.patch(`/admin/users/${user._id}/role`, { role });
      toast.success("Role updated", { description: `${user.name} is now a ${role}.` });
      state.close();
      onDone();
    } catch (err) {
      toast.danger(apiMessage(err, "Could not update the role"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal state={state}>
      <Button size="sm" variant="secondary" className="min-h-11" aria-label={`Update role for ${user.name}`}>
        <UserCog className="size-4" aria-hidden="true" />
        Update Role
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Change role for {user.name}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="space-y-4">
              <Select value={role} onChange={setRole} className="w-full">
                <Label>New role</Label>
                <Select.Trigger className="min-h-11">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {ROLES.map((r) => (
                      <ListBox.Item key={r.id} id={r.id} textValue={r.label}>
                        {r.label}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
              <p className="text-sm text-foreground/70">
                The new permissions apply immediately. Existing campaigns and contributions are not changed.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" className="min-h-11" onPress={state.close} isDisabled={busy}>
                Cancel
              </Button>
              <Button className="min-h-11" onPress={save} isPending={busy} isDisabled={role === user.role}>
                Confirm change
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

const removalNote = (u) =>
  u.role === "creator"
    ? `${u.name}'s campaigns will be deleted and every supporter will be refunded.`
    : u.role === "supporter"
      ? `${u.name}'s pending contributions will be cancelled.`
      : "This admin account will be removed.";

export function ManageUsers() {
  const { user: me } = useAuth();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebouncedValue(search.trim(), 300);
  const { data, meta, loading, error, refetch } = useFetch("/admin/users", {
    q: q || undefined,
    role: role || undefined,
    page,
    limit: 8,
  });

  async function remove(u) {
    try {
      const { data: res } = await api.delete(`/admin/users/${u._id}`);
      toast.success("User removed", {
        description: res.data.campaignsDeleted
          ? `${res.data.campaignsDeleted} campaign(s) deleted with refunds.`
          : u.email,
      });
      if (data.length === 1 && page > 1) setPage(page - 1);
      else refetch();
    } catch (err) {
      toast.danger(apiMessage(err, "Could not remove the user"));
      throw err;
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <SearchField
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          label="Search users"
          placeholder="Search by name or email"
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by role">
          {[{ id: "", label: "All" }, ...ROLES].map((r) => (
            <Button
              key={r.id || "all"}
              size="sm"
              variant={role === r.id ? "primary" : "outline"}
              aria-pressed={role === r.id}
              className="min-h-11"
              onPress={() => {
                setRole(r.id);
                setPage(1);
              }}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      {error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : loading && !data ? (
        <div className="space-y-3" role="status" aria-label="Loading users">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : !data?.length ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Try a different name, email or role filter."
        />
      ) : (
        <div className={`space-y-4 ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="Users" className="min-w-[820px]">
                <Table.Header>
                  <Table.Column isRowHeader>User</Table.Column>
                  <Table.Column>Email</Table.Column>
                  <Table.Column>Role</Table.Column>
                  <Table.Column>Credits</Table.Column>
                  <Table.Column>Actions</Table.Column>
                </Table.Header>
                <Table.Body>
                  {data.map((u) => {
                    const isMe = u._id === me.id;
                    return (
                      <Table.Row key={u._id} id={u._id}>
                        <Table.Cell>
                          <div className="flex items-center gap-3">
                            <Avatar size="sm">
                              {u.photo_url && <Avatar.Image src={u.photo_url} alt="" />}
                              <Avatar.Fallback>{u.name?.[0]?.toUpperCase()}</Avatar.Fallback>
                            </Avatar>
                            <span className="font-semibold">
                              {u.name}
                              {isMe && (
                                <span className="ml-2 text-xs font-normal text-foreground/70">(you)</span>
                              )}
                            </span>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="break-all">{u.email}</span>
                        </Table.Cell>
                        <Table.Cell>
                          <Chip size="sm" color={ROLE_COLOR[u.role]} className="capitalize">
                            {u.role}
                          </Chip>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <Coins className="size-4 text-accent-ink" aria-hidden="true" />
                            {formatCredits(u.credits)}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          {isMe ? (
                            <span className="text-sm text-foreground/70">This is your account</span>
                          ) : (
                            <div className="flex gap-2">
                              <RoleModal user={u} onDone={refetch} />
                              <ConfirmDialog
                                triggerLabel={
                                  <>
                                    <Trash2 className="size-4" aria-hidden="true" />
                                    Remove
                                  </>
                                }
                                triggerVariant="danger-soft"
                                title={`Remove ${u.name}?`}
                                description={`${removalNote(u)} This cannot be undone.`}
                                confirmLabel="Remove user"
                                confirmVariant="danger"
                                onConfirm={() => remove(u)}
                              />
                            </div>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
          {meta && <Pager page={meta.page} totalPages={meta.totalPages} onChange={setPage} />}
        </div>
      )}
    </div>
  );
}
