import { CircleAlert, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useAuth } from "@/store/auth-context";

/**
 * Where the API sends the browser back after Google sign-in.
 *
 * The session arrives as an httpOnly cookie, never in this URL — so there is
 * nothing to read out of the query string beyond a status, and nothing leaks
 * through the Referer header or browser history.
 */
const MESSAGES: Record<string, string> = {
  cancelled: "Google sign-in was cancelled.",
  link_required:
    "That email already has a MOVIEO account. Sign in with your password first, then link Google from your account.",
  invalid_state: "That sign-in link expired. Please try again.",
  missing_parameters: "Google's response was incomplete. Please try again.",
  exchange_failed: "We could not complete sign-in with Google. Please try again.",
};

export default function AuthCallbackPage() {
  usePageMeta({ title: "Signing in — MOVIEO", description: "Completing your sign-in." });

  const [params] = useSearchParams();
  const { reload } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  // StrictMode mounts effects twice in development; the exchange must not run twice.
  const handled = useRef(false);

  const status = params.get("status");
  const reason = params.get("reason");

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    if (status === "ok") {
      void (async () => {
        // The refresh cookie is already set; turn it into a live session.
        await reload();
        toast.success("Signed in with Google");
        navigate("/", { replace: true });
      })();
      return;
    }

    setError(MESSAGES[reason ?? ""] ?? MESSAGES[status ?? ""] ?? "Sign-in did not complete.");
  }, [status, reason, reload, navigate]);

  if (!error) {
    return (
      <div className="page-shell grid min-h-screen place-items-center pb-24 pt-28">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Finishing sign-in…
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell grid min-h-screen place-items-center pb-24 pt-28">
      <section className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-card sm:p-9">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <CircleAlert className="size-6" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold">Sign-in didn't finish</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error}</p>
        <Button asChild size="lg" className="mt-8 w-full">
          <Link to="/login">Back to sign in</Link>
        </Button>
      </section>
    </div>
  );
}
