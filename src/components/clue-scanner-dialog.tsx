"use client";

import { CheckCircle2, ScanQrCode, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ThemeBuddy } from "@/components/theme-buddy";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  }, [expectedDestination, open, phase]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setPhase("scanner");
      setFeedback("idle");
      setAvailabilityMessage(null);
      setStatusMessage(
        "Hold the hidden QR inside the frame and keep the phone steady for a moment.",
      );
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
          <div className="space-y-5 py-2">
            <div className="space-y-3 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[linear-gradient(135deg,#83d986,#41ba6f)] text-white shadow-[0_16px_34px_rgba(65,186,111,0.28)]">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
                QR matched
              </p>
              <h3 className="font-serif text-4xl text-[color:var(--foreground)]">
                {successMessage}
              </h3>
              <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
                You found the correct code. Ready for the next part of the
                treasure trail?
              </p>
            </div>

            <ThemeBuddy
              className="bg-[linear-gradient(180deg,rgba(255,248,233,0.86),rgba(255,255,255,0.74))]"
              message="Bubbles approves. Sparkles, prancing, onward."
              variant="celebration"
            />

            <div className="flex justify-center">
              <Button
                className="w-full sm:w-auto"
                onClick={() => window.location.assign(expectedDestination)}
                size="lg"
                type="button"
              >
                {continueLabel}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <DialogHeader>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
                Scanner
              </p>
              <DialogTitle>Scan the hidden QR</DialogTitle>
              <DialogDescription>
                Use the in-app camera to check the code at this clue location.
              </DialogDescription>
            </DialogHeader>

            {availabilityMessage ? (
              <div className="rounded-[24px] border border-[rgba(220,110,110,0.35)] bg-[rgba(255,244,244,0.9)] p-4 text-sm leading-6 text-[color:#8f4b4b]">
                {availabilityMessage}
              </div>
            ) : (
              <>
                <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-[color:var(--paper)] p-3 shadow-inner">
                  <div className="aspect-[3/4] overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,rgba(241,232,216,0.88),rgba(229,217,202,0.75))]">
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
                      "pointer-events-none absolute inset-[1.7rem] rounded-[24px] border-4 border-white/85 shadow-[0_0_0_999px_rgba(255,255,255,0.06)] transition-colors duration-200",
                      feedback === "success" &&
                        "border-[#5dc978] shadow-[0_0_0_999px_rgba(93,201,120,0.18)]",
                      feedback === "error" &&
                        "border-[#e56e78] shadow-[0_0_0_999px_rgba(229,110,120,0.18)]",
                    )}
                  />
                </div>

                <p className="text-center text-sm leading-6 text-[color:var(--muted-foreground)]">
                  {statusMessage}
                </p>
              </>
            )}

            <div className="flex items-start gap-3 rounded-[22px] bg-white/65 p-4">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent-ink)]" />
              <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
                If your browser blocks the in-app scanner, you can still use the
                phone camera app to open the next clue as a fallback.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
