"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Modal, toast, useOverlayState } from "@heroui/react";
import { Flag } from "lucide-react";
import api from "@/lib/api";
import { applyApiErrors } from "@/lib/apiErrors";
import { FormAlert } from "@/components/auth/AuthCard";
import { TextAreaField } from "@/components/forms/fields";

const schema = z.object({
  reason: z
    .string()
    .trim()
    .min(10, "Please describe the problem in at least 10 characters")
    .max(500, "Keep it under 500 characters"),
});

function ReportForm({ campaign, onDone }) {
  const [formError, setFormError] = useState(null);
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { reason: "" } });

  async function onSubmit(values) {
    setFormError(null);
    try {
      await api.post("/reports", { campaign_id: campaign._id, reason: values.reason });
      toast.success("Report sent", { description: "Thank you. An admin will review this campaign." });
      onDone();
    } catch (err) {
      setFormError(applyApiErrors(err, setError, ["reason"]));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Modal.Body className="space-y-4">
        <FormAlert>{formError}</FormAlert>
        <p className="text-sm text-foreground/70">
          Tell us what is wrong with <strong>{campaign.title}</strong>. Reports are reviewed by the Fundora
          team.
        </p>
        <TextAreaField
          control={control}
          name="reason"
          label="What is the problem?"
          rows={4}
          placeholder="For example: the photos belong to another project, or the goal looks misleading."
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          variant="secondary"
          className="min-h-11"
          onPress={onDone}
          isDisabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="danger" className="min-h-11" isPending={isSubmitting}>
          Send report
        </Button>
      </Modal.Footer>
    </form>
  );
}

export function ReportModal({ campaign }) {
  const state = useOverlayState();
  return (
    <Modal state={state}>
      <Button variant="ghost" size="sm" className="min-h-11">
        <Flag className="size-4" aria-hidden="true" />
        Report campaign
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Report this campaign</Modal.Heading>
            </Modal.Header>
            <ReportForm campaign={campaign} onDone={state.close} />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
