import { getActiveTheme } from "@/lib/themes";
import { cn } from "@/lib/utils";

type ThemeBuddyProps = {
  message: string;
  className?: string;
};

export function ThemeBuddy({ message, className }: ThemeBuddyProps) {
  const theme = getActiveTheme();

  return (
    <aside
      className={cn(
        "relative overflow-hidden rounded-[30px] border border-white/70 bg-white/72 p-5 shadow-[0_22px_60px_rgba(77,56,115,0.14)] backdrop-blur-sm",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-90",
          theme.buddyGlowClassName,
        )}
      />
      <div className="relative flex items-start gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[24px] bg-white/75 text-4xl shadow-inner">
          <span aria-hidden="true">{theme.buddyEmoji}</span>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
            {theme.buddyName} · {theme.buddyTitle}
          </p>
          <p className="font-serif text-2xl leading-8 text-[color:var(--foreground)]">
            {message}
          </p>
        </div>
      </div>
    </aside>
  );
}
