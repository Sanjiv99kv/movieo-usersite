import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { ALL, FilterSelect } from "@/components/cinebook/FilterSelect";
import { MovieCard } from "@/components/cinebook/MovieCard";
import { MovieGridSkeleton } from "@/components/cinebook/Skeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getShowDates,
  hasShowInBand,
  inPriceBand,
  PRICE_BANDS,
  TIME_BAND_HINT,
  TIME_BANDS,
  type PriceBand,
  type TimeBand,
} from "@/data/booking";
import { movies, type Movie } from "@/data/cinebook";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSimulatedLoad } from "@/hooks/use-simulated-load";
import { cn } from "@/lib/utils";

const STATUSES = ["All", "Now Showing", "Coming Soon"] as const;
type Status = (typeof STATUSES)[number];

const SORTS = [
  { value: "rating", label: "Top rated" },
  { value: "popularity", label: "Most voted" },
  { value: "release", label: "Release date" },
  { value: "title", label: "Title (A–Z)" },
] as const;
type Sort = (typeof SORTS)[number]["value"];

const SORT_LABELS = Object.fromEntries(SORTS.map((s) => [s.value, s.label])) as Record<
  Sort,
  string
>;

/** "142K" / "89K" -> a number, so "most voted" can actually sort. */
function voteCount(movie: Movie): number {
  return Number(movie.votes.replace(/K$/i, "")) * (/K$/i.test(movie.votes) ? 1000 : 1);
}

export default function MoviesPage() {
  usePageMeta({
    title: "Movies — MOVIEO",
    description: "Browse movies now showing and coming soon at cinemas near you.",
    ogDescription: "Find your next movie and book cinema tickets.",
  });

  const loading = useSimulatedLoad(500);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>(ALL);
  const [price, setPrice] = useState<PriceBand | typeof ALL>(ALL);
  const [genre, setGenre] = useState(ALL);
  const [language, setLanguage] = useState(ALL);
  const [format, setFormat] = useState(ALL);
  const [certificate, setCertificate] = useState(ALL);
  const [timeBand, setTimeBand] = useState<TimeBand | typeof ALL>(ALL);
  const [sort, setSort] = useState<Sort>("rating");

  const today = useMemo(() => getShowDates(1)[0]?.id ?? "", []);

  const options = useMemo(
    () => ({
      genres: [ALL, ...new Set(movies.flatMap((m) => m.genres))],
      languages: [ALL, ...new Set(movies.flatMap((m) => m.language.split(" · ")))],
      formats: [ALL, ...new Set(movies.flatMap((m) => m.formats))],
      certificates: [ALL, ...new Set(movies.map((m) => m.certificate))],
    }),
    [],
  );

  const active = [
    status !== ALL && { label: status, clear: () => setStatus(ALL) },
    genre !== ALL && { label: genre, clear: () => setGenre(ALL) },
    language !== ALL && { label: language, clear: () => setLanguage(ALL) },
    format !== ALL && { label: format, clear: () => setFormat(ALL) },
    certificate !== ALL && { label: certificate, clear: () => setCertificate(ALL) },
    timeBand !== ALL && { label: timeBand, clear: () => setTimeBand(ALL) },
    price !== ALL && { label: price, clear: () => setPrice(ALL) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const clearAll = () => {
    setStatus(ALL);
    setPrice(ALL);
    setGenre(ALL);
    setLanguage(ALL);
    setFormat(ALL);
    setCertificate(ALL);
    setTimeBand(ALL);
  };

  const results = useMemo(() => {
    const filtered = movies.filter((movie) => {
      if (status === "Now Showing" && movie.status !== "now-showing") return false;
      if (status === "Coming Soon" && movie.status !== "coming-soon") return false;
      if (genre !== ALL && !movie.genres.includes(genre)) return false;
      if (language !== ALL && !movie.language.includes(language)) return false;
      if (format !== ALL && !movie.formats.includes(format)) return false;
      if (certificate !== ALL && movie.certificate !== certificate) return false;
      if (timeBand !== ALL && !hasShowInBand(movie.id, today, timeBand)) return false;
      if (price !== ALL && !inPriceBand(movie, price)) return false;
      return movie.title.toLowerCase().includes(query.trim().toLowerCase());
    });

    return [...filtered].sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "popularity") return voteCount(b) - voteCount(a);
      if (sort === "release") return Date.parse(b.release) - Date.parse(a.release);
      return a.title.localeCompare(b.title);
    });
  }, [status, genre, language, format, certificate, timeBand, price, query, sort, today]);

  return (
    <div className="page-shell pb-24 pt-32">
      <span className="eyebrow">Discover</span>
      <h1 className="mt-3 font-display text-4xl font-bold sm:text-6xl">Movies for every mood.</h1>

      <div className="relative mt-10">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by movie title"
          className="h-12 bg-card pl-12"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <FilterSelect
          label="Status"
          allLabel="All movies"
          options={[...STATUSES]}
          value={status}
          onChange={(next) => setStatus(next as Status)}
        />
        <FilterSelect
          label="Genre"
          allLabel="All genres"
          options={options.genres}
          value={genre}
          onChange={setGenre}
        />
        <FilterSelect
          label="Language"
          allLabel="All languages"
          options={options.languages}
          value={language}
          onChange={setLanguage}
        />
        <FilterSelect
          label="Format"
          allLabel="All formats"
          options={options.formats}
          value={format}
          onChange={setFormat}
        />
        <FilterSelect
          label="Certificate"
          allLabel="All certificates"
          options={options.certificates}
          value={certificate}
          onChange={setCertificate}
        />
        <FilterSelect
          label="Preferred time"
          allLabel="Any time"
          options={[ALL, ...TIME_BANDS]}
          value={timeBand}
          onChange={(next) => setTimeBand(next as TimeBand | typeof ALL)}
          optionHint={(option) => (option === ALL ? undefined : TIME_BAND_HINT[option as TimeBand])}
        />
        <FilterSelect
          label="Price"
          allLabel="Any price"
          options={[ALL, ...PRICE_BANDS]}
          value={price}
          onChange={(next) => setPrice(next as PriceBand | typeof ALL)}
        />

        <span className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <Select value={sort} onValueChange={(value) => setSort(value as Sort)}>
          <SelectTrigger className="h-10 w-auto gap-2 bg-card" aria-label="Sort movies">
            <span className="truncate">
              <span className="text-muted-foreground">Sort:</span> {SORT_LABELS[sort]}
            </span>
          </SelectTrigger>
          <SelectContent>
            {SORTS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {active.length > 0 && (
          <Button variant="ghost" className="h-10 text-muted-foreground" onClick={clearAll}>
            <X /> Clear {active.length} filter{active.length > 1 ? "s" : ""}
          </Button>
        )}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        {loading
          ? "Loading movies…"
          : `${results.length} ${results.length === 1 ? "movie" : "movies"}`}
      </p>

      <div className="mt-4">
        {loading ? (
          <MovieGridSkeleton />
        ) : results.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border py-20 text-center">
            <h2 className="font-display text-2xl font-bold">Nothing matches that yet.</h2>
            <p className="mt-2 text-muted-foreground">
              Try a different title, or loosen one of your filters.
            </p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => {
                setQuery("");
                clearAll();
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
