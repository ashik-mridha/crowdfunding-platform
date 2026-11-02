"use client";

import { useState } from "react";
import { Button, Modal, useOverlayState } from "@heroui/react";

// Trigger button + confirmation modal. `onConfirm` may be async; the dialog closes when it resolves.
export function ConfirmDialog({
  triggerLabel,
  triggerVariant = "outline",
  triggerSize = "sm",
  triggerClassName = "",
  title,
  description,
  confirmLabel = "Confirm",
  confirmVariant = "primary",
  onConfirm,
}) {
  const state = useOverlayState();
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    try {
      await onConfirm();
      state.close();
    } catch {
      // The caller reports the failure; keep the dialog open so the user can retry or cancel.
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal state={state}>
      <Button variant={triggerVariant} size={triggerSize} className={`min-h-11 ${triggerClassName}`}>
        {triggerLabel}
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{title}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-foreground/80">{description}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" className="min-h-11" onPress={state.close} isDisabled={busy}>
                Cancel
              </Button>
              <Button variant={confirmVariant} className="min-h-11" onPress={confirm} isPending={busy}>
                {confirmLabel}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
