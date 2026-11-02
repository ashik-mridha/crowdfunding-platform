"use client";

import { Input, Label, TextField } from "@heroui/react";
import { Search } from "lucide-react";

// Controlled search box; callers debounce the value before querying.
export function SearchField({ value, onChange, label, placeholder }) {
  return (
    <TextField value={value} onChange={onChange} className="w-full">
      <Label className="sr-only">{label}</Label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/70"
          aria-hidden="true"
        />
        <Input placeholder={placeholder} className="min-h-11 w-full pl-9" />
      </div>
    </TextField>
  );
}
