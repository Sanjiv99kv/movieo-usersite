import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { formatRupees } from "@/data/booking";
import type { FoodItem } from "@/data/movieo";
import { cn } from "@/lib/utils";

/** The square veg / non-veg mark used on Indian menus. */
export function VegMark({ veg }: { veg: boolean }) {
  return (
    <span
      role="img"
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
      className={cn(
        "grid size-4 shrink-0 place-items-center rounded-[3px] border",
        veg ? "border-emerald-500" : "border-red-500",
      )}
    >
      <span className={cn("size-2 rounded-full", veg ? "bg-emerald-500" : "bg-red-500")} />
    </span>
  );
}

export function FoodCard({ item }: { item: FoodItem }) {
  return (
    <article className="group relative flex flex-col rounded-lg bg-card p-4 ring-1 ring-inset ring-border transition duration-300 hover:-translate-y-0.5 hover:ring-primary/40">
      <div className="flex items-center gap-2">
        <VegMark veg={item.veg} />
        {item.tag && (
          <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
            {item.tag}
          </span>
        )}
      </div>

      <h3 className="mt-2.5 font-semibold leading-tight">{item.name}</h3>
      <p className="mt-1 flex-1 text-xs leading-5 text-muted-foreground">{item.detail}</p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="font-display text-base font-bold">{formatRupees(item.price)}</span>
        <Button asChild size="sm" variant="outline" className="h-8">
          {/* Food is attached to a booking, so adding starts by picking a show. */}
          <Link to="/movies">Add</Link>
        </Button>
      </div>
    </article>
  );
}
