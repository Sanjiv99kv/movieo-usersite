# CineBook — premium movie discovery and booking experience

## Goal
Build a polished, dark-first movie platform with original CineBook branding, cinematic artwork, responsive discovery, and a complete UI-level booking journey.

## Pages and flows
- **Home `/`**: transparent-to-blurred navigation, cinematic carousel, city selector, discovery filters, Now Showing, recommendations, rankings, upcoming releases, cinemas, premium formats, offers, food, booking steps, account activity, newsletter, and footer.
- **Movies `/movies`**: searchable/filterable movie catalogue with tabs for now showing and upcoming.
- **Movie details `/movies/$movieId`**: backdrop, poster, metadata, cast and crew, watchlist action, date selection, cinemas, and showtimes.
- **Cinemas `/cinemas`**: nearby cinema catalogue with amenities and show links.
- **Offers `/offers`**: offer catalogue with copyable codes.
- **Booking `/booking/$movieId`**: movie/cinema/show summary, interactive seat map, seat states, live seat count and total, and sticky continue action.
- **Confirmation `/confirmation`**: successful booking summary, designed ticket, QR-style visual, download, calendar, and home actions.
- **Account pages**: `/bookings`, `/watchlist`, and `/login`, with tabs, booking cards, empty states, and a minimal login experience.

## Shared experience
- Reusable mock data and components for movies, cinemas, offers, cards, navigation, footer, modals, search, seat map, and loading placeholders.
- Global search overlay with grouped live results and recent searches.
- City picker with search, popular cities, and recent selection.
- Desktop navigation plus compact mobile header and fixed mobile bottom navigation.
- Functional UI interactions: carousel movement, filters, reminders, offer copying, watchlist toggles, date/show selection, seat selection, totals, booking progression, and toast feedback.

## Visual system
- Near-black and charcoal surfaces, crimson actions, restrained violet/blue depth, off-white type, subtle borders, professional radii, and controlled glass effects.
- Bold cinematic display typography paired with a clean body font.
- Original generated movie backdrops, posters, cinema scenes, format visuals, and food imagery stored with the project.
- Restrained section reveals, poster zoom, navbar state, modal transitions, and confirmation motion with reduced-motion support.

## Technical details
- TanStack Start file-based routes and typed links.
- Semantic Tailwind v4 tokens in the global design system; shared Shadcn controls for interactive elements.
- Local mock state only; no payments, real authentication, or persistent booking backend in this phase.
- Route-specific title, description, Open Graph, and Twitter metadata.
- Responsive verification at desktop and mobile sizes, plus interaction testing for search, show selection, seats, and confirmation.
