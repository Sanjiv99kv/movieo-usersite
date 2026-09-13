# Original design brief

The prompt this project was built from, kept verbatim for reference. The shipped
product diverges in places — see the README for what actually exists.

---

Build a modern, premium movie-ticket booking website for a personal project inspired by the best UX patterns from movie-ticket platforms and streaming services, but with a completely original visual identity. Do NOT copy BookMyShow's exact branding, layout, colors, logos, or assets.

The product is a movie discovery and cinema ticket booking platform.

Overall Design Direction

Create a cinematic, premium, modern UI.

Theme:

Dark-first interface

Deep black / charcoal background

Use rich red/crimson as the primary action color

Subtle purple/blue gradients can be used for visual depth

White/off-white typography

Large cinematic movie posters and backdrops

Glassmorphism used subtly for cards and overlays

Rounded corners, but keep the design professional rather than overly playful

Strong visual hierarchy

Lots of breathing room

Smooth hover effects and micro-interactions

Premium OTT + cinema booking aesthetic

The website should feel like a real production-ready movie platform rather than a demo project.

Use high-quality movie artwork/placeholders throughout the UI.

Use responsive design for:

Desktop

Tablet

Mobile

Prioritize desktop initially but make every section responsive.

1. NAVIGATION BAR

Create a sticky top navigation bar.

Left:

Original movie-platform logo

Logo name: "MOVIEO" (you may use this temporarily)

Small cinematic/play icon next to the logo

Center:

Home

Movies

Cinemas

Offers

Right:

City selector

Search icon

Search input / expandable search

Login button

User avatar when logged in

Example:

MOVIEO

Home | Movies | Cinemas | Offers

[📍 Mumbai] [🔍 Search movies] [Login]

Navbar behavior:

Transparent over hero section initially

Becomes dark/blurred when scrolling

Smooth transition

Sticky at top

Mobile navigation should collapse into a hamburger menu

2. HERO SECTION

Create a large cinematic hero section immediately below the navbar.

Use a full-width movie backdrop.

Hero should occupy approximately 70–80vh on desktop.

Add:

Large background movie image

Dark gradient overlay from left and bottom

Subtle blur/fade on the right

Small badge: "NOW SHOWING"

Movie title in very large typography

Short description

Genre tags

Duration

Language

IMDb-style rating

Release date

Example content:

NOW SHOWING

DUNE: PART TWO

"Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators..."

Sci-Fi · Adventure · Drama

⭐ 8.8 2h 46m English

Buttons:

[ Book Tickets ]
[ ▶ Watch Trailer ]

Hero interactions:

Book Tickets button should be the strongest CTA

Trailer button should have a subtle glass/outline style

Add small "More Info" interaction

Add subtle image zoom/parallax effect

Hero background should transition smoothly if a carousel is implemented

Add carousel indicators at the bottom.

Hero should feel cinematic and premium, not like a generic SaaS landing page.

3. LOCATION / CITY SELECTOR

Immediately below or integrated into the hero, provide a city selection component.

Example:

📍 Watching movies in
[Mumbai ▼]

Popular cities:
Mumbai
Delhi
Bangalore
Pune
Hyderabad
Chennai
Nashik

Allow users to change city.

Use a modal/dropdown with:

Search city

Popular cities

Recently selected city

4. QUICK MOVIE DISCOVERY BAR

Create a compact section below the hero.

Options:

Movies
Cinemas
Languages
Genres
Dates

Example:

[Movies] [Cinemas] [Languages] [Genres] [This Weekend]

Use pill-shaped controls.

5. NOW SHOWING SECTION

Create a major section titled:

"Now Showing"

Subtitle:

"Catch the biggest movies playing near you."

Display movie cards horizontally.

Each movie card should contain:

Large poster

Movie title

Genre

Language

Rating

"Book Now" button on hover

Example cards:

Dune: Part Two
8.8 ⭐
Sci-Fi · English

Deadpool & Wolverine
8.0 ⭐
Action · English

Inside Out 2
8.6 ⭐
Animation · English

Stree 2
7.2 ⭐
Comedy · Hindi

Movie card interaction:

Poster slightly scales on hover

Dark gradient appears

Booking button slides/fades in

Rating remains visible

Smooth transition

Clicking the card opens movie details

Include:
[←] [→] carousel controls.

At the end:

[ View All Movies ]

6. RECOMMENDED FOR YOU

Create a personalized recommendation section.

Title:

"Recommended For You"

Subtitle:

"Movies you might love"

Use larger horizontal cards than the Now Showing section.

Show recommendation reason where appropriate:

"Because you watched Action movies"

"Popular in your city"

"Trending this week"

"Based on your bookings"

This section should feel similar to modern streaming platforms.

7. TRENDING MOVIES

Create a visually different section.

Title:

"Trending Now"

Display a horizontal list of movies with ranking numbers:

01
Movie Poster

02
Movie Poster

03
Movie Poster

The number should be large and partially overlap the poster.

Add subtle glow/gradient effects.

8. UPCOMING MOVIES

Create:

"Coming Soon"

Subtitle:

"Get ready for what's next."

Movie cards should show:

Poster

Movie name

Release date

Genre

Language

"Remind Me" button

Example:

AVATAR 3
Releasing Dec 2026

[ 🔔 Remind Me ]

When clicked, show a toast:

"Reminder set successfully."

9. CINEMAS NEAR YOU

Create a cinema discovery section.

Title:

"Popular Cinemas"

Cards should contain:

Cinema name
Location
Distance
Number of screens
Amenities

Example:

PVR INOX
Phoenix Mall
2.4 km

Dolby Atmos · IMAX · Recliner

[ View Shows ]

Use cinema-building imagery or elegant cinema icons.

Allow horizontal scrolling.

10. MOVIE EXPERIENCE / FORMAT SECTION

Create a visually attractive section showing premium formats.

Title:

"Choose Your Experience"

Cards:

IMAX
Dolby Atmos
4DX
MX4D
Recliner
Premium

Each card should have:

Cinematic background

Format logo/text

Short description

Explore button

Example:

IMAX
"Experience movies the way they were meant to be seen."

11. OFFERS SECTION

Create a section:

"Exclusive Offers"

Display promotional cards.

Examples:

50% OFF
Weekend Movie Offer

Use Code:
CINE50

[ View Offer ]

Other cards:

Bank offers

Credit card offers

First booking discount

Student discount

Food combo offers

Use attractive gradients but keep the section premium.

12. FOOD & BEVERAGES

Create a small cinema food section.

Title:

"Complete Your Movie Experience"

Show:

Popcorn

Nachos

Coke

Combos

Example:

Classic Popcorn Combo
₹299

[ Add to Booking ]

This can later connect to the booking flow.

13. HOW IT WORKS

Create a simple 3-step section.

Title:

"Book Your Movie in 3 Easy Steps"

Step 01
Choose a Movie

Step 02
Select Your Seats

Step 03
Enjoy the Show

Use clean icons and subtle animations.

14. PERSONALIZED ACTIVITY

If the user is logged in, show:

"Your Movie Journey"

Cards:

Upcoming Booking
Last Watched
Favorites
Watchlist

Example:

Upcoming Booking

Dune: Part Two
Saturday · 7:30 PM
PVR INOX · Phoenix Mall

[ View Ticket ]

15. NEWSLETTER / APP PROMOTION

Create a premium dark section near the bottom.

Title:

"Never Miss a Movie"

Description:

"Get movie releases, exclusive offers and personalized recommendations straight to your inbox."

Email input:

[ Enter your email ] [ Subscribe ]

Also include:

"Coming soon on mobile"

with iOS / Android style buttons.

16. FOOTER

Create a comprehensive footer.

Columns:

MOVIEO

About Us

Careers

Contact

Movies

Now Showing

Upcoming Movies

Popular Movies

Cinemas

Cinemas Near Me

Popular Cinemas

Premium Experiences

Support

Help Center

Terms

Privacy

Refund Policy

Social:
Instagram
X
YouTube
LinkedIn

Bottom:

© 2026 MOVIEO. All rights reserved.

17. SEARCH EXPERIENCE

Implement a polished global search.

When user clicks search:

Open a large search overlay/modal.

Search:
"Search movies, cinemas, actors..."

Show live suggestions:

MOVIES
Dune: Part Two
Deadpool & Wolverine

CINEMAS
PVR INOX Phoenix

PEOPLE
Ryan Reynolds

Include recent searches.

18. MOVIE DETAILS PAGE

Create a dedicated movie details page.

Hero:

Large movie backdrop

Poster

Title

Rating

Genre

Duration

Language

Release date

Description

Cast:
Horizontal actor cards.

Crew:
Director
Writers
Producers

Buttons:

[ Book Tickets ]
[ ▶ Watch Trailer ]
[ ♡ Add to Watchlist ]

Then:

"Available Shows"

Date selector:

Today
Tomorrow
Sat 20
Sun 21
Mon 22

Cinema list:

PVR INOX
Phoenix Mall

IMAX
Dolby Atmos
Recliner

Show timings:

10:30 AM
1:45 PM
4:30 PM
7:30 PM
10:15 PM

Each showtime should be clickable.

19. BOOKING FLOW

Create a clean multi-step booking experience.

Step indicator:

Movie

Cinema

Seats

Payment

Confirmation

Seat selection screen:

Show:
Movie title
Cinema
Screen
Date
Time

Create an actual cinema seat layout.

Sections:

PREMIUM
RECLINER
GOLD
SILVER

Seat states:

Available
Selected
Occupied
Temporarily Locked

Use different visual states.

When selecting seats:

Show selection animation

Update selected seats

Update ticket count

Update total price

Bottom sticky booking summary:

2 Seats
A10, A11

₹640

[ Continue ]

20. BOOKING CONFIRMATION PAGE

Create a beautiful confirmation screen.

Large success animation/icon.

"Booking Confirmed 🎉"

Movie:
Dune: Part Two

Cinema:
PVR INOX · Phoenix Mall

Date:
Saturday, 20 September

Time:
7:30 PM

Seats:
A10, A11

Booking ID:
CBX982341

QR CODE

[ Download Ticket ]

[ Add to Calendar ]

[ Back to Home ]

21. LOGIN / SIGNUP

Create modern authentication modal/page.

Options:

Continue with Google

OR

Email
Password

[ Continue ]

Also:

"New to MOVIEO? Create an account"

Keep the design minimal.

22. MY BOOKINGS PAGE

Create dashboard:

"My Bookings"

Tabs:

Upcoming
Completed
Cancelled

Each booking card:

Movie poster
Movie title
Cinema
Date/time
Seats
Booking status

Buttons:

[ View Ticket ]
[ Cancel Booking ]

23. WATCHLIST

Create:

"My Watchlist"

Grid of movies.

Each card:

Poster
Title
Rating
Release date

[ Remove ]

24. ANIMATIONS

Use polished animations throughout.

Preferred animation behavior:

Fade-up sections when entering viewport

Smooth card hover

Poster zoom

Button hover

Navbar transition

Modal slide/fade

Page transitions

Skeleton loaders

Toast notifications

Seat selection animation

Booking confirmation animation

Animations should be subtle and premium.

Do NOT over-animate the website.

25. LOADING STATES

Implement skeleton loaders for:

Movie cards
Cinema cards
Movie details
Showtimes
Seat layout

Use realistic skeleton animations.

26. EMPTY STATES

Create polished empty states.

Examples:

No bookings:

"Your movie journey starts here 🍿"

"No upcoming bookings yet."

[ Explore Movies ]

Empty watchlist:

"Your watchlist is empty."

"Save movies you don't want to miss."

[ Discover Movies ]

27. RESPONSIVE MOBILE DESIGN

On mobile:

Navbar:
Logo + search + hamburger

Hero:
Reduced height
Movie poster/title optimized for mobile

Movie sections:
Horizontal swipe carousels

Bottom navigation:

Home
Movies
Bookings
Watchlist
Profile

Booking seat layout:
Allow horizontal scrolling/zooming if necessary.

Sticky bottom CTA:

"2 Seats · ₹640"
[ Continue ]

28. DESIGN SYSTEM

Use a consistent design system.

Typography:
Use a modern font such as Inter, Manrope, or Geist.

Headings:
Large, bold, cinematic.

Body:
Clean and readable.

Buttons:
Rounded, medium radius.

Cards:
Dark surfaces with subtle borders.

Spacing:
Use generous spacing between sections.

Colors:
Background: near-black
Surface: dark charcoal
Primary: cinematic red
Secondary accent: subtle purple/blue
Text: white
Muted text: gray

Do not use excessive gradients.

29. DATA / COMPONENT ARCHITECTURE

Build reusable components.

Components should include:

Navbar
HeroCarousel
CitySelector
SearchOverlay
MovieCard
MovieCarousel
TrendingMovies
RecommendedMovies
UpcomingMovies
CinemaCard
OfferCard
FormatCard
BookingCard
SeatMap
ShowtimeCard
MovieDetails
Footer
Toast
Modal
SkeletonLoader

Use reusable data structures rather than hardcoding duplicate components.

Create realistic mock data for movies, cinemas, shows, seats and bookings.

30. IMPORTANT UX REQUIREMENTS

The website should feel like a real movie-booking product.

Prioritize:

Movie discovery

Fast booking

Clear showtime selection

Easy seat selection

Strong visual movie presentation

Mobile responsiveness

Accessibility

Loading and empty states

Clear CTAs

Consistent visual hierarchy

Avoid:

Generic SaaS dashboard styling

Excessive glassmorphism

Excessive gradients

Tiny text

Overcrowded cards

Too many colors

Stock-looking generic UI

The final result should look like a polished startup product that could realistically launch publicly.

Make the homepage visually impressive enough to be used as a portfolio project and GitHub showcase.

Use realistic placeholder movie images and cinema imagery where necessary.

Make all major buttons and navigation elements functional at the UI level and route users between the relevant pages.
