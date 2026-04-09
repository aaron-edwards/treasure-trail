"use client";

import { Volume2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { useSpeechSettings } from "@/components/speech-settings";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PoemReaderProps = {
  lines: string[];
  className?: string;
};

function getPreferredVoice(
  voices: SpeechSynthesisVoice[],
  selectedVoiceUri: string | null,
) {
  if (selectedVoiceUri) {
    const selectedVoice = voices.find(
      (voice) => voice.voiceURI === selectedVoiceUri,
    );

    if (selectedVoice) {
      return selectedVoice;
    }
  }

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

function speakLines(lines: string[], selectedVoiceUri: string | null) {
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
  utterance.rate = 0.8;
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

  const preferredVoice = getPreferredVoice(voices, selectedVoiceUri);

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
  const pathname = usePathname();
  const { autoRead, isReady, selectedVoiceUri } = useSpeechSettings();
  const autoReadPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isReady || !autoRead) {
      return;
    }

    if (autoReadPathRef.current === pathname) {
      return;
    }

    const attempt = () => {
      const spoke = speakLines(lines, selectedVoiceUri);

      if (spoke) {
        autoReadPathRef.current = pathname;
        window.speechSynthesis?.removeEventListener("voiceschanged", attempt);
      }
    };

    const timeoutId = window.setTimeout(attempt, 180);
    window.speechSynthesis?.addEventListener("voiceschanged", attempt);

    return () => {
      window.clearTimeout(timeoutId);
      window.speechSynthesis?.removeEventListener("voiceschanged", attempt);
    };
  }, [autoRead, isReady, lines, pathname, selectedVoiceUri]);

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
        speakLines(lines, selectedVoiceUri);
      }}
      type="button"
    >
      <Volume2 className="h-4 w-4" />
      Read aloud
    </button>
  );
}
