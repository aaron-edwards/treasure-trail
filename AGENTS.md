# AGENTS.md

## Purpose

This repository contains `Treasure Trail`, a whimsical birthday scavenger hunt app. It is optimized for phone use, poem-based clue presentation, and QR-code progression between clue pages.

## Current Stack

- Next.js App Router
- React
- Tailwind CSS v4
- TypeScript
- Biome
- Small local shadcn-style UI primitives in `src/components/ui`

## Source Of Truth

- Hunt content: `src/content/hunt.json`
- Theme definitions and buddy artwork mapping: `src/lib/themes.ts`
- Hunt helpers: `src/lib/hunt.ts`

When changing the content model, routes, theme structure, or important workflows, update both `README.md` and this file in the same change.

## Main Routes

- `/`
  - Intro screen with the opening poem, Bubbles, and browser read-aloud
- `/hunt/[stepId]`
  - Individual clue screen with URL-driven scanner dialog states and browser read-aloud
- `/done`
  - Celebration/finale screen with browser read-aloud
- `/dev/qrs`
  - Print-first QR sheet for the current host

## UI Intent

- Prioritize mobile-first layout and readable poem lines.
- Keep the app playful and whimsical, not dashboard-like.
- Avoid adding builder-facing copy to participant-facing screens unless explicitly requested.
- Keep the home screen and clue screens visually related.
- Bubbles should feel like a supporting visual character, not a noisy decoration.
- The scanner flow should use route/query state where practical, validate the expected success URL for the current clue, and clearly signal success or incorrect scans.
- Voiceover should stay simple and close to the earlier present-hunt implementation, with best-effort auto-read plus a manual reread button.
- The QR sheet should stay easy to print and avoid unnecessary explanatory UI.

## Content Rules

- Poem lines are authored intentionally and should not be casually rewritten.
- Prefer preserving authored poem line breaks, especially on mobile.
- Remove unused content fields from `src/content/hunt.json` when the UI no longer needs them.

## Working Rules

- Run `pnpm lint` and `pnpm build` after meaningful UI or content-structure changes when practical.
- Do not commit incidental generated-file drift unless it is intentionally required.
- Keep README and AGENTS current as the project evolves.
