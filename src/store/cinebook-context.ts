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

export type User = { name: string; email: string };

export type CinebookState = {
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

  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
};

export const CinebookContext = createContext<CinebookState | null>(null);

export function useCinebook(): CinebookState {
  const value = useContext(CinebookContext);
  if (!value) throw new Error("useCinebook must be used inside <CinebookProvider>");
  return value;
}
