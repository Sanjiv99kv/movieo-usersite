import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { CinebookContext, type Booking, type User } from "@/store/cinebook-context";

const STORAGE_KEY = "cinebook:state";

type Persisted = {
  city: string;
  recentCities: string[];
  watchlist: string[];
  bookings: Booking[];
  recentSearches: string[];
  user: User | null;
};

/** One seeded booking of each kind, so a first-time visitor sees a populated dashboard. */
function seedBookings(): Booking[] {
  const today = new Date();
  const upcoming = new Date(today);
  upcoming.setDate(today.getDate() + 3);
  const past = new Date(today);
  past.setDate(today.getDate() - 12);
  const iso = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  return [
    {
      id: "CBX982341",
      movieId: "echoes-of-arrakis",
      cinemaId: "aurora",
      showId: `${iso(upcoming)}T1930`,
      dateId: iso(upcoming),
      time: "7:30",
      meridiem: "PM",
      format: "IMAX",
      seats: ["A10", "A11"],
      total: 1484,
      status: "upcoming",
    },
    {
      id: "CBX771208",
      movieId: "crimson-run",
      cinemaId: "grand",
      showId: `${iso(past)}T2215`,
      dateId: iso(past),
      time: "10:15",
      meridiem: "PM",
      format: "4DX",
      seats: ["G7"],
      total: 551,
      status: "completed",
    },
  ];
}

const DEFAULTS: Persisted = {
  city: "Mumbai",
  recentCities: [],
  watchlist: ["echoes-of-arrakis", "moonlight-tales"],
  bookings: seedBookings(),
  recentSearches: [],
  user: null,
};

function load(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

export function CinebookProvider({ children }: { children: ReactNode }) {
  // Read storage in the initializer, not in an effect. Loading in an effect races the
  // persist effect below — under StrictMode's double-invoked effects the persist pass
  // writes DEFAULTS back over storage before the loaded state commits, wiping real data.
  const [state, setState] = useState<Persisted>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable (private mode, blocked cookies) — the app still works.
    }
  }, [state]);

  const setCity = useCallback((city: string) => {
    setState((prev) => ({
      ...prev,
      city,
      recentCities: [city, ...prev.recentCities.filter((item) => item !== city)].slice(0, 4),
    }));
  }, []);

  const toggleWatchlist = useCallback((movieId: string) => {
    setState((prev) => ({
      ...prev,
      watchlist: prev.watchlist.includes(movieId)
        ? prev.watchlist.filter((id) => id !== movieId)
        : [movieId, ...prev.watchlist],
    }));
  }, []);

  const addBooking = useCallback((booking: Booking) => {
    setState((prev) => ({ ...prev, bookings: [booking, ...prev.bookings] }));
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: "cancelled" } : booking,
      ),
    }));
  }, []);

  const rememberSearch = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      recentSearches: [trimmed, ...prev.recentSearches.filter((item) => item !== trimmed)].slice(
        0,
        5,
      ),
    }));
  }, []);

  const clearRecentSearches = useCallback(() => {
    setState((prev) => ({ ...prev, recentSearches: [] }));
  }, []);

  const signIn = useCallback((user: User) => setState((prev) => ({ ...prev, user })), []);
  const signOut = useCallback(() => setState((prev) => ({ ...prev, user: null })), []);

  const value = useMemo(
    () => ({
      city: state.city,
      setCity,
      recentCities: state.recentCities,
      watchlist: state.watchlist,
      toggleWatchlist,
      isSaved: (movieId: string) => state.watchlist.includes(movieId),
      bookings: state.bookings,
      addBooking,
      cancelBooking,
      recentSearches: state.recentSearches,
      rememberSearch,
      clearRecentSearches,
      user: state.user,
      signIn,
      signOut,
    }),
    [
      state,
      setCity,
      toggleWatchlist,
      addBooking,
      cancelBooking,
      rememberSearch,
      clearRecentSearches,
      signIn,
      signOut,
    ],
  );

  return <CinebookContext.Provider value={value}>{children}</CinebookContext.Provider>;
}
