import { Check, KeyRound, Loader2, Mail, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { AccountLayout } from "@/components/movieo/AccountLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePageMeta } from "@/hooks/use-page-meta";
import { ApiError, api } from "@/lib/api";
import { useAccount } from "@/store/account-context";
import { useAuth } from "@/store/auth-context";

const longDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });

const describe = (caught: unknown): string =>
  caught instanceof ApiError || caught instanceof Error
    ? caught.message
    : "Something went wrong. Please try again.";

function ProfileContent() {
  const { profile, setProfile } = useAccount();
  const { reload } = useAuth();

  const [fullName, setFullName] = useState(profile.fullName ?? "");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const dirty = fullName.trim() !== (profile.fullName ?? "");

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!dirty) return;

    void (async () => {
      setSaving(true);
      try {
        const trimmed = fullName.trim();
        const next = await api.updateProfile({ fullName: trimmed === "" ? null : trimmed });
        setProfile(next);
        setFullName(next.fullName ?? "");
        // The app shell shows the name too, so refresh the session copy.
        await reload();
        toast.success("Profile updated");
      } catch (caught) {
        toast.error(describe(caught));
      } finally {
        setSaving(false);
      }
    })();
  };

  const removePicture = () => {
    void (async () => {
      setRemoving(true);
      try {
        setProfile(await api.removeAvatar());
        await reload();
        toast.success("Picture removed");
      } catch (caught) {
        toast.error(describe(caught));
      } finally {
        setRemoving(false);
      }
    })();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start">
      {/* ---- the only real card: the one thing you can edit here ---- */}
      <section className="rounded-xl border border-border bg-card p-6 shadow-card sm:p-7">
        <h2 className="font-display text-xl font-bold">Your details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This is the name we use on your tickets.
        </p>

        <form className="mt-6 space-y-5" onSubmit={save}>
          <label className="block text-sm font-semibold">
            Name
            <Input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Add your name"
              maxLength={120}
              autoComplete="name"
              className="mt-2 h-11"
            />
          </label>

          <div className="text-sm font-semibold">
            Email
            <div className="mt-2 flex h-11 items-center gap-2.5 rounded-md border border-border bg-muted/40 px-3">
              <Mail className="size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate font-normal text-muted-foreground">
                {profile.email}
              </span>
            </div>
            <span className="mt-1.5 block text-xs font-normal text-muted-foreground">
              Your email is how you sign in, so it can't be changed here yet.
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" disabled={!dirty || saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Check />} Save changes
            </Button>
            {dirty && !saving && (
              <button
                type="button"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setFullName(profile.fullName ?? "")}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* ---- facts: a list, not a card. Nothing here is actionable. ---- */}
      <section className="lg:pt-2">
        <h2 className="font-display text-xl font-bold">Account</h2>

        <dl className="mt-5 divide-y divide-border border-y border-border">
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="text-sm text-muted-foreground">Member since</dt>
            <dd className="text-sm font-medium">{longDate(profile.createdAt)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="text-sm text-muted-foreground">Last signed in</dt>
            <dd className="text-sm font-medium">
              {profile.lastLoginAt ? longDate(profile.lastLoginAt) : "—"}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="text-sm text-muted-foreground">Sign-in method</dt>
            <dd className="flex items-center gap-1.5 text-sm font-medium">
              <KeyRound className="size-3.5 text-muted-foreground" />
              {profile.hasPassword ? "Password" : "Code or Google"}
            </dd>
          </div>
          {profile.avatarUrl && (
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-muted-foreground">Profile picture</dt>
              <dd>
                <button
                  type="button"
                  disabled={removing}
                  onClick={removePicture}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive disabled:opacity-60"
                >
                  {removing ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                  Remove
                </button>
              </dd>
            </div>
          )}
        </dl>

        {!profile.emailVerified && (
          <p className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-500">
            Confirm your email to book tickets. Check your inbox for the link we sent when you
            signed up.
          </p>
        )}

        <p className="mt-5 text-xs text-muted-foreground">
          Click your picture at the top of this page to change it. JPEG, PNG, WebP or GIF, up to
          2&nbsp;MB.
        </p>
      </section>
    </div>
  );
}

export default function ProfilePage() {
  usePageMeta({
    title: "My Account — MOVIEO",
    description: "Your MOVIEO profile, picture and account details.",
  });

  return (
    <AccountLayout>
      <ProfileContent />
    </AccountLayout>
  );
}
