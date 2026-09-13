# MOVIEO

A movie discovery and cinema ticket-booking front end — browse what's on, pick a
cinema and showtime, choose your seats, and walk away with a scannable QR ticket.

Built with Vite, React 19 and TypeScript. No backend: every screen runs on
generated mock data, so you can clone it and click the whole journey end to end.

```bash
npm install && npm run dev
```

Then open <http://localhost:8080>.

---

## What's in it

**Browse**

- Home page with a featured hero, Now Showing and Recommended rails, trending,
  coming soon, cinemas, formats, offers and food
- Movies listing with search plus eight filters — status, genre, language,
  format, certificate, preferred time, price and sort
- Movie detail pages with synopsis, cast, crew, audience and critic reviews
- Cinema pages listing everything screening there today
- Global search across movies, cinemas and people, with recent searches

**Book**

- A dedicated showtimes page per film: date strip, and filters for cinema,
  format, time, price and sold-out
- Seat map with four tiers, real aisles, and available / selected / occupied /
  locked states
- Checkout with food add-ons, promo codes and a live order summary
- Confirmation with a **real scannable QR code**, a downloadable SVG ticket and
  an `.ics` calendar invite

**Keep**

- Watchlist and booking history, with cancellation
- City picker covering 83 cities, including "detect my location"
- Demo sign-in — no account, no password stored

Everything persists to `localStorage`, so bookings and your watchlist survive a
reload.

## Tech stack

|         |                                                                                 |
| ------- | ------------------------------------------------------------------------------- |
| Build   | [Vite 8](https://vite.dev)                                                      |
| UI      | [React 19](https://react.dev) + TypeScript (strict)                             |
| Routing | [React Router 7](https://reactrouter.com), lazy-loaded per route                |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| Data    | [TanStack Query](https://tanstack.com/query) + React context                    |
| Icons   | [lucide-react](https://lucide.dev)                                              |
| QR      | [qrcode](https://github.com/soldair/node-qrcode), loaded on demand              |

## Getting started

You need Node.js 20+ and npm.

```bash
npm install
npm run dev        # http://localhost:8080
```

| Script              | What it does                  |
| ------------------- | ----------------------------- |
| `npm run dev`       | Start the dev server          |
| `npm run build`     | Production build into `dist/` |
| `npm run preview`   | Serve the production build    |
| `npm run lint`      | ESLint                        |
| `npm run typecheck` | `tsc --noEmit`                |
| `npm run format`    | Prettier                      |

## Routes

| Path                                  | Page                                   |
| ------------------------------------- | -------------------------------------- |
| `/`                                   | Home                                   |
| `/movies`                             | Browse and filter                      |
| `/movies/:movieId`                    | Detail — synopsis, cast, crew, reviews |
| `/movies/:movieId/showtimes`          | Date, cinema and showtime picker       |
| `/cinemas`                            | Cinema listing                         |
| `/cinemas/:cinemaId`                  | One venue's full schedule              |
| `/offers`                             | Offers and promo codes                 |
| `/booking/:movieId/:cinemaId/:showId` | Seat selection and checkout            |
| `/confirmation/:bookingId`            | Ticket with QR                         |
| `/bookings`                           | Booking history                        |
| `/watchlist`                          | Saved films                            |
| `/login`                              | Demo sign-in                           |

## Project structure

```
index.html              Vite entry document
src/
  main.tsx              React root: providers + error boundary
  App.tsx               Route table, routes lazy-loaded into their own chunks
  pages/                One component per route
  components/
    cinebook/           App shell, rails, cards, seat map, filters, reviews
    ui/                 shadcn/ui primitives
  store/                City, watchlist, bookings, session (localStorage)
  data/
    cinebook.ts         Movies, cinemas, offers, formats, food, cities
    booking.ts          Showtime + seat generators, pricing, promo codes
    reviews.ts          Audience and critic reviews
  hooks/                usePageMeta, useSimulatedLoad, useIsMobile
  lib/                  utils, clipboard, ticket (SVG + .ics)
  styles.css            Tailwind entry + design tokens
```

## How the mock data works

There is no backend, and the generated data is **deterministic rather than
random**. Showtimes, seat layouts and occupancy are seeded from the show's
identity (`movie | cinema | date`), so a given screening always produces the same
times, the same taken seats and the same prices — across reloads, navigations and
refreshes. Without that, walking back to a seat map would reshuffle it.

Pricing composes from three parts, and the same calculation drives the price
filter, the "tickets from" label and the seat map, so they cannot disagree:

```
seat price = tier (₹220–₹550) + format surcharge (2D ₹0 … 4DX ₹200) + per-title modifier
```

Bookings, watchlist, city, recent searches and the demo session live in
`localStorage` under `movieo:state`. Clear that key to reset to seed data.

Promo codes accepted at checkout: `CINE50`, `HDFC250`, `FIRSTSHOW`, `CAMPUS150`,
`SNACK199`.

## Known limits

Worth knowing before you read too much into it:

- **Posters and cinema photos are placeholders.** Six images are reused across
  eleven films; all three venues share one auditorium photo, colour-graded per
  venue so the row doesn't read as identical.
- **Reviews exist for three films only.** Review prose can't be generated the way
  showtimes can, so films without them show no review section rather than filler.
- **Trailers, social links and "directions" are inert** — there's nothing behind
  them to link to.
- **Sign-in is a demo.** No account is created, no password is stored or sent.
- Seats marked "temporarily locked" are static; there's no real hold timer.

## Deployment

`npm run build` emits a static bundle in `dist/`. Any static host works — just
make sure it rewrites unknown paths to `index.html`, or client-side routes will
404 on a hard refresh.

## Credits

Built from [the original design brief](docs/BRIEF.md). UI primitives from
shadcn/ui, icons from lucide.
