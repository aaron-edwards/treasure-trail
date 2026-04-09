"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SiteHeader() {
  const pathname = usePathname();

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

          <nav className="flex flex-col gap-3 px-5 pb-5 pt-2">
            <Link
              className="text-lg font-semibold text-[color:var(--foreground)] underline-offset-4 transition-colors hover:text-[color:var(--accent-ink)] hover:underline"
              href="/dev/qrs"
            >
              QR sheet
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
