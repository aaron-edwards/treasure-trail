# Treasure Trail

A whimsical QR-powered scavenger hunt app for a birthday treasure trail, built with Next.js, Tailwind CSS v4, and lightweight shadcn-style UI primitives.

## Overview

The app is currently configured from a single JSON file and is designed so that the data source can later move to a server without rewriting the UI.

Current experience:

- `/` landing page with the intro poem, Bubbles the unicorn, and browser read-aloud
- `/hunt/[stepId]` clue pages with poem clues, buddy art, URL-driven scanner states, and browser read-aloud
- `/done` finale page with browser read-aloud
- `/dev/qrs` printable QR sheet that uses the current host automatically

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

## Content Model

Edit [`src/content/hunt.json`](./src/content/hunt.json) to change:

- event title and intro/finale poem copy
- theme selection
- start button label
- clue titles and poem lines
- event copy, theme selection, and clue order

The JSON file is the current source of truth for the hunt flow.

## Theme Assets

The current unicorn theme is defined in [`src/lib/themes.ts`](./src/lib/themes.ts).

Unicorn artwork lives in:

- [`public/media/unicorns/unicorn-intro.png`](./public/media/unicorns/unicorn-intro.png)
- [`public/media/unicorns/unicorn-yay.png`](./public/media/unicorns/unicorn-yay.png)
- [`public/media/unicorns/unicorn-1.png`](./public/media/unicorns/unicorn-1.png) through [`public/media/unicorns/unicorn-7.png`](./public/media/unicorns/unicorn-7.png)

## Project Notes

- The home and clue pages are optimized for mobile-first use during an actual scavenger hunt.
- Clue pages use `?scanner=open` to open the camera dialog and `?scanner=success` to show the success state.
- Solution QR codes now point to the current clue's success route instead of directly to the next clue.
- Voiceover uses the browser `speechSynthesis` API in a simple self-contained reader component modeled after the earlier app.
- Poem screens attempt to auto-read on load and also provide a manual `Read aloud` button.
- The QR sheet uses the current request host instead of a stored base URL.
- If the content model, routes, or theme system changes, update this README and `AGENTS.md` in the same change.
