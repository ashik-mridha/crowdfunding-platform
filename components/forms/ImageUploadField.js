"use client";

import { useRef, useState } from "react";
import { Avatar, Button, Description, Input, Label, TextField } from "@heroui/react";
import { ImagePlus, Loader2 } from "lucide-react";
import { IMGBB_KEY, uploadToImgbb, validateImage } from "@/lib/imgbb";

// Controlled by `value` (final image URL). Upload goes to imgBB; a pasted URL is the fallback.
export function ImageUploadField({
  value,
  onChange,
  label = "Profile picture",
  fallbackInitial = "?",
  cover = false,
  fieldError,
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const problem = validateImage(file);
    if (problem) return setError(problem);

    setError(null);
    setBusy(true);
    const local = URL.createObjectURL(file);
    setPreview(local);
    try {
      onChange(await uploadToImgbb(file));
    } catch (err) {
      setPreview(null);
      setError(err.message);
    } finally {
      setBusy(false);
      URL.revokeObjectURL(local);
    }
  }

  const shown = value || preview;

  return (
    <fieldset className="space-y-3">
      <legend className="mb-1 text-sm font-medium">{label}</legend>
      <div className="flex items-center gap-4">
        {cover ? (
          <div className="flex aspect-video w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-default text-foreground/70 sm:w-48">
            {shown ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shown} alt="Selected cover preview" className="size-full object-cover" />
            ) : (
              <ImagePlus className="size-7" aria-hidden="true" />
            )}
          </div>
        ) : (
          <Avatar size="lg">
            {shown && <Avatar.Image src={shown} alt="Selected profile preview" />}
            <Avatar.Fallback>{fallbackInitial}</Avatar.Fallback>
          </Avatar>
        )}
        <div className="space-y-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={onFile}
            aria-label={`${label} file`}
            tabIndex={-1}
          />
          <Button
            variant="secondary"
            className="min-h-11"
            isDisabled={busy || !IMGBB_KEY}
            onPress={() => inputRef.current?.click()}
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <ImagePlus className="size-4" aria-hidden="true" />
            )}
            {busy ? "Uploading..." : "Upload image"}
          </Button>
          <p className="text-xs text-foreground/70">
            {IMGBB_KEY
              ? "JPG, PNG, WebP or GIF up to 5 MB."
              : "Uploads need an imgBB key; paste an image URL below."}
          </p>
        </div>
      </div>
      {(error || fieldError) && (
        <p role="alert" className="text-sm text-danger">
          {error || fieldError}
        </p>
      )}
      <TextField name="photo_url" type="url" value={value || ""} onChange={onChange} className="w-full">
        <Label>Or paste an image URL</Label>
        <Input placeholder="https://example.com/photo.jpg" className="min-h-11" />
        {!cover && <Description>Optional. We show your initial if you skip this.</Description>}
      </TextField>
    </fieldset>
  );
}
