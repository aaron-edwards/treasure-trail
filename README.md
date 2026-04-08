# Treasure Trail

A whimsical scavenger hunt app built with Next.js, Tailwind CSS v4, and shadcn-style components.

## Commands

```bash
pnpm install
pnpm dev
```

## Content

Edit [`src/content/hunt.json`](./src/content/hunt.json) to change the event title, intro copy, theme, steps, and the URLs used for printable QR codes.

## Routes

- `/` landing page
- `/hunt/[stepId]` clue pages
- `/done` finale page
- `/dev/qrs` printable QR helper page
