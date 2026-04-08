import QRCode from "react-qr-code";

import { Card, CardContent } from "@/components/ui/card";
import {
  getAbsoluteDoneUrl,
  getAbsoluteStepUrl,
  getHunt,
  getSteps,
} from "@/lib/hunt";

export function QrPreviewGrid() {
  const hunt = getHunt();
  const steps = getSteps();

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {steps.slice(1).map((step, index) => (
        <Card key={step.id} className="break-inside-avoid">
          <CardContent className="grid gap-5 sm:grid-cols-[1fr_176px] sm:items-center">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
                Place this QR after clue {index + 1}
              </p>
              <h2 className="font-serif text-3xl text-[color:var(--foreground)]">
                Reveals: {step.title}
              </h2>
              <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
                Link target: {getAbsoluteStepUrl(step.id)}
              </p>
            </div>

            <div className="rounded-[28px] border border-[color:var(--border)] bg-white p-4 shadow-inner">
              <QRCode
                size={144}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={getAbsoluteStepUrl(step.id)}
                viewBox="0 0 256 256"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="break-inside-avoid lg:col-span-2">
        <CardContent className="grid gap-5 sm:grid-cols-[1fr_176px] sm:items-center">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
              Final QR
            </p>
            <h2 className="font-serif text-3xl text-[color:var(--foreground)]">
              Reveals: {hunt.event.celebrationTitle}
            </h2>
            <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
              Link target: {getAbsoluteDoneUrl()}
            </p>
          </div>

          <div className="rounded-[28px] border border-[color:var(--border)] bg-white p-4 shadow-inner">
            <QRCode
              size={144}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={getAbsoluteDoneUrl()}
              viewBox="0 0 256 256"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
