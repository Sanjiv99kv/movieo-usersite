import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { MovieCard } from "@/components/cinebook/MovieCard";
import { MovieGridSkeleton } from "@/components/cinebook/Skeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { movies } from "@/data/cinebook";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSimulatedLoad } from "@/hooks/use-simulated-load";
import { cn } from "@/lib/utils";

const TABS = ["All", "Now Showing", "Coming Soon"] as const;

export default function MoviesPage() {
  usePageMeta({
    title: "Movies — CineBook",
    description: "Browse movies now showing and coming soon at cinemas near you.",
    ogDescription: "Find your next movie and book cinema tickets.",
  });

  const loading = useSimulatedLoad(500);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [language, setLanguage] = useState("All");
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [showFilters, setShowFilters] = useState(false);

  const genres = useMemo(() => ["All", ...new Set(movies.flatMap((movie) => movie.genres))], []);
  const languages = useMemo(
    () => ["All", ...new Set(movies.flatMap((movie) => movie.language.split(" · ")))],
    [],
  );

  const filtered = movies.filter((movie) => {
    const matchesTab =
      tab === "All" ||
      (tab === "Now Showing" && movie.status === "now-showing") ||
      (tab === "Coming Soon" && movie.status === "coming-soon");
    const matchesGenre = genre === "All" || movie.genres.includes(genre);
    const matchesLanguage = language === "All" || movie.language.includes(language);
    const matchesQuery = movie.title.toLowerCase().includes(query.trim().toLowerCase());
    return matchesTab && matchesGenre && matchesLanguage && matchesQuery;
  });

  const activeFilters = (genre !== "All" ? 1 : 0) + (language !== "All" ? 1 : 0);

  return (
    <div className="page-shell pb-24 pt-32">
      <span className="eyebrow">Discover</span>
      <h1 className="mt-3 font-display text-4xl font-bold sm:text-6xl">Movies for every mood.</h1>

      <div className="mt-10 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by movie title"
            className="h-12 bg-card pl-12"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters((value) => !value)}>
          <SlidersHorizontal /> Filters
          {activeFilters > 0 && (
            <span className="ml-1 grid size-5 place-items-center rounded-full bg-primary text-[11px] text-primary-foreground">
              {activeFilters}
            </span>
          )}
        </Button>
      </div>

      <div className="mt-5 flex gap-2 overflow-auto hide-scrollbar">
        {TABS.map((item) => (
          <Button
            key={item}
            variant={tab === item ? "default" : "secondary"}
            className="shrink-0 rounded-full"
            onClick={() => setTab(item)}
          >
            {item}
          </Button>
        ))}
      </div>

      {showFilters && (
        <div className="mt-5 space-y-5 rounded-lg border border-border bg-card p-5">
          <FilterRow label="Genre" options={genres} value={genre} onChange={setGenre} />
          <FilterRow label="Language" options={languages} value={language} onChange={setLanguage} />
          {activeFilters > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setGenre("All");
                setLanguage("All");
              }}
            >
              <X /> Clear filters
            </Button>
          )}
        </div>
      )}

      <p className="mt-8 text-sm text-muted-foreground">
        {loading
          ? "Loading movies…"
          : `${filtered.length} ${filtered.length === 1 ? "movie" : "movies"}`}
      </p>

      <div className="mt-4">
        {loading ? (
          <MovieGridSkeleton />
        ) : filtered.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {filtered.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border py-20 text-center">
            <h2 className="font-display text-2xl font-bold">Nothing matches that yet.</h2>
            <p className="mt-2 text-muted-foreground">Try a different title, genre or language.</p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => {
                setQuery("");
                setGenre("All");
                setLanguage("All");
                setTab("All");
              }}
            >
              Reset search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div>
      <p className="eyebrow mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={option === value}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition",
              option === value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-muted-foreground hover:border-primary/50",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
