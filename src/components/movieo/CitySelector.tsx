import {
  Building2,
  Castle,
  Church,
  Landmark,
  LocateFixed,
  Mountain,
  Search,
  TreePalm,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cities, otherCities, popularCities, type PopularCity } from "@/data/movieo";
import { cn } from "@/lib/utils";
import { useMovieo } from "@/store/movieo-context";

const CITY_ICONS: Record<PopularCity["icon"], LucideIcon> = {
  arch: Landmark,
  tower: Castle,
  tech: Building2,
  fort: Castle,
  temple: Church,
  memorial: Landmark,
  coast: TreePalm,
  hills: Mountain,
};

/** Great-circle distance, good enough to pick the nearest city from a fix. */
function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

export function CitySelector({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { city, setCity, recentCities } = useMovieo();
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [locating, setLocating] = useState(false);

  const term = query.trim().toLowerCase();
  const matches = cities.filter((item) => item.toLowerCase().includes(term));

  const choose = (next: string) => {
    setCity(next);
    setQuery("");
    setShowAll(false);
    onOpenChange(false);
  };

  /**
   * There is no geocoding service here, so we take the browser's fix and snap it to the
   * nearest city we actually list — which is what the user can pick anyway.
   */
  const detect = () => {
    if (!navigator.geolocation) {
      toast.error("Your browser can't share a location.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        const nearest = popularCities.reduce((best, candidate) =>
          distanceKm(coords.latitude, coords.longitude, candidate.lat, candidate.lng) <
          distanceKm(coords.latitude, coords.longitude, best.lat, best.lng)
            ? candidate
            : best,
        );
        toast.success(`Nearest city: ${nearest.name}`);
        choose(nearest.name);
      },
      () => {
        setLocating(false);
        toast.error("Couldn't get your location. Pick a city below.");
      },
      { timeout: 8000 },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto border-border bg-card">
        <DialogTitle>Where are you watching?</DialogTitle>
        <DialogDescription className="sr-only">
          Choose a city to see nearby movies and showtimes.
        </DialogDescription>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for your city"
            className="h-11 pl-10"
          />
        </div>

        <button
          type="button"
          onClick={detect}
          disabled={locating}
          className="flex items-center gap-2 text-sm font-semibold text-primary transition hover:opacity-80 disabled:opacity-60"
        >
          <LocateFixed className={cn("size-4", locating && "animate-pulse")} />
          {locating ? "Detecting…" : "Detect my location"}
        </button>

        {term ? (
          <section className="border-t border-border pt-4">
            <p className="eyebrow mb-3">Matching cities</p>
            {matches.length ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
                {matches.map((item) => (
                  <CityLink key={item} name={item} active={item === city} onClick={choose} />
                ))}
              </div>
            ) : (
              <p className="py-6 text-sm text-muted-foreground">
                No city matches “{query}”. We are adding new cities every month.
              </p>
            )}
          </section>
        ) : (
          <>
            <section className="border-t border-border pt-5">
              <p className="mb-4 text-center text-sm font-semibold">Popular Cities</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {popularCities.map((item) => {
                  const Icon = CITY_ICONS[item.icon];
                  const active = item.name === city;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => choose(item.name)}
                      aria-pressed={active}
                      className={cn(
                        "group flex flex-col items-center gap-2 rounded-lg px-2 py-3 transition",
                        active ? "bg-primary/15" : "hover:bg-accent/60",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-8 transition",
                          active
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                        strokeWidth={1.25}
                      />
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          active ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {recentCities.length > 0 && !showAll && (
              <section className="border-t border-border pt-4">
                <p className="eyebrow mb-3">Recently selected</p>
                <div className="flex flex-wrap gap-2">
                  {recentCities.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => choose(item)}
                      className="rounded-md bg-secondary px-3 py-1.5 text-sm transition hover:bg-accent"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {showAll && (
              <section className="border-t border-border pt-5">
                <p className="mb-4 text-center text-sm font-semibold">Other Cities</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-5">
                  {otherCities.map((item) => (
                    <CityLink key={item} name={item} active={item === city} onClick={choose} />
                  ))}
                </div>
              </section>
            )}

            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="mx-auto block text-sm font-semibold text-primary transition hover:opacity-80"
            >
              {showAll ? "Hide all cities" : "View All Cities"}
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CityLink({
  name,
  active,
  onClick,
}: {
  name: string;
  active: boolean;
  onClick: (name: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(name)}
      aria-pressed={active}
      className={cn(
        "truncate text-left text-sm transition hover:text-foreground",
        active ? "font-semibold text-primary" : "text-muted-foreground",
      )}
    >
      {name}
    </button>
  );
}
