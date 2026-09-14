import desertPoster from "@/assets/dune-echo.jpg";
import crimsonPoster from "@/assets/crimson-run.jpg";
import moonlightPoster from "@/assets/moonlight-tales.jpg";
import heroBackdrop from "@/assets/hero-desert.jpg";
import cinemaImage from "@/assets/cinema-hall.jpg";
import foodImage from "@/assets/cinema-food.jpg";

export type CastMember = { name: string; role: string };
export type CrewMember = { name: string; job: string };

export type Movie = {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  rating: number;
  votes: string;
  genre: string;
  genres: string[];
  language: string;
  duration: string;
  release: string;
  certificate: string;
  description: string;
  synopsis: string;
  status: "now-showing" | "coming-soon";
  formats: string[];
  cast: CastMember[];
  crew: CrewMember[];
  /**
   * Per-title price adjustment in rupees, added on top of the seat tier and the format
   * surcharge. Real cinemas price a tentpole above a quiet drama; without this every
   * film costs exactly the same and a price filter could not discriminate.
   */
  priceModifier: number;
  reason?: string;
};

export const movies: Movie[] = [
  {
    id: "echoes-of-arrakis",
    title: "Echoes of Arrakis",
    poster: desertPoster,
    backdrop: heroBackdrop,
    rating: 8.8,
    votes: "142K",
    genre: "Sci-Fi · Adventure",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    language: "English",
    duration: "2h 46m",
    release: "13 Sep 2026",
    certificate: "UA13+",
    description:
      "A reluctant heir crosses a forbidden desert to unite its people against an empire that controls the future.",
    synopsis:
      "Ten years after the fall of the northern houses, a reluctant heir walks into the open desert with nothing but a name he never wanted. What he finds there is not an army but a people who have survived every empire that tried to own them. As the machinery of a distant throne turns toward the sand, he must decide whether to become the myth they need or the person he still believes he is.",
    status: "now-showing",
    formats: ["IMAX", "Dolby Atmos", "4DX", "2D"],
    cast: [
      { name: "Ilias Marenko", role: "Kael Oduya" },
      { name: "Noor Farah", role: "Chandi" },
      { name: "Ravi Menon", role: "The Cartographer" },
      { name: "Sela Brandt", role: "Reverend Mother" },
      { name: "Tom Whitaker", role: "Emperor Vance" },
      { name: "Aria Kesh", role: "Sayla" },
    ],
    crew: [
      { name: "Denis Aurel", job: "Director" },
      { name: "Marta Kline", job: "Writer" },
      { name: "Jon Petrov", job: "Writer" },
      { name: "Hana Okafor", job: "Producer" },
      { name: "Lior Ben-Ari", job: "Cinematographer" },
      { name: "Esme Calder", job: "Composer" },
    ],
    priceModifier: 120,
    reason: "Because you love epic sci-fi",
  },
  {
    id: "crimson-run",
    title: "Crimson Run",
    poster: crimsonPoster,
    backdrop: crimsonPoster,
    rating: 8.1,
    votes: "89K",
    genre: "Action · Thriller",
    genres: ["Action", "Thriller"],
    language: "English · Hindi",
    duration: "2h 18m",
    release: "20 Sep 2026",
    certificate: "A",
    description:
      "A courier with one night to expose the conspiracy hidden beneath a sleepless neon city.",
    synopsis:
      "Mira runs packages nobody wants traced through a city that never turns its lights off. When a routine drop turns out to be the only copy of a file three ministries would kill to bury, she has until sunrise to get it into the right hands — and every exit is already watched.",
    status: "now-showing",
    formats: ["Dolby Atmos", "4DX", "2D"],
    cast: [
      { name: "Priya Nandakumar", role: "Mira" },
      { name: "Dev Arora", role: "Sahil" },
      { name: "Lena Cruz", role: "Commissioner Rao" },
      { name: "Marcus Vane", role: "The Broker" },
      { name: "Ishaan Rai", role: "Kabir" },
    ],
    crew: [
      { name: "Anita Sood", job: "Director" },
      { name: "Anita Sood", job: "Writer" },
      { name: "Farhan Qureshi", job: "Producer" },
      { name: "Yuki Tanabe", job: "Cinematographer" },
    ],
    priceModifier: 60,
    reason: "Trending in your city",
  },
  {
    id: "moonlight-tales",
    title: "Moonlight Tales",
    poster: moonlightPoster,
    backdrop: moonlightPoster,
    rating: 8.6,
    votes: "64K",
    genre: "Animation · Family",
    genres: ["Animation", "Family"],
    language: "English · Hindi",
    duration: "1h 52m",
    release: "27 Sep 2026",
    certificate: "U",
    description:
      "A curious child and a luminous forest spirit race to return the stars before dawn.",
    synopsis:
      "Every hundred years the lanterns of the old forest go dark, and every hundred years someone small enough to be overlooked is asked to carry them home. This year it is Juno, who is eight, afraid of the dark, and entirely unprepared to be the bravest person in the story.",
    status: "now-showing",
    formats: ["IMAX", "Dolby Atmos", "2D"],
    cast: [
      { name: "Amara Sol", role: "Juno (voice)" },
      { name: "Kenji Hara", role: "Lumen (voice)" },
      { name: "Bea Thornton", role: "Grandmother (voice)" },
      { name: "Otto Lindqvist", role: "The Keeper (voice)" },
    ],
    crew: [
      { name: "Mei Lin Zhao", job: "Director" },
      { name: "Pablo Serrano", job: "Writer" },
      { name: "Grace Oyelowo", job: "Producer" },
      { name: "Esme Calder", job: "Composer" },
    ],
    priceModifier: 0,
    reason: "Popular with families",
  },
  {
    id: "after-the-storm",
    title: "After the Storm",
    poster: crimsonPoster,
    backdrop: heroBackdrop,
    rating: 7.9,
    votes: "31K",
    genre: "Drama · Mystery",
    genres: ["Drama", "Mystery"],
    language: "Hindi",
    duration: "2h 05m",
    release: "4 Oct 2026",
    certificate: "UA16+",
    description: "A journalist returns home to find that the truth has been waiting for her.",
    synopsis:
      "Twelve years after she left without saying goodbye, Aditi comes back to a coastal town that has rebuilt itself around a lie. The storm took forty houses and one family. Everyone agreed on the story that night. Only one person never did.",
    status: "coming-soon",
    formats: ["Dolby Atmos", "2D"],
    cast: [
      { name: "Aditi Raghavan", role: "Aditi Shenoy" },
      { name: "Vikram Joshi", role: "Inspector Pai" },
      { name: "Meera Das", role: "Sumi" },
      { name: "Rehan Kapoor", role: "Arjun" },
    ],
    crew: [
      { name: "Shyam Kulkarni", job: "Director" },
      { name: "Nandita Bose", job: "Writer" },
      { name: "Farhan Qureshi", job: "Producer" },
    ],
    priceModifier: -40,
    reason: "Based on your bookings",
  },
  {
    id: "the-last-orbit",
    title: "The Last Orbit",
    poster: desertPoster,
    backdrop: heroBackdrop,
    rating: 8.4,
    votes: "27K",
    genre: "Sci-Fi · Drama",
    genres: ["Sci-Fi", "Drama"],
    language: "English",
    duration: "2h 29m",
    release: "18 Dec 2026",
    certificate: "UA13+",
    description: "Earth's final pilot receives a signal from a mission lost twenty years ago.",
    synopsis:
      "The station has been winding down for a decade. Commander Hale is the last one left to turn the lights off. Then the long-range array picks up a carrier tone on a frequency that was retired before she was born — and the voice on it is one she buried.",
    status: "coming-soon",
    formats: ["IMAX", "Dolby Atmos", "2D"],
    cast: [
      { name: "Sela Brandt", role: "Cmdr. Hale" },
      { name: "Ilias Marenko", role: "Yusuf" },
      { name: "Noor Farah", role: "Dr. Anand" },
    ],
    crew: [
      { name: "Denis Aurel", job: "Director" },
      { name: "Marta Kline", job: "Writer" },
      { name: "Hana Okafor", job: "Producer" },
      { name: "Esme Calder", job: "Composer" },
    ],
    priceModifier: 60,
    reason: "Most anticipated",
  },
  {
    id: "paper-lanterns",
    title: "Paper Lanterns",
    poster: moonlightPoster,
    backdrop: moonlightPoster,
    rating: 7.6,
    votes: "18K",
    genre: "Comedy · Romance",
    genres: ["Comedy", "Romance"],
    language: "Hindi · Marathi",
    duration: "1h 58m",
    release: "11 Oct 2026",
    certificate: "U",
    description: "Two rival wedding planners are booked for the same impossible ceremony.",
    synopsis:
      "Neha plans weddings for people who want to be remembered. Aman plans weddings for people who want to be comfortable. Both have been hired, separately and secretly, for the same three-day ceremony — by a bride who could not choose and a groom who forgot to ask.",
    status: "coming-soon",
    formats: ["2D"],
    cast: [
      { name: "Neha Pillai", role: "Neha" },
      { name: "Aman Sethi", role: "Aman" },
      { name: "Bea Thornton", role: "Aunt Fio" },
    ],
    crew: [
      { name: "Rhea Malhotra", job: "Director" },
      { name: "Rhea Malhotra", job: "Writer" },
      { name: "Grace Oyelowo", job: "Producer" },
    ],
    priceModifier: -40,
    reason: "Trending this week",
  },
  {
    id: "neon-harvest",
    title: "Neon Harvest",
    poster: crimsonPoster,
    backdrop: crimsonPoster,
    rating: 8.2,
    votes: "76K",
    genre: "Action · Thriller",
    genres: ["Action", "Thriller", "Sci-Fi"],
    language: "English · Tamil",
    duration: "2h 11m",
    release: "6 Sep 2026",
    certificate: "UA16+",
    description:
      "A farmer discovers the city has been growing something underneath her fields for years.",
    synopsis:
      "The subsidy cheques arrived every month for eleven years and nobody asked what the pipes under the south field were for. When the harvest comes up wrong, Kavya follows the pipes to a facility that does not appear on any map, and finds out what her land has been feeding.",
    status: "now-showing",
    formats: ["Dolby Atmos", "4DX", "2D"],
    cast: [
      { name: "Kavya Selvan", role: "Kavya" },
      { name: "Dev Arora", role: "Ronan" },
      { name: "Lena Cruz", role: "Director Mehta" },
      { name: "Marcus Vane", role: "Auditor" },
    ],
    crew: [
      { name: "Anita Sood", job: "Director" },
      { name: "Nandita Bose", job: "Writer" },
      { name: "Farhan Qureshi", job: "Producer" },
      { name: "Yuki Tanabe", job: "Cinematographer" },
    ],
    priceModifier: 60,
    reason: "Popular in your city",
  },
  {
    id: "the-quiet-tide",
    title: "The Quiet Tide",
    poster: moonlightPoster,
    backdrop: moonlightPoster,
    rating: 8.0,
    votes: "42K",
    genre: "Drama · Romance",
    genres: ["Drama", "Romance"],
    language: "Hindi · Marathi",
    duration: "2h 02m",
    release: "30 Aug 2026",
    certificate: "U",
    description: "Two strangers keep meeting on the same ferry, always going opposite ways.",
    synopsis:
      "He takes the 6:40 out. She takes the 6:40 back. For one crossing every evening they occupy the same deck, and for two years neither of them says anything. Then the ferry service announces it is shutting down at the end of the month.",
    status: "now-showing",
    formats: ["Dolby Atmos", "2D"],
    cast: [
      { name: "Meera Das", role: "Sharvari" },
      { name: "Rehan Kapoor", role: "Nikhil" },
      { name: "Bea Thornton", role: "Ferry Captain" },
    ],
    crew: [
      { name: "Rhea Malhotra", job: "Director" },
      { name: "Rhea Malhotra", job: "Writer" },
      { name: "Grace Oyelowo", job: "Producer" },
      { name: "Esme Calder", job: "Composer" },
    ],
    priceModifier: -40,
    reason: "Because you watched slow dramas",
  },
  {
    id: "iron-lotus",
    title: "Iron Lotus",
    poster: desertPoster,
    backdrop: heroBackdrop,
    rating: 7.7,
    votes: "58K",
    genre: "Action · Adventure",
    genres: ["Action", "Adventure"],
    language: "English · Hindi",
    duration: "2h 24m",
    release: "23 Aug 2026",
    certificate: "A",
    description: "The last student of a closed school is asked to teach the people who shut it.",
    synopsis:
      "Twelve years after the academy burned, its final graduate is running a repair shop and declining every invitation. The people who lit the fire now need what only she was taught, and they are willing to be honest about it — which is the one thing she was not prepared for.",
    status: "now-showing",
    formats: ["IMAX", "Dolby Atmos", "4DX", "2D"],
    cast: [
      { name: "Priya Nandakumar", role: "Ila Rao" },
      { name: "Kenji Hara", role: "Master Ando" },
      { name: "Ishaan Rai", role: "Vikrant" },
      { name: "Aria Kesh", role: "Nadia" },
    ],
    crew: [
      { name: "Mei Lin Zhao", job: "Director" },
      { name: "Pablo Serrano", job: "Writer" },
      { name: "Hana Okafor", job: "Producer" },
      { name: "Lior Ben-Ari", job: "Cinematographer" },
    ],
    priceModifier: 0,
    reason: "Trending this week",
  },
  {
    id: "thunder-road-south",
    title: "Thunder Road South",
    poster: crimsonPoster,
    backdrop: heroBackdrop,
    rating: 7.4,
    votes: "24K",
    genre: "Comedy · Adventure",
    genres: ["Comedy", "Adventure"],
    language: "English",
    duration: "1h 47m",
    release: "16 Aug 2026",
    certificate: "UA13+",
    description: "Three siblings, one inherited truck and a funeral nine hundred miles away.",
    synopsis:
      "Their father left them a truck that does not start, a route marked in pen on a paper map, and instructions to be at a beach in three days. None of them have spoken since the wedding. The truck, it turns out, is the least broken thing in the vehicle.",
    status: "now-showing",
    formats: ["Dolby Atmos", "2D"],
    cast: [
      { name: "Tom Whitaker", role: "Russ" },
      { name: "Amara Sol", role: "Dee" },
      { name: "Otto Lindqvist", role: "Bo" },
    ],
    crew: [
      { name: "Shyam Kulkarni", job: "Director" },
      { name: "Marta Kline", job: "Writer" },
      { name: "Grace Oyelowo", job: "Producer" },
    ],
    priceModifier: -40,
  },
  {
    id: "the-cartographers-daughter",
    title: "The Cartographer's Daughter",
    poster: moonlightPoster,
    backdrop: moonlightPoster,
    rating: 8.5,
    votes: "39K",
    genre: "Animation · Adventure",
    genres: ["Animation", "Adventure", "Family"],
    language: "English · Hindi",
    duration: "1h 44m",
    release: "9 Aug 2026",
    certificate: "U",
    description: "A girl inherits maps of places that do not exist yet, and one that already did.",
    synopsis:
      "Her father drew coastlines before anyone sailed them and mountains before anyone climbed. When he disappears, Wren finds a map of a place with her own name on it, dated forty years before she was born, and sets out to arrive somewhere that has been waiting.",
    status: "now-showing",
    formats: ["IMAX", "Dolby Atmos", "2D"],
    cast: [
      { name: "Amara Sol", role: "Wren (voice)" },
      { name: "Ravi Menon", role: "The Cartographer (voice)" },
      { name: "Noor Farah", role: "Bel (voice)" },
      { name: "Sela Brandt", role: "The Archivist (voice)" },
    ],
    crew: [
      { name: "Mei Lin Zhao", job: "Director" },
      { name: "Jon Petrov", job: "Writer" },
      { name: "Hana Okafor", job: "Producer" },
      { name: "Esme Calder", job: "Composer" },
    ],
    priceModifier: 0,
    reason: "Highest rated this month",
  },
];

export function getMovie(id: string | undefined): Movie | undefined {
  return movies.find((movie) => movie.id === id);
}

export const nowShowing = movies.filter((movie) => movie.status === "now-showing");
export const comingSoon = movies.filter((movie) => movie.status === "coming-soon");

export type Cinema = {
  id: string;
  name: string;
  location: string;
  distance: string;
  screens: number;
  rating: number;
  amenities: string[];
  image: string;
  /** Step-free access, surfaced as a badge the way venue listings normally do. */
  accessible: boolean;
  parking: boolean;
  /**
   * Colour grade applied over the shared auditorium photo. Every venue draws on the
   * same source image, so without a per-venue grade the row reads as three clones.
   */
  tone: string;
};

export const cinemas: Cinema[] = [
  {
    id: "aurora",
    name: "Aurora Cinemas",
    location: "Phoenix Palladium, Lower Parel",
    distance: "2.4 km",
    screens: 9,
    rating: 4.7,
    amenities: ["IMAX", "Dolby Atmos", "Recliner"],
    image: cinemaImage,
    accessible: true,
    parking: true,
    tone: "offer-red",
  },
  {
    id: "grand",
    name: "The Grand Picturehouse",
    location: "Jio World Drive, BKC",
    distance: "5.8 km",
    screens: 7,
    rating: 4.4,
    amenities: ["4DX", "Laser", "Lounge"],
    image: cinemaImage,
    accessible: true,
    parking: true,
    tone: "offer-blue",
  },
  {
    id: "sterling",
    name: "Sterling Luxe",
    location: "Fort, South Mumbai",
    distance: "7.1 km",
    screens: 5,
    rating: 4.6,
    amenities: ["Dolby Atmos", "Recliner", "Dining"],
    image: cinemaImage,
    accessible: false,
    parking: true,
    tone: "offer-violet",
  },
];

export function getCinema(id: string | undefined): Cinema | undefined {
  return cinemas.find((cinema) => cinema.id === id);
}

export type Offer = {
  kicker: string;
  title: string;
  code: string;
  tone: string;
  detail: string;
  /** The headline number on the banner — the thing you read from across the page. */
  value: string;
  icon: "ticket" | "bank" | "gift" | "student" | "food" | "member";
  /** Days from today, so demo offers never drift into looking expired. */
  validDays: number;
};

export const offers: Offer[] = [
  {
    kicker: "Weekend premiere",
    title: "50% off your second ticket",
    code: "CINE50",
    tone: "offer-red",
    detail: "Book two or more seats on Saturday or Sunday shows.",
    value: "50% OFF",
    icon: "ticket",
    validDays: 21,
  },
  {
    kicker: "Bank offer",
    title: "₹250 instant savings",
    code: "HDFC250",
    tone: "offer-blue",
    detail: "On credit and debit cards, minimum booking of ₹800.",
    value: "₹250 OFF",
    icon: "bank",
    validDays: 45,
  },
  {
    kicker: "First booking",
    title: "Your first show is on us",
    code: "FIRSTSHOW",
    tone: "offer-violet",
    detail: "New to MOVIEO? One free standard ticket, any cinema.",
    value: "FREE",
    icon: "gift",
    validDays: 90,
  },
  {
    kicker: "Student",
    title: "Flat ₹150 tickets",
    code: "CAMPUS150",
    tone: "offer-blue",
    detail: "Valid with a student ID on weekday shows before 6 PM.",
    value: "₹150 FLAT",
    icon: "student",
    validDays: 60,
  },
  {
    kicker: "Food combo",
    title: "Popcorn combo at ₹199",
    code: "SNACK199",
    tone: "offer-red",
    detail: "Add any classic combo to a booking of two or more seats.",
    value: "₹100 OFF",
    icon: "food",
    validDays: 30,
  },
  {
    kicker: "Member exclusive",
    title: "Double reward points",
    code: "CINECLUB",
    tone: "offer-violet",
    detail: "MOVIEO Club members earn 2x points on every premium format show.",
    value: "2X POINTS",
    icon: "member",
    validDays: 120,
  },
];

/** Absolute end date for an offer, e.g. "Wed, 30 Sep 2026". */
export function offerValidTill(validDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + validDays);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export type PopularCity = {
  name: string;
  /** Resolved to a lucide icon in CitySelector — the data layer stays icon-free. */
  icon: "arch" | "tower" | "tech" | "fort" | "temple" | "memorial" | "coast" | "hills";
  lat: number;
  lng: number;
};

/** The cities given prominence in the picker, with coordinates so "detect my location"
 *  can resolve to the nearest one without a geocoding service. */
export const popularCities: PopularCity[] = [
  { name: "Mumbai", icon: "arch", lat: 19.076, lng: 72.8777 },
  { name: "Delhi-NCR", icon: "arch", lat: 28.6139, lng: 77.209 },
  { name: "Bengaluru", icon: "tech", lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", icon: "tower", lat: 17.385, lng: 78.4867 },
  { name: "Chandigarh", icon: "tech", lat: 30.7333, lng: 76.7794 },
  { name: "Ahmedabad", icon: "fort", lat: 23.0225, lng: 72.5714 },
  { name: "Pune", icon: "fort", lat: 18.5204, lng: 73.8567 },
  { name: "Chennai", icon: "temple", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", icon: "memorial", lat: 22.5726, lng: 88.3639 },
  { name: "Kochi", icon: "coast", lat: 9.9312, lng: 76.2673 },
];

/** Everything behind "View all cities", alphabetical. */
export const otherCities: string[] = [
  "Agra",
  "Ajmer",
  "Aligarh",
  "Allahabad",
  "Amravati",
  "Amritsar",
  "Aurangabad",
  "Bareilly",
  "Belgaum",
  "Bhavnagar",
  "Bhopal",
  "Bhubaneswar",
  "Bikaner",
  "Chandrapur",
  "Coimbatore",
  "Cuttack",
  "Dehradun",
  "Dhanbad",
  "Durgapur",
  "Erode",
  "Faridabad",
  "Gorakhpur",
  "Guntur",
  "Guwahati",
  "Gwalior",
  "Hubli",
  "Indore",
  "Jabalpur",
  "Jaipur",
  "Jalandhar",
  "Jammu",
  "Jamshedpur",
  "Jodhpur",
  "Kanpur",
  "Kolhapur",
  "Kota",
  "Kozhikode",
  "Lucknow",
  "Ludhiana",
  "Madurai",
  "Mangalore",
  "Meerut",
  "Moradabad",
  "Mysuru",
  "Nagpur",
  "Nanded",
  "Nashik",
  "Nellore",
  "Noida",
  "Patna",
  "Puducherry",
  "Raipur",
  "Rajkot",
  "Ranchi",
  "Rourkela",
  "Salem",
  "Sangli",
  "Shimla",
  "Siliguri",
  "Solapur",
  "Srinagar",
  "Surat",
  "Thiruvananthapuram",
  "Thrissur",
  "Tiruchirappalli",
  "Tirupati",
  "Udaipur",
  "Ujjain",
  "Vadodara",
  "Varanasi",
  "Vijayawada",
  "Visakhapatnam",
  "Warangal",
];

/** Every selectable city, for search and validation. */
export const cities = [...popularCities.map((city) => city.name), ...otherCities];

export type FormatCard = {
  name: string;
  copy: string;
  tone: string;
  /** Key resolved to a lucide icon in FormatCard — the data layer stays icon-free. */
  icon: "imax" | "atmos" | "4dx" | "mx4d" | "recliner" | "premiere";
  /** One concrete spec, so the cards say something beyond the tagline. */
  detail: string;
};

export const formatCards: FormatCard[] = [
  {
    name: "IMAX",
    copy: "Scale that pulls you beyond the frame.",
    tone: "offer-blue",
    icon: "imax",
    detail: "1.43:1 · 26% more picture",
  },
  {
    name: "DOLBY ATMOS",
    copy: "Sound that moves through the room.",
    tone: "offer-red",
    icon: "atmos",
    detail: "64 speakers · overhead audio",
  },
  {
    name: "4DX",
    copy: "Feel every turn, storm and impact.",
    tone: "offer-violet",
    icon: "4dx",
    detail: "21 motion & weather effects",
  },
  {
    name: "MX4D",
    copy: "Motion tuned frame by frame.",
    tone: "offer-blue",
    icon: "mx4d",
    detail: "11 in-seat effects",
  },
  {
    name: "RECLINER",
    copy: "Full stretch, full attention.",
    tone: "offer-red",
    icon: "recliner",
    detail: "160° recline · extra legroom",
  },
  {
    name: "PREMIERE",
    copy: "Dining, lounge and the best seat in the house.",
    tone: "offer-violet",
    icon: "premiere",
    detail: "In-seat dining · private lounge",
  },
];

export type FoodItem = {
  id: string;
  name: string;
  detail: string;
  price: number;
  /** Drives the veg/non-veg mark Indian cinema menus are expected to carry. */
  veg: boolean;
  tag?: string;
};

export const foodItems: FoodItem[] = [
  {
    id: "combo-classic",
    name: "Classic Cinema Combo",
    detail: "Large salted popcorn + 2 drinks",
    price: 299,
    veg: true,
    tag: "Bestseller",
  },
  {
    id: "popcorn-caramel",
    name: "Caramel Popcorn",
    detail: "Large tub, freshly glazed",
    price: 249,
    veg: true,
  },
  {
    id: "nachos",
    name: "Loaded Nachos",
    detail: "Cheese, jalapeño and salsa",
    price: 219,
    veg: true,
  },
  {
    id: "peri-wings",
    name: "Peri Peri Wings",
    detail: "Six pieces, tossed hot",
    price: 329,
    veg: false,
    tag: "New",
  },
  {
    id: "choco-sundae",
    name: "Choco Fudge Sundae",
    detail: "Vanilla, brownie chunks, hot fudge",
    price: 189,
    veg: true,
  },
  {
    id: "drink-cola",
    name: "Chilled Cola",
    detail: "500ml, refill on premium seats",
    price: 129,
    veg: true,
  },
];

export const foodImageSrc = foodImage;

/** Cast and crew names, flattened for the global search overlay. */
export const people = [...new Set(movies.flatMap((movie) => movie.cast.map((c) => c.name)))].map(
  (name) => ({
    name,
    movie: movies.find((m) => m.cast.some((c) => c.name === name))?.title ?? "",
  }),
);
