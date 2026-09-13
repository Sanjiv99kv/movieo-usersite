import { CalendarDays, Clock3, Heart, Play, Star, Ticket } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Reveal } from "@/components/cinebook/Reveal";
import { Reviews } from "@/components/cinebook/Reviews";
import { SectionHeading } from "@/components/cinebook/SectionHeading";
import { MovieDetailsSkeleton } from "@/components/cinebook/Skeletons";
import { Button } from "@/components/ui/button";
import { formatRupees, movieFromPrice } from "@/data/booking";
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

  const { isSaved, toggleWatchlist } = useCinebook();

  usePageMeta({
    title: movie ? `${movie.title} — MOVIEO` : "Movie — MOVIEO",
    description: movie?.description ?? "Movie details and showtimes on MOVIEO.",
  });

  if (!movie) return <NotFoundPage />;
  if (loading) return <MovieDetailsSkeleton />;

  const saved = isSaved(movie.id);
  const similar = movies.filter(
    (item) => item.id !== movie.id && item.genres.some((g) => movie.genres.includes(g)),
  );
  const basePrice = movieFromPrice(movie);

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
                <Button asChild size="lg">
                  <Link to={`/movies/${movie.id}/showtimes`}>
                    <Ticket /> Book tickets · from {formatRupees(basePrice)}
                  </Link>
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
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {movie.cast.map((member) => (
              <PersonTile key={member.name} name={member.name} role={member.role} />
            ))}
          </div>

          <div className="mt-12">
            <SectionHeading title="Crew" subtitle="The people behind it." />
            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
              {movie.crew.map((member, index) => (
                <PersonTile
                  key={`${member.name}-${member.job}-${index}`}
                  name={member.name}
                  role={member.job}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal as="section" className="page-shell section-space">
        <Reviews movie={movie} />
      </Reveal>

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

/** Uniform tile for a cast or crew member — square art area, name, then role. */
function PersonTile({ name, role }: { name: string; role: string }) {
  return (
    <article className="w-32 shrink-0 sm:w-36">
      <span className="grid aspect-square w-full place-items-center rounded-xl bg-card font-display text-2xl font-bold text-primary ring-1 ring-inset ring-border transition duration-300 hover:ring-primary/50">
        {name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")}
      </span>
      <h3 className="mt-3 text-sm font-semibold leading-tight">{name}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{role}</p>
    </article>
  );
}
