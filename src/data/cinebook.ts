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
    reason: "Trending this week",
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
  amenities: string[];
  image: string;
};

export const cinemas: Cinema[] = [
  {
    id: "aurora",
    name: "Aurora Cinemas",
    location: "Phoenix Palladium, Lower Parel",
    distance: "2.4 km",
    screens: 9,
    amenities: ["IMAX", "Dolby Atmos", "Recliner"],
    image: cinemaImage,
  },
  {
    id: "grand",
    name: "The Grand Picturehouse",
    location: "Jio World Drive, BKC",
    distance: "5.8 km",
    screens: 7,
    amenities: ["4DX", "Laser", "Lounge"],
    image: cinemaImage,
  },
  {
    id: "sterling",
    name: "Sterling Luxe",
    location: "Fort, South Mumbai",
    distance: "7.1 km",
    screens: 5,
    amenities: ["Dolby Atmos", "Recliner", "Dining"],
    image: cinemaImage,
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
};

export const offers: Offer[] = [
  {
    kicker: "WEEKEND PREMIERE",
    title: "50% off your second ticket",
    code: "CINE50",
    tone: "offer-red",
    detail: "Book two or more seats on Saturday or Sunday shows.",
  },
  {
    kicker: "HDFC BANK",
    title: "₹250 instant savings",
    code: "HDFC250",
    tone: "offer-blue",
    detail: "On HDFC credit and debit cards, minimum booking of ₹800.",
  },
  {
    kicker: "FIRST BOOKING",
    title: "Your first show is on us",
    code: "FIRSTSHOW",
    tone: "offer-violet",
    detail: "New to CineBook? One free standard ticket, any cinema.",
  },
  {
    kicker: "STUDENT",
    title: "Flat ₹150 tickets",
    code: "CAMPUS150",
    tone: "offer-blue",
    detail: "Valid with a student ID on weekday shows before 6 PM.",
  },
  {
    kicker: "FOOD COMBO",
    title: "Popcorn combo at ₹199",
    code: "SNACK199",
    tone: "offer-red",
    detail: "Add any classic combo to a booking of two or more seats.",
  },
  {
    kicker: "MEMBER EXCLUSIVE",
    title: "Double reward points",
    code: "CINECLUB",
    tone: "offer-violet",
    detail: "CineClub members earn 2x points on every premium format show.",
  },
];

export const cities = ["Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad", "Chennai", "Nashik"];

export type FormatCard = { name: string; copy: string; tone: string };

export const formatCards: FormatCard[] = [
  {
    name: "IMAX",
    copy: "Scale that pulls you beyond the frame.",
    tone: "offer-blue",
  },
  {
    name: "DOLBY ATMOS",
    copy: "Sound that moves through the room.",
    tone: "offer-red",
  },
  { name: "4DX", copy: "Feel every turn, storm and impact.", tone: "offer-violet" },
  { name: "MX4D", copy: "Motion tuned frame by frame.", tone: "offer-blue" },
  { name: "RECLINER", copy: "Full stretch, full attention.", tone: "offer-red" },
  {
    name: "PREMIERE",
    copy: "Dining, lounge and the best seat in the house.",
    tone: "offer-violet",
  },
];

export type FoodItem = {
  id: string;
  name: string;
  detail: string;
  price: number;
};

export const foodItems: FoodItem[] = [
  {
    id: "combo-classic",
    name: "Classic Cinema Combo",
    detail: "Large salted popcorn + 2 drinks",
    price: 299,
  },
  {
    id: "popcorn-caramel",
    name: "Caramel Popcorn",
    detail: "Large tub, freshly glazed",
    price: 249,
  },
  { id: "nachos", name: "Loaded Nachos", detail: "Cheese, jalapeño and salsa", price: 219 },
  { id: "drink-cola", name: "Chilled Cola", detail: "500ml, refill on premium seats", price: 129 },
];

export const foodImageSrc = foodImage;

/** Cast and crew names, flattened for the global search overlay. */
export const people = [...new Set(movies.flatMap((movie) => movie.cast.map((c) => c.name)))].map(
  (name) => ({
    name,
    movie: movies.find((m) => m.cast.some((c) => c.name === name))?.title ?? "",
  }),
);
