import { Star, ThumbsUp } from "lucide-react";

import { SectionHeading } from "@/components/cinebook/SectionHeading";
import {
  compactCount,
  getReviews,
  relativeDays,
  type CriticReview,
  type Review,
} from "@/data/reviews";
import type { Movie } from "@/data/cinebook";
import { cn } from "@/lib/utils";

/** Initials stand in for avatars — there are no user photos in this project. */
function Initials({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-primary/15 font-display font-bold text-primary",
        className,
      )}
    >
      {name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}

function Score({ score }: { score: number }) {
  return (
    <span className="flex shrink-0 items-center gap-1 text-sm font-bold">
      <Star className="size-4 fill-rating text-rating" />
      {score}
      <span className="font-normal text-muted-foreground">/10</span>
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex w-[85vw] max-w-sm shrink-0 flex-col rounded-xl bg-card p-5 ring-1 ring-inset ring-border">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Initials name={review.author} className="size-10 text-sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{review.author}</p>
            <p className="text-xs text-muted-foreground">{relativeDays(review.daysAgo)}</p>
          </div>
        </div>
        <Score score={review.score} />
      </div>

      <p className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-sm font-semibold text-primary">
        {review.tags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </p>

      <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{review.text}</p>

      <p className="mt-4 flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
        <ThumbsUp className="size-3.5" />
        {compactCount(review.helpful)} found this helpful
      </p>
    </article>
  );
}

function CriticCard({ critic }: { critic: CriticReview }) {
  return (
    <article className="flex w-[85vw] max-w-sm shrink-0 flex-col rounded-xl bg-card p-5 ring-1 ring-inset ring-border">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Initials name={critic.outlet} className="size-10 text-sm" />
          <p className="truncate text-sm font-semibold">{critic.outlet}</p>
        </div>
        <Score score={critic.score} />
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">“{critic.verdict}”</p>
    </article>
  );
}

export function Reviews({ movie }: { movie: Movie }) {
  const data = getReviews(movie.id);
  if (!data) return null;

  const total = data.sentiment.reduce((sum, item) => sum + item.count, 0);

  return (
    <>
      <SectionHeading
        title="Top reviews"
        subtitle={`What ${compactCount(total)} people said after watching.`}
      />

      <div className="flex flex-wrap gap-2">
        {data.sentiment.map((item) => (
          <span
            key={item.tag}
            className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-sm font-semibold text-primary ring-1 ring-inset ring-border"
          >
            #{item.tag}
            <span className="rounded bg-background px-1.5 py-0.5 text-[11px] font-bold text-muted-foreground">
              {item.count}
            </span>
          </span>
        ))}
      </div>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
        {data.reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <div className="mt-12">
        <SectionHeading title="Critic reviews" subtitle="What the press made of it." />
        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {data.critics.map((critic) => (
            <CriticCard key={critic.id} critic={critic} />
          ))}
        </div>
      </div>
    </>
  );
}
