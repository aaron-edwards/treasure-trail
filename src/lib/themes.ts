import { getHunt } from "@/lib/hunt";

export type ThemeDefinition = {
  id: string;
  label: string;
  buddyName: string;
  buddyTitle: string;
  buddyEmoji: string;
  buddyGlowClassName: string;
};

const themes: Record<string, ThemeDefinition> = {
  unicorn: {
    id: "unicorn",
    label: "Unicorn Parade",
    buddyName: "Pippin",
    buddyTitle: "Starlight Trail Guide",
    buddyEmoji: "🦄",
    buddyGlowClassName:
      "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(255,255,255,0)_66%),linear-gradient(135deg,rgba(232,85,108,0.24),rgba(247,166,74,0.22),rgba(122,204,255,0.24))]",
  },
};

export function getActiveTheme() {
  const themeId = getHunt().event.themeId;

  return themes[themeId] ?? themes.unicorn;
}
