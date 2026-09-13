import { Check, MapPin, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cities } from "@/data/cinebook";
import { cn } from "@/lib/utils";
import { useCinebook } from "@/store/cinebook-context";

export function CitySelector({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { city, setCity, recentCities } = useCinebook();
  const [query, setQuery] = useState("");

  const term = query.trim().toLowerCase();
  const matches = cities.filter((item) => item.toLowerCase().includes(term));

  const choose = (next: string) => {
    setCity(next);
    setQuery("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card">
        <DialogTitle>Where are you watching?</DialogTitle>
        <DialogDescription>Choose a city to see nearby movies and showtimes.</DialogDescription>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search city"
            className="pl-10"
          />
        </div>

        {!term && recentCities.length > 0 && (
          <div>
            <p className="eyebrow mb-2">Recently selected</p>
            <div className="flex flex-wrap gap-2">
              {recentCities.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => choose(item)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-sm transition hover:bg-accent"
                >
                  <MapPin className="size-3.5 text-muted-foreground" />
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="eyebrow mb-2">{term ? "Matching cities" : "Popular cities"}</p>
          {matches.length ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {matches.map((item) => (
                <Button
                  key={item}
                  variant={item === city ? "default" : "outline"}
                  onClick={() => choose(item)}
                  className={cn("justify-between", item === city && "pointer-events-none")}
                >
                  {item}
                  {item === city && <Check className="size-4" />}
                </Button>
              ))}
            </div>
          ) : (
            <p className="py-4 text-sm text-muted-foreground">
              No city matches “{query}”. We are adding new cities every month.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
