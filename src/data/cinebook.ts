import desertPoster from "@/assets/dune-echo.jpg";
import crimsonPoster from "@/assets/crimson-run.jpg";
import moonlightPoster from "@/assets/moonlight-tales.jpg";
import heroBackdrop from "@/assets/hero-desert.jpg";
import cinemaImage from "@/assets/cinema-hall.jpg";
import foodImage from "@/assets/cinema-food.jpg";

export type Movie = {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  rating: number;
  genre: string;
  language: string;
  duration: string;
  release: string;
  description: string;
  reason?: string;
};

export const movies: Movie[] = [
  {
    id: "echoes-of-arrakis",
    title: "Echoes of Arrakis",
    poster: desertPoster,
    backdrop: heroBackdrop,
    rating: 8.8,
    genre: "Sci-Fi · Adventure",
    language: "English",
    duration: "2h 46m",
    release: "13 Sep 2026",
    description: "A reluctant heir crosses a forbidden desert to unite its people against an empire that controls the future.",
    reason: "Because you love epic sci-fi",
  },
  {
    id: "crimson-run",
    title: "Crimson Run",
    poster: crimsonPoster,
    backdrop: crimsonPoster,
    rating: 8.1,
    genre: "Action · Thriller",
    language: "English · Hindi",
    duration: "2h 18m",
    release: "20 Sep 2026",
    description: "A courier with one night to expose the conspiracy hidden beneath a sleepless neon city.",
    reason: "Trending in Mumbai",
  },
  {
    id: "moonlight-tales",
    title: "Moonlight Tales",
    poster: moonlightPoster,
    backdrop: moonlightPoster,
    rating: 8.6,
    genre: "Animation · Family",
    language: "English · Hindi",
    duration: "1h 52m",
    release: "27 Sep 2026",
    description: "A curious child and a luminous forest spirit race to return the stars before dawn.",
    reason: "Popular with families",
  },
  {
    id: "after-the-storm",
    title: "After the Storm",
    poster: crimsonPoster,
    backdrop: heroBackdrop,
    rating: 7.9,
    genre: "Drama · Mystery",
    language: "Hindi",
    duration: "2h 05m",
    release: "4 Oct 2026",
    description: "A journalist returns home to find that the truth has been waiting for her.",
    reason: "Based on your bookings",
  },
  {
    id: "the-last-orbit",
    title: "The Last Orbit",
    poster: desertPoster,
    backdrop: heroBackdrop,
    rating: 8.4,
    genre: "Sci-Fi · Drama",
    language: "English",
    duration: "2h 29m",
    release: "18 Dec 2026",
    description: "Earth's final pilot receives a signal from a mission lost twenty years ago.",
    reason: "Most anticipated",
  },
];

export const cinemas = [
  { id: "aurora", name: "Aurora Cinemas", location: "Phoenix Palladium, Lower Parel", distance: "2.4 km", screens: 9, amenities: ["IMAX", "Dolby Atmos", "Recliner"], image: cinemaImage },
  { id: "grand", name: "The Grand Picturehouse", location: "Jio World Drive, BKC", distance: "5.8 km", screens: 7, amenities: ["4DX", "Laser", "Lounge"], image: cinemaImage },
  { id: "sterling", name: "Sterling Luxe", location: "Fort, South Mumbai", distance: "7.1 km", screens: 5, amenities: ["Dolby", "Recliner", "Dining"], image: cinemaImage },
];

export const offers = [
  { kicker: "WEEKEND PREMIERE", title: "50% off your second ticket", code: "CINE50", tone: "offer-red" },
  { kicker: "HDFC BANK", title: "₹250 instant savings", code: "HDFC250", tone: "offer-blue" },
  { kicker: "FIRST BOOKING", title: "Your first show is on us", code: "FIRSTSHOW", tone: "offer-violet" },
];

export const cities = ["Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad", "Chennai", "Nashik"];
export const formatCards = [
  { name: "IMAX", copy: "Scale that pulls you beyond the frame." },
  { name: "DOLBY ATMOS", copy: "Sound that moves through the room." },
  { name: "4DX", copy: "Feel every turn, storm and impact." },
];
export const foodImageSrc = foodImage;