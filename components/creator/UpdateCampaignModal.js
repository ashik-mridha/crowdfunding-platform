"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Modal, toast, useOverlayState } from "@heroui/react";
import { Pencil } from "lucide-react";
import api from "@/lib/api";
import { applyApiErrors } from "@/lib/apiErrors";
import { FormAlert } from "@/components/auth/AuthCard";
import { TextAreaField, TextInputField } from "@/components/forms/fields";

const schema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(120, "Title is too long"),
  story: z.string().trim().min(30, "Story must be at least 30 characters").max(5000),
  reward_info: z.string().trim().min(3, "Describe the reward for supporters").max(500),
});

function UpdateForm({ campaign, onDone, onSaved }) {
  const [formError, setFormError] = useState(null);
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: campaign.title, story: campaign.story, reward_info: campaign.reward_info },
  });

  async function onSubmit(values) {
    setFormError(null);
    try {
      await api.patch(`/campaigns/${campaign._id}`, values);
      toast.success("Campaign updated");
      onSaved();
      onDone();
    } catch (err) {
      setFormError(applyApiErrors(err, setError, ["title", "story", "reward_info"]));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Modal.Body className="space-y-4">
        <FormAlert>{formError}</FormAlert>
        <TextInputField control={control} name="title" label="Title" />
        <TextAreaField control={control} name="story" label="Story" rows={6} />
        <TextAreaField control={control} name="reward_info" label="Reward for supporters" rows={3} />
        <p className="text-xs text-foreground/70">
          Goal, deadline and category cannot be changed after you submit a campaign.
        </p>
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
        <Button type="submit" className="min-h-11" isPending={isSubmitting}>
          Save changes
        </Button>
      </Modal.Footer>
    </form>
  );
}

export function UpdateCampaignModal({ campaign, onSaved }) {
  const state = useOverlayState();
  return (
    <Modal state={state}>
      <Button size="sm" variant="secondary" className="min-h-11" aria-label={`Update ${campaign.title}`}>
        <Pencil className="size-4" aria-hidden="true" />
        Update
      </Button>
      <Modal.Backdrop>
        <Modal.Container scroll="inside">
          <Modal.Dialog className="sm:max-w-xl">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Update campaign</Modal.Heading>
            </Modal.Header>
            <UpdateForm campaign={campaign} onDone={state.close} onSaved={onSaved} />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
