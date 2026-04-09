"use client";

import { ScanQrCode } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

import { ThemeBuddy } from "@/components/theme-buddy";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type BarcodeDetectorLike = {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>>;
};

type BarcodeDetectorConstructor = new (options?: {
  formats?: string[];
}) => BarcodeDetectorLike;

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
  }
}

type ScanPhase = "scanner" | "success";
type ScannerFeedback = "idle" | "error" | "success";

type ClueScannerDialogProps = {
  expectedDestination: string;
  successMessage: string;
  continueLabel: string;
};

const CELEBRATION_MESSAGES = [
  "A clever find, right on cue.",
  "That little rhyme led true.",
  "You found the spot. Hooray for you.",
  "Another verse is fluttering through.",
  "Your unicorn buddy approves of you.",
];

const CONFETTI_PIECES = Array.from({ length: 20 }, (_, index) => ({
  id: `confetti-${index + 1}`,
  offset: index,
  left: [
    8, 18, 29, 40, 51, 63, 74, 85, 12, 23, 35, 46, 58, 69, 81, 15, 27, 49, 66,
    78,
  ][index],
  top: [
    9, 6, 11, 7, 13, 8, 12, 10, 20, 17, 22, 18, 24, 19, 21, 30, 27, 29, 26, 31,
  ][index],
}));

function normalizePathname(value: string) {
  return value.replace(/\/+$/, "") || "/";
}

function getQrPathname(value: string) {
  try {
    return normalizePathname(new URL(value, window.location.href).pathname);
  } catch {
    return null;
  }
}

export function ClueScannerDialog({
  expectedDestination,
  successMessage,
  continueLabel,
}: ClueScannerDialogProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<BarcodeDetectorLike | null>(null);
  const frameRef = useRef<number | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);
  const processingRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<ScanPhase>("scanner");
  const [feedback, setFeedback] = useState<ScannerFeedback>("idle");
  const [statusMessage, setStatusMessage] = useState(
    "Hold the hidden QR inside the frame and keep the phone steady for a moment.",
  );
  const [celebrationMessage, setCelebrationMessage] = useState(successMessage);
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      if (feedbackTimeoutRef.current) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }

      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) {
          track.stop();
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!open || phase !== "scanner") {
      processingRef.current = false;
      setFeedback("idle");

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      if (feedbackTimeoutRef.current) {
        window.clearTimeout(feedbackTimeoutRef.current);
        feedbackTimeoutRef.current = null;
      }

      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) {
          track.stop();
        }
        streamRef.current = null;
      }

      return;
    }

    const hasCameraAccess =
      typeof navigator.mediaDevices?.getUserMedia === "function";
    const BarcodeDetectorCtor = window.BarcodeDetector;

    if (!window.isSecureContext) {
      setAvailabilityMessage(
        "The in-app scanner needs HTTPS or localhost. You can still use the regular phone camera as a fallback.",
      );
      return;
    }

    if (!hasCameraAccess || !BarcodeDetectorCtor) {
      setAvailabilityMessage(
        "This browser does not expose the camera QR scanning APIs needed for the in-app scanner.",
      );
      return;
    }

    setAvailabilityMessage(null);
    let cancelled = false;

    async function startScanner() {
      setStatusMessage("Opening the camera...");

      try {
        const ActiveBarcodeDetectorCtor = window.BarcodeDetector;
        if (!ActiveBarcodeDetectorCtor) {
          setAvailabilityMessage(
            "This browser does not expose the camera QR scanning APIs needed for the in-app scanner.",
          );
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: {
              ideal: "environment",
            },
          },
        });

        if (cancelled) {
          for (const track of stream.getTracks()) {
            track.stop();
          }
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        detectorRef.current = new ActiveBarcodeDetectorCtor({
          formats: ["qr_code"],
        });
        setStatusMessage(
          "Camera is live. Hold the QR inside the frame and we will check it automatically.",
        );

        const expectedPathname = normalizePathname(expectedDestination);

        const scanFrame = async () => {
          if (cancelled || !videoRef.current || !detectorRef.current) {
            return;
          }

          if (processingRef.current) {
            frameRef.current = requestAnimationFrame(scanFrame);
            return;
          }

          if (
            videoRef.current.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
          ) {
            try {
              const barcodes = await detectorRef.current.detect(
                videoRef.current,
              );
              const qrValue = barcodes.find(
                (barcode) => barcode.rawValue,
              )?.rawValue;

              if (qrValue) {
                processingRef.current = true;
                const scannedPathname = getQrPathname(qrValue);

                if (scannedPathname === expectedPathname) {
                  setFeedback("success");
                  setStatusMessage("That is the right QR.");
                  setCelebrationMessage(
                    CELEBRATION_MESSAGES[
                      Math.floor(Math.random() * CELEBRATION_MESSAGES.length)
                    ] ?? successMessage,
                  );

                  feedbackTimeoutRef.current = window.setTimeout(() => {
                    if (streamRef.current) {
                      for (const track of streamRef.current.getTracks()) {
                        track.stop();
                      }
                      streamRef.current = null;
                    }

                    setPhase("success");
                    setFeedback("idle");
                    processingRef.current = false;
                  }, 360);

                  return;
                }

                setFeedback("error");
                setStatusMessage(
                  "That QR is not the one for this clue. Try the hidden code at this spot.",
                );

                feedbackTimeoutRef.current = window.setTimeout(() => {
                  setFeedback("idle");
                  setStatusMessage(
                    "Hold the hidden QR inside the frame and keep the phone steady for a moment.",
                  );
                  processingRef.current = false;
                  frameRef.current = requestAnimationFrame(scanFrame);
                }, 820);

                return;
              }
            } catch {
              setStatusMessage(
                "The camera opened, but QR detection failed on this device. You can still use the regular phone camera as a fallback.",
              );
              processingRef.current = false;
              return;
            }
          }

          frameRef.current = requestAnimationFrame(scanFrame);
        };

        frameRef.current = requestAnimationFrame(scanFrame);
      } catch (error) {
        const denied =
          error instanceof DOMException &&
          (error.name === "NotAllowedError" ||
            error.name === "PermissionDeniedError");

        setAvailabilityMessage(
          denied
            ? "Camera permission was denied. Allow camera access in the browser and try again."
            : "Could not open the camera. On mobile this usually needs HTTPS and a supported browser.",
        );
      }
    }

    void startScanner();

    return () => {
      cancelled = true;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) {
          track.stop();
        }
        streamRef.current = null;
      }
    };
  }, [expectedDestination, open, phase, successMessage]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setPhase("scanner");
      setFeedback("idle");
      setAvailabilityMessage(null);
      setStatusMessage(
        "Hold the hidden QR inside the frame and keep the phone steady for a moment.",
      );
      setCelebrationMessage(successMessage);
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto" size="lg" type="button">
          <ScanQrCode className="h-4 w-4" />
          Open scanner
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        {phase === "success" ? (
          <div className="relative space-y-5 overflow-hidden py-2">
            <div className="confetti-burst" aria-hidden="true">
              {CONFETTI_PIECES.map((piece) => (
                <span
                  className="confetti-piece"
                  key={piece.id}
                  style={
                    {
                      "--confetti-index": piece.offset,
                      "--confetti-left": `${piece.left}%`,
                      "--confetti-top": `${piece.top}%`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <div className="relative z-10 space-y-3 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
                Sparkly Success
              </p>
              <h3 className="font-serif text-4xl text-[color:var(--foreground)] sm:text-5xl">
                {celebrationMessage}
              </h3>
            </div>

            <ThemeBuddy
              className="relative z-10 mx-auto"
              imageOnly
              message=""
              variant="celebration"
            />

            <div className="relative z-10 flex justify-center pt-1">
              <Button
                className="w-full shadow-none hover:translate-y-0 sm:w-auto"
                onClick={() => window.location.assign(expectedDestination)}
                size="lg"
                type="button"
              >
                {continueLabel}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="pr-10">
              <DialogHeader className="gap-1.5">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
                  Scanner
                </p>
                <DialogTitle>Scan the hidden QR</DialogTitle>
              </DialogHeader>
            </div>

            {availabilityMessage ? (
              <div className="rounded-[24px] border border-[rgba(220,110,110,0.35)] bg-[rgba(255,244,244,0.9)] p-4 text-sm leading-6 text-[color:#8f4b4b]">
                {availabilityMessage}
              </div>
            ) : (
              <>
                <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-[color:var(--paper)] p-3 shadow-inner sm:p-4">
                  <div className="aspect-square overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,rgba(241,232,216,0.88),rgba(229,217,202,0.75))]">
                    <video
                      autoPlay
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                      ref={videoRef}
                    />
                  </div>
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-[1.4rem] rounded-[24px] border-4 border-white/85 shadow-[0_0_0_999px_rgba(255,255,255,0.06)] transition-colors duration-200 sm:inset-[1.9rem]",
                      feedback === "success" &&
                        "border-[#5dc978] shadow-[0_0_0_999px_rgba(93,201,120,0.18)]",
                      feedback === "error" &&
                        "border-[#e56e78] shadow-[0_0_0_999px_rgba(229,110,120,0.18)]",
                    )}
                  />
                </div>

                <p className="px-2 text-center text-sm leading-6 text-[color:var(--muted-foreground)]">
                  {statusMessage}
                </p>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
