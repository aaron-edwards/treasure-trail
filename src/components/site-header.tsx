import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 pt-6 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/75 px-4 py-2 shadow-[0_12px_30px_rgba(77,56,115,0.12)] backdrop-blur-sm"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] text-lg text-white shadow-inner">
          ✦
        </span>
        <span>
          <span className="block text-xs uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
            Treasure Trail
          </span>
          <span className="font-serif text-lg text-[color:var(--foreground)]">
            Birthday Edition
          </span>
        </span>
      </Link>

      <nav className="flex items-center gap-2 text-sm font-semibold text-[color:var(--muted-foreground)]">
        <Link className="rounded-full px-4 py-2 hover:bg-white/55" href="/">
          Home
        </Link>
        <Link
          className="rounded-full px-4 py-2 hover:bg-white/55"
          href="/dev/qrs"
        >
          QR helper
        </Link>
      </nav>
    </header>
  );
}
