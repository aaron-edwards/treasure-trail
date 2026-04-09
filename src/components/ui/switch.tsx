"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-transparent transition-colors outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--ring-soft)] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] data-[state=unchecked]:bg-[rgba(139,111,154,0.28)]",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 translate-x-1 rounded-full bg-white shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-6",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
