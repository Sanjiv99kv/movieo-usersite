import { CalendarPlus, Check, Download, Home, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { StepIndicator } from "@/components/movieo/StepIndicator";
import { Button } from "@/components/ui/button";
import { formatRupees, formatShowDate } from "@/data/booking";
import { getCinema, getMovie } from "@/data/movieo";
import { usePageMeta } from "@/hooks/use-page-meta";
import { downloadCalendarInvite, downloadTicket, type TicketDetails } from "@/lib/ticket";
import NotFoundPage from "@/pages/NotFound";
import { useMovieo } from "@/store/movieo-context";

/** Turns "2026-09-20" + "7:30" + "PM" into a real Date for the calendar invite. */
function showStart(dateId: string, time: string, meridiem: string): Date {
  const [year, month, day] = dateId.split("-").map(Number);
  const [rawHour, rawMinute] = time.split(":").map(Number);
  let hour = rawHour ?? 0;
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, hour, rawMinute ?? 0);
}

export default function ConfirmationPage() {
  const { bookingId } = useParams();
  const { bookings } = useMovieo();
  const booking = bookings.find((item) => item.id === bookingId);
  const [qr, setQr] = useState("");

  const movie = getMovie(booking?.movieId);
  const cinema = getCinema(booking?.cinemaId);

  usePageMeta({
    title: "Booking confirmed — MOVIEO",
    description: "Your MOVIEO tickets are confirmed.",
    twitterCard: "summary",
  });

  useEffect(() => {
    if (!booking) return;
    let cancelled = false;
    // Loaded on demand so the QR encoder stays out of the main bundle.
    import("qrcode")
      .then((module) =>
        module.default.toDataURL(`MOVIEO:${booking.id}`, {
          margin: 1,
          width: 320,
          color: { dark: "#0f0f14", light: "#ffffff" },
        }),
      )
      .then((url) => {
        if (!cancelled) setQr(url);
      })
      .catch(() => setQr(""));
    return () => {
      cancelled = true;
    };
  }, [booking]);

  if (!booking || !movie || !cinema) return <NotFoundPage />;

  const dateLabel = formatShowDate(booking.dateId);
  const details: TicketDetails = {
    bookingId: booking.id,
    movieTitle: movie.title,
    cinemaName: cinema.name,
    cinemaLocation: cinema.location,
    dateLabel,
    time: `${booking.time} ${booking.meridiem}`,
    format: booking.format,
    seats: booking.seats,
    total: formatRupees(booking.total),
  };

  const rows = [
    ["Movie", movie.title],
    ["Cinema", `${cinema.name} · ${cinema.location}`],
    ["Date", dateLabel],
    ["Time", `${booking.time} ${booking.meridiem} · ${booking.format}`],
    ["Seats", booking.seats.join(", ")],
    ["Amount paid", formatRupees(booking.total)],
  ];

  return (
    <div className="page-shell min-h-[75vh] pb-24 pt-28">
      <div className="mx-auto max-w-3xl">
        <StepIndicator current={4} />

        <div className="mt-10 text-center">
          <span className="success-pop mx-auto grid size-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
            <Check className="size-10" strokeWidth={3} />
          </span>
          <h1 className="mt-7 font-display text-3xl font-bold sm:text-4xl">Booking Confirmed 🎉</h1>
          <p className="mt-3 text-muted-foreground">
            Your tickets are ready. Show the QR code at the entrance.
          </p>
        </div>

        <article className="mt-10 overflow-hidden rounded-lg border border-border bg-card">
          <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_auto]">
            <div>
              <dl className="space-y-4">
                {rows.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[110px_1fr] gap-4 text-sm">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 border-t border-dashed border-border pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              {qr ? (
                <img
                  src={qr}
                  alt={`QR code for booking ${booking.id}`}
                  width={160}
                  height={160}
                  className="size-40 rounded-md bg-white p-2"
                />
              ) : (
                <div className="size-40 animate-pulse rounded-md bg-muted" />
              )}
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Booking ID</p>
              <p className="font-display text-lg font-bold">{booking.id}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-border bg-surface p-6 sm:p-8">
            <Button
              onClick={() => {
                downloadTicket(details, qr);
                toast.success("Ticket downloaded");
              }}
              disabled={!qr}
            >
              <Download /> Download Ticket
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                downloadCalendarInvite(
                  details,
                  showStart(booking.dateId, booking.time, booking.meridiem),
                  150,
                );
                toast.success("Calendar invite downloaded");
              }}
            >
              <CalendarPlus /> Add to Calendar
            </Button>
            <Button asChild variant="ghost">
              <Link to="/bookings">
                <Ticket /> My bookings
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/">
                <Home /> Back to Home
              </Link>
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
}
