import { Clapperboard, LogOut, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useCinebook } from "@/store/cinebook-context";

/** "aditi.rao@mail.com" → "Aditi Rao", so the avatar and greeting have something real to show. */
function nameFromEmail(email: string): string {
  const handle = email.split("@")[0] ?? "Guest";
  return (
    handle
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || "Guest"
  );
}

export default function LoginPage() {
  usePageMeta({
    title: "Sign In — CineBook",
    description: "Sign in to CineBook to manage bookings, reminders and your watchlist.",
    ogDescription: "Access your CineBook movie account.",
    twitterCard: "summary",
  });

  const { user, signIn, signOut } = useCinebook();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    signIn({ name: nameFromEmail(email), email: email.trim() });
    toast.success("Signed in. Welcome back!");
    navigate("/bookings");
  };

  if (user) {
    return (
      <div className="page-shell grid min-h-screen place-items-center pb-24 pt-28">
        <section className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-card sm:p-9">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary font-display text-xl font-bold text-primary-foreground">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold">You're signed in</h1>
          <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
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
              onClick={() => {
                signOut();
                toast.success("Signed out");
              }}
            >
              <LogOut /> Sign out
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-shell grid min-h-screen place-items-center pb-24 pt-28">
      <section className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-card sm:p-9">
        <div className="mx-auto grid size-12 place-items-center rounded-lg bg-primary">
          <Clapperboard />
        </div>
        <h1 className="mt-6 text-center font-display text-3xl font-bold">Welcome to CineBook</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sign in to keep every ticket and favourite in one place.
        </p>

        <Button
          variant="outline"
          size="lg"
          className="mt-8 w-full"
          onClick={() => {
            signIn({ name: "Aditi Rao", email: "aditi.rao@example.com" });
            toast.success("Signed in with Google");
            navigate("/bookings");
          }}
        >
          G&nbsp; Continue with Google
        </Button>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          OR
          <span className="h-px flex-1 bg-border" />
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <label className="block text-sm font-semibold">
            Email
            <Input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-2 h-11"
            />
          </label>
          <label className="block text-sm font-semibold">
            Password
            <Input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="mt-2 h-11"
            />
          </label>
          <Button type="submit" size="lg" className="w-full">
            <Mail /> Continue
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to CineBook?{" "}
          <button
            type="button"
            className="font-semibold text-primary"
            onClick={() => toast("Sign-up opens with the public launch.")}
          >
            Create an account
          </button>
        </p>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Demo sign-in — nothing is sent anywhere and no password is stored.
        </p>
      </section>
    </div>
  );
}
