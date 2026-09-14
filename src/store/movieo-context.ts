import { createContext, useContext } from "react";

export type BookingStatus = "upcoming" | "completed" | "cancelled";

export type Booking = {
  id: string;
  movieId: string;
  cinemaId: string;
  showId: string;
  dateId: string;
  time: string;
  meridiem: string;
  format: string;
  seats: string[];
  total: number;
  status: BookingStatus;
};

export type MovieoState = {
  city: string;
  setCity: (city: string) => void;
  recentCities: string[];

  watchlist: string[];
  toggleWatchlist: (movieId: string) => void;
  isSaved: (movieId: string) => boolean;

  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;

  recentSearches: string[];
  rememberSearch: (term: string) => void;
  clearRecentSearches: () => void;
};

export const MovieoContext = createContext<MovieoState | null>(null);

export function useMovieo(): MovieoState {
  const value = useContext(MovieoContext);
  if (!value) throw new Error("useMovieo must be used inside <MovieoProvider>");
  return value;
}
