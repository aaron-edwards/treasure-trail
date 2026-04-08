import hunt from "@/content/hunt.json";

export type HuntStep = (typeof hunt.steps)[number];
export type HuntEvent = typeof hunt.event;

export function getHunt() {
  return hunt;
}

export function getSteps() {
  return hunt.steps;
}

export function getStep(stepId: string) {
  return hunt.steps.find((step) => step.id === stepId);
}

export function getStepIndex(stepId: string) {
  return hunt.steps.findIndex((step) => step.id === stepId);
}

export function getNextStep(stepId: string) {
  const currentIndex = getStepIndex(stepId);

  if (currentIndex < 0 || currentIndex === hunt.steps.length - 1) {
    return null;
  }

  return hunt.steps[currentIndex + 1];
}

export function getStepUrl(stepId: string) {
  return `/hunt/${stepId}`;
}

export function getAbsoluteStepUrl(stepId: string) {
  return `${hunt.event.qrBaseUrl}${getStepUrl(stepId)}`;
}

export function getAbsoluteDoneUrl() {
  return `${hunt.event.qrBaseUrl}/done`;
}
