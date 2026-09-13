import { Skeleton } from "@/components/ui/skeleton";

export function MovieCardSkeleton() {
  return (
    <div className="w-[58vw] max-w-[240px] shrink-0">
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <Skeleton className="mt-4 h-5 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
    </div>
  );
}

export function MovieRailSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-5 overflow-hidden pb-5">
      {Array.from({ length: count }, (_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function MovieGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <Skeleton className="mt-4 h-5 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function CinemaCardSkeleton() {
  return (
    <div className="grid overflow-hidden rounded-lg border border-border bg-card md:grid-cols-[300px_1fr]">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-6 sm:p-8">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="mt-3 h-4 w-72" />
        <div className="mt-6 flex gap-2">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-7 w-24 rounded-md" />
          ))}
        </div>
        <Skeleton className="mt-7 h-10 w-36" />
      </div>
    </div>
  );
}

export function ShowtimesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="rounded-lg border border-border bg-card p-5 sm:p-6">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="mt-3 h-4 w-64" />
          <div className="mt-5 flex flex-wrap gap-2">
            {Array.from({ length: 5 }, (_, slot) => (
              <Skeleton key={slot} className="h-14 w-24 rounded-md" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function MovieDetailsSkeleton() {
  return (
    <div className="page-shell pb-20 pt-32">
      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <Skeleton className="aspect-[2/3] w-full max-w-[260px] rounded-lg" />
        <div>
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="mt-4 h-4 w-1/2" />
          <Skeleton className="mt-8 h-20 w-full" />
          <div className="mt-8 flex gap-3">
            <Skeleton className="h-11 w-40" />
            <Skeleton className="h-11 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SeatMapSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="mx-auto h-3 w-2/3 rounded-full" />
      {Array.from({ length: 8 }, (_, row) => (
        <div key={row} className="flex justify-center gap-1.5">
          {Array.from({ length: 16 }, (_, seat) => (
            <Skeleton key={seat} className="size-7 rounded-md" />
          ))}
        </div>
      ))}
    </div>
  );
}
