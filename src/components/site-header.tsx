"use client";

import { Menu, QrCode, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSpeechSettings } from "@/components/speech-settings";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

export function SiteHeader() {
  const pathname = usePathname();
  const {
    autoRead,
    selectedVoiceUri,
    setAutoRead,
    setSelectedVoiceUri,
    voices,
  } = useSpeechSettings();
  const sortedVoices = [...voices].sort((left, right) => {
    const leftIsEnglish = left.lang.toLowerCase().startsWith("en");
    const rightIsEnglish = right.lang.toLowerCase().startsWith("en");

    if (leftIsEnglish !== rightIsEnglish) {
      return leftIsEnglish ? -1 : 1;
    }

    return (
      left.lang.localeCompare(right.lang) || left.name.localeCompare(right.name)
    );
  });

  if (pathname.startsWith("/dev/qrs")) {
    return null;
  }

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 pt-6 sm:px-6">
      <Link href="/" className="inline-flex items-center gap-3 px-1 py-1">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] text-lg text-white shadow-inner">
          ✦
        </span>
        <span className="font-serif text-xl text-[color:var(--foreground)]">
          Treasure Trail
        </span>
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <button
            aria-label="Open menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/75 text-[color:var(--foreground)] shadow-[0_12px_30px_rgba(77,56,115,0.12)] backdrop-blur-sm transition-colors hover:bg-white"
            type="button"
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>

        <SheetContent showCloseButton={false} side="right">
          <SheetHeader className="flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] text-lg text-white shadow-inner">
                ✦
              </span>
              <SheetTitle>Treasure Trail</SheetTitle>
            </div>

            <SheetClose asChild>
              <button
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/90 text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--ring-soft)]"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </SheetClose>
          </SheetHeader>

          <nav className="flex flex-col gap-6 px-5 pb-5 pt-3">
            <section className="rounded-[24px] border border-white/70 bg-white/72 p-4 shadow-[0_12px_30px_rgba(77,56,115,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">
                    Auto read
                  </p>
                  <p className="text-xs leading-4 text-[color:var(--muted-foreground)] sm:text-sm sm:leading-5">
                    Read each poem aloud when a page opens.
                  </p>
                </div>

                <Switch
                  aria-label="Toggle automatic reading"
                  checked={autoRead}
                  onCheckedChange={(checked) => {
                    setAutoRead(checked);
                  }}
                />
              </div>

              <div className="mt-4 space-y-2">
                <label
                  className="text-sm font-semibold text-[color:var(--foreground)]"
                  htmlFor="voice-select"
                >
                  Voice
                </label>
                <select
                  className="h-11 w-full rounded-2xl border border-white/80 bg-white/90 px-4 text-sm text-[color:var(--foreground)] shadow-inner outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--ring-soft)]"
                  id="voice-select"
                  onChange={(event) => {
                    setSelectedVoiceUri(event.target.value || null);
                  }}
                  value={selectedVoiceUri ?? ""}
                >
                  <option value="">Karen / AU fallback</option>
                  {sortedVoices.map((voice) => (
                    <option
                      key={`${voice.name}-${voice.lang}-${voice.voiceURI}`}
                      value={voice.voiceURI}
                    >
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <div className="px-1">
              <Link
                className="inline-flex items-center gap-3 text-base font-semibold text-[color:var(--foreground)] underline-offset-4 transition-colors hover:text-[color:var(--accent-ink)] hover:underline"
                href="/dev/qrs"
              >
                <QrCode className="h-4 w-4 text-[color:var(--muted-foreground)]" />
                QR sheet
              </Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
