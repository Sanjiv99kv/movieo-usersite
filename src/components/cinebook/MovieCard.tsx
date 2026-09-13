import { Link } from "@tanstack/react-router";
import { Star, Ticket } from "lucide-react";
import type { Movie } from "@/data/cinebook";
import { Button } from "@/components/ui/button";

export function MovieCard({ movie, large = false }: { movie: Movie; large?: boolean }) {
  return <article className={`group shrink-0 ${large ? "w-[78vw] max-w-md" : "w-[58vw] max-w-[240px]"}`}>
    <Link to="/movies/$movieId" params={{ movieId: movie.id }} className="relative block overflow-hidden rounded-lg bg-card shadow-card">
      <img src={movie.poster} alt={`${movie.title} poster`} loading="lazy" width={1024} height={1536} className={`w-full object-cover transition duration-700 group-hover:scale-105 ${large ? "aspect-[4/5]" : "aspect-[2/3]"}`} />
      <div className="absolute inset-0 flex items-end bg-poster-overlay p-4 opacity-0 transition duration-300 group-hover:opacity-100"><Button asChild className="w-full"><span><Ticket /> Book now</span></Button></div>
      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-xs font-bold backdrop-blur"><Star className="size-3 fill-rating text-rating" /> {movie.rating}</span>
    </Link>
    <div className="pt-4"><h3 className="truncate font-display text-lg font-semibold">{movie.title}</h3><p className="mt-1 text-sm text-muted-foreground">{movie.genre} · {movie.language}</p>{large && movie.reason && <p className="mt-3 text-xs font-semibold uppercase text-primary">{movie.reason}</p>}</div>
  </article>;
}

export function SectionHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return <div className="mb-7 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div className="min-w-0"><h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>{subtitle && <p className="mt-2 text-sm text-muted-foreground sm:text-base">{subtitle}</p>}</div>{action}</div>;
}