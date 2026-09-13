import { Navigation, Search } from "lucide-react";
import { useState } from "react";

import { CinemaRow } from "@/components/cinebook/CinemaCard";
import { CinemaCardSkeleton } from "@/components/cinebook/Skeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cinemas } from "@/data/cinebook";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSimulatedLoad } from "@/hooks/use-simulated-load";
import { useCinebook } from "@/store/cinebook-context";

export default function CinemasPage() {
  usePageMeta({
    title: "Cinemas Near You — CineBook",
    description: "Explore premium cinemas, screens and movie showtimes near you.",
    ogDescription: "Explore premium cinemas and movie showtimes near you.",
  });

  const { city } = useCinebook();
  const loading = useSimulatedLoad(500);
  const [query, setQuery] = useState("");

  const term = query.trim().toLowerCase();
  const filtered = cinemas.filter(
    (cinema) =>
      cinema.name.toLowerCase().includes(term) ||
      cinema.location.toLowerCase().includes(term) ||
      cinema.amenities.some((amenity) => amenity.toLowerCase().includes(term)),
  );

  return (
    <div className="page-shell pb-24 pt-32">
      <span className="eyebrow">{city}</span>
      <h1 className="mt-3 font-display text-4xl font-bold sm:text-6xl">
        Find your perfect screen.
      </h1>

      <div className="mt-8 flex max-w-2xl items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search cinemas, neighbourhoods or formats"
            className="h-12 bg-card pl-12"
          />
        </div>
        <Button size="icon" variant="outline" aria-label="Use current location">
          <Navigation />
        </Button>
      </div>

      <div className="mt-12 space-y-5">
        {loading ? (
          <>
            <CinemaCardSkeleton />
            <CinemaCardSkeleton />
            <CinemaCardSkeleton />
          </>
        ) : filtered.length ? (
          filtered.map((cinema) => <CinemaRow key={cinema.id} cinema={cinema} />)
        ) : (
          <div className="rounded-lg border border-dashed border-border py-20 text-center">
            <h2 className="font-display text-2xl font-bold">No cinemas match “{query}”.</h2>
            <p className="mt-2 text-muted-foreground">Try a neighbourhood or a format like IMAX.</p>
            <Button className="mt-6" variant="outline" onClick={() => setQuery("")}>
              Clear search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
