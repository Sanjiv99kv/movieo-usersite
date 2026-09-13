import { Armchair, AudioLines, ChevronRight, Maximize, Vibrate, Waves, Wine } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import type { FormatCard as FormatCardData } from "@/data/cinebook";
import { cn } from "@/lib/utils";

/** Each format gets its own mark — six identical sparkles read as unfinished. */
const FORMAT_ICONS: Record<FormatCardData["icon"], LucideIcon> = {
  imax: Maximize,
  atmos: AudioLines,
  "4dx": Waves,
  mx4d: Vibrate,
  recliner: Armchair,
  premiere: Wine,
};

export function FormatCard({ format }: { format: FormatCardData }) {
  const Icon = FORMAT_ICONS[format.icon];

  return (
    // The whole card is the link — an "Explore" affordance repeated six times gave a
    // tiny hit area and said nothing the card had not already said.
    <Link
      to="/cinemas"
      className="group relative flex flex-col overflow-hidden rounded-xl bg-card p-6 transition duration-500 hover:-translate-y-1"
    >
      <div
        className={cn(
          format.tone,
          "pointer-events-none absolute inset-0 opacity-20 transition duration-500 group-hover:opacity-40",
        )}
      />

      <div className="relative flex items-start justify-between gap-4">
        <span className="grid size-11 place-items-center rounded-lg bg-background/60 text-primary backdrop-blur transition duration-500 group-hover:scale-110">
          <Icon className="size-5" />
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition duration-500 group-hover:translate-x-1 group-hover:text-primary" />
      </div>

      <h3 className="relative mt-6 font-display text-2xl font-bold">{format.name}</h3>
      <p className="relative mt-2 flex-1 text-sm leading-6 text-muted-foreground">{format.copy}</p>

      <p className="relative mt-5 border-t border-border/70 pt-4 text-xs font-semibold uppercase tracking-wide text-foreground/70">
        {format.detail}
      </p>

      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-border transition duration-500 group-hover:ring-primary/50" />
    </Link>
  );
}
