import { headers } from "next/headers";

import { QrPrintCard } from "@/components/qr-print-card";
import { getNextStep, getSteps, getStepUrl } from "@/lib/hunt";
import { getStepBuddyVariant, getThemeBuddyArt } from "@/lib/themes";

function getRequestOrigin(headerList: Headers) {
  const protocol =
    headerList.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");
  const host =
    headerList.get("x-forwarded-host") ??
    headerList.get("host") ??
    "localhost:3000";

  return `${protocol}://${host}`;
}

export default async function QrHelperPage() {
  const headerList = await headers();
  const origin = getRequestOrigin(headerList);
  const steps = getSteps();

  return (
    <main className="min-h-screen bg-white px-4 py-6 print:px-3 print:py-3">
      <section className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3 print:max-w-none print:grid-cols-3">
        {steps.map((step, index) => {
          const nextStep = getNextStep(step.id);
          const destination = nextStep ? getStepUrl(nextStep.id) : "/done";
          const buddyArt = getThemeBuddyArt(getStepBuddyVariant(index + 1));

          return (
            <QrPrintCard
              badgeAlt={buddyArt.alt}
              badgeSrc={buddyArt.src}
              key={step.id}
              title={`Solution ${index + 1}`}
              value={`${origin}${destination}`}
            />
          );
        })}
      </section>
    </main>
  );
}
