import { createContext, useContext } from "react";

import type { CurrentUser } from "@/lib/api";

export type AuthStatus = "loading" | "authenticated" | "anonymous";

export type AuthState = {
  /** "loading" until the refresh cookie has been tried once on boot. */
  status: AuthStatus;
  user: CurrentUser | null;

  signInWithPassword: (email: string, password: string) => Promise<void>;
  sendLoginCode: (email: string) => Promise<void>;
  signInWithCode: (email: string, code: string) => Promise<void>;
  createAccount: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Re-reads /auth/me — after verifying an email, say. */
  reload: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}

/** A display name, falling back to the local part of the address. */
export function displayName(user: CurrentUser | null): string {
  if (!user) return "Guest";
  if (user.fullName?.trim()) return user.fullName.trim();
  const handle = user.email.split("@")[0] ?? "Guest";
  return (
    handle
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || "Guest"
  );
}
