import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/movieo/AppShell";
import { Skeleton } from "@/components/ui/skeleton";
import HomePage from "@/pages/Home";

// The landing page ships in the main bundle; every other route is fetched on demand.
const MoviesPage = lazy(() => import("@/pages/Movies"));
const MovieDetailsPage = lazy(() => import("@/pages/MovieDetails"));
const ShowtimesPage = lazy(() => import("@/pages/Showtimes"));
const CinemasPage = lazy(() => import("@/pages/Cinemas"));
const CinemaDetailsPage = lazy(() => import("@/pages/CinemaDetails"));
const OffersPage = lazy(() => import("@/pages/Offers"));
const BookingPage = lazy(() => import("@/pages/Booking"));
const ConfirmationPage = lazy(() => import("@/pages/Confirmation"));
const BookingsPage = lazy(() => import("@/pages/Bookings"));
const WatchlistPage = lazy(() => import("@/pages/Watchlist"));
const LoginPage = lazy(() => import("@/pages/Login"));
const AuthCallbackPage = lazy(() => import("@/pages/AuthCallback"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPassword"));
const VerifyEmailPage = lazy(() => import("@/pages/VerifyEmail"));
const ProfilePage = lazy(() => import("@/pages/Profile"));
const SessionsPage = lazy(() => import("@/pages/Sessions"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

function RouteFallback() {
  return (
    <div className="page-shell min-h-[70vh] pb-24 pt-32">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="mt-4 h-12 w-2/3 max-w-xl" />
      <Skeleton className="mt-10 h-12 w-full max-w-2xl" />
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="aspect-[2/3] w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function App() {
  return (
    <AppShell>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
          <Route path="/movies/:movieId/showtimes" element={<ShowtimesPage />} />
          <Route path="/cinemas" element={<CinemasPage />} />
          <Route path="/cinemas/:cinemaId" element={<CinemaDetailsPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/booking/:movieId/:cinemaId/:showId" element={<BookingPage />} />
          <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/sessions" element={<SessionsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
