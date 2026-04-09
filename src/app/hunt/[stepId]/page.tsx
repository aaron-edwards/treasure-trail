import { notFound } from "next/navigation";

import { ClueScannerDialog } from "@/components/clue-scanner-dialog";
import { PoemCard } from "@/components/poem-card";
import { PoemReader } from "@/components/poem-reader";
import { StepProgress } from "@/components/step-progress";
import {
  getNextStep,
  getStep,
  getStepIndex,
  getStepScannerUrl,
  getSteps,
  getStepUrl,
} from "@/lib/hunt";
import { getStepSpeechUrl } from "@/lib/speech";

type HuntStepPageProps = {
  params: Promise<{
    stepId: string;
  }>;
  searchParams: Promise<{
    scanner?: string | string[];
  }>;
};

export default async function HuntStepPage({
  params,
  searchParams,
}: HuntStepPageProps) {
  const { stepId } = await params;
  const resolvedSearchParams = await searchParams;
  const step = getStep(stepId);

  if (!step) {
    notFound();
  }

  const allSteps = getSteps();
  const currentIndex = getStepIndex(step.id);
  const nextStep = getNextStep(step.id);
  const stepSpeechUrl = getStepSpeechUrl(step.id);
  const scannerParam = Array.isArray(resolvedSearchParams.scanner)
    ? resolvedSearchParams.scanner[0]
    : resolvedSearchParams.scanner;
  const initialMode =
    scannerParam === "open" || scannerParam === "success"
      ? scannerParam
      : "closed";
  const expectedDestination = getStepScannerUrl(step.id, "success");
  const continueHref = nextStep ? getStepUrl(nextStep.id) : "/done";
  const continueLabel = nextStep ? "Open next clue" : "Celebrate";
  const successMessage = nextStep
    ? "That is the right QR."
    : "That is the final QR.";

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-5 sm:gap-6 sm:px-6 sm:py-10">
      <StepProgress currentIndex={currentIndex} total={allSteps.length} />

      <PoemCard
        readerButton={
          <PoemReader audioSrc={stepSpeechUrl ?? undefined} lines={step.poem} />
        }
        scannerButton={
          <ClueScannerDialog
            continueLabel={continueLabel}
            expectedDestination={expectedDestination}
            initialMode={initialMode}
            continueHref={continueHref}
            successMessage={successMessage}
          />
        }
        step={step}
      />
    </main>
  );
}
