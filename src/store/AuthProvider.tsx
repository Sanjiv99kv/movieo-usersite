import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { api, refreshSession, setAccessToken, type CurrentUser } from "@/lib/api";
import { AuthContext, type AuthStatus } from "@/store/auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<CurrentUser | null>(null);

  const load = useCallback(async () => {
    const me = await api.me();
    setUser(me);
    setStatus("authenticated");
  }, []);

  /**
   * On boot the app has no access token — it was only ever in memory. The
   * refresh cookie is the single source of "am I still signed in?", so spend it
   * once. No session is the normal answer for a new visitor, not an error.
   */
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const restored = await refreshSession();
      if (cancelled) return;
      if (!restored) {
        setStatus("anonymous");
        return;
      }
      try {
        await load();
      } catch {
        if (!cancelled) {
          setAccessToken(null);
          setStatus("anonymous");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [load]);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      await api.login({ email, password });
      await load();
    },
    [load],
  );

  const sendLoginCode = useCallback(async (email: string) => {
    await api.requestLoginCode({ email });
  }, []);

  const signInWithCode = useCallback(
    async (email: string, code: string) => {
      await api.verifyLoginCode({ email, code });
      await load();
    },
    [load],
  );

  const createAccount = useCallback(async (email: string, password: string, fullName?: string) => {
    await api.register(fullName ? { email, password, fullName } : { email, password });
  }, []);

  const signOut = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      // Clear locally even if the call failed — the user asked to be signed out,
      // and a dead cookie is not a reason to keep showing a signed-in shell.
      setAccessToken(null);
      setUser(null);
      setStatus("anonymous");
    }
  }, []);

  const reload = useCallback(async () => {
    try {
      await load();
    } catch {
      setAccessToken(null);
      setUser(null);
      setStatus("anonymous");
    }
  }, [load]);

  const value = useMemo(
    () => ({
      status,
      user,
      signInWithPassword,
      sendLoginCode,
      signInWithCode,
      createAccount,
      signOut,
      reload,
    }),
    [
      status,
      user,
      signInWithPassword,
      sendLoginCode,
      signInWithCode,
      createAccount,
      signOut,
      reload,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
