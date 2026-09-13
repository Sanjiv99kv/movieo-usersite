import { CalendarDays, Clock3, Heart, Play, Star, Ticket } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Reveal } from "@/components/cinebook/Reveal";
import { SectionHeading } from "@/components/cinebook/SectionHeading";
import { MovieDetailsSkeleton, ShowtimesSkeleton } from "@/components/cinebook/Skeletons";
import { Button } from "@/components/ui/button";
import { formatRupees, getShowDates, getShows, seatTiers } from "@/data/booking";
import { getMovie, movies } from "@/data/cinebook";
import { cn } from "@/lib/utils";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSimulatedLoad } from "@/hooks/use-simulated-load";
import { useCinebook } from "@/store/cinebook-context";
import NotFoundPage from "@/pages/NotFound";

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const movie = getMovie(movieId);
  const loading = useSimulatedLoad(500);

  const dates = useMemo(() => getShowDates(), []);
  const [dateId, setDateId] = useState(() => dates[0]?.id ?? "");
  const showsRef = useRef<HTMLDivElement>(null);

  const { isSaved, toggleWatchlist } = useCinebook();

  usePageMeta({
    title: movie ? `${movie.title} — CineBook` : "Movie — CineBook",
    description: movie?.description ?? "Movie details and showtimes on CineBook.",
  });

  if (!movie) return <NotFoundPage />;
  if (loading) return <MovieDetailsSkeleton />;

  const saved = isSaved(movie.id);
  const similar = movies.filter(
    (item) => item.id !== movie.id && item.genres.some((g) => movie.genres.includes(g)),
  );
  const basePrice = Math.min(...seatTiers.map((tier) => tier.price));

  return (
    <>
      <section className="relative">
        <img
          src={movie.backdrop}
          alt=""
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="page-shell relative grid gap-8 pb-14 pt-32 md:grid-cols-[260px_1fr] md:pb-20 md:pt-40">
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            width={1024}
            height={1536}
            className="w-40 rounded-lg object-cover shadow-card md:w-full"
          />
          <div className="reveal">
            <span className="eyebrow rounded-sm bg-primary/15 px-2.5 py-1.5">
              {movie.status === "now-showing" ? "Now showing" : "Coming soon"}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-6xl">
              {movie.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold">
              <span className="flex items-center gap-1 text-rating">
                <Star className="size-4 fill-current" /> {movie.rating}
                <span className="font-normal text-muted-foreground">({movie.votes} votes)</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock3 className="size-4" /> {movie.duration}
              </span>
              <span>{movie.language}</span>
              <span className="rounded border border-border px-1.5 py-0.5 text-xs">
                {movie.certificate}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <CalendarDays className="size-4" /> {movie.release}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-md bg-secondary/80 px-3 py-1.5 text-xs font-semibold backdrop-blur"
                >
                  {genre}
                </span>
              ))}
            </div>
            <p className="mt-6 max-w-2xl leading-7 text-foreground/80">{movie.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {movie.status === "now-showing" ? (
                <Button
                  size="lg"
                  onClick={() =>
                    showsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                >
                  <Ticket /> Book tickets
                </Button>
              ) : (
                <Button size="lg" onClick={() => toast.success("Reminder set successfully.")}>
                  <CalendarDays /> Remind me
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                onClick={() => toast("Trailer added to your watch queue")}
              >
                <Play /> Watch trailer
              </Button>
              <Button
                size="lg"
                variant="ghost"
                aria-pressed={saved}
                onClick={() => {
                  toggleWatchlist(movie.id);
                  toast.success(saved ? "Removed from watchlist" : "Added to watchlist");
                }}
              >
                <Heart className={cn(saved && "fill-primary text-primary")} />
                {saved ? "In watchlist" : "Add to watchlist"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Reveal as="section" className="page-shell section-space">
        <SectionHeading title="Synopsis" />
        <p className="max-w-3xl leading-8 text-muted-foreground">{movie.synopsis}</p>
      </Reveal>

      <section className="bg-surface">
        <Reveal className="page-shell section-space">
          <SectionHeading title="Cast" subtitle="The people on screen." />
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {movie.cast.map((member) => (
              <article key={member.name} className="w-36 shrink-0 text-center">
                <span className="mx-auto grid size-24 place-items-center rounded-full bg-secondary font-display text-2xl font-bold text-primary">
                  {member.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <h3 className="mt-4 text-sm font-semibold">{member.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{member.role}</p>
              </article>
            ))}
          </div>

          <div className="mt-12">
            <SectionHeading title="Crew" subtitle="The people behind it." />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {movie.crew.map((member, index) => (
                <div
                  key={`${member.name}-${member.job}-${index}`}
                  className="rounded-lg border border-border bg-card px-5 py-4"
                >
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {member.job}
                  </p>
                  <p className="mt-1 font-semibold">{member.name}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section ref={showsRef} className="page-shell section-space scroll-mt-24">
        <SectionHeading
          title="Available Shows"
          subtitle={
            movie.status === "now-showing"
              ? `Tickets from ${formatRupees(basePrice)} · pick a date and time.`
              : "Booking opens closer to release."
          }
        />

        {movie.status !== "now-showing" ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center">
            <CalendarDays className="mx-auto size-9 text-primary" />
            <h3 className="mt-5 font-display text-xl font-bold">Releasing {movie.release}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Set a reminder and we will tell you the moment seats open.
            </p>
            <Button className="mt-6" onClick={() => toast.success("Reminder set successfully.")}>
              Remind me
            </Button>
          </div>
        ) : (
          <>
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
              <ShowtimeList key={dateId} movieId={movie.id} dateId={dateId} />
            </div>
          </>
        )}
      </section>

      {similar.length > 0 && (
        <section className="bg-surface">
          <Reveal className="page-shell section-space">
            <SectionHeading
              title="More like this"
              subtitle="Because you are looking at this one."
            />
            <div className="flex gap-5 overflow-x-auto pb-5 hide-scrollbar">
              {similar.map((item) => (
                <Link
                  key={item.id}
                  to={`/movies/${item.id}`}
                  className="group w-[58vw] max-w-[200px] shrink-0"
                >
                  <img
                    src={item.poster}
                    alt={`${item.title} poster`}
                    loading="lazy"
                    width={1024}
                    height={1536}
                    className="aspect-[2/3] w-full rounded-lg object-cover shadow-card transition duration-500 group-hover:-translate-y-1"
                  />
                  <h3 className="mt-3 truncate font-display font-semibold">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.genre}</p>
                </Link>
              ))}
            </div>
          </Reveal>
        </section>
      )}
    </>
  );
}

function ShowtimeList({ movieId, dateId }: { movieId: string; dateId: string }) {
  // Re-mounts on date change (key in the parent) so the skeleton runs per date.
  const loading = useSimulatedLoad(400);
  const shows = useMemo(() => getShows(movieId, dateId), [movieId, dateId]);

  if (loading) return <ShowtimesSkeleton />;

  return (
    <div className="space-y-4">
      {shows.map(({ cinema, showtimes }) => (
        <article key={cinema.id} className="rounded-lg border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold">{cinema.name}</h3>
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

          {showtimes.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {showtimes.map((showtime) => (
                <ShowtimeButton
                  key={showtime.id}
                  to={`/booking/${movieId}/${cinema.id}/${showtime.id}`}
                  time={`${showtime.time} ${showtime.meridiem}`}
                  format={showtime.format}
                  seatsLeft={showtime.seatsLeft}
                  soldOut={showtime.soldOut}
                />
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-muted-foreground">
              No shows at this cinema on this date.
            </p>
          )}
        </article>
      ))}
    </div>
  );
}

function ShowtimeButton({
  to,
  time,
  format,
  seatsLeft,
  soldOut,
}: {
  to: string;
  time: string;
  format: string;
  seatsLeft: number;
  soldOut: boolean;
}) {
  const fillingFast = !soldOut && seatsLeft < 20;

  if (soldOut) {
    return (
      <span className="grid w-24 cursor-not-allowed place-items-center rounded-md border border-border bg-muted/40 px-3 py-2 text-center opacity-60">
        <span className="text-sm font-semibold line-through">{time}</span>
        <span className="text-[10px] uppercase text-muted-foreground">Sold out</span>
      </span>
    );
  }

  return (
    <Link
      to={to}
      className={cn(
        "grid w-24 place-items-center rounded-md border px-3 py-2 text-center transition hover:-translate-y-0.5 hover:border-primary hover:shadow-glow",
        fillingFast ? "border-rating/60" : "border-border",
      )}
    >
      <span className="text-sm font-semibold">{time}</span>
      <span
        className={cn(
          "text-[10px] uppercase",
          fillingFast ? "text-rating" : "text-muted-foreground",
        )}
      >
        {fillingFast ? "Filling fast" : format}
      </span>
    </Link>
  );
}
