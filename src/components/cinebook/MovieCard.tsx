import { Heart, Star, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import type { Movie } from "@/data/cinebook";
import { cn } from "@/lib/utils";
import { useCinebook } from "@/store/cinebook-context";

export function MovieCard({
  movie,
  showReason = false,
}: {
  movie: Movie;
  /** Renders the recommendation rationale under the title, where the movie has one. */
  showReason?: boolean;
}) {
  const { isSaved, toggleWatchlist } = useCinebook();
  const saved = isSaved(movie.id);

  return (
    <article className="group w-[58vw] max-w-[240px] shrink-0">
      <div className="relative overflow-hidden rounded-lg bg-card shadow-card">
        <Link to={`/movies/${movie.id}`} className="block" aria-label={`${movie.title} details`}>
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            loading="lazy"
            width={1024}
            height={1536}
            className="aspect-[2/3] w-full object-cover transition duration-700 group-hover:scale-105"
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
        {showReason && movie.reason && (
          <p className="mt-3 text-xs font-semibold uppercase text-primary">{movie.reason}</p>
        )}
      </div>
    </article>
  );
}
