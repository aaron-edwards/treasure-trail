"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SpeechSettingsContextValue = {
  autoRead: boolean;
  isReady: boolean;
  selectedVoiceUri: string | null;
  setAutoRead: (value: boolean) => void;
  setSelectedVoiceUri: (value: string | null) => void;
  voices: SpeechSynthesisVoice[];
};

const AUTO_READ_STORAGE_KEY = "treasure-trail:auto-read";
const SELECTED_VOICE_STORAGE_KEY = "treasure-trail:selected-voice";

const SpeechSettingsContext = createContext<SpeechSettingsContextValue | null>(
  null,
);

export function SpeechSettingsProvider({ children }: { children: ReactNode }) {
  const [autoRead, setAutoReadState] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [selectedVoiceUri, setSelectedVoiceUriState] = useState<string | null>(
    null,
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedAutoRead = window.sessionStorage.getItem(AUTO_READ_STORAGE_KEY);
    if (storedAutoRead !== null) {
      setAutoReadState(storedAutoRead === "true");
    }

    const storedVoice = window.sessionStorage.getItem(
      SELECTED_VOICE_STORAGE_KEY,
    );
    if (storedVoice) {
      setSelectedVoiceUriState(storedVoice);
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isReady) {
      return;
    }

    window.sessionStorage.setItem(AUTO_READ_STORAGE_KEY, String(autoRead));
  }, [autoRead, isReady]);

  useEffect(() => {
    if (typeof window === "undefined" || !isReady) {
      return;
    }

    if (selectedVoiceUri) {
      window.sessionStorage.setItem(
        SELECTED_VOICE_STORAGE_KEY,
        selectedVoiceUri,
      );
      return;
    }

    window.sessionStorage.removeItem(SELECTED_VOICE_STORAGE_KEY);
  }, [isReady, selectedVoiceUri]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const updateVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    updateVoices();
    window.speechSynthesis.addEventListener("voiceschanged", updateVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
    };
  }, []);

  const value = useMemo(
    () => ({
      autoRead,
      isReady,
      selectedVoiceUri,
      setAutoRead: setAutoReadState,
      setSelectedVoiceUri: setSelectedVoiceUriState,
      voices,
    }),
    [autoRead, isReady, selectedVoiceUri, voices],
  );

  return (
    <SpeechSettingsContext.Provider value={value}>
      {children}
    </SpeechSettingsContext.Provider>
  );
}

export function useSpeechSettings() {
  const context = useContext(SpeechSettingsContext);

  if (!context) {
    throw new Error(
      "useSpeechSettings must be used within a SpeechSettingsProvider",
    );
  }

  return context;
}
