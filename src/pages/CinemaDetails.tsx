import { ArrowLeft, MapPin, Navigation, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { SectionHeading } from "@/components/cinebook/SectionHeading";
import { ShowtimesSkeleton } from "@/components/cinebook/Skeletons";
import { Button } from "@/components/ui/button";
import { getShowDates, getShows } from "@/data/booking";
import { getCinema, nowShowing } from "@/data/cinebook";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSimulatedLoad } from "@/hooks/use-simulated-load";
import { cn } from "@/lib/utils";
import NotFoundPage from "@/pages/NotFound";

export default function CinemaDetailsPage() {
  const { cinemaId } = useParams();
  const cinema = getCinema(cinemaId);
  const dates = useMemo(() => getShowDates(), []);
  const [dateId, setDateId] = useState(() => dates[0]?.id ?? "");

  usePageMeta({
    title: cinema ? `${cinema.name} — CineBook` : "Cinema — CineBook",
    description: cinema
      ? `Showtimes and screens at ${cinema.name}, ${cinema.location}.`
      : "Cinema showtimes on CineBook.",
  });

  if (!cinema) return <NotFoundPage />;

  return (
    <>
      <section className="relative">
        <img
          src={cinema.image}
          alt=""
          width={1536}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="page-shell relative pb-12 pt-32">
          <Button asChild variant="ghost" className="-ml-3 mb-4 text-muted-foreground">
            <Link to="/cinemas">
              <ArrowLeft /> All cinemas
            </Link>
          </Button>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">{cinema.name}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <MapPin className="size-4" />
              {cinema.location}
            </span>
            <span>{cinema.distance}</span>
            <span>{cinema.screens} screens</span>
            <span className="flex items-center gap-1 text-rating">
              <Star className="size-4 fill-current" /> 4.6
            </span>
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {cinema.amenities.map((amenity) => (
              <span
                key={amenity}
                className="rounded-md bg-secondary/80 px-3 py-1.5 text-xs font-semibold backdrop-blur"
              >
                {amenity}
              </span>
            ))}
          </div>
          <Button variant="outline" className="mt-6">
            <Navigation /> Directions
          </Button>
        </div>
      </section>

      <section className="page-shell section-space">
        <SectionHeading title="Today's Screenings" subtitle="Pick a date, then a showtime." />

        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {dates.map((date) => (
            <button
              key={date.id}
              type="button"
              onClick={() => setDateId(date.id)}
              aria-pressed={date.id === dateId}
              className={cn(
                "grid w-20 shrink-0 place-items-center rounded-lg border px-3 py-3 transition",
                date.id === dateId
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/50",
              )}
            >
              <span className="text-[11px] font-semibold uppercase tracking-wide">
                {date.label}
              </span>
              <span className="font-display text-xl font-bold">{date.day}</span>
              <span className="text-[11px] uppercase">{date.month}</span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <CinemaSchedule key={dateId} cinemaId={cinema.id} dateId={dateId} />
        </div>
      </section>
    </>
  );
}

function CinemaSchedule({ cinemaId, dateId }: { cinemaId: string; dateId: string }) {
  const loading = useSimulatedLoad(400);

  const schedule = useMemo(
    () =>
      nowShowing
        .map((movie) => ({
          movie,
          showtimes:
            getShows(movie.id, dateId).find((entry) => entry.cinema.id === cinemaId)?.showtimes ??
            [],
        }))
        .filter((entry) => entry.showtimes.length > 0),
    [cinemaId, dateId],
  );

  if (loading) return <ShowtimesSkeleton />;

  if (!schedule.length) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center">
        <p className="font-display text-xl font-bold">No screenings on this date.</p>
        <p className="mt-2 text-sm text-muted-foreground">Try another day this week.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {schedule.map(({ movie, showtimes }) => (
        <article
          key={movie.id}
          className="grid gap-5 rounded-lg border border-border bg-card p-5 sm:grid-cols-[90px_1fr] sm:p-6"
        >
          <Link to={`/movies/${movie.id}`} className="shrink-0">
            <img
              src={movie.poster}
              alt={`${movie.title} poster`}
              loading="lazy"
              width={1024}
              height={1536}
              className="aspect-[2/3] w-20 rounded-md object-cover sm:w-full"
            />
          </Link>
          <div className="min-w-0">
            <Link
              to={`/movies/${movie.id}`}
              className="font-display text-lg font-bold hover:text-primary"
            >
              {movie.title}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              {movie.genre} · {movie.language} · {movie.certificate}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {showtimes.map((showtime) =>
                showtime.soldOut ? (
                  <span
                    key={showtime.id}
                    className="grid w-24 cursor-not-allowed place-items-center rounded-md border border-border bg-muted/40 px-3 py-2 text-center opacity-60"
                  >
                    <span className="text-sm font-semibold line-through">
                      {showtime.time} {showtime.meridiem}
                    </span>
                    <span className="text-[10px] uppercase text-muted-foreground">Sold out</span>
                  </span>
                ) : (
                  <Link
                    key={showtime.id}
                    to={`/booking/${movie.id}/${cinemaId}/${showtime.id}`}
                    className="grid w-24 place-items-center rounded-md border border-border px-3 py-2 text-center transition hover:-translate-y-0.5 hover:border-primary hover:shadow-glow"
                  >
                    <span className="text-sm font-semibold">
                      {showtime.time} {showtime.meridiem}
                    </span>
                    <span className="text-[10px] uppercase text-muted-foreground">
                      {showtime.format}
                    </span>
                  </Link>
                ),
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
