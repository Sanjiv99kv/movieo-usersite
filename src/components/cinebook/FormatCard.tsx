import { ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type { FormatCard as FormatCardData } from "@/data/cinebook";

export function FormatCard({ format }: { format: FormatCardData }) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-border bg-card/80 p-6 backdrop-blur transition hover:border-primary/40">
      <div
        className={`${format.tone} pointer-events-none absolute inset-0 opacity-15 transition duration-500 group-hover:opacity-30`}
      />
      <div className="relative">
        <Sparkles className="text-primary" />
        <h3 className="mt-8 font-display text-2xl font-bold">{format.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{format.copy}</p>
        <Button asChild variant="link" className="mt-5 px-0">
          <Link to="/cinemas">
            Explore <ChevronRight />
          </Link>
        </Button>
      </div>
    </article>
  );
}
