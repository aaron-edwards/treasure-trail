import { Gift, MapIcon, ScanSearch } from "lucide-react";
import Link from "next/link";

import { ThemeBuddy } from "@/components/theme-buddy";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getHunt, getSteps, getStepUrl } from "@/lib/hunt";
import { getActiveTheme } from "@/lib/themes";

export default function HomePage() {
  const hunt = getHunt();
  const steps = getSteps();
  const theme = getActiveTheme();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
        <Card className="overflow-hidden">
          <CardContent className="relative space-y-7">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_70%)]" />
            <div className="relative space-y-4">
              <p className="text-sm font-bold uppercase tracking-[0.32em] text-[color:var(--muted-foreground)]">
                {hunt.event.introEyebrow}
              </p>
              <h1 className="max-w-3xl font-serif text-5xl leading-none text-[color:var(--foreground)] sm:text-7xl">
                {hunt.event.introHeadline}
              </h1>
              <p className="max-w-2xl text-base font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                {hunt.event.subtitle}
              </p>
              <div className="max-w-2xl space-y-2 font-serif text-2xl leading-9 text-[color:var(--foreground)]">
                {hunt.event.introPoem.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href={getStepUrl(hunt.event.startStepId)}>
                <Button size="lg">{hunt.event.startLabel}</Button>
              </Link>
              <Link href="/dev/qrs">
                <Button size="lg" variant="secondary">
                  Open QR helper
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[28px] bg-white/65 p-4 ring-1 ring-white/70">
                <MapIcon className="mb-3 h-5 w-5 text-[color:var(--accent-ink)]" />
                <p className="text-sm font-semibold text-[color:var(--foreground)]">
                  {steps.length} clue stops
                </p>
              </div>
              <div className="rounded-[28px] bg-white/65 p-4 ring-1 ring-white/70">
                <ScanSearch className="mb-3 h-5 w-5 text-[color:var(--accent-ink)]" />
                <p className="text-sm font-semibold text-[color:var(--foreground)]">
                  QR-powered reveals
                </p>
              </div>
              <div className="rounded-[28px] bg-white/65 p-4 ring-1 ring-white/70">
                <Gift className="mb-3 h-5 w-5 text-[color:var(--accent-ink)]" />
                <p className="text-sm font-semibold text-[color:var(--foreground)]">
                  JSON-configured story
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[linear-gradient(180deg,rgba(255,248,233,0.96),rgba(255,255,255,0.88))]">
          <CardContent className="space-y-5">
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-[color:var(--muted-foreground)]">
              Theme ready
            </p>
            <ThemeBuddy
              message={`Welcome to the ${theme.label.toLowerCase()}. I’ll pop up along the trail until we add more themed buddies.`}
            />
            <div className="rounded-[28px] border border-dashed border-[color:var(--border-strong)] bg-white/70 p-5">
              <p className="font-serif text-2xl text-[color:var(--foreground)]">
                Edit the hunt in
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-[color:var(--accent-ink)]">
                src/content/hunt.json
              </p>
            </div>
            <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
              Each clue page shows the poem-like riddle for a location, and the
              hidden QR there opens the next clue. The theme setup is now
              separate from the hunt content so we can add new buddies and looks
              later without changing the route structure.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
