import { CircleAlert, Loader2, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import logo from "@/assets/movieo-logo.png";
import { PasswordInput } from "@/components/movieo/PasswordInput";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/use-page-meta";
import { ApiError, api, fieldErrors } from "@/lib/api";

/**
 * Where the reset link in the email lands.
 *
 * The token and address arrive in the query string because that is the only
 * channel an email link has. Both are single-use and short-lived, and the token
 * is verified server-side against the stated address — a link alone proves
 * nothing without the address it was issued for.
 */
export default function ResetPasswordPage() {
  usePageMeta({
    title: "Set a new password — MOVIEO",
    description: "Choose a new password for your MOVIEO account.",
  });

  const [params] = useSearchParams();
  const navigate = useNavigate();

  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (password !== confirm) {
      setFormError("Those two passwords don't match.");
      return;
    }

    void (async () => {
      setBusy(true);
      setErrors({});
      setFormError(null);
      try {
        await api.resetPassword({ email, token, password });
        // Resetting also ends every live session, so there is nothing to
        // restore — send them to sign in with the new password.
        toast.success("Password changed. Sign in with your new one.");
        navigate("/login", { replace: true });
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
    })();
  };

  // A link that lost half of itself cannot be repaired here; send them back to
  // request a fresh one rather than failing on submit.
  if (!email || !token) {
    return (
      <div className="page-shell grid min-h-screen place-items-center pb-24 pt-28">
        <section className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-card sm:p-9">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
            <CircleAlert className="size-6" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold">That link looks incomplete</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Open the link straight from the email, or ask for a new one.
          </p>
          <Button asChild size="lg" className="mt-8 w-full">
            <Link to="/login">Back to sign in</Link>
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="page-shell grid min-h-screen place-items-center pb-24 pt-28">
      <section className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-card sm:p-9">
        <img src={logo} alt="MOVIEO" width={877} height={219} className="mx-auto h-8 w-auto" />
        <h1 className="mt-6 text-center font-display text-3xl font-bold">Set a new password</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          For <span className="text-foreground">{email}</span>
        </p>

        <form className="mt-8 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-semibold">
            New password
            <PasswordInput
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={Boolean(errors["password"])}
              className="mt-2 h-11"
            />
            {errors["password"] ? (
              <span className="mt-1.5 block font-normal text-destructive">
                {errors["password"]}
              </span>
            ) : (
              <span className="mt-1.5 block font-normal text-muted-foreground">
                At least 10 characters. Length beats punctuation.
              </span>
            )}
          </label>

          <label className="block text-sm font-semibold">
            Confirm password
            <PasswordInput
              required
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              className="mt-2 h-11"
            />
          </label>

          {formError && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <ShieldCheck />} Change password
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Changing your password signs you out everywhere else.
        </p>
      </section>
    </div>
  );
}
