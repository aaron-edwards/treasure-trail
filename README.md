# Treasure Trail

A whimsical QR-powered scavenger hunt app for a birthday treasure trail, built with Next.js, Tailwind CSS v4, and lightweight shadcn-style UI primitives.

## Overview

The app is currently configured from a single JSON file and is designed so that the data source can later move to a server without rewriting the UI.

Current experience:

- `/` landing page with the intro poem, Bubbles the unicorn, and read-aloud
- `/hunt/[stepId]` clue pages with poem clues, buddy art, URL-driven scanner states, and read-aloud
- `/done` finale page with read-aloud
- `/dev/qrs` printable QR sheet that uses the current host automatically

## Commands

```bash
pnpm install
pnpm dev
pnpm speech:sync
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

Generated narration URLs live in [`src/content/speech-manifest.json`](./src/content/speech-manifest.json). The app reads from that manifest and falls back to browser speech when a page has no generated audio URL.

## Theme Assets

The current unicorn theme is defined in [`src/lib/themes.ts`](./src/lib/themes.ts).

Unicorn artwork lives in:

- [`public/media/unicorns/unicorn-intro.png`](./public/media/unicorns/unicorn-intro.png)
- [`public/media/unicorns/unicorn-yay.png`](./public/media/unicorns/unicorn-yay.png)
- [`public/media/unicorns/unicorn-1.png`](./public/media/unicorns/unicorn-1.png) through [`public/media/unicorns/unicorn-8.png`](./public/media/unicorns/unicorn-8.png)
- generated narration URLs in [`src/content/speech-manifest.json`](./src/content/speech-manifest.json)

## Project Notes

- The home and clue pages are optimized for mobile-first use during an actual scavenger hunt.
- Clue pages use `?scanner=open` to open the camera dialog and `?scanner=success` to show the success state.
- Solution QR codes now point to the current clue's success route instead of directly to the next clue.
- Voiceover uses generated narration URLs from `speech-manifest.json` when available, and otherwise falls back to the browser `speechSynthesis` API.
- Auto-read and voice selection are stored in session storage.
- The default voice behavior prefers `Karen`, then other `en-AU`, then English voices when no explicit voice is selected.
- The QR sheet uses the current request host instead of a stored base URL.
- `pnpm speech:sync` is the build-time hook for generated narration. It uses Vercel Blob plus the Gemini API when present, and otherwise leaves the manifest alone so builds still succeed.
- Generated speech uses a verse-style prompt that asks Gemini TTS to read the poem like a whimsical children's story, preserving the authored line breaks.
- If the content model, routes, or theme system changes, update this README and `AGENTS.md` in the same change.

## Speech Setup

Copy [`.env.example`](./.env.example) to `.env.local` for local generation, then set:

- `BLOB_READ_WRITE_TOKEN`
- `GEMINI_API_KEY`

The sync script has built-in defaults for the non-secret settings:

- model: `gemini-2.5-flash-preview-tts`
- voice: `Puck`
- output: `WAV` converted from Gemini PCM audio
- style: whimsical children's story poem with preserved line breaks

You can still override those with optional env vars like `GEMINI_TTS_VOICE`, `GEMINI_TTS_MODEL`, and `GEMINI_TTS_STYLE` later if you want.

`pnpm build` now runs `pnpm speech:sync` first. The sync script hashes the generation prompt plus voice settings, reuses existing manifest entries when the hash matches, and uploads newly generated audio to Vercel Blob.
