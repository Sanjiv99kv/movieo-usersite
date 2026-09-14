import { cinemas, getMovie, type Cinema, type Movie } from "@/data/movieo";

/**
 * Showtimes, seat layouts and occupancy are generated rather than stored, but every
 * generator is seeded from the show's identity — so the same show always produces the
 * same times, the same taken seats and the same prices across reloads and navigations.
 */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: string): () => number {
  let a = hash(seed);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type ShowDate = {
  id: string;
  label: string;
  weekday: string;
  day: string;
  month: string;
};

function toISODate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getShowDates(count = 6): ShowDate[] {
  const today = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const weekday = WEEKDAYS[date.getDay()] ?? "";
    return {
      id: toISODate(date),
      // "Tomorrow" overflows the date tile — every other day is a 3-letter weekday.
      label: index === 0 ? "Today" : weekday,
      weekday,
      day: String(date.getDate()).padStart(2, "0"),
      month: MONTHS[date.getMonth()] ?? "",
    };
  });
}

export function formatShowDate(dateId: string): string {
  const [year, month, day] = dateId.split("-").map(Number);
  if (!year || !month || !day) return dateId;
  const date = new Date(year, month - 1, day);
  return `${WEEKDAYS[date.getDay()]}, ${day} ${MONTHS[month - 1]}`;
}

const TIME_SLOTS = ["09:45", "11:30", "13:15", "16:30", "19:30", "22:15"];

/** Premium formats cost more than a standard 2D screening. */
const FORMAT_SURCHARGE: Record<string, number> = {
  IMAX: 150,
  "4DX": 200,
  "Dolby Atmos": 60,
  "2D": 0,
};

export type Showtime = {
  id: string;
  time: string;
  meridiem: string;
  format: string;
  surcharge: number;
  seatsLeft: number;
  soldOut: boolean;
};

export type CinemaShows = { cinema: Cinema; showtimes: Showtime[] };

function to12Hour(time: string): { time: string; meridiem: string } {
  const [rawHour, minute] = time.split(":");
  const hour = Number(rawHour);
  const meridiem = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return { time: `${display}:${minute}`, meridiem };
}

/** Formats a cinema can actually screen: what the movie supports ∩ what the venue has. */
function screenableFormats(movieFormats: string[], cinema: Cinema): string[] {
  const shared = movieFormats.filter((format) => cinema.amenities.includes(format));
  return shared.length ? shared : ["2D"];
}

export function getShows(movieId: string, dateId: string): CinemaShows[] {
  const movie = getMovie(movieId);
  // A film that has not opened has no screenings. Callers that render showtimes gate on
  // status themselves, but anything querying this directly was getting invented shows.
  if (!movie || movie.status !== "now-showing") return [];

  return cinemas.map((cinema) => {
    const formats = screenableFormats(movie.formats, cinema);
    const random = rng(`${movieId}|${cinema.id}|${dateId}`);

    const showtimes = TIME_SLOTS.flatMap<Showtime>((slot, index) => {
      // Not every cinema runs every slot — early shows are the ones most often dropped.
      if (random() < (index === 0 ? 0.45 : 0.15)) return [];
      const format = formats[Math.floor(random() * formats.length)] ?? "2D";
      const seatsLeft = Math.floor(random() * 70);
      const { time, meridiem } = to12Hour(slot);
      return [
        {
          id: `${dateId}T${slot.replace(":", "")}`,
          time,
          meridiem,
          format,
          surcharge: FORMAT_SURCHARGE[format] ?? 0,
          seatsLeft,
          soldOut: seatsLeft === 0,
        },
      ];
    });

    return { cinema, showtimes };
  });
}

export function findShowtime(
  movieId: string,
  cinemaId: string,
  showId: string,
): Showtime | undefined {
  const dateId = showId.split("T")[0] ?? "";
  const forCinema = getShows(movieId, dateId).find((entry) => entry.cinema.id === cinemaId);
  return forCinema?.showtimes.find((showtime) => showtime.id === showId);
}

export type SeatTier = {
  id: string;
  name: string;
  price: number;
  rows: string[];
};

export const seatTiers: SeatTier[] = [
  { id: "premium", name: "PREMIUM", price: 550, rows: ["A", "B"] },
  { id: "recliner", name: "RECLINER", price: 450, rows: ["C", "D"] },
  { id: "gold", name: "GOLD", price: 320, rows: ["E", "F", "G", "H"] },
  { id: "silver", name: "SILVER", price: 220, rows: ["J", "K", "L", "M"] },
];

export type SeatStatus = "available" | "occupied" | "locked";

export type Seat = {
  id: string;
  row: string;
  number: number;
  tierId: string;
  price: number;
  status: SeatStatus;
};

export type SeatRow = {
  row: string;
  tier: SeatTier;
  /** Seats split into blocks so the map can render real aisles between them. */
  groups: Seat[][];
};

const SEATS_PER_ROW = 16;
const AISLES_AFTER = [4, 12];

export function buildSeatMap(showKey: string, surcharge: number, priceModifier = 0): SeatRow[] {
  const random = rng(showKey);
  const rows: SeatRow[] = [];

  for (const tier of seatTiers) {
    for (const row of tier.rows) {
      const groups: Seat[][] = [[]];
      for (let number = 1; number <= SEATS_PER_ROW; number++) {
        const roll = random();
        const status: SeatStatus = roll < 0.28 ? "occupied" : roll < 0.32 ? "locked" : "available";
        const group = groups[groups.length - 1];
        group?.push({
          id: `${row}${number}`,
          row,
          number,
          tierId: tier.id,
          price: tier.price + surcharge + priceModifier,
          status,
        });
        if (AISLES_AFTER.includes(number)) groups.push([]);
      }
      rows.push({ row, tier, groups });
    }
  }

  return rows;
}

export const CONVENIENCE_FEE_RATE = 0.06;

export function convenienceFee(subtotal: number): number {
  return Math.round(subtotal * CONVENIENCE_FEE_RATE);
}

export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function makeBookingId(): string {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `CBX${suffix}`;
}

export type PromoResult = { code: string; label: string; discount: number };

/**
 * Promo rules for the demo checkout. Each returns the rupee discount for the current
 * basket, or null when the basket does not qualify.
 */
const PROMOS: Record<string, (seatPrices: number[], foodTotal: number) => PromoResult | null> = {
  CINE50: (seatPrices) => {
    if (seatPrices.length < 2) return null;
    const sorted = [...seatPrices].sort((a, b) => a - b);
    const second = sorted[1] ?? 0;
    return {
      code: "CINE50",
      label: "50% off your second ticket",
      discount: Math.round(second / 2),
    };
  },
  HDFC250: (seatPrices) => {
    const subtotal = seatPrices.reduce((sum, price) => sum + price, 0);
    if (subtotal < 800) return null;
    return { code: "HDFC250", label: "HDFC instant savings", discount: 250 };
  },
  FIRSTSHOW: (seatPrices) => {
    const cheapest = Math.min(...seatPrices);
    if (!Number.isFinite(cheapest)) return null;
    return { code: "FIRSTSHOW", label: "First booking free ticket", discount: cheapest };
  },
  CAMPUS150: (seatPrices) => {
    const discount = seatPrices.reduce((sum, price) => sum + Math.max(0, price - 150), 0);
    if (discount <= 0) return null;
    return { code: "CAMPUS150", label: "Student flat ₹150 tickets", discount };
  },
  SNACK199: (_seatPrices, foodTotal) => {
    if (foodTotal < 299) return null;
    return { code: "SNACK199", label: "Popcorn combo at ₹199", discount: 100 };
  },
};

export type PromoOutcome =
  { ok: true; promo: PromoResult } | { ok: false; reason: "unknown" | "not-eligible" };

export function applyPromo(rawCode: string, seatPrices: number[], foodTotal: number): PromoOutcome {
  const code = rawCode.trim().toUpperCase();
  const rule = PROMOS[code];
  if (!rule) return { ok: false, reason: "unknown" };
  const promo = rule(seatPrices, foodTotal);
  return promo ? { ok: true, promo } : { ok: false, reason: "not-eligible" };
}

export const TIME_BANDS = ["Morning", "Afternoon", "Evening", "Night"] as const;
export type TimeBand = (typeof TIME_BANDS)[number];

/** Label for a band, so the filter can say what it actually means. */
export const TIME_BAND_HINT: Record<TimeBand, string> = {
  Morning: "before 12 PM",
  Afternoon: "12 – 4 PM",
  Evening: "4 – 8 PM",
  Night: "after 8 PM",
};

function bandOf(showId: string): TimeBand {
  const hour = Number(showId.split("T")[1]?.slice(0, 2) ?? 0);
  if (hour < 12) return "Morning";
  if (hour < 16) return "Afternoon";
  if (hour < 20) return "Evening";
  return "Night";
}

/** True when the movie actually has a screening in that band on that date. */
export function hasShowInBand(movieId: string, dateId: string, band: TimeBand): boolean {
  return getShows(movieId, dateId).some((entry) =>
    entry.showtimes.some((showtime) => !showtime.soldOut && bandOf(showtime.id) === band),
  );
}

/** Cheapest ticket for a title: lowest tier, cheapest format it screens in, plus its modifier. */
export function movieFromPrice(movie: Movie): number {
  const cheapestTier = Math.min(...seatTiers.map((tier) => tier.price));
  const cheapestFormat = Math.min(...movie.formats.map((f) => FORMAT_SURCHARGE[f] ?? 0));
  return cheapestTier + cheapestFormat + movie.priceModifier;
}

export const PRICE_BANDS = ["Under ₹250", "₹250 – ₹300", "Over ₹300"] as const;
export type PriceBand = (typeof PRICE_BANDS)[number];

export function matchesPriceBand(price: number, band: PriceBand): boolean {
  if (band === "Under ₹250") return price < 250;
  if (band === "₹250 – ₹300") return price >= 250 && price <= 300;
  return price > 300;
}

export function inPriceBand(movie: Movie, band: PriceBand): boolean {
  return matchesPriceBand(movieFromPrice(movie), band);
}

/** Cheapest seat for one screening: lowest tier + that show's format surcharge + the title's modifier. */
export function showtimeFromPrice(movie: Movie, showtime: Showtime): number {
  const cheapestTier = Math.min(...seatTiers.map((tier) => tier.price));
  return cheapestTier + showtime.surcharge + movie.priceModifier;
}

/** Which band a screening falls into — Morning / Afternoon / Evening / Night. */
export function showtimeBand(showtime: Showtime): TimeBand {
  const hour = Number(showtime.id.split("T")[1]?.slice(0, 2) ?? 0);
  if (hour < 12) return "Morning";
  if (hour < 16) return "Afternoon";
  if (hour < 20) return "Evening";
  return "Night";
}
