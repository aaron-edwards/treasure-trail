import { getHunt } from "@/lib/hunt";

export type ThemeBuddyVariant =
  | "intro"
  | "celebration"
  | "step1"
  | "step2"
  | "step3"
  | "step4"
  | "step5"
  | "step6"
  | "step7";

export type ThemeDefinition = {
  id: string;
  label: string;
  buddyName: string;
  buddyTitle: string;
  buddyGlowClassName: string;
  buddyArt: Record<
    ThemeBuddyVariant,
    {
      alt: string;
      src: string;
    }
  >;
};

const themes: Record<string, ThemeDefinition> = {
  unicorn: {
    id: "unicorn",
    label: "Unicorn Parade",
    buddyName: "Bubbles",
    buddyTitle: "Treasure Trail Guide",
    buddyGlowClassName:
      "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(255,255,255,0)_66%),linear-gradient(135deg,rgba(232,85,108,0.24),rgba(247,166,74,0.22),rgba(122,204,255,0.24))]",
    buddyArt: {
      intro: {
        alt: "A whimsical unicorn buddy waving hello.",
        src: "/media/unicorns/unicorn-intro.png",
      },
      celebration: {
        alt: "A whimsical unicorn buddy celebrating with party energy.",
        src: "/media/unicorns/unicorn-yay.png",
      },
      step1: {
        alt: "A whimsical unicorn buddy with a triceratops friend.",
        src: "/media/unicorns/unicorn-1.png",
      },
      step2: {
        alt: "A whimsical unicorn buddy carrying flowers.",
        src: "/media/unicorns/unicorn-2.png",
      },
      step3: {
        alt: "A whimsical unicorn buddy painting a rainbow.",
        src: "/media/unicorns/unicorn-3.png",
      },
      step4: {
        alt: "A whimsical unicorn buddy driving a racecar.",
        src: "/media/unicorns/unicorn-4.png",
      },
      step5: {
        alt: "A whimsical unicorn buddy eating a frosted donut.",
        src: "/media/unicorns/unicorn-5.png",
      },
      step6: {
        alt: "A whimsical unicorn buddy blowing bubbles.",
        src: "/media/unicorns/unicorn-6.png",
      },
      step7: {
        alt: "A whimsical unicorn buddy dressed as a birthday wizard.",
        src: "/media/unicorns/unicorn-7.png",
      },
    },
  },
};

export function getActiveTheme() {
  const themeId = getHunt().event.themeId;

  return themes[themeId] ?? themes.unicorn;
}

export function getStepBuddyVariant(stepNumber: number): ThemeBuddyVariant {
  const clampedStepNumber = Math.max(1, Math.min(7, stepNumber));

  return `step${clampedStepNumber}` as ThemeBuddyVariant;
}
