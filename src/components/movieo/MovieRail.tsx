import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { MovieCard } from "@/components/movieo/MovieCard";
import type { Movie } from "@/data/movieo";
import { cn } from "@/lib/utils";

/**
 * Horizontal movie rail with arrows sitting on the left and right edges of the
 * scroller itself. Each arrow fades out once the rail can no longer travel that
 * way, so the controls never sit there dead.
 */
export function MovieRail({
  movies,
  showReason = false,
}: {
  movies: Movie[];
  showReason?: boolean;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const sync = useCallback(() => {
    const node = rail.current;
    if (!node) return;
    const maxScroll = node.scrollWidth - node.clientWidth;
    setAtStart(node.scrollLeft <= 4);
    setAtEnd(node.scrollLeft >= maxScroll - 4);
  }, []);

  useEffect(() => {
    const node = rail.current;
    if (!node) return;
    sync();
    node.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      node.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync, movies.length]);

  // Page by most of a screenful rather than a fixed pixel count, so the step
  // stays sensible from a phone up to a wide desktop.
  const move = (direction: number) => {
    const node = rail.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div ref={rail} className="flex gap-5 overflow-x-auto pb-5 hide-scrollbar">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} showReason={showReason} />
        ))}
      </div>

      <RailArrow side="left" disabled={atStart} onClick={() => move(-1)} />
      <RailArrow side="right" disabled={atEnd} onClick={() => move(1)} />
    </div>
  );
}

function RailArrow({
  side,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "Scroll left" : "Scroll right"}
      className={cn(
        // Centred on the poster, not the whole card — the card also carries a title
        // and genre line underneath. Both variants land within a few px of 40%.
        "absolute top-[40%] z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full",
        "border border-border/70 bg-background/70 text-foreground shadow-card backdrop-blur-xl",
        "transition duration-300 hover:border-primary hover:bg-background hover:text-primary sm:grid",
        side === "left" ? "left-2" : "right-2",
        disabled && "pointer-events-none opacity-0",
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}
