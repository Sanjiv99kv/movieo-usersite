import { CircleAlert, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import logo from "@/assets/movieo-logo.png";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/use-page-meta";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth-context";

type State = "working" | "done" | "failed";

/**
 * Where the confirmation link in the registration email lands.
 *
 * The token is single-use, so the exchange must happen exactly once — React
 * StrictMode double-invokes effects in development, and a second call would
 * spend a token that is already gone and report the success as a failure.
 */
export default function VerifyEmailPage() {
  usePageMeta({
    title: "Confirm your email — MOVIEO",
    description: "Confirm your email address to finish setting up your MOVIEO account.",
  });

  const [params] = useSearchParams();
  const { reload } = useAuth();

  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";

  const [state, setState] = useState<State>("working");
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    if (!email || !token) {
      setState("failed");
      return;
    }

    void (async () => {
      try {
        await api.verifyEmail({ email, token });
        setState("done");
        // Re-read the profile so a signed-in tab swaps "confirm your email"
        // for "email confirmed" without needing a reload.
        await reload();
      } catch {
        setState("failed");
      }
    })();
  }, [email, token, reload]);

  if (state === "working") {
    return (
      <div className="page-shell grid min-h-screen place-items-center pb-24 pt-28">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Confirming your email…
        </div>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div className="page-shell grid min-h-screen place-items-center pb-24 pt-28">
        <section className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-card sm:p-9">
          <img src={logo} alt="MOVIEO" width={877} height={219} className="mx-auto h-8 w-auto" />
          <div className="mx-auto mt-7 grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold">Email confirmed</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            <span className="text-foreground">{email}</span> is verified. Your account is ready —
            you can book seats now.
          </p>
          <div className="mt-8 grid gap-2">
            <Button asChild size="lg">
              <Link to="/movies">Browse movies</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">Go to my account</Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-shell grid min-h-screen place-items-center pb-24 pt-28">
      <section className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-card sm:p-9">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <CircleAlert className="size-6" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold">That link didn't work</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Confirmation links last 24 hours and can only be used once — so this one may have expired,
          or already been used.
        </p>

        {/* Not a dead end: a sign-in code proves the same thing the link does,
            so verifying this way needs no separate "resend" flow. */}
        <p className="mt-5 rounded-md border border-border bg-background/60 px-4 py-3 text-left text-sm text-muted-foreground">
          <KeyRound className="mr-1.5 inline size-4 text-primary" />
          Sign in with a six-digit code instead. Receiving it proves the address is yours, so it
          confirms your email at the same time.
        </p>

        <div className="mt-8 grid gap-2">
          <Button asChild size="lg">
            <Link to="/login">Sign in with a code</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
