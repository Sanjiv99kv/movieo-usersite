import { Clock3, Film, MapPin, Search, User, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cinemas, movies, people } from "@/data/cinebook";
import { useCinebook } from "@/store/cinebook-context";

export function SearchOverlay({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { recentSearches, rememberSearch, clearRecentSearches } = useCinebook();

  const term = query.trim().toLowerCase();
  const movieHits = term ? movies.filter((m) => m.title.toLowerCase().includes(term)) : [];
  const cinemaHits = term
    ? cinemas.filter(
        (c) => c.name.toLowerCase().includes(term) || c.location.toLowerCase().includes(term),
      )
    : [];
  const peopleHits = term ? people.filter((p) => p.name.toLowerCase().includes(term)) : [];
  const nothingFound = term && !movieHits.length && !cinemaHits.length && !peopleHits.length;

  const go = (to: string, remembered: string) => {
    rememberSearch(remembered);
    setQuery("");
    onOpenChange(false);
    navigate(to);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[8%] max-h-[84vh] max-w-3xl translate-y-0 overflow-auto border-border bg-card p-0">
        <DialogTitle className="sr-only">Search MOVIEO</DialogTitle>
        <DialogDescription className="sr-only">Search movies, cinemas and people</DialogDescription>

        <div className="flex items-center gap-3 border-b border-border p-5">
          <Search className="size-6 shrink-0 text-primary" />
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search movies, cinemas, actors..."
            className="h-12 border-0 bg-transparent text-lg shadow-none focus-visible:ring-0"
          />
        </div>

        <div className="p-5">
          {!term && recentSearches.length > 0 && (
            <section className="mb-7">
              <div className="mb-3 flex items-center justify-between">
                <p className="eyebrow">Recent searches</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground"
                  onClick={clearRecentSearches}
                >
                  Clear
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-sm transition hover:bg-accent"
                  >
                    <Clock3 className="size-3.5 text-muted-foreground" />
                    {item}
                  </button>
                ))}
              </div>
            </section>
          )}

          {!term && (
            <section>
              <p className="eyebrow mb-4">Trending searches</p>
              <div className="space-y-1">
                {movies.slice(0, 4).map((movie) => (
                  <ResultRow
                    key={movie.id}
                    image={movie.poster}
                    title={movie.title}
                    subtitle={`${movie.genre} · ${movie.language}`}
                    onClick={() => go(`/movies/${movie.id}`, movie.title)}
                  />
                ))}
              </div>
            </section>
          )}

          {movieHits.length > 0 && (
            <section className="mb-6">
              <p className="eyebrow mb-3 flex items-center gap-2">
                <Film className="size-3.5" /> Movies
              </p>
              <div className="space-y-1">
                {movieHits.map((movie) => (
                  <ResultRow
                    key={movie.id}
                    image={movie.poster}
                    title={movie.title}
                    subtitle={`${movie.genre} · ${movie.language}`}
                    onClick={() => go(`/movies/${movie.id}`, movie.title)}
                  />
                ))}
              </div>
            </section>
          )}

          {cinemaHits.length > 0 && (
            <section className="mb-6">
              <p className="eyebrow mb-3 flex items-center gap-2">
                <MapPin className="size-3.5" /> Cinemas
              </p>
              <div className="space-y-1">
                {cinemaHits.map((cinema) => (
                  <ResultRow
                    key={cinema.id}
                    title={cinema.name}
                    subtitle={`${cinema.location} · ${cinema.distance}`}
                    onClick={() => go(`/cinemas/${cinema.id}`, cinema.name)}
                  />
                ))}
              </div>
            </section>
          )}

          {peopleHits.length > 0 && (
            <section>
              <p className="eyebrow mb-3 flex items-center gap-2">
                <User className="size-3.5" /> People
              </p>
              <div className="space-y-1">
                {peopleHits.map((person) => (
                  <ResultRow
                    key={person.name}
                    title={person.name}
                    subtitle={person.movie ? `Known for ${person.movie}` : "Cast member"}
                    onClick={() => go("/movies", person.name)}
                  />
                ))}
              </div>
            </section>
          )}

          {nothingFound && (
            <div className="py-12 text-center">
              <X className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-4 font-display text-lg font-bold">No results for “{query}”</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a movie title, a cinema or an actor.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ResultRow({
  image,
  title,
  subtitle,
  onClick,
}: {
  image?: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-lg p-2 text-left transition hover:bg-accent"
    >
      {image ? (
        <img src={image} alt="" width={52} height={72} className="h-16 w-12 rounded object-cover" />
      ) : (
        <span className="grid h-16 w-12 shrink-0 place-items-center rounded bg-secondary">
          <MapPin className="size-4 text-muted-foreground" />
        </span>
      )}
      <span className="min-w-0">
        <strong className="block truncate">{title}</strong>
        <span className="block truncate text-sm text-muted-foreground">{subtitle}</span>
      </span>
    </button>
  );
}
