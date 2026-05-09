import { useState } from "react";

import { IconPencil } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function EditableName({
  label,
  value,
  hideLabel = false,
  className = "",
  onChange,
}: {
  readonly label: string;
  readonly value: string;
  readonly hideLabel?: boolean;
  readonly className?: string;
  readonly onChange: (value: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <label className={`grid min-w-0 gap-2 text-sm font-medium ${className}`}>
        {!hideLabel && label}
        <span className="p-0.5">
          <input
            aria-label={label}
            autoFocus
            className="keyboard-safe-input h-12 w-full rounded-md border bg-background px-3 text-base outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            maxLength={24}
            value={value}
            onBlur={() => setIsEditing(false)}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
          />
        </span>
      </label>
    );
  }

  return (
    <div className={`grid min-w-0 gap-2 ${className}`}>
      {!hideLabel && <p className="text-sm font-medium">{label}</p>}
      <div className="flex h-12 items-center justify-between gap-3 rounded-md border bg-card px-3">
        <p className="min-w-0 truncate text-base font-semibold">{value}</p>
        <Button
          aria-label={`Edit ${label}`}
          size="icon"
          variant="ghost"
          onClick={() => setIsEditing(true)}
        >
          <IconPencil className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
