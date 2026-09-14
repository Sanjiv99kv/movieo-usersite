import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const BOOKING_STEPS = ["Movie", "Cinema", "Seats", "Payment", "Confirmation"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-1 overflow-x-auto pb-1 hide-scrollbar sm:gap-2">
      {BOOKING_STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step} className="flex shrink-0 items-center gap-1 sm:gap-2">
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold transition",
                done && "bg-primary/20 text-primary",
                active && "bg-primary text-primary-foreground",
                !done && !active && "bg-secondary text-muted-foreground",
              )}
            >
              {done ? <Check className="size-3.5" /> : index + 1}
            </span>
            <span
              className={cn(
                "text-xs font-semibold",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step}
            </span>
            {index < BOOKING_STEPS.length - 1 && (
              <span className={cn("h-px w-5 sm:w-8", done ? "bg-primary/50" : "bg-border")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
