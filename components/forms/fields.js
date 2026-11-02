"use client";

import { Controller } from "react-hook-form";
import { Description, FieldError, Input, Label, ListBox, Select, TextArea, TextField } from "@heroui/react";

export function TextInputField({
  control,
  name,
  label,
  type = "text",
  placeholder,
  description,
  autoComplete,
  inputProps,
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          name={name}
          type={type}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          isInvalid={Boolean(fieldState.error)}
          className="w-full"
        >
          <Label>{label}</Label>
          <Input placeholder={placeholder} autoComplete={autoComplete} className="min-h-11" {...inputProps} />
          {description && !fieldState.error && <Description>{description}</Description>}
          <FieldError>{fieldState.error?.message}</FieldError>
        </TextField>
      )}
    />
  );
}

export function SelectField({ control, name, label, options, placeholder }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Select
          name={name}
          value={field.value || null}
          onChange={field.onChange}
          placeholder={placeholder}
          isInvalid={Boolean(fieldState.error)}
          className="w-full"
        >
          <Label>{label}</Label>
          <Select.Trigger className="min-h-11">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {options.map((o) => (
                <ListBox.Item key={o.id} id={o.id} textValue={o.label}>
                  <div className="flex flex-col">
                    <span className="font-medium">{o.label}</span>
                    {o.description && <span className="text-xs text-foreground/70">{o.description}</span>}
                  </div>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
          <FieldError>{fieldState.error?.message}</FieldError>
        </Select>
      )}
    />
  );
}

export function TextAreaField({ control, name, label, placeholder, description, rows = 5 }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          name={name}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          isInvalid={Boolean(fieldState.error)}
          className="w-full"
        >
          <Label>{label}</Label>
          <TextArea placeholder={placeholder} rows={rows} />
          {description && !fieldState.error && <Description>{description}</Description>}
          <FieldError>{fieldState.error?.message}</FieldError>
        </TextField>
      )}
    />
  );
}
