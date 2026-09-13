import { Heart, Star, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Movie } from "@/data/cinebook";
import { cn } from "@/lib/utils";
import { useCinebook } from "@/store/cinebook-context";

export function MovieCard({ movie, large = false }: { movie: Movie; large?: boolean }) {
  const { isSaved, toggleWatchlist } = useCinebook();
  const saved = isSaved(movie.id);

  return (
    <article
      className={cn("group shrink-0", large ? "w-[78vw] max-w-md" : "w-[58vw] max-w-[240px]")}
    >
      <div className="relative overflow-hidden rounded-lg bg-card shadow-card">
        <Link to={`/movies/${movie.id}`} className="block" aria-label={`${movie.title} details`}>
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            loading="lazy"
            width={1024}
            height={1536}
            className={cn(
              "w-full object-cover transition duration-700 group-hover:scale-105",
              large ? "aspect-[4/5]" : "aspect-[2/3]",
            )}
          />
          <div className="absolute inset-0 flex items-end bg-poster-overlay p-4 opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="inline-flex h-9 w-full translate-y-2 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition duration-300 group-hover:translate-y-0">
              <Ticket className="size-4" /> Book now
            </span>
          </div>
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-xs font-bold backdrop-blur">
            <Star className="size-3 fill-rating text-rating" /> {movie.rating}
          </span>
        </Link>
        <button
          type="button"
          aria-label={
            saved ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`
          }
          aria-pressed={saved}
          onClick={() => {
            toggleWatchlist(movie.id);
            toast.success(saved ? "Removed from watchlist" : "Added to watchlist");
          }}
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-md bg-background/80 text-foreground backdrop-blur transition hover:bg-background"
        >
          <Heart className={cn("size-4", saved && "fill-primary text-primary")} />
        </button>
      </div>
      <div className="pt-4">
        <h3 className="truncate font-display text-lg font-semibold">{movie.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {movie.genre} · {movie.language}
        </p>
        {large && movie.reason && (
          <p className="mt-3 text-xs font-semibold uppercase text-primary">{movie.reason}</p>
        )}
      </div>
    </article>
  );
}

/** Horizontal movie rail with arrow controls, used by every "row" on the home page. */
export function MovieCarousel({
  movies,
  large = false,
  className,
}: {
  movies: Movie[];
  large?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-5 overflow-x-auto pb-5 hide-scrollbar", className)}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} large={large} />
      ))}
    </div>
  );
}

export function RailArrows({ onMove }: { onMove: (direction: number) => void }) {
  return (
    <div className="hidden gap-2 sm:flex">
      <Button size="icon" variant="outline" onClick={() => onMove(-1)} aria-label="Scroll left">
        <ArrowGlyph direction="left" />
      </Button>
      <Button size="icon" variant="outline" onClick={() => onMove(1)} aria-label="Scroll right">
        <ArrowGlyph direction="right" />
      </Button>
    </div>
  );
}

function ArrowGlyph({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
      <path
        d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
