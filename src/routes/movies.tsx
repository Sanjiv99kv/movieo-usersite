import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { MovieCard } from "@/components/cinebook/MovieCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { movies } from "@/data/cinebook";

export const Route = createFileRoute("/movies")({ head: () => ({ meta: [{ title: "Movies — CineBook" }, { name: "description", content: "Browse movies now showing and coming soon at cinemas near you." }, { property: "og:title", content: "Movies — CineBook" }, { property: "og:description", content: "Find your next movie and book cinema tickets." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: MoviesPage });

function MoviesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const filtered = movies.filter((movie) => (filter === "All" || movie.genre.includes(filter)) && movie.title.toLowerCase().includes(query.toLowerCase()));
  return <div className="page-shell pb-24 pt-32"><span className="eyebrow">Discover</span><h1 className="mt-3 font-display text-4xl font-bold sm:text-6xl">Movies for every mood.</h1><div className="mt-10 grid gap-3 sm:grid-cols-[1fr_auto]"><div className="relative"><Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by movie title" className="h-12 bg-card pl-12"/></div><Button variant="outline"><SlidersHorizontal/> Filters</Button></div><div className="mt-5 flex gap-2 overflow-auto hide-scrollbar">{["All","Sci-Fi","Action","Animation","Drama"].map((item) => <Button key={item} variant={filter === item ? "default" : "secondary"} onClick={() => setFilter(item)}>{item}</Button>)}</div><div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">{filtered.map((movie) => <MovieCard key={movie.id} movie={movie}/>)}</div></div>;
}