import type { ReactNode } from "react";

import { ThemeBuddy } from "@/components/theme-buddy";
import { Card, CardContent } from "@/components/ui/card";
import type { HuntStep } from "@/lib/hunt";
import { getStepIndex, getSteps } from "@/lib/hunt";

type PoemCardProps = {
  step: HuntStep;
  scannerButton?: ReactNode;
};

export function PoemCard({
  step,
  scannerButton,
}: PoemCardProps) {
  const stepNumber = getStepIndex(step.id) + 1;
  const totalSteps = getSteps().length;

  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-10 -top-8 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95),rgba(255,255,255,0))]" />
      <CardContent className="space-y-4 p-4 sm:space-y-6 sm:p-8">
        <div className="space-y-2.5 sm:space-y-3">
          <h1 className="font-serif text-3xl leading-tight text-[color:var(--foreground)] sm:text-5xl">
            {step.title}
          </h1>
        </div>

        <div className="rounded-[24px] border border-dashed border-[color:var(--border-strong)] bg-[color:var(--paper)] px-4 py-5 shadow-inner sm:rounded-[28px] sm:px-6 sm:py-7">
          <div className="space-y-2 font-serif text-[1.08rem] leading-8 tracking-[-0.01em] text-[color:var(--foreground)] sm:space-y-3 sm:text-2xl sm:leading-10 sm:tracking-normal">
            {step.poem.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        <ThemeBuddy
          imageOnly
          stepNumber={stepNumber}
          message=""
        />

        {scannerButton ? (
          <div className="flex justify-center pt-0.5">{scannerButton}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}
