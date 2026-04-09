import Link from "next/link";

import { PoemReader } from "@/components/poem-reader";
import { ThemeBuddy } from "@/components/theme-buddy";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getHunt, getStepUrl } from "@/lib/hunt";

export default function HomePage() {
  const hunt = getHunt();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-5 sm:px-6 sm:py-10">
      <section>
        <Card className="overflow-hidden">
          <CardContent className="relative space-y-4 p-4 sm:space-y-7 sm:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_70%)]" />
            <div className="relative space-y-2.5 sm:space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)] sm:text-sm sm:tracking-[0.32em]">
                {hunt.event.introEyebrow}
              </p>
              <h1 className="max-w-3xl font-serif text-3xl leading-none text-[color:var(--foreground)] sm:text-6xl lg:text-7xl">
                {hunt.event.introHeadline}
              </h1>
              <div className="max-w-2xl rounded-[24px] border border-dashed border-[color:var(--border-strong)] bg-[color:var(--paper)] px-4 py-5 shadow-inner sm:rounded-[28px] sm:px-6 sm:py-7">
                <div className="space-y-2 font-serif text-[1.08rem] leading-8 tracking-[-0.01em] text-[color:var(--foreground)] sm:space-y-3 sm:text-2xl sm:leading-10 sm:tracking-normal">
                  {hunt.event.introPoem.map((line) => (
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
              className="bg-[linear-gradient(180deg,rgba(255,248,233,0.9),rgba(255,255,255,0.78))]"
              compact
              message="Bubbles is ready to trot beside you."
              variant="intro"
            />

            <div className="flex justify-center">
              <PoemReader lines={hunt.event.introPoem} />
            </div>

            <div className="flex justify-center pt-0.5">
              <Link
                className="block w-full sm:w-auto"
                href={getStepUrl(hunt.event.startStepId)}
              >
                <Button className="w-full sm:w-auto" size="lg">
                  {hunt.event.startLabel}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
