import type * as React from "react";

import { cn } from "@/lib/utils";

type SwitchProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> & {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Switch({
  checked,
  className,
  disabled,
  onCheckedChange,
  onClick,
  ...props
}: SwitchProps) {
  return (
    <button
      aria-checked={checked}
      className={cn(
        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--ring-soft)] disabled:cursor-not-allowed disabled:opacity-50",
        checked
          ? "bg-[linear-gradient(135deg,var(--primary),var(--primary-2))]"
          : "bg-[rgba(139,111,154,0.28)]",
        className,
      )}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented && !disabled) {
          onCheckedChange?.(!checked);
        }
      }}
      role="switch"
      {...props}
      type="button"
    >
      <span
        className={cn(
          "absolute left-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}
