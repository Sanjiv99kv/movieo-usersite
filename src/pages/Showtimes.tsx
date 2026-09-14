import { ArrowLeft, CalendarDays, Clock3, Search, Star, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { ALL, FilterSelect } from "@/components/movieo/FilterSelect";
import { ShowtimesSkeleton } from "@/components/movieo/Skeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  formatRupees,
  getShowDates,
  getShows,
  matchesPriceBand,
  movieFromPrice,
  PRICE_BANDS,
  showtimeBand,
  showtimeFromPrice,
  TIME_BAND_HINT,
  TIME_BANDS,
  type PriceBand,
  type Showtime,
  type TimeBand,
} from "@/data/booking";
import { getMovie, type Cinema, type Movie } from "@/data/movieo";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSimulatedLoad } from "@/hooks/use-simulated-load";
import { cn } from "@/lib/utils";
import NotFoundPage from "@/pages/NotFound";

export default function ShowtimesPage() {
  const { movieId } = useParams();
  const movie = getMovie(movieId);

  const dates = useMemo(() => getShowDates(), []);
  const [dateId, setDateId] = useState(() => dates[0]?.id ?? "");
  const [format, setFormat] = useState(ALL);
  const [timeBand, setTimeBand] = useState<TimeBand | typeof ALL>(ALL);
  const [price, setPrice] = useState<PriceBand | typeof ALL>(ALL);
  const [hideSoldOut, setHideSoldOut] = useState(false);
  const [venueQuery, setVenueQuery] = useState("");

  usePageMeta({
    title: movie ? `${movie.title} showtimes — MOVIEO` : "Showtimes — MOVIEO",
    description: movie
      ? `Pick a date, cinema and showtime for ${movie.title}.`
      : "Showtimes on MOVIEO.",
  });

  const activeFilters =
    (format !== ALL ? 1 : 0) +
    (timeBand !== ALL ? 1 : 0) +
    (price !== ALL ? 1 : 0) +
    (hideSoldOut ? 1 : 0) +
    (venueQuery.trim() ? 1 : 0);

  if (!movie) return <NotFoundPage />;

  return (
    <div className="pb-24 pt-24">
      {/* The film stays pinned at the top so you always know what you are booking. */}
      <div className="sticky top-18 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="page-shell py-4">
          <Button asChild variant="ghost" className="-ml-3 mb-3 h-8 text-muted-foreground">
            <Link to={`/movies/${movie.id}`}>
              <ArrowLeft /> Back to {movie.title}
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <img
              src={movie.poster}
              alt=""
              width={1024}
              height={1536}
              className="aspect-[2/3] w-12 shrink-0 rounded-md object-cover"
            />
            <div className="min-w-0">
              <h1 className="truncate font-display text-xl font-bold sm:text-2xl">{movie.title}</h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-rating">
                  <Star className="size-3 fill-current" /> {movie.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Clock3 className="size-3" /> {movie.duration}
                </span>
                <span className="rounded border border-border px-1.5">{movie.certificate}</span>
                <span>{movie.genres.join(" · ")}</span>
                <span>{movie.language}</span>
              </p>
            </div>
          </div>

          {movie.status === "now-showing" && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {dates.map((date) => (
                <button
                  key={date.id}
                  type="button"
                  onClick={() => setDateId(date.id)}
                  aria-pressed={date.id === dateId}
                  className={cn(
                    "grid w-[4.5rem] shrink-0 place-items-center rounded-lg border px-3 py-2 transition",
                    date.id === dateId
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/50",
                  )}
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wide">
                    {date.label}
                  </span>
                  <span className="font-display text-lg font-bold">{date.day}</span>
                  <span className="text-[11px] uppercase">{date.month}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="page-shell pt-8">
        {movie.status !== "now-showing" ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <CalendarDays className="mx-auto size-9 text-primary" />
            <h2 className="mt-5 font-display text-xl font-bold">Releasing {movie.release}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Booking opens closer to release. Set a reminder and we will tell you the moment seats
              open.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button onClick={() => toast.success("Reminder set successfully.")}>Remind me</Button>
              <Button asChild variant="outline">
                <Link to="/movies">Browse movies</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={venueQuery}
                  onChange={(event) => setVenueQuery(event.target.value)}
                  placeholder="Search cinema or area"
                  className="h-10 bg-card pl-9"
                />
              </div>
              <FilterSelect
                label="Format"
                allLabel="All formats"
                options={[ALL, ...movie.formats]}
                value={format}
                onChange={setFormat}
              />
              <FilterSelect
                label="Time"
                allLabel="Any time"
                options={[ALL, ...TIME_BANDS]}
                value={timeBand}
                onChange={(next) => setTimeBand(next as TimeBand | typeof ALL)}
                optionHint={(option) =>
                  option === ALL ? undefined : TIME_BAND_HINT[option as TimeBand]
                }
              />
              <FilterSelect
                label="Price"
                allLabel="Any price"
                options={[ALL, ...PRICE_BANDS]}
                value={price}
                onChange={(next) => setPrice(next as PriceBand | typeof ALL)}
              />
              <Button
                variant={hideSoldOut ? "default" : "outline"}
                className="h-10"
                aria-pressed={hideSoldOut}
                onClick={() => setHideSoldOut((value) => !value)}
              >
                Hide sold out
              </Button>
              {activeFilters > 0 && (
                <Button
                  variant="ghost"
                  className="h-10 text-muted-foreground"
                  onClick={() => {
                    setFormat(ALL);
                    setTimeBand(ALL);
                    setPrice(ALL);
                    setHideSoldOut(false);
                    setVenueQuery("");
                  }}
                >
                  <X /> Clear
                </Button>
              )}
            </div>

            <p className="mb-5 text-sm text-muted-foreground">
              Tickets from {formatRupees(movieFromPrice(movie))} · pick a cinema and time.
            </p>
            <ShowtimeList
              key={dateId}
              movie={movie}
              dateId={dateId}
              format={format}
              timeBand={timeBand}
              price={price}
              hideSoldOut={hideSoldOut}
              venueQuery={venueQuery}
            />
          </>
        )}
      </div>
    </div>
  );
}

function ShowtimeList({
  movie,
  dateId,
  format,
  timeBand,
  price,
  hideSoldOut,
  venueQuery,
}: {
  movie: Movie;
  dateId: string;
  format: string;
  timeBand: TimeBand | typeof ALL;
  price: PriceBand | typeof ALL;
  hideSoldOut: boolean;
  venueQuery: string;
}) {
  // Re-mounts on date change (key in the parent) so the skeleton runs per date.
  const loading = useSimulatedLoad(400);
  const shows = useMemo(() => getShows(movie.id, dateId), [movie.id, dateId]);

  const keeps = (showtime: Showtime) => {
    if (format !== ALL && showtime.format !== format) return false;
    if (timeBand !== ALL && showtimeBand(showtime) !== timeBand) return false;
    if (price !== ALL && !matchesPriceBand(showtimeFromPrice(movie, showtime), price)) return false;
    if (hideSoldOut && showtime.soldOut) return false;
    return true;
  };

  // Venues with nothing left after filtering drop out entirely, rather than showing a
  // row of empty space.
  // Venue search matches name, area or format so "BKC", "Aurora" and "4DX" all work.
  const term = venueQuery.trim().toLowerCase();
  const matchesVenue = (cinema: Cinema) =>
    !term ||
    cinema.name.toLowerCase().includes(term) ||
    cinema.location.toLowerCase().includes(term) ||
    cinema.amenities.some((amenity) => amenity.toLowerCase().includes(term));

  const filtered = shows
    .filter((entry) => matchesVenue(entry.cinema))
    .map((entry) => ({ ...entry, showtimes: entry.showtimes.filter(keeps) }))
    .filter((entry) => entry.showtimes.length > 0);

  if (loading) return <ShowtimesSkeleton />;

  if (!filtered.length) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center">
        <h2 className="font-display text-xl font-bold">No shows match these filters.</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Try another date, a different cinema, or loosen the format, time or price filter.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filtered.map(({ cinema, showtimes }) => (
        <article
          key={cinema.id}
          className="relative rounded-xl bg-card p-5 ring-1 ring-inset ring-border sm:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Link
                to={`/cinemas/${cinema.id}`}
                className="font-display text-lg font-bold hover:text-primary"
              >
                {cinema.name}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {cinema.location} · {cinema.distance}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cinema.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="rounded bg-secondary px-2 py-1 text-[11px] font-semibold"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {showtimes.map((showtime) => (
              <ShowtimeButton
                key={showtime.id}
                to={`/booking/${movie.id}/${cinema.id}/${showtime.id}`}
                time={`${showtime.time} ${showtime.meridiem}`}
                format={showtime.format}
                price={showtimeFromPrice(movie, showtime)}
                seatsLeft={showtime.seatsLeft}
                soldOut={showtime.soldOut}
              />
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function ShowtimeButton({
  to,
  time,
  format,
  price,
  seatsLeft,
  soldOut,
}: {
  to: string;
  time: string;
  format: string;
  price: number;
  seatsLeft: number;
  soldOut: boolean;
}) {
  const fillingFast = !soldOut && seatsLeft < 20;
  // "Dolby Atmos" does not fit the tile next to a price.
  const shortFormat = format === "Dolby Atmos" ? "DOLBY" : format.toUpperCase();

  if (soldOut) {
    return (
      <span className="grid w-28 cursor-not-allowed place-items-center rounded-md border border-border bg-muted/40 px-2 py-2 text-center opacity-60">
        <span className="text-sm font-semibold line-through">{time}</span>
        <span className="text-[10px] uppercase text-muted-foreground">Sold out</span>
      </span>
    );
  }

  return (
    <Link
      to={to}
      className={cn(
        "grid w-28 place-items-center rounded-md border px-2 py-2 text-center transition hover:-translate-y-0.5 hover:border-primary hover:shadow-glow",
        fillingFast ? "border-rating/60" : "border-border",
      )}
    >
      <span className="text-sm font-semibold">{time}</span>
      <span className="text-[10px] uppercase text-muted-foreground">
        {formatRupees(price)} · {shortFormat}
      </span>
      {fillingFast && (
        <span className="text-[10px] font-semibold uppercase text-rating">Filling fast</span>
      )}
    </Link>
  );
}
