import { ArrowLeft, CreditCard, Minus, Plus, Tag, Utensils } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { SeatLegend, SeatMap } from "@/components/cinebook/SeatMap";
import { SeatMapSkeleton } from "@/components/cinebook/Skeletons";
import { StepIndicator } from "@/components/cinebook/StepIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  applyPromo,
  buildSeatMap,
  convenienceFee,
  findShowtime,
  formatRupees,
  formatShowDate,
  makeBookingId,
  type PromoResult,
  type Seat,
} from "@/data/booking";
import { foodItems, getCinema, getMovie } from "@/data/cinebook";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSimulatedLoad } from "@/hooks/use-simulated-load";
import { cn } from "@/lib/utils";
import NotFoundPage from "@/pages/NotFound";
import { useCinebook } from "@/store/cinebook-context";

const MAX_SEATS = 10;
const PAYMENT_METHODS = ["UPI", "Credit / Debit Card", "Net Banking", "Wallet"];

export default function BookingPage() {
  const { movieId, cinemaId, showId } = useParams();
  const navigate = useNavigate();
  const { addBooking } = useCinebook();

  const movie = getMovie(movieId);
  const cinema = getCinema(cinemaId);
  const showtime =
    movieId && cinemaId && showId ? findShowtime(movieId, cinemaId, showId) : undefined;

  const loading = useSimulatedLoad(520);
  const [stage, setStage] = useState<"seats" | "payment">("seats");
  const [selected, setSelected] = useState<Seat[]>([]);
  const [food, setFood] = useState<Record<string, number>>({});
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<PromoResult | null>(null);
  const [method, setMethod] = useState(PAYMENT_METHODS[0] ?? "UPI");
  const [paying, setPaying] = useState(false);

  usePageMeta({
    title: movie ? `Book ${movie.title} — CineBook` : "Book tickets — CineBook",
    description: "Pick your seats and complete your CineBook booking.",
    twitterCard: "summary",
  });

  const rows = useMemo(
    () =>
      showId ? buildSeatMap(`${movieId}|${cinemaId}|${showId}`, showtime?.surcharge ?? 0) : [],
    [movieId, cinemaId, showId, showtime?.surcharge],
  );

  if (!movie || !cinema || !showtime) return <NotFoundPage />;

  const seatPrices = selected.map((seat) => seat.price);
  const ticketTotal = seatPrices.reduce((sum, price) => sum + price, 0);
  const foodTotal = Object.entries(food).reduce((sum, [id, qty]) => {
    const item = foodItems.find((entry) => entry.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);
  const subtotal = ticketTotal + foodTotal;
  const discount = promo?.discount ?? 0;
  const fee = convenienceFee(Math.max(0, subtotal - discount));
  const total = Math.max(0, subtotal - discount) + fee;

  const toggleSeat = (seat: Seat) => {
    setPromo(null);
    setSelected((current) => {
      const exists = current.some((item) => item.id === seat.id);
      if (exists) return current.filter((item) => item.id !== seat.id);
      if (current.length >= MAX_SEATS) {
        toast.error(`You can book up to ${MAX_SEATS} seats in one go.`);
        return current;
      }
      return [...current, seat].sort((a, b) =>
        a.id.localeCompare(b.id, undefined, { numeric: true }),
      );
    });
  };

  const setFoodQty = (id: string, delta: number) => {
    setPromo(null);
    setFood((current) => {
      const next = Math.max(0, (current[id] ?? 0) + delta);
      const updated = { ...current, [id]: next };
      if (!next) delete updated[id];
      return updated;
    });
  };

  const redeem = () => {
    const outcome = applyPromo(promoInput, seatPrices, foodTotal);
    if (outcome.ok) {
      setPromo(outcome.promo);
      toast.success(`${outcome.promo.code} applied — ${formatRupees(outcome.promo.discount)} off`);
      return;
    }
    setPromo(null);
    toast.error(
      outcome.reason === "unknown"
        ? "That code isn't valid."
        : "This basket doesn't qualify for that code yet.",
    );
  };

  const pay = () => {
    setPaying(true);
    // Stands in for the payment gateway round trip.
    setTimeout(() => {
      const booking = {
        id: makeBookingId(),
        movieId: movie.id,
        cinemaId: cinema.id,
        showId: showtime.id,
        dateId: showtime.id.split("T")[0] ?? "",
        time: showtime.time,
        meridiem: showtime.meridiem,
        format: showtime.format,
        seats: selected.map((seat) => seat.id),
        total,
        status: "upcoming" as const,
      };
      addBooking(booking);
      setPaying(false);
      navigate(`/confirmation/${booking.id}`);
    }, 900);
  };

  const showDate = formatShowDate(showtime.id.split("T")[0] ?? "");

  return (
    <div className="page-shell pb-44 pt-28 md:pb-32">
      <Button asChild variant="ghost" className="-ml-3 mb-4 text-muted-foreground">
        <Link to={`/movies/${movie.id}`}>
          <ArrowLeft /> Back to {movie.title}
        </Link>
      </Button>

      <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{movie.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {cinema.name} · {cinema.location}
            </p>
          </div>
          <div className="text-sm sm:text-right">
            <p className="font-semibold">
              {showDate} · {showtime.time} {showtime.meridiem}
            </p>
            <p className="mt-1 text-muted-foreground">
              Screen 3 · {showtime.format} · {movie.certificate}
            </p>
          </div>
        </div>
        <div className="mt-6 border-t border-border pt-5">
          <StepIndicator current={stage === "seats" ? 2 : 3} />
        </div>
      </div>

      {stage === "seats" ? (
        <section className="mt-8">
          {loading ? (
            <SeatMapSkeleton />
          ) : (
            <>
              <SeatMap
                rows={rows}
                selected={selected.map((seat) => seat.id)}
                onToggle={toggleSeat}
                maxSeats={MAX_SEATS}
              />
              <div className="mt-8 border-t border-border pt-6">
                <SeatLegend />
              </div>
            </>
          )}
        </section>
      ) : (
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <article className="rounded-lg border border-border bg-card p-5 sm:p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <Utensils className="size-5 text-primary" /> Add food &amp; beverages
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Collect it at the counter or have it brought to your seat.
              </p>
              <div className="mt-5 space-y-3">
                {foodItems.map((item) => {
                  const qty = food[item.id] ?? 0;
                  return (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.detail}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">{formatRupees(item.price)}</span>
                        {qty > 0 ? (
                          <div className="flex items-center gap-1 rounded-md border border-border">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-8"
                              aria-label={`Remove one ${item.name}`}
                              onClick={() => setFoodQty(item.id, -1)}
                            >
                              <Minus className="size-3.5" />
                            </Button>
                            <span className="w-5 text-center text-sm font-semibold">{qty}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-8"
                              aria-label={`Add one ${item.name}`}
                              onClick={() => setFoodQty(item.id, 1)}
                            >
                              <Plus className="size-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setFoodQty(item.id, 1)}
                          >
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="rounded-lg border border-border bg-card p-5 sm:p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <Tag className="size-5 text-primary" /> Apply an offer
              </h2>
              <div className="mt-4 flex gap-2">
                <Input
                  value={promoInput}
                  onChange={(event) => setPromoInput(event.target.value)}
                  placeholder="Enter code e.g. CINE50"
                  className="uppercase"
                />
                <Button variant="outline" onClick={redeem} disabled={!promoInput.trim()}>
                  Apply
                </Button>
              </div>
              {promo && (
                <p className="mt-3 text-sm text-primary">
                  {promo.code} applied — {promo.label}
                </p>
              )}
            </article>

            <article className="rounded-lg border border-border bg-card p-5 sm:p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <CreditCard className="size-5 text-primary" /> Payment method
              </h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {PAYMENT_METHODS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMethod(item)}
                    aria-pressed={method === item}
                    className={cn(
                      "rounded-md border px-4 py-3 text-left text-sm font-semibold transition",
                      method === item
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-surface text-muted-foreground hover:border-primary/50",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                This is a demo checkout — no payment details are collected and no money moves.
              </p>
            </article>
          </div>

          <aside className="h-max rounded-lg border border-border bg-card p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-bold">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <Line label={`Tickets (${selected.length})`} value={formatRupees(ticketTotal)} />
              {foodTotal > 0 && <Line label="Food & beverages" value={formatRupees(foodTotal)} />}
              {discount > 0 && (
                <Line
                  label={`Discount (${promo?.code})`}
                  value={`−${formatRupees(discount)}`}
                  accent
                />
              )}
              <Line label="Convenience fee" value={formatRupees(fee)} />
              <div className="flex items-center justify-between border-t border-border pt-3 text-base font-bold">
                <dt>Total</dt>
                <dd>{formatRupees(total)}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              Seats {selected.map((seat) => seat.id).join(", ")}
            </p>
            <Button className="mt-6 w-full" size="lg" disabled={paying} onClick={pay}>
              {paying ? "Processing…" : `Pay ${formatRupees(total)}`}
            </Button>
            <Button variant="ghost" className="mt-2 w-full" onClick={() => setStage("seats")}>
              Change seats
            </Button>
          </aside>
        </section>
      )}

      {stage === "seats" && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl">
          <div className="page-shell flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              {selected.length ? (
                <>
                  <p className="font-semibold">
                    {selected.length} {selected.length === 1 ? "Seat" : "Seats"} ·{" "}
                    {formatRupees(ticketTotal)}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {selected.map((seat) => seat.id).join(", ")}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Select up to {MAX_SEATS} seats</p>
              )}
            </div>
            <Button size="lg" disabled={!selected.length} onClick={() => setStage("payment")}>
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Line({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("font-semibold", accent && "text-primary")}>{value}</dd>
    </div>
  );
}
