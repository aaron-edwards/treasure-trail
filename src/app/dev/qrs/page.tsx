import { QrPreviewGrid } from "@/components/qr-preview-grid";
import { Card, CardContent } from "@/components/ui/card";
import { getHunt } from "@/lib/hunt";

export default function QrHelperPage() {
  const hunt = getHunt();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <Card className="bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(251,245,255,0.84))]">
        <CardContent className="space-y-4">
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-[color:var(--muted-foreground)]">
            QR helper
          </p>
          <h1 className="font-serif text-5xl text-[color:var(--foreground)]">
            Printable reveal cards
          </h1>
          <p className="max-w-3xl text-base leading-7 text-[color:var(--muted-foreground)]">
            These QR codes link directly to the next clue pages. Update the base
            URL in{" "}
            <span className="font-semibold text-[color:var(--foreground)]">
              src/content/hunt.json
            </span>{" "}
            before printing so the codes point at your final Vercel site.
          </p>
          <div className="rounded-[28px] border border-dashed border-[color:var(--border-strong)] bg-white/72 p-4 text-sm leading-6 text-[color:var(--muted-foreground)]">
            Current base URL:{" "}
            <span className="font-semibold text-[color:var(--foreground)]">
              {hunt.event.qrBaseUrl}
            </span>
          </div>
        </CardContent>
      </Card>

      <QrPreviewGrid />
    </main>
  );
}
