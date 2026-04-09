import Image from "next/image";

import {
  getActiveTheme,
  getStepBuddyVariant,
  type ThemeBuddyVariant,
} from "@/lib/themes";
import { cn } from "@/lib/utils";

type ThemeBuddyProps = {
  message: string;
  variant?: ThemeBuddyVariant;
  stepNumber?: number;
  className?: string;
  compact?: boolean;
  imageOnly?: boolean;
};

export function ThemeBuddy({
  message,
  variant,
  stepNumber,
  className,
  compact = false,
  imageOnly = false,
}: ThemeBuddyProps) {
  const theme = getActiveTheme();
  const resolvedVariant =
    variant ?? (stepNumber ? getStepBuddyVariant(stepNumber) : "intro");
  const buddyArt = theme.buddyArt[resolvedVariant];

  return (
    <aside
      className={cn(
        "relative overflow-hidden rounded-[30px] border border-white/70 bg-white/72 p-5 shadow-[0_22px_60px_rgba(77,56,115,0.14)] backdrop-blur-sm",
        compact && "p-3 sm:p-4",
        imageOnly &&
          "border-transparent bg-transparent p-0 shadow-none backdrop-blur-none",
        className,
      )}
    >
      {imageOnly ? null : (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 opacity-90",
            theme.buddyGlowClassName,
          )}
        />
      )}
      <div
        className={cn(
          "relative flex items-center gap-4",
          compact && "gap-3 sm:gap-4",
          imageOnly && "justify-center",
        )}
      >
        <div
          className={cn(
            "w-[124px] shrink-0 sm:w-[220px]",
            compact && "w-[104px] sm:w-[180px]",
            imageOnly && "w-[132px] sm:w-[196px]",
          )}
        >
          <div
            className={cn(
              "rounded-[28px] bg-white/78 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_40px_rgba(77,56,115,0.10)]",
              compact && "rounded-[22px] p-2.5",
              imageOnly && "bg-transparent p-0 shadow-none",
            )}
          >
            <Image
              alt={buddyArt.alt}
              className="h-auto w-full"
              height={256}
              priority={
                resolvedVariant === "intro" || resolvedVariant === "celebration"
              }
              src={buddyArt.src}
              width={256}
            />
          </div>
        </div>
        {imageOnly ? null : (
          <div
            className={cn(
              "min-w-0 flex-1 space-y-2 text-left",
              compact && "space-y-1.5",
            )}
          >
            <p
              className={cn(
                "text-xs font-bold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]",
                compact && "text-[10px] tracking-[0.22em] sm:text-xs",
              )}
            >
              <span className="block sm:inline">{theme.buddyName}</span>
              <span className="hidden sm:inline"> · </span>
              <span className="block sm:inline">{theme.buddyTitle}</span>
            </p>
            <p
              className={cn(
                "font-serif text-2xl leading-8 text-[color:var(--foreground)]",
                compact && "text-lg leading-7 sm:text-xl",
              )}
            >
              {message}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
