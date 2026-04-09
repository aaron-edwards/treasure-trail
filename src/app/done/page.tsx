import { Gift, Sparkles } from "lucide-react";
import Link from "next/link";

import { PoemReader } from "@/components/poem-reader";
import { ThemeBuddy } from "@/components/theme-buddy";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getHunt } from "@/lib/hunt";

export default function DonePage() {
  const hunt = getHunt();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <Card className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,245,248,0.98),rgba(255,255,255,0.88))]">
        <CardContent className="relative space-y-6 py-10 sm:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.88),transparent_54%)]" />
          <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] text-white shadow-[0_20px_50px_rgba(232,85,108,0.25)]">
            <Gift className="h-9 w-9" />
          </div>
          <div className="relative space-y-4 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-[color:var(--muted-foreground)]">
              <Sparkles className="mr-2 inline h-4 w-4" />
              {hunt.event.celebrationEyebrow}
            </p>
            <h1 className="font-serif text-5xl text-[color:var(--foreground)] sm:text-6xl">
              {hunt.event.celebrationTitle}
            </h1>
            <div className="mx-auto max-w-2xl space-y-2 font-serif text-2xl leading-9 text-[color:var(--foreground)]">
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
          <div className="relative flex justify-center">
            <PoemReader lines={hunt.event.celebrationPoem} />
          </div>
          <div className="relative flex justify-center">
            <Link href="/">
              <Button size="lg">Start again</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <ThemeBuddy
        message="You did it. Confetti hoof-kicks, sparkles, and triumphant birthday prancing all around."
        variant="celebration"
      />
    </main>
  );
}
