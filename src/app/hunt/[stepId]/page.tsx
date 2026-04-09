import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ClueScannerDialog } from "@/components/clue-scanner-dialog";
import { PoemCard } from "@/components/poem-card";
import { StepProgress } from "@/components/step-progress";
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
  const expectedDestination = nextStep ? getStepUrl(nextStep.id) : "/done";
  const continueLabel = nextStep ? "Open next clue" : "Celebrate";
  const successMessage = nextStep
    ? "That is the right QR."
    : "That is the final QR.";

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-5 sm:gap-6 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
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
        scannerButton={
          <ClueScannerDialog
            continueLabel={continueLabel}
            expectedDestination={expectedDestination}
            successMessage={successMessage}
          />
        }
        step={step}
      />
    </main>
  );
}
