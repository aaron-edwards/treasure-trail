import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--ring-soft)]",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] text-white shadow-[0_16px_34px_rgba(232,85,108,0.28)] hover:-translate-y-0.5",
        secondary:
          "bg-white/75 text-[color:var(--foreground)] ring-1 ring-[color:var(--border)] hover:bg-white",
        ghost: "text-[color:var(--foreground)] hover:bg-white/60",
      },
      size: {
        default: "h-11 px-5",
        lg: "h-13 px-6 text-base",
        sm: "h-9 px-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
