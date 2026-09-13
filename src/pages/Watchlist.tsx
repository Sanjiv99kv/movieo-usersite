import { Heart, Star, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getMovie } from "@/data/cinebook";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useCinebook } from "@/store/cinebook-context";

export default function WatchlistPage() {
  usePageMeta({
    title: "My Watchlist — CineBook",
    description: "Keep track of movies you want to see on CineBook.",
    ogDescription: "Movies saved for your next cinema visit.",
    twitterCard: "summary",
  });

  const { watchlist, toggleWatchlist } = useCinebook();
  const saved = watchlist.map(getMovie).filter((movie) => movie !== undefined);

  return (
    <div className="page-shell min-h-[75vh] pb-24 pt-32">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">My Watchlist</h1>
      <p className="mt-3 text-muted-foreground">
        {saved.length
          ? `${saved.length} ${saved.length === 1 ? "story" : "stories"} you don't want to miss.`
          : "Stories you don't want to miss."}
      </p>

      {saved.length ? (
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {saved.map((movie) => (
            <article key={movie.id}>
              <Link to={`/movies/${movie.id}`} className="group block overflow-hidden rounded-lg">
                <img
                  src={movie.poster}
                  alt={`${movie.title} poster`}
                  width={1024}
                  height={1536}
                  className="aspect-[2/3] w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="mt-4 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="truncate font-display font-bold">
                    <Link to={`/movies/${movie.id}`} className="hover:text-primary">
                      {movie.title}
                    </Link>
                  </h2>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="size-3 fill-rating text-rating" /> {movie.rating} ·{" "}
                    {movie.release}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Remove ${movie.title} from watchlist`}
                  onClick={() => {
                    toggleWatchlist(movie.id);
                    toast.success(`${movie.title} removed from watchlist`);
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
              <Button asChild size="sm" className="mt-3 w-full">
                <Link to={`/movies/${movie.id}`}>
                  {movie.status === "now-showing" ? "Book tickets" : "View details"}
                </Link>
              </Button>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-20 max-w-lg">
          <Heart className="size-10 text-primary" />
          <h2 className="mt-5 font-display text-2xl font-bold">Your watchlist is empty.</h2>
          <p className="mt-2 text-muted-foreground">Save movies you don't want to miss.</p>
          <Button asChild className="mt-6">
            <Link to="/movies">Discover movies</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
