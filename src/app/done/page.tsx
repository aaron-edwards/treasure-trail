import Link from "next/link";

import { PoemReader } from "@/components/poem-reader";
import { ThemeBuddy } from "@/components/theme-buddy";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getHunt } from "@/lib/hunt";
import { getDoneSpeechUrl } from "@/lib/speech";

export default function DonePage() {
  const hunt = getHunt();
  const doneSpeechUrl = getDoneSpeechUrl();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-5 sm:px-6 sm:py-10">
      <Card className="overflow-hidden">
        <CardContent className="relative space-y-4 p-4 sm:space-y-6 sm:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_70%)]" />
          <div className="relative space-y-2.5 sm:space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)] sm:text-sm sm:tracking-[0.32em]">
              {hunt.event.celebrationEyebrow}
            </p>
            <h1 className="max-w-3xl font-serif text-3xl leading-tight text-[color:var(--foreground)] sm:text-5xl">
              {hunt.event.celebrationTitle}
            </h1>
            <div className="max-w-2xl rounded-[24px] border border-dashed border-[color:var(--border-strong)] bg-[color:var(--paper)] px-4 py-5 shadow-inner sm:rounded-[28px] sm:px-6 sm:py-7">
              <div className="space-y-2 font-serif text-[1.08rem] leading-8 tracking-[-0.01em] text-[color:var(--foreground)] sm:space-y-3 sm:text-2xl sm:leading-10 sm:tracking-normal">
                {hunt.event.celebrationPoem.map((line) => (
                  <p
                    className="whitespace-nowrap sm:whitespace-normal"
                    key={line}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <ThemeBuddy
            message="Bubbles is here for one last burst of confetti, sparkle, and birthday cheer."
            variant="celebration"
          />

          <div className="flex justify-center">
            <PoemReader
              audioSrc={doneSpeechUrl ?? undefined}
              lines={hunt.event.celebrationPoem}
            />
          </div>

          <div className="flex justify-center pt-0.5">
            <Link className="block w-full sm:w-auto" href="/">
              <Button className="w-full sm:w-auto" size="lg">
                Start Again
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
