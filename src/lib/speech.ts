import manifest from "@/content/speech-manifest.json";

type SpeechEntry = {
  hash: string;
  url: string;
} | null;

type SpeechManifest = {
  audioEncoding: string | null;
  event: {
    done: SpeechEntry;
    intro: SpeechEntry;
  };
  generatedAt: string | null;
  provider: string | null;
  steps: Record<string, SpeechEntry>;
};

const speechManifest = manifest as SpeechManifest;

export function getIntroSpeechUrl() {
  return speechManifest.event.intro?.url ?? null;
}

export function getDoneSpeechUrl() {
  return speechManifest.event.done?.url ?? null;
}

export function getStepSpeechUrl(stepId: string) {
  return speechManifest.steps[stepId]?.url ?? null;
}
