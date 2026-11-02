"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

// Plain <img> because cover URLs come from arbitrary hosts (imgBB or pasted links).
export function CampaignImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex size-full items-center justify-center bg-gradient-to-br from-accent/30 to-navy/40 text-white/80 ${className}`}
      >
        <ImageOff className="size-8" aria-hidden="true" />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`size-full object-cover ${className}`}
    />
  );
}
