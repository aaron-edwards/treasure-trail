"use client";

import { Volume2 } from "lucide-react";
import { useEffect } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PoemReaderProps = {
  lines: string[];
  className?: string;
};

function getPreferredVoice(voices: SpeechSynthesisVoice[]) {
  return (
    voices.find(
      (voice) =>
        voice.name.toLowerCase().includes("karen") &&
        voice.lang.toLowerCase() === "en-au",
    ) ??
    voices.find((voice) => voice.lang.toLowerCase() === "en-au") ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ??
    null
  );
}

function speakLines(lines: string[]) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.info("[speech] browser support: unavailable");
    return false;
  }

  const text = lines.join(" ");
  if (!text.trim()) {
    console.warn("[speech] speak aborted: empty text");
    return false;
  }

  const synthesis = window.speechSynthesis;
  console.info("[speech] browser support: available");

  synthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  utterance.volume = 1;

  const voices = synthesis.getVoices();
  console.info("[speech] voices loaded", {
    count: voices.length,
    voices: voices.map((voice) => ({
      default: voice.default,
      lang: voice.lang,
      name: voice.name,
      voiceURI: voice.voiceURI,
    })),
  });

  const preferredVoice = getPreferredVoice(voices);

  if (preferredVoice) {
    utterance.voice = preferredVoice;
    utterance.lang = preferredVoice.lang;
  }

  utterance.onstart = () => {
    console.info("[speech] utterance started", {
      lang: utterance.lang,
      voice: utterance.voice?.name ?? null,
    });
  };

  utterance.onend = () => {
    console.info("[speech] utterance ended");
  };

  utterance.onerror = (event) => {
    console.error("[speech] utterance error", {
      error: event.error,
    });
  };

  synthesis.speak(utterance);
  console.info("[speech] speak requested", {
    hasVoices: voices.length > 0,
    lang: utterance.lang,
    pending: synthesis.pending,
    paused: synthesis.paused,
    speaking: synthesis.speaking,
    textLength: text.length,
    voice: preferredVoice?.name ?? null,
  });

  window.setTimeout(() => {
    console.info("[speech] state after 120ms", {
      paused: synthesis.paused,
      pending: synthesis.pending,
      speaking: synthesis.speaking,
    });
  }, 120);

  return true;
}

export function PoemReader({ lines, className }: PoemReaderProps) {
  useEffect(() => {
    const attempt = () => {
      speakLines(lines);
    };

    attempt();
    window.speechSynthesis?.addEventListener("voiceschanged", attempt);

    return () => {
      window.speechSynthesis?.removeEventListener("voiceschanged", attempt);
      window.speechSynthesis?.cancel();
    };
  }, [lines]);

  return (
    <button
      className={cn(
        buttonVariants({
          className: "w-full sm:w-auto",
          size: "sm",
          variant: "secondary",
        }),
        className,
      )}
      onClick={() => {
        speakLines(lines);
      }}
      type="button"
    >
      <Volume2 className="h-4 w-4" />
      Read aloud
    </button>
  );
}
