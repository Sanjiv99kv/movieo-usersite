import { Loader2, LogOut, Monitor, ShieldCheck, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AccountLayout } from "@/components/movieo/AccountLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageMeta } from "@/hooks/use-page-meta";
import { ApiError, api, type DeviceSession } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth-context";

/** "3 minutes ago", "yesterday", "12 September" — whichever is clearest. */
function relative(iso: string): string {
  const then = new Date(iso).getTime();
  const minutes = Math.round((Date.now() - then) / 60_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${String(minutes)} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${String(hours)} hour${hours === 1 ? "" : "s"} ago`;
  if (hours < 48) return "yesterday";

  return new Date(then).toLocaleDateString(undefined, { day: "numeric", month: "long" });
}

const isPhone = (label: string | null): boolean => /iOS|Android/i.test(label ?? "");

const describe = (caught: unknown): string =>
  caught instanceof ApiError || caught instanceof Error
    ? caught.message
    : "Something went wrong. Please try again.";

function SessionsContent() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [endingOthers, setEndingOthers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const { sessions: list } = await api.sessions();
    setSessions(list);
  };

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { sessions: list } = await api.sessions();
        if (!cancelled) setSessions(list);
      } catch (caught) {
        if (!cancelled) setError(describe(caught));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const endOne = (session: DeviceSession) => {
    void (async () => {
      setBusyId(session.id);
      try {
        await api.revokeSession(session.id);
        if (session.current) {
          // Ending your own session is a sign-out, so leave rather than
          // rendering a list you can no longer fetch.
          await signOut();
          toast.success("Signed out");
          navigate("/login", { replace: true });
          return;
        }
        await load();
        toast.success("That device was signed out");
      } catch (caught) {
        toast.error(describe(caught));
      } finally {
        setBusyId(null);
      }
    })();
  };

  const endOthers = () => {
    void (async () => {
      setEndingOthers(true);
      try {
        const { endedSessions } = await api.logoutOthers();
        await load();
        toast.success(
          `Signed out ${String(endedSessions)} other device${endedSessions === 1 ? "" : "s"}`,
        );
      } catch (caught) {
        toast.error(describe(caught));
      } finally {
        setEndingOthers(false);
      }
    })();
  };

  if (loading) {
    return (
      <div className="grid gap-3">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="mt-2 h-px w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  const others = sessions.filter((session) => !session.current).length;

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold">
            {sessions.length} {sessions.length === 1 ? "active session" : "active sessions"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign out anything you don't recognise. That device has to sign in again.
          </p>
        </div>

        {others > 0 && (
          <Button variant="outline" size="sm" disabled={endingOthers} onClick={endOthers}>
            {endingOthers ? <Loader2 className="animate-spin" /> : <LogOut />}
            Sign out {others === 1 ? "the other device" : `all ${String(others)} others`}
          </Button>
        )}
      </div>

      {/* One bordered container with divided rows — a list of like things
          should read as one object, not as N floating cards. */}
      <ul className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-card">
        {sessions.map((session) => {
          const Icon = isPhone(session.deviceLabel) ? Smartphone : Monitor;
          const busy = busyId === session.id;

          return (
            <li
              key={session.id}
              className={cn(
                "flex flex-wrap items-center gap-4 px-5 py-4 transition-colors sm:px-6",
                session.current && "bg-primary/[0.04]",
              )}
            >
              <span
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-full",
                  session.current ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 font-semibold">
                  {session.deviceLabel ?? "Unknown device"}
                  {session.current && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                      <ShieldCheck className="size-3" /> This device
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Last used {relative(session.lastUsedAt)}
                  {session.ip ? (
                    <span className="text-muted-foreground/70"> · {session.ip}</span>
                  ) : null}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                disabled={busy}
                className={cn(!session.current && "text-muted-foreground hover:text-destructive")}
                onClick={() => {
                  endOne(session);
                }}
              >
                {busy ? <Loader2 className="animate-spin" /> : session.current ? <LogOut /> : <X />}
                Sign out
              </Button>
            </li>
          );
        })}
      </ul>

      {sessions.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">No active sessions.</p>
      )}

      <p className="mt-5 text-xs text-muted-foreground">
        A session ends on its own after 30 days without use, and after 90 days regardless.
      </p>
    </section>
  );
}

export default function SessionsPage() {
  usePageMeta({
    title: "Signed-in devices — MOVIEO",
    description:
      "See where your MOVIEO account is signed in, and sign out devices you don't recognise.",
  });

  return (
    <AccountLayout>
      <SessionsContent />
    </AccountLayout>
  );
}
