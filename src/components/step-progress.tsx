import { cn } from "@/lib/utils";

type StepProgressProps = {
  currentIndex: number;
  total: number;
};

export function StepProgress({ currentIndex, total }: StepProgressProps) {
  const markers = Array.from({ length: total }, (_, index) => index + 1);

  return (
    <>
      <p className="sr-only">
        Clue progress: step {currentIndex + 1} of {total}
      </p>
      <div className="flex flex-wrap gap-3" aria-hidden="true">
        {markers.map((marker, index) => (
          <span
            key={marker}
            className={cn(
              "h-3.5 w-12 rounded-full border border-white/70 bg-white/60 shadow-inner transition-colors",
              index <= currentIndex &&
                "border-transparent bg-[linear-gradient(135deg,var(--primary),var(--primary-2))]",
            )}
          />
        ))}
      </div>
    </>
  );
}
