import {
  ArrowLeft,
  KeyRound,
  Loader2,
  LogOut,
  Mail,
  MailCheck,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import logo from "@/assets/movieo-logo.png";
import { GoogleIcon } from "@/components/movieo/GoogleIcon";
import { PasswordInput } from "@/components/movieo/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { usePageMeta } from "@/hooks/use-page-meta";
import { ApiError, api, fieldErrors } from "@/lib/api";
import { displayName, useAuth } from "@/store/auth-context";

type Mode = "password" | "code" | "register" | "forgot";

/** The API answers 202 for unknown addresses too, so messages stay deliberately vague. */
const CODE_SENT = "If that address has an inbox, a six-digit code is on its way.";

export default function LoginPage() {
  usePageMeta({
    title: "Sign In — MOVIEO",
    description: "Sign in to MOVIEO to manage bookings, reminders and your watchlist.",
    ogDescription: "Access your MOVIEO movie account.",
    twitterCard: "summary",
  });

  const {
    status,
    user,
    signInWithPassword,
    sendLoginCode,
    signInWithCode,
    createAccount,
    signOut,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Where to go once signed in.
   *
   * Home by default — signing in is not a request to be taken somewhere in
   * particular. The exception is arriving here because a guard bounced you off
   * a page you asked for; then finishing the sign-in should finish that
   * journey. Only same-site paths are honoured, so a crafted link cannot use
   * this to bounce someone off to another origin.
   */
  const requested = (location.state as { from?: string } | null)?.from;
  const destination =
    requested && requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";

  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  // Clear errors when the user switches tack, so a stale message never sits
  // under a form it no longer describes.
  useEffect(() => {
    setErrors({});
    setFormError(null);
    setResetSent(false);
  }, [mode]);

  const handle = async (action: () => Promise<void>) => {
    setBusy(true);
    setErrors({});
    setFormError(null);
    try {
      await action();
    } catch (error) {
      if (error instanceof ApiError) {
        const fields = fieldErrors(error);
        if (Object.keys(fields).length > 0) setErrors(fields);
        else setFormError(error.message);
      } else {
        setFormError(
          error instanceof Error ? error.message : "Something went wrong. Please try again.",
        );
      }
    } finally {
      setBusy(false);
    }
  };

  const submitPassword = (event: FormEvent) => {
    event.preventDefault();
    void handle(async () => {
      await signInWithPassword(email.trim(), password);
      toast.success("Signed in. Welcome back!");
      navigate(destination, { replace: true });
    });
  };

  const submitRegister = (event: FormEvent) => {
    event.preventDefault();
    void handle(async () => {
      await createAccount(email.trim(), password, fullName.trim() || undefined);
      toast.success("Check your inbox to confirm your address.");
      setMode("password");
      setPassword("");
    });
  };

  const requestCode = (event: FormEvent) => {
    event.preventDefault();
    void handle(async () => {
      await sendLoginCode(email.trim());
      setCodeSent(true);
      toast.success(CODE_SENT);
    });
  };

  const submitCode = (event: FormEvent) => {
    event.preventDefault();
    void handle(async () => {
      await signInWithCode(email.trim(), code);
      toast.success("Signed in. Welcome back!");
      navigate(destination, { replace: true });
    });
  };

  const submitForgot = (event: FormEvent) => {
    event.preventDefault();
    void handle(async () => {
      await api.forgotPassword({ email: email.trim() });
      setResetSent(true);
    });
  };

  // ---------------------------------------------------------------- loading

  if (status === "loading") {
    return (
      <div className="page-shell grid min-h-screen place-items-center pb-24 pt-28">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Checking your session…
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------- signed in

  if (user) {
    return (
      <div className="page-shell grid min-h-screen place-items-center pb-24 pt-28">
        <section className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-card sm:p-9">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary font-display text-xl font-bold text-primary-foreground">
            {displayName(user).slice(0, 1).toUpperCase()}
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold">You're signed in</h1>
          <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>

          {user.emailVerified ? (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="size-3.5" /> Email confirmed
            </p>
          ) : (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500">
              <TriangleAlert className="size-3.5" /> Confirm your email to book
            </p>
          )}

          <div className="mt-8 grid gap-2">
            <Button asChild size="lg">
              <Link to="/bookings">My bookings</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/watchlist">My watchlist</Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              disabled={busy}
              onClick={() => {
                void handle(async () => {
                  await signOut();
                  toast.success("Signed out");
                });
              }}
            >
              <LogOut /> Sign out
            </Button>
          </div>
        </section>
      </div>
    );
  }

  // --------------------------------------------------------- code entry step

  if (mode === "code" && codeSent) {
    return (
      <div className="page-shell grid min-h-screen place-items-center pb-24 pt-28">
        <section className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-card sm:p-9">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => {
              setCodeSent(false);
              setCode("");
            }}
          >
            <ArrowLeft className="size-4" /> Back
          </button>

          <h1 className="mt-6 font-display text-2xl font-bold">Enter your code</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a six-digit code to <span className="text-foreground">{email}</span>. It expires
            in five minutes.
          </p>

          <form className="mt-8 space-y-6" onSubmit={submitCode}>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={code} onChange={setCode} disabled={busy}>
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((slot) => (
                    <InputOTPSlot key={slot} index={slot} className="size-12 text-lg" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {formError && <p className="text-center text-sm text-destructive">{formError}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={busy || code.length < 6}>
              {busy ? <Loader2 className="animate-spin" /> : <KeyRound />} Verify and continue
            </Button>
          </form>

          <button
            type="button"
            className="mt-6 w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
            disabled={busy}
            onClick={() => {
              void handle(async () => {
                await sendLoginCode(email.trim());
                toast.success("Another code is on its way.");
              });
            }}
          >
            Didn't get it? Send another
          </button>
        </section>
      </div>
    );
  }

  // ------------------------------------------------------ reset link sent

  if (mode === "forgot" && resetSent) {
    return (
      <div className="page-shell grid min-h-screen place-items-center pb-24 pt-28">
        <section className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-card sm:p-9">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
            <MailCheck className="size-6" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold">Check your inbox</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            If <span className="text-foreground">{email}</span> has an account, a reset link is on
            its way. It's good for one hour, and one use.
          </p>
          <div className="mt-8 grid gap-2">
            <Button size="lg" onClick={() => setMode("password")}>
              Back to sign in
            </Button>
            <Button
              size="lg"
              variant="ghost"
              disabled={busy}
              onClick={() => {
                setResetSent(false);
              }}
            >
              Use a different address
            </Button>
          </div>
        </section>
      </div>
    );
  }

  // ------------------------------------------------------------------ forms

  const HEADINGS: Record<Mode, string> = {
    register: "Create your account",
    code: "Sign in with a code",
    forgot: "Reset your password",
    // Not "Welcome to MOVIEO" — the wordmark sits directly above this line, so
    // naming the brand again just says it twice.
    password: "Welcome back",
  };
  const BLURBS: Record<Mode, string> = {
    register: "One account for every ticket, reminder and favourite.",
    code: "No password needed — we'll email you a six-digit code.",
    forgot: "Tell us your email and we'll send you a link to set a new password.",
    password: "Sign in to keep every ticket and favourite in one place.",
  };
  const heading = HEADINGS[mode];
  const blurb = BLURBS[mode];

  // Google and the divider are for signing in, not for recovering an account.
  const showGoogle = mode !== "forgot";
  const showPasswordField = mode === "password" || mode === "register";

  return (
    <div className="page-shell grid min-h-screen place-items-center pb-24 pt-28">
      <section className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-card sm:p-9">
        <img src={logo} alt="MOVIEO" width={877} height={219} className="mx-auto h-8 w-auto" />
        <h1 className="mt-6 text-center font-display text-3xl font-bold">{heading}</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">{blurb}</p>

        {showGoogle && (
          <>
            <Button
              variant="outline"
              size="lg"
              className="mt-8 w-full gap-3"
              onClick={() => {
                // A full page navigation: the OAuth handshake happens in the
                // browser, and the API redirects back to /auth/callback.
                window.location.href = api.googleSignInUrl();
              }}
            >
              <GoogleIcon className="size-5" /> Continue with Google
            </Button>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              OR
              <span className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <form
          className={showGoogle ? "space-y-4" : "mt-8 space-y-4"}
          onSubmit={
            mode === "register"
              ? submitRegister
              : mode === "code"
                ? requestCode
                : mode === "forgot"
                  ? submitForgot
                  : submitPassword
          }
        >
          {mode === "register" && (
            <label className="block text-sm font-semibold">
              Name
              <Input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Aditi Rao"
                autoComplete="name"
                className="mt-2 h-11"
              />
            </label>
          )}

          <label className="block text-sm font-semibold">
            Email
            <Input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors["email"])}
              className="mt-2 h-11"
            />
            {errors["email"] && (
              <span className="mt-1.5 block font-normal text-destructive">{errors["email"]}</span>
            )}
          </label>

          {showPasswordField && (
            <label className="block text-sm font-semibold">
              Password
              <PasswordInput
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                aria-invalid={Boolean(errors["password"])}
                className="mt-2 h-11"
              />
              {errors["password"] ? (
                <span className="mt-1.5 block font-normal text-destructive">
                  {errors["password"]}
                </span>
              ) : mode === "register" ? (
                <span className="mt-1.5 block font-normal text-muted-foreground">
                  At least 10 characters. Length beats punctuation.
                </span>
              ) : null}
            </label>
          )}

          {formError && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? (
              <Loader2 className="animate-spin" />
            ) : mode === "code" ? (
              <KeyRound />
            ) : (
              <Mail />
            )}
            {mode === "register"
              ? "Create account"
              : mode === "code"
                ? "Email me a code"
                : mode === "forgot"
                  ? "Send reset link"
                  : "Continue"}
          </Button>
        </form>

        <div className="mt-6 space-y-3 text-center text-sm">
          {mode === "password" && (
            <>
              <button
                type="button"
                className="text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMode("code")}
              >
                Sign in with a code instead
              </button>
              <p className="text-muted-foreground">
                New to MOVIEO?{" "}
                <button
                  type="button"
                  className="font-semibold text-primary"
                  onClick={() => setMode("register")}
                >
                  Create an account
                </button>
              </p>
              <button
                type="button"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMode("forgot")}
              >
                Forgot your password?
              </button>
            </>
          )}

          {mode === "code" && (
            <button
              type="button"
              className="text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMode("password")}
            >
              Use a password instead
            </button>
          )}

          {mode === "forgot" && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMode("password")}
            >
              <ArrowLeft className="size-4" /> Back to sign in
            </button>
          )}

          {mode === "register" && (
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                className="font-semibold text-primary"
                onClick={() => setMode("password")}
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
