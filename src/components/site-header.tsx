"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  if (pathname.startsWith("/dev/qrs")) {
    return null;
  }

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center px-4 pt-6 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/75 px-4 py-2 shadow-[0_12px_30px_rgba(77,56,115,0.12)] backdrop-blur-sm"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] text-lg text-white shadow-inner">
          ✦
        </span>
        <span className="font-serif text-xl text-[color:var(--foreground)]">
          Treasure Trail
        </span>
      </Link>
    </header>
  );
}
