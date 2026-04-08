import { ArrowLeft, PartyPopper } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PoemCard } from "@/components/poem-card";
import { StepProgress } from "@/components/step-progress";
import { ThemeBuddy } from "@/components/theme-buddy";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getNextStep,
  getStep,
  getStepIndex,
  getSteps,
  getStepUrl,
} from "@/lib/hunt";

type HuntStepPageProps = {
  params: Promise<{
    stepId: string;
  }>;
};

export default async function HuntStepPage({ params }: HuntStepPageProps) {
  const { stepId } = await params;
  const step = getStep(stepId);

  if (!step) {
    notFound();
  }

  const allSteps = getSteps();
  const currentIndex = getStepIndex(step.id);
  const nextStep = getNextStep(step.id);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to intro
        </Link>
        <StepProgress currentIndex={currentIndex} total={allSteps.length} />
      </div>

      <PoemCard
        step={step}
        stepNumber={currentIndex + 1}
        totalSteps={allSteps.length}
      />

      <ThemeBuddy
        message="A gentle hoof-tap hint: once you find this spot, the hidden QR should whisk you onward."
        stepNumber={currentIndex + 1}
      />

      <Card className="bg-[linear-gradient(180deg,rgba(241,251,255,0.95),rgba(255,255,255,0.82))]">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
              Next reveal
            </p>
            <p className="max-w-2xl text-base leading-7 text-[color:var(--muted-foreground)]">
              Hide the QR for the next clue at this location so the trail keeps
              unfolding with a little theatre.
            </p>
          </div>

          {nextStep ? (
            <Link href="/dev/qrs">
              <Button variant="secondary">Check QR helper</Button>
            </Link>
          ) : (
            <Link href="/done">
              <Button>
                <PartyPopper className="h-4 w-4" />
                Open finale
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      {nextStep ? (
        <Card className="border-dashed bg-white/60">
          <CardContent className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
              Builder note
            </p>
            <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
              The next QR should point to{" "}
              <span className="font-semibold text-[color:var(--foreground)]">
                {getStepUrl(nextStep.id)}
              </span>
              .
            </p>
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}
