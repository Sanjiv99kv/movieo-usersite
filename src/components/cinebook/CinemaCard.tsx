import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type { Cinema } from "@/data/cinebook";

/** Compact cinema tile used in the home page rail. */
export function CinemaCard({ cinema }: { cinema: Cinema }) {
  return (
    <article className="w-[82vw] max-w-sm shrink-0 overflow-hidden rounded-lg border border-border bg-card transition hover:border-primary/40">
      <img
        src={cinema.image}
        alt={`${cinema.name} auditorium`}
        loading="lazy"
        width={1536}
        height={1024}
        className="aspect-[16/8] w-full object-cover"
      />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold">{cinema.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{cinema.location}</p>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">{cinema.distance}</span>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          {cinema.screens} screens · {cinema.amenities.join(" · ")}
        </p>
        <Button asChild className="mt-5 w-full">
          <Link to={`/cinemas/${cinema.id}`}>View shows</Link>
        </Button>
      </div>
    </article>
  );
}

/** Full-width cinema row used on the cinemas listing page. */
export function CinemaRow({ cinema }: { cinema: Cinema }) {
  return (
    <article className="grid overflow-hidden rounded-lg border border-border bg-card transition hover:border-primary/40 md:grid-cols-[300px_1fr]">
      <img
        src={cinema.image}
        alt={`${cinema.name} cinema`}
        width={1536}
        height={1024}
        className="h-full min-h-56 w-full object-cover"
      />
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold">{cinema.name}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {cinema.location}
            </p>
          </div>
          <span className="text-sm text-muted-foreground">{cinema.distance}</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {cinema.amenities.map((amenity) => (
            <span
              key={amenity}
              className="rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold"
            >
              {amenity}
            </span>
          ))}
        </div>
        <div className="mt-7 flex gap-2">
          <Button asChild>
            <Link to={`/cinemas/${cinema.id}`}>View shows</Link>
          </Button>
          <Button variant="outline">Directions</Button>
        </div>
      </div>
    </article>
  );
}
