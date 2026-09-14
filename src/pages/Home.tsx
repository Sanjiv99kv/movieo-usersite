import {
  Apple,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  Film,
  Heart,
  MapPin,
  Play,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Ticket,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import heroFallback from "@/assets/hero-desert.jpg";
import cinemaHall from "@/assets/cinema-hall.jpg";
import { CinemaCard } from "@/components/movieo/CinemaCard";
import { FoodCard } from "@/components/movieo/FoodMenu";
import { CitySelector } from "@/components/movieo/CitySelector";
import { FormatCard } from "@/components/movieo/FormatCard";
import { MovieRail } from "@/components/movieo/MovieRail";
import { OfferCard } from "@/components/movieo/OfferCard";
import { Reveal } from "@/components/movieo/Reveal";
import { SectionHeading } from "@/components/movieo/SectionHeading";
import { MovieRailSkeleton } from "@/components/movieo/Skeletons";
import { Button } from "@/components/ui/button";
import { formatRupees, formatShowDate } from "@/data/booking";
import {
  cinemas,
  comingSoon,
  foodImageSrc,
  foodItems,
  formatCards,
  getCinema,
  getMovie,
  movies,
  nowShowing,
  offers,
  type Movie,
} from "@/data/movieo";
import { api, type HeroSlide } from "@/lib/api";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSimulatedLoad } from "@/hooks/use-simulated-load";
import { displayName, useAuth } from "@/store/auth-context";
import { useMovieo } from "@/store/movieo-context";

export default function HomePage() {
  usePageMeta({
    title: "MOVIEO — Book Movies & Cinema Tickets",
    description:
      "Discover now showing movies, premium cinemas, offers and book the best seats with MOVIEO.",
    ogTitle: "MOVIEO — Your Next Great Story",
    ogDescription: "Discover movies and book cinema tickets in a faster, more cinematic way.",
  });

  const { city, watchlist, bookings } = useMovieo();
  const { user } = useAuth();
  const [cityOpen, setCityOpen] = useState(false);
  const loading = useSimulatedLoad(600);

  // A movie is "recommended" when it carries a rationale, which is the line the
  // card shows under the title — so the copy always matches the data.
  const recommended = movies.filter((movie) => movie.reason);
  const cheapestSnack = Math.min(...foodItems.map((item) => item.price));

  const upcomingBooking = bookings.find((booking) => booking.status === "upcoming");
  const lastWatched = bookings.find((booking) => booking.status === "completed");

  return (
    <>
      <Hero />

      {/*
        Hugs its own content and centres, rather than stretching city and pills to
        opposite edges of a full-width card — that left a dead gap down the middle.
        Sits below the hero instead of overlapping it, so the hero reads clean.
      */}
      <section className="page-shell relative z-20 mt-8">
        <div className="mx-auto flex w-max max-w-full items-center gap-2 rounded-full border border-border/70 bg-card/80 p-2 shadow-card backdrop-blur-2xl sm:gap-3">
          <button
            type="button"
            onClick={() => setCityOpen(true)}
            className="group flex shrink-0 items-center gap-2.5 rounded-full py-1 pl-1 pr-2 text-left transition hover:bg-accent/60"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
              <MapPin className="size-4" />
            </span>
            <span className="pr-1">
              <span className="block text-[11px] leading-tight text-muted-foreground">
                Watching in
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold leading-tight transition group-hover:text-primary">
                {city}
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </span>
            </span>
          </button>

          <span className="h-8 w-px shrink-0 bg-border" />

          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
            {[
              { label: "Movies", to: "/movies" },
              { label: "Cinemas", to: "/cinemas" },
              { label: "Languages", to: "/movies" },
              { label: "Genres", to: "/movies" },
              { label: "This Weekend", to: "/movies" },
            ].map((item, index) => (
              <Button
                key={item.label}
                asChild
                size="sm"
                variant={index === 0 ? "default" : "secondary"}
                className="shrink-0 rounded-full px-4"
              >
                <Link to={item.to}>{item.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <Reveal as="section" className="page-shell section-space">
        <SectionHeading
          title="Now Showing"
          subtitle="Catch the biggest movies playing near you."
          action={
            <Button asChild variant="outline">
              <Link to="/movies">
                View all movies <ChevronRight />
              </Link>
            </Button>
          }
        />
        {loading ? <MovieRailSkeleton /> : <MovieRail movies={nowShowing} />}
      </Reveal>

      <section className="bg-surface">
        <Reveal className="page-shell section-space">
          <SectionHeading
            title="Recommended For You"
            subtitle="Movies you might love."
            action={
              <Button asChild variant="outline">
                <Link to="/movies">
                  View all movies <ChevronRight />
                </Link>
              </Button>
            }
          />
          {loading ? (
            <MovieRailSkeleton count={4} />
          ) : (
            <MovieRail movies={recommended} showReason />
          )}
        </Reveal>
      </section>

      <Reveal as="section" className="page-shell section-space">
        <SectionHeading title="Trending Now" subtitle="The stories everyone is talking about." />
        <div className="flex gap-8 overflow-x-auto py-4 hide-scrollbar">
          {movies.slice(0, 5).map((movie, index) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className="group relative flex w-[220px] shrink-0 items-end pl-12"
            >
              <span className="absolute bottom-0 left-0 z-10 font-display text-8xl font-bold text-background transition duration-500 group-hover:text-primary/20 [-webkit-text-stroke:2px_var(--foreground)]">
                0{index + 1}
              </span>
              <img
                src={movie.poster}
                alt={`${movie.title} trending poster`}
                loading="lazy"
                width={1024}
                height={1536}
                className="aspect-[2/3] w-40 rounded-lg object-cover shadow-card transition duration-500 group-hover:-translate-y-2 group-hover:shadow-glow"
              />
            </Link>
          ))}
        </div>
      </Reveal>

      <section className="bg-surface">
        <Reveal className="page-shell section-space">
          <SectionHeading title="Coming Soon" subtitle="Get ready for what's next." />
          <div className="grid gap-5 md:grid-cols-3">
            {comingSoon.map((movie) => (
              <article
                key={movie.id}
                className="grid grid-cols-[110px_1fr] overflow-hidden rounded-lg border border-border bg-card transition hover:border-primary/40"
              >
                <Link to={`/movies/${movie.id}`}>
                  <img
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                    loading="lazy"
                    width={1024}
                    height={1536}
                    className="h-full min-h-44 w-full object-cover"
                  />
                </Link>
                <div className="flex flex-col justify-between p-4">
                  <div>
                    <span className="eyebrow">Releasing {movie.release}</span>
                    <h3 className="mt-2 font-display text-lg font-bold">
                      <Link to={`/movies/${movie.id}`} className="hover:text-primary">
                        {movie.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {movie.genre} · {movie.language}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => toast.success("Reminder set successfully.")}
                  >
                    <Bell /> Remind me
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      {user && (
        <Reveal as="section" className="page-shell section-space">
          <SectionHeading
            title="Your Movie Journey"
            subtitle={`Welcome back, ${displayName(user).split(" ")[0]}.`}
            action={
              <Button asChild variant="ghost">
                <Link to="/bookings">
                  All bookings <ChevronRight />
                </Link>
              </Button>
            }
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <JourneyCard
              eyebrow="Upcoming booking"
              title={getMovie(upcomingBooking?.movieId)?.title ?? "Nothing booked yet"}
              lines={
                upcomingBooking
                  ? [
                      `${formatShowDate(upcomingBooking.dateId)} · ${upcomingBooking.time} ${upcomingBooking.meridiem}`,
                      getCinema(upcomingBooking.cinemaId)?.name ?? "",
                      `Seats ${upcomingBooking.seats.join(", ")}`,
                    ]
                  : ["Find a show and grab your seats."]
              }
              action={
                upcomingBooking
                  ? { label: "View ticket", to: `/confirmation/${upcomingBooking.id}` }
                  : { label: "Explore movies", to: "/movies" }
              }
              icon={Ticket}
            />
            <JourneyCard
              eyebrow="Last watched"
              title={getMovie(lastWatched?.movieId)?.title ?? "No history yet"}
              lines={
                lastWatched
                  ? [
                      formatShowDate(lastWatched.dateId),
                      getCinema(lastWatched.cinemaId)?.name ?? "",
                    ]
                  : ["Your completed shows appear here."]
              }
              action={{ label: "Book again", to: "/movies" }}
              icon={Film}
            />
            <JourneyCard
              eyebrow="Watchlist"
              title={`${watchlist.length} saved ${watchlist.length === 1 ? "movie" : "movies"}`}
              lines={["Stories you don't want to miss."]}
              action={{ label: "Open watchlist", to: "/watchlist" }}
              icon={Heart}
            />
            <JourneyCard
              eyebrow="MOVIEO Club"
              title={`${bookings.length * 120} points`}
              lines={["Earn 2x on every premium format show."]}
              action={{ label: "See offers", to: "/offers" }}
              icon={Sparkles}
            />
          </div>
        </Reveal>
      )}

      <Reveal as="section" className="page-shell section-space">
        <SectionHeading
          title="Popular Cinemas"
          subtitle="Premium screens, closer than you think."
          action={
            <Button asChild variant="ghost">
              <Link to="/cinemas">
                View all <ChevronRight />
              </Link>
            </Button>
          }
        />
        {/* A grid, not a rail — there are only a handful of venues, and a scroller left
            dead space on the right once they all fit. */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cinemas.map((cinema) => (
            <CinemaCard key={cinema.id} cinema={cinema} />
          ))}
        </div>
      </Reveal>

      <section className="relative overflow-hidden bg-surface">
        <img
          src={cinemaHall}
          alt=""
          loading="lazy"
          width={1536}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        {/* Fades top-and-bottom rather than left-to-right — the horizontal version left
            the backdrop visible only on the right, which read as a half-applied wash. */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/75 to-surface" />
        <Reveal className="page-shell section-space relative">
          <SectionHeading
            title="Choose Your Experience"
            subtitle="Every story deserves the perfect screen."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {formatCards.map((format) => (
              <FormatCard key={format.name} format={format} />
            ))}
          </div>
        </Reveal>
      </section>

      <Reveal as="section" className="page-shell section-space">
        <SectionHeading
          title="Exclusive Offers"
          subtitle="More movies. Less spend."
          action={
            <Button asChild variant="ghost">
              <Link to="/offers">
                All offers <ChevronRight />
              </Link>
            </Button>
          }
        />
        <div className="grid gap-5 md:grid-cols-3">
          {offers.slice(0, 3).map((offer) => (
            <OfferCard key={offer.code} offer={offer} />
          ))}
        </div>
      </Reveal>

      <section className="bg-surface">
        <Reveal className="page-shell section-space">
          <span className="eyebrow">Food &amp; beverages</span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Complete Your Movie Experience
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
            Add a combo while you pick your seats and it will be waiting when you arrive.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            {/* The photo has no intrinsic height here — it stretches to the grid row, so
                it starts and ends flush with the menu beside it. min-h covers the
                single-column case, where there is no taller sibling to match. */}
            <div className="relative min-h-72 overflow-hidden rounded-xl lg:min-h-0">
              <img
                src={foodImageSrc}
                alt="Popcorn, nachos and drinks at the concession counter"
                loading="lazy"
                width={1536}
                height={1024}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/25 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Starting at
                  </p>
                  <p className="font-display text-2xl font-bold">{formatRupees(cheapestSnack)}</p>
                </div>
                <span className="rounded-md bg-background/75 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                  Counter pickup or served to your seat
                </span>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-border" />
            </div>

            <div className="flex flex-col">
              <div className="grid gap-3 sm:grid-cols-2">
                {foodItems.slice(0, 4).map((item) => (
                  <FoodCard key={item.id} item={item} />
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Button asChild>
                  <Link to="/movies">
                    <Utensils /> Add with your booking
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground">
                  {foodItems.length} items on the menu · added at checkout
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal as="section" className="page-shell section-space">
        <SectionHeading title="Book Your Movie in 3 Easy Steps" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Film,
              step: "01",
              title: "Choose a Movie",
              copy: "Browse what is playing near you.",
            },
            {
              icon: CalendarDays,
              step: "02",
              title: "Select Your Seats",
              copy: "Pick a showtime and your row.",
            },
            {
              icon: Ticket,
              step: "03",
              title: "Enjoy the Show",
              copy: "Your QR ticket is ready instantly.",
            },
          ].map((item, index) => (
            <Reveal key={item.step} delay={index * 90} className="border-t border-border pt-5">
              <span className="font-display text-sm text-primary">STEP {item.step}</span>
              <item.icon className="mt-8 size-7" />
              <h3 className="mt-4 font-display text-xl font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.copy}</p>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <section className="bg-surface">
        <Reveal className="page-shell section-space">
          {/* One panel split evenly in two. The old [1fr_auto] grid pushed the form and
              the app card to opposite edges and left a dead gap down the middle. */}
          <div className="relative overflow-hidden rounded-2xl bg-card p-6 sm:p-10">
            <div className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-primary/20 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <span className="eyebrow">Stay in the front row</span>
                <h2 className="mt-3 font-display text-3xl font-bold">Never Miss a Movie</h2>
                <p className="mt-3 max-w-md leading-7 text-muted-foreground">
                  Get movie releases, exclusive offers and personalized recommendations straight to
                  your inbox.
                </p>

                <form
                  className="mt-7 flex w-full max-w-md flex-col gap-2 sm:flex-row"
                  onSubmit={(event) => {
                    event.preventDefault();
                    event.currentTarget.reset();
                    toast.success("You're on the list!");
                  }}
                >
                  <label className="sr-only" htmlFor="newsletter">
                    Email address
                  </label>
                  <input
                    id="newsletter"
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="h-11 min-w-0 flex-1 rounded-md border border-input bg-background px-4 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-ring"
                  />
                  <Button type="submit" className="h-11 shrink-0">
                    Subscribe
                  </Button>
                </form>

                <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-primary" />
                  No spam, and one click to unsubscribe.
                </p>
              </div>

              <div className="lg:border-l lg:border-border lg:pl-16">
                <span className="eyebrow">Coming soon on mobile</span>
                <h3 className="mt-3 font-display text-xl font-bold">
                  Your tickets, in your pocket
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  Tickets, reminders and your QR pass in one place.
                </p>

                <ul className="mt-6 space-y-3">
                  {[
                    { icon: QrCode, label: "Your QR pass works without signal" },
                    { icon: Bell, label: "Showtime reminders before you leave" },
                    { icon: Heart, label: "A watchlist that follows you across devices" },
                  ].map((feature) => (
                    <li
                      key={feature.label}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
                        <feature.icon className="size-4" />
                      </span>
                      {feature.label}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => toast("We'll let you know at launch.")}>
                    <Apple /> App Store
                  </Button>
                  <Button variant="outline" onClick={() => toast("We'll let you know at launch.")}>
                    <Smartphone /> Google Play
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function JourneyCard({
  eyebrow,
  title,
  lines,
  action,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  lines: string[];
  action: { label: string; to: string };
  icon: typeof Ticket;
}) {
  return (
    <article className="flex flex-col rounded-lg border border-border bg-card p-5">
      <Icon className="size-5 text-primary" />
      <p className="eyebrow mt-4">{eyebrow}</p>
      <h3 className="mt-2 font-display text-lg font-bold">{title}</h3>
      <div className="mt-2 flex-1 space-y-1 text-sm text-muted-foreground">
        {lines.filter(Boolean).map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <Button asChild variant="outline" size="sm" className="mt-5 w-max">
        <Link to={action.to}>{action.label}</Link>
      </Button>
    </article>
  );
}

/** One slide, however it was sourced — the API or the bundled fallback. */
interface HeroView {
  key: string;
  href: string;
  eyebrow: string;
  title: string;
  blurb: string;
  backdrop: string;
  rating: number | null;
  genres: string[];
  duration: string | null;
  language: string | null;
}

/** 166 -> "2h 46m". The server sends minutes; how they read is ours to decide. */
function runtimeLabel(minutes: number | null): string | null {
  if (minutes === null || minutes <= 0) return null;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${String(hours)}h ${String(rest)}m` : `${String(rest)}m`;
}

function fromApi(slide: HeroSlide): HeroView {
  return {
    key: slide.id,
    href: `/movies/${slide.slug}`,
    // Derived server-side from whether screenings exist, so this cannot
    // advertise "Now showing" for a film with nothing to book.
    eyebrow: slide.bucket === "now_showing" ? "Now showing" : "Coming soon",
    title: slide.title,
    blurb: slide.tagline ?? "",
    backdrop: slide.backdropUrl ?? heroFallback,
    rating: slide.criticRating,
    genres: slide.genres.map((genre) => genre.name),
    duration: runtimeLabel(slide.runtimeMinutes),
    language: slide.languages.map((language) => language.name).join(" · ") || null,
  };
}

function fromBundled(movie: Movie): HeroView {
  return {
    key: movie.id,
    href: `/movies/${movie.id}`,
    eyebrow: movie.status === "now-showing" ? "Now showing" : "Coming soon",
    title: movie.title,
    blurb: movie.description,
    backdrop: movie.backdrop,
    rating: movie.rating,
    genres: movie.genres,
    duration: movie.duration,
    language: movie.language,
  };
}

function Hero() {
  // `null` while the request is in flight, so the first paint does not flash the
  // fallback and then swap to real data.
  const [slides, setSlides] = useState<HeroView[] | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const { slides: fetched } = await api.hero();
        if (!cancelled) setSlides(fetched.map(fromApi));
      } catch {
        // The homepage is the front door: it renders for a visitor whether or
        // not the API is up. Falling back is not hiding an error, it is the
        // page doing its job while the catalogue is unreachable or still empty.
        if (!cancelled) setSlides([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const bundled = nowShowing[0];
  const views =
    slides === null || slides.length > 0 ? (slides ?? []) : bundled ? [fromBundled(bundled)] : [];

  // Auto-advance, but never for a single slide and never against a stated
  // preference for less motion.
  //
  // Keyed on `active` as well as the count, so every change — a click on a dot
  // included — starts a fresh dwell. Without that, picking a slide just as the
  // timer was about to fire shows it for a moment and then moves on, which
  // reads as the carousel ignoring you.
  useEffect(() => {
    if (views.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % views.length);
    }, 7000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [views.length, active]);

  const slide = views[active] ?? views[0];

  // Before the first response there is nothing truthful to show, so hold the
  // stage's height rather than letting the page jump when it arrives.
  if (!slide) {
    return <section className="min-h-[680px] bg-card/40 md:h-[82vh] md:min-h-[720px]" />;
  }

  // "Echoes of Arrakis" -> "ECHOES OF" / "ARRAKIS", the second line in crimson.
  const words = slide.title.split(" ");
  const lastWord = words.pop() ?? "";
  const leadWords = words.join(" ");

  const facts = [slide.genres.slice(0, 2).join(" · "), slide.duration, slide.language].filter(
    (fact): fact is string => Boolean(fact),
  );

  return (
    <section className="relative min-h-[680px] overflow-hidden md:h-[82vh] md:min-h-[720px]">
      {views.map((view, index) => (
        <img
          key={view.key}
          src={view.backdrop}
          alt={index === active ? `${view.title} backdrop` : ""}
          width={1920}
          height={1080}
          aria-hidden={index !== active}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-hero-overlay" />

      <div className="page-shell relative flex h-full min-h-[680px] items-end pb-20 pt-32 md:min-h-[720px] md:items-center md:pb-16">
        <div key={slide.key} className="reveal max-w-2xl">
          <span className="eyebrow rounded-sm bg-primary/15 px-2.5 py-1.5">{slide.eyebrow}</span>
          <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[.95] sm:text-7xl lg:text-8xl">
            {leadWords}
            {leadWords && <br />}
            <span className="text-primary">{lastWord}</span>
          </h1>
          {slide.blurb && (
            <p className="mt-6 max-w-xl text-base leading-7 text-foreground/75 sm:text-lg">
              {slide.blurb}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold">
            {slide.rating !== null && (
              <span className="flex items-center gap-1 text-rating">
                <Star className="size-4 fill-current" /> {slide.rating}
              </span>
            )}
            {facts.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to={slide.href}>
                <Ticket /> Book tickets
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => toast("Trailer added to your watch queue")}
            >
              <Play /> Watch trailer
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to={slide.href}>
                More info <ChevronRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* One dot per slide that actually exists — the three fixed dots this
          replaced implied a carousel the page did not have. */}
      {views.length > 1 && (
        <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 gap-2">
          {views.map((view, index) => (
            <button
              key={view.key}
              type="button"
              aria-label={`Show ${view.title}`}
              aria-current={index === active}
              onClick={() => setActive(index)}
              className={`h-1 rounded transition-all ${
                index === active ? "w-8 bg-primary" : "w-2 bg-foreground/30 hover:bg-foreground/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
