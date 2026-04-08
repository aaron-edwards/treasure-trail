import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";
import { getHunt } from "@/lib/hunt";

import "./globals.css";

const hunt = getHunt();

export const metadata: Metadata = {
  title: `${hunt.event.title} | Treasure Trail`,
  description: hunt.event.introPoem.join(" "),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen pb-16">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
