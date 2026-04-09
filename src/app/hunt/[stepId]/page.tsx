import { ArrowLeft, ScanQrCode } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PoemCard } from "@/components/poem-card";
import { StepProgress } from "@/components/step-progress";
import { Button } from "@/components/ui/button";
import { getStep, getStepIndex, getSteps } from "@/lib/hunt";

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
          <Button className="w-full sm:w-auto" size="lg" type="button">
            <ScanQrCode className="h-4 w-4" />
            Open scanner
          </Button>
        }
        step={step}
      />
    </main>
  );
}
