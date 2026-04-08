import { Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { HuntStep } from "@/lib/hunt";

type PoemCardProps = {
  step: HuntStep;
  stepNumber: number;
  totalSteps: number;
};

export function PoemCard({ step, stepNumber, totalSteps }: PoemCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-10 -top-8 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95),rgba(255,255,255,0))]" />
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[color:var(--muted-foreground)]">
            {step.eyebrow} · {stepNumber} of {totalSteps}
          </p>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl leading-tight text-[color:var(--foreground)] sm:text-5xl">
                {step.title}
              </h1>
              <p className="mt-2 text-sm font-semibold text-[color:var(--accent-ink)]">
                {step.locationHint}
              </p>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[color:var(--accent)] text-[color:var(--accent-ink)]">
              <Sparkles className="h-5 w-5" />
            </span>
          </div>
        </div>

        <div className="rounded-[28px] border border-dashed border-[color:var(--border-strong)] bg-[color:var(--paper)] px-6 py-7 shadow-inner">
          <div className="space-y-3 font-serif text-xl leading-8 text-[color:var(--foreground)] sm:text-2xl sm:leading-10">
            {step.poem.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        <p className="max-w-2xl text-base leading-7 text-[color:var(--muted-foreground)]">
          {step.note}
        </p>
      </CardContent>
    </Card>
  );
}
