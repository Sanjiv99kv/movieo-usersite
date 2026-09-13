import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatRupees, formatShowDate } from "@/data/booking";
import { getCinema, getMovie } from "@/data/cinebook";
import { usePageMeta } from "@/hooks/use-page-meta";
import { cn } from "@/lib/utils";
import { useCinebook, type BookingStatus } from "@/store/cinebook-context";

const TABS: { label: string; status: BookingStatus }[] = [
  { label: "Upcoming", status: "upcoming" },
  { label: "Completed", status: "completed" },
  { label: "Cancelled", status: "cancelled" },
];

export default function BookingsPage() {
  usePageMeta({
    title: "My Bookings — CineBook",
    description: "View upcoming, completed and cancelled CineBook reservations.",
    ogDescription: "Your movie tickets and booking history.",
    twitterCard: "summary",
  });

  const { bookings, cancelBooking } = useCinebook();
  const [tab, setTab] = useState<BookingStatus>("upcoming");

  const visible = bookings.filter((booking) => booking.status === tab);
  const activeLabel = TABS.find((item) => item.status === tab)?.label.toLowerCase() ?? "";

  return (
    <div className="page-shell min-h-[75vh] pb-24 pt-32">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">My Bookings</h1>
      <p className="mt-3 text-muted-foreground">Every ticket you have booked with CineBook.</p>

      <div className="mt-8 flex gap-2">
        {TABS.map((item) => {
          const count = bookings.filter((booking) => booking.status === item.status).length;
          return (
            <Button
              key={item.status}
              variant={tab === item.status ? "default" : "secondary"}
              className="rounded-full"
              onClick={() => setTab(item.status)}
            >
              {item.label}
              <span
                className={cn(
                  "ml-1 grid size-5 place-items-center rounded-full text-[11px]",
                  tab === item.status ? "bg-primary-foreground/20" : "bg-background/60",
                )}
              >
                {count}
              </span>
            </Button>
          );
        })}
      </div>

      {visible.length ? (
        <div className="mt-10 space-y-5">
          {visible.map((booking) => {
            const movie = getMovie(booking.movieId);
            const cinema = getCinema(booking.cinemaId);
            if (!movie) return null;
            return (
              <article
                key={booking.id}
                className="grid max-w-3xl overflow-hidden rounded-lg border border-border bg-card sm:grid-cols-[180px_1fr]"
              >
                <Link to={`/movies/${movie.id}`}>
                  <img
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                    width={1024}
                    height={1536}
                    className="h-full max-h-80 w-full object-cover"
                  />
                </Link>
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <span
                      className={cn(
                        "eyebrow",
                        booking.status === "cancelled" && "text-muted-foreground",
                      )}
                    >
                      {booking.status === "upcoming"
                        ? "Booking confirmed"
                        : booking.status === "completed"
                          ? "Watched"
                          : "Cancelled"}
                    </span>
                    <span className="text-xs text-muted-foreground">#{booking.id}</span>
                  </div>
                  <h2 className="mt-3 font-display text-2xl font-bold">
                    <Link to={`/movies/${movie.id}`} className="hover:text-primary">
                      {movie.title}
                    </Link>
                  </h2>
                  <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="size-4" />
                      {formatShowDate(booking.dateId)} · {booking.time} {booking.meridiem} ·{" "}
                      {booking.format}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="size-4" />
                      {cinema ? `${cinema.name} · ${cinema.location}` : "Cinema"}
                    </p>
                    <p className="flex items-center gap-2">
                      <Ticket className="size-4" />
                      {booking.seats.length} {booking.seats.length === 1 ? "seat" : "seats"} ·{" "}
                      {booking.seats.join(", ")} · {formatRupees(booking.total)}
                    </p>
                  </div>
                  {booking.status === "upcoming" && (
                    <div className="mt-7 flex flex-wrap gap-3">
                      <Button asChild>
                        <Link to={`/confirmation/${booking.id}`}>View ticket</Link>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          cancelBooking(booking.id);
                          toast.success("Booking cancelled. Refund starts in 3–5 days.");
                        }}
                      >
                        Cancel booking
                      </Button>
                    </div>
                  )}
                  {booking.status === "completed" && (
                    <Button asChild variant="outline" className="mt-7">
                      <Link to={`/movies/${movie.id}`}>Book again</Link>
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-16 max-w-lg">
          <Ticket className="size-10 text-primary" />
          <h2 className="mt-5 font-display text-2xl font-bold">
            Your movie journey starts here 🍿
          </h2>
          <p className="mt-2 text-muted-foreground">No {activeLabel} bookings yet.</p>
          <Button asChild className="mt-6">
            <Link to="/movies">Explore movies</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
