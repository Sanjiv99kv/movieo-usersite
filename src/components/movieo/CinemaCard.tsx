import {
  Accessibility,
  Armchair,
  ChevronRight,
  MapPin,
  Navigation,
  ParkingCircle,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { getShowDates, getShows } from "@/data/booking";
import { nowShowing, type Cinema, type Movie } from "@/data/movieo";
import { cn } from "@/lib/utils";

/**
 * Every venue shares one auditorium photo, so each card colour-grades it with the
 * venue's own tone. `mix-blend-color` takes the hue and saturation from the grade
 * while keeping the photo's luminance, so the room still reads as a real room.
 */
function CinemaPhoto({ cinema, className }: { cinema: Cinema; className?: string }) {
  return (
    <>
      <img
        src={cinema.image}
        alt={`${cinema.name} auditorium`}
        loading="lazy"
        width={1536}
        height={1024}
        className={cn("h-full w-full object-cover transition duration-700", className)}
      />
      <div
        className={cn(
          cinema.tone,
          "pointer-events-none absolute inset-0 opacity-45 mix-blend-color",
        )}
      />
    </>
  );
}

function AmenityChips({ cinema }: { cinema: Cinema }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[11px] font-semibold">
        <Armchair className="size-3 text-primary" />
        {cinema.screens} screens
      </span>
      {cinema.amenities.map((amenity) => (
        <span
          key={amenity}
          className="rounded-md bg-secondary px-2 py-1 text-[11px] font-semibold text-muted-foreground"
        >
          {amenity}
        </span>
      ))}
    </div>
  );
}

/**
 * The card's outline, drawn as an inset ring layered over the content rather than as a
 * border on the card itself. `overflow-hidden` clips children to the padding box, and
 * the hover transform promotes the card to its own compositing layer — together those
 * let a child's pixels rasterise over a 1px border and eat the top edge. A ring painted
 * above the content cannot be clipped by it.
 */
function CardOutline() {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-border transition duration-500 group-hover:ring-primary/50" />
  );
}

/** Compact cinema tile used in the home page rail. */
export function CinemaCard({ cinema }: { cinema: Cinema }) {
  return (
    <article className="group relative overflow-hidden rounded-xl bg-card transition duration-500 hover:-translate-y-1 hover:shadow-glow">
      <div className="relative aspect-[16/9] overflow-hidden">
        <CinemaPhoto cinema={cinema} className="group-hover:scale-105" />
        {/* Melts the photo into the card body so the name sits on a readable ground. */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/45 to-transparent" />

        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-background/75 px-2 py-1 text-xs font-bold backdrop-blur">
          <Star className="size-3 fill-rating text-rating" /> {cinema.rating}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-background/75 px-2 py-1 text-xs font-semibold backdrop-blur">
          <Navigation className="size-3 text-primary" /> {cinema.distance}
        </span>

        <div className="absolute inset-x-4 bottom-3">
          <h3 className="font-display text-lg font-bold leading-tight">{cinema.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0" />
            <span className="truncate">{cinema.location}</span>
          </p>
        </div>
      </div>

      <div className="p-4">
        <AmenityChips cinema={cinema} />
        <Button asChild className="mt-4 w-full">
          <Link to={`/cinemas/${cinema.id}`}>View shows</Link>
        </Button>
      </div>

      <CardOutline />
    </article>
  );
}

/** Titles actually screening at this venue today, for the row's poster strip. */
function nowPlayingAt(cinemaId: string): Movie[] {
  const today = getShowDates(1)[0]?.id ?? "";
  return nowShowing.filter((movie) =>
    getShows(movie.id, today).some(
      (entry) => entry.cinema.id === cinemaId && entry.showtimes.length > 0,
    ),
  );
}

/** Full-width cinema row used on the cinemas listing page. */
export function CinemaRow({ cinema }: { cinema: Cinema }) {
  const playing = nowPlayingAt(cinema.id);
  const shown = playing.slice(0, 4);
  const extra = playing.length - shown.length;

  return (
    <article className="group relative grid overflow-hidden rounded-xl bg-card transition duration-500 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)_auto]">
      <div className="relative min-h-52 overflow-hidden">
        <CinemaPhoto cinema={cinema} className="group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-card/80" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-background/75 px-2 py-1 text-xs font-bold backdrop-blur">
          <Star className="size-3 fill-rating text-rating" /> {cinema.rating}
        </span>
      </div>

      <div className="p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-bold">{cinema.name}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              <span className="truncate">{cinema.location}</span>
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
            <Navigation className="size-3.5 text-primary" />
            {cinema.distance}
          </span>
        </div>

        <div className="mt-5">
          <AmenityChips cinema={cinema} />
        </div>

        {(cinema.accessible || cinema.parking) && (
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            {cinema.accessible && (
              <span className="flex items-center gap-1.5">
                <Accessibility className="size-3.5" /> Step-free access
              </span>
            )}
            {cinema.parking && (
              <span className="flex items-center gap-1.5">
                <ParkingCircle className="size-3.5" /> Parking
              </span>
            )}
          </div>
        )}

        <div className="mt-6 flex gap-2">
          <Button asChild>
            <Link to={`/cinemas/${cinema.id}`}>View shows</Link>
          </Button>
          <Button variant="outline">Directions</Button>
        </div>
      </div>

      {/* What is actually playing here today — the row was mostly empty space, and this
          is the question someone scanning a cinema list is trying to answer. */}
      {shown.length > 0 && (
        <div className="border-t border-border p-6 sm:p-7 lg:w-72 lg:border-l lg:border-t-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="eyebrow">Now showing</p>
            <Link
              to={`/cinemas/${cinema.id}`}
              className="flex items-center text-xs font-semibold text-muted-foreground transition hover:text-primary"
            >
              All <ChevronRight className="size-3.5" />
            </Link>
          </div>
          <div className="flex gap-2">
            {shown.map((movie) => (
              <Link
                key={movie.id}
                to={`/movies/${movie.id}`}
                title={movie.title}
                className="min-w-0 flex-1"
              >
                <img
                  src={movie.poster}
                  alt={`${movie.title} poster`}
                  loading="lazy"
                  width={1024}
                  height={1536}
                  className="aspect-[2/3] w-full rounded-md object-cover transition duration-300 hover:-translate-y-0.5"
                />
              </Link>
            ))}
          </div>
          {extra > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">+{extra} more playing today</p>
          )}
        </div>
      )}

      <CardOutline />
    </article>
  );
}
