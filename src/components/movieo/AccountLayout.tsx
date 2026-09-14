import {
  Camera,
  Loader2,
  MonitorSmartphone,
  ShieldCheck,
  Ticket,
  TriangleAlert,
  User,
} from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import { ApiError, api, type Profile } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AccountContext } from "@/store/account-context";
import { useAuth } from "@/store/auth-context";

const MAX_BYTES = 2 * 1024 * 1024;

const TABS = [
  { to: "/account", label: "Profile", icon: User, end: true },
  { to: "/account/sessions", label: "Devices", icon: MonitorSmartphone, end: false },
  { to: "/bookings", label: "Bookings", icon: Ticket, end: false },
];

/**
 * The shell both account pages sit in.
 *
 * It owns the identity header — avatar, name, email — so neither page repeats
 * it, and the avatar is edited by clicking the thing itself rather than a
 * button parked beside it. The profile is fetched once here and shared through
 * context, so switching tabs does not refetch what has not changed.
 */
export function AccountLayout({ children }: { children: ReactNode }) {
  const { status, reload } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "anonymous") {
      // Remembered, so signing in returns here rather than dumping you on home.
      navigate("/login", { replace: true, state: { from: location.pathname } });
      return;
    }
    if (status !== "authenticated") return;

    let cancelled = false;
    void (async () => {
      try {
        const loaded = await api.profile();
        if (!cancelled) setProfile(loaded);
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : "Could not load your account");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, navigate, location.pathname]);

  const pickFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset first, so picking the same file twice still fires onChange.
    event.target.value = "";
    if (!file) return;

    // Checked here as well as on the server: a 5 MB round trip only to be
    // rejected is a slow way to learn the limit.
    if (file.size > MAX_BYTES) {
      toast.error("That image is larger than 2 MB. Try a smaller one.");
      return;
    }

    void (async () => {
      setUploading(true);
      try {
        setProfile(await api.uploadAvatar(file));
        await reload();
        toast.success("Picture updated");
      } catch (caught) {
        toast.error(
          caught instanceof ApiError || caught instanceof Error
            ? caught.message
            : "Could not upload that picture",
        );
      } finally {
        setUploading(false);
      }
    })();
  };

  if (loading) {
    return (
      <div className="page-shell mx-auto w-full max-w-4xl pb-24 pt-28">
        <div className="flex items-center gap-5">
          <Skeleton className="size-24 rounded-full" />
          <div className="grid gap-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="mt-10 h-10 w-full max-w-sm" />
        <Skeleton className="mt-8 h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-shell mx-auto w-full max-w-4xl pb-24 pt-28">
        <h1 className="font-display text-3xl font-bold">My account</h1>
        <p className="mt-4 text-sm text-destructive">{error ?? "Could not load your account."}</p>
      </div>
    );
  }

  const name = profile.fullName?.trim() ?? "";
  const initial = (name || profile.email).slice(0, 1).toUpperCase();

  return (
    <AccountContext.Provider value={{ profile, setProfile }}>
      <div className="page-shell mx-auto w-full max-w-4xl pb-24 pt-28">
        {/* ---- identity: the page's focal point, not a card ---- */}
        <header className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            aria-label={profile.avatarUrl ? "Change your picture" : "Upload a picture"}
            className="group relative shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt=""
                className="size-24 rounded-full object-cover ring-1 ring-border"
              />
            ) : (
              <span className="grid size-24 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/70 font-display text-4xl font-bold text-primary-foreground">
                {initial}
              </span>
            )}

            <span
              className={cn(
                "absolute inset-0 grid place-items-center rounded-full bg-background/70 opacity-0 transition-opacity",
                "group-hover:opacity-100 group-focus-visible:opacity-100",
                uploading && "opacity-100",
              )}
            >
              {uploading ? (
                <Loader2 className="size-6 animate-spin text-primary" />
              ) : (
                <Camera className="size-6 text-foreground" />
              )}
            </span>
          </button>

          <div className="min-w-0">
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
              {name || "Your account"}
            </h1>
            <p className="mt-1 truncate text-sm text-muted-foreground">{profile.email}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {profile.emailVerified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-2.5 py-1 text-xs font-semibold text-primary">
                  <ShieldCheck className="size-3.5" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/12 px-2.5 py-1 text-xs font-semibold text-amber-500">
                  <TriangleAlert className="size-3.5" /> Email unconfirmed
                </span>
              )}
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                Member since{" "}
                {new Date(profile.createdAt).toLocaleDateString(undefined, {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="sr-only"
            onChange={pickFile}
          />
        </header>

        {/* ---- tabs ---- */}
        <nav className="mt-9 flex gap-1 overflow-x-auto border-b border-border">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  "-mb-px inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )
              }
            >
              <tab.icon className="size-4" />
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8">{children}</div>
      </div>
    </AccountContext.Provider>
  );
}
