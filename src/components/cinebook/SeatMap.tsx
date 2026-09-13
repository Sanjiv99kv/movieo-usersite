import { useMemo } from "react";

import { formatRupees, seatTiers, type Seat, type SeatRow } from "@/data/booking";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<Seat["status"], string> = {
  available: "available",
  occupied: "already booked",
  locked: "temporarily locked",
};

export function SeatMap({
  rows,
  selected,
  onToggle,
  maxSeats = 10,
}: {
  rows: SeatRow[];
  selected: string[];
  onToggle: (seat: Seat) => void;
  maxSeats?: number;
}) {
  const byTier = useMemo(
    () =>
      seatTiers
        .map((tier) => ({ tier, rows: rows.filter((row) => row.tier.id === tier.id) }))
        .filter((group) => group.rows.length > 0),
    [rows],
  );

  const atLimit = selected.length >= maxSeats;

  return (
    <div className="overflow-x-auto pb-2 hide-scrollbar">
      <div className="mx-auto w-max min-w-full px-2">
        <div className="mx-auto mb-2 h-1.5 w-[70%] rounded-full bg-primary/70 shadow-glow" />
        <p className="mb-9 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Screen this way
        </p>

        {byTier.map(({ tier, rows: tierRows }) => (
          <section key={tier.id} className="mb-8">
            <div className="mb-3 flex items-center gap-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {tier.name}
              </h3>
              <span className="text-xs text-muted-foreground">
                {formatRupees(tierRows[0]?.groups[0]?.[0]?.price ?? tier.price)}
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-2">
              {tierRows.map((row) => (
                <div key={row.row} className="flex items-center gap-4">
                  <span className="w-4 shrink-0 text-xs font-semibold text-muted-foreground">
                    {row.row}
                  </span>
                  <div className="flex gap-5">
                    {row.groups.map((group, index) => (
                      <div key={index} className="flex gap-1.5">
                        {group.map((seat) => {
                          const isSelected = selected.includes(seat.id);
                          const taken = seat.status !== "available";
                          const blocked = taken || (atLimit && !isSelected);
                          return (
                            <button
                              key={seat.id}
                              type="button"
                              disabled={blocked}
                              aria-pressed={isSelected}
                              aria-label={`Seat ${seat.id}, ${formatRupees(seat.price)}, ${
                                isSelected ? "selected" : STATUS_LABEL[seat.status]
                              }`}
                              onClick={() => onToggle(seat)}
                              className={cn(
                                "size-7 rounded-md border text-[10px] font-semibold transition",
                                isSelected &&
                                  "seat-pop border-primary bg-primary text-primary-foreground",
                                !isSelected &&
                                  seat.status === "available" &&
                                  "border-border bg-surface-raised text-muted-foreground hover:border-primary hover:text-foreground",
                                seat.status === "occupied" &&
                                  "cursor-not-allowed border-transparent bg-muted/60 text-muted-foreground/40",
                                seat.status === "locked" &&
                                  "cursor-not-allowed border-dashed border-muted-foreground/40 bg-transparent text-muted-foreground/40",
                                blocked && !taken && "cursor-not-allowed opacity-40",
                              )}
                            >
                              {seat.number}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export function SeatLegend() {
  const items = [
    { label: "Available", className: "border-border bg-surface-raised" },
    { label: "Selected", className: "border-primary bg-primary" },
    { label: "Occupied", className: "border-transparent bg-muted/60" },
    { label: "Locked", className: "border-dashed border-muted-foreground/40 bg-transparent" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={cn("size-4 rounded border", item.className)} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
