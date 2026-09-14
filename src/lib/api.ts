/**
 * Client for the MOVIEO API.
 *
 * Two rules shape this file:
 *
 * 1. **The access token lives in memory, never in localStorage.** It is a bearer
 *    credential; anything a page script can read, an injected script can steal.
 *    Losing it on reload costs one refresh call and nothing else.
 * 2. **The refresh token is never touched here at all.** It is an httpOnly
 *    cookie scoped to `/api/v1/auth`, so the browser attaches it to refresh
 *    calls and to nothing else. `credentials: "include"` is what lets it travel.
 */

const BASE_URL =
  (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:4000/api/v1";

export interface ApiErrorBody {
  error: { code: string; message: string; details?: unknown; requestId: string };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: unknown;
  readonly requestId: string;

  constructor(status: number, body: ApiErrorBody["error"]) {
    super(body.message);
    this.name = "ApiError";
    this.status = status;
    this.code = body.code;
    this.details = body.details;
    this.requestId = body.requestId;
  }
}

/** Thrown when the API cannot be reached at all — offline, or nothing listening. */
export class NetworkError extends Error {
  constructor() {
    super("Could not reach the server. Is the API running?");
    this.name = "NetworkError";
  }
}

let accessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};
export const getAccessToken = (): string | null => accessToken;

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** Set for the refresh call itself, so a failed refresh cannot recurse. */
  skipRetry?: boolean;
  auth?: boolean;
}

async function parse(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function send<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {};
  // Letting the browser set Content-Type for FormData is not optional: it has
  // to append the multipart boundary, and a hand-set header omits it.
  if (options.body !== undefined && !isFormData) headers["Content-Type"] = "application/json";
  if (options.auth !== false && accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const init: RequestInit = {
    method: options.method ?? "GET",
    headers,
    // Carries the refresh cookie. Without it the session cannot survive a reload.
    credentials: "include",
  };
  // Assigned rather than spread: exactOptionalPropertyTypes rejects an explicit
  // `body: undefined`, and a GET must not carry one at all.
  if (options.body !== undefined) {
    init.body = isFormData ? (options.body as FormData) : JSON.stringify(options.body);
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, init);
  } catch {
    throw new NetworkError();
  }

  if (response.ok) return (await parse(response)) as T;

  // A 401 on a normal call usually means the 15-minute access token expired.
  // Rotate once and replay; if the rotation also fails the session is genuinely
  // over and the caller sees the original error.
  if (response.status === 401 && !options.skipRetry && accessToken) {
    const rotated = await refreshSession();
    if (rotated) return send<T>(path, { ...options, skipRetry: true });
  }

  const body = (await parse(response)) as Partial<ApiErrorBody> | null;
  throw new ApiError(
    response.status,
    body?.error ?? {
      code: "UNKNOWN",
      message: `Request failed with status ${String(response.status)}`,
      requestId: "unknown",
    },
  );
}

// ------------------------------------------------------------------ endpoints

export interface HeroGenre {
  slug: string;
  name: string;
}

export interface HeroLanguage {
  code: string;
  name: string;
  nativeName: string | null;
  isOriginal: boolean;
}

/**
 * One slide of the homepage hero.
 *
 * Values arrive raw — `runtimeMinutes: 166`, not `"2h 46m"`; `voteCount:
 * 142000`, not `"142K"` — because how they read is this app's decision, not the
 * server's. `bucket` is the exception: it is derived server-side from whether
 * screenings exist, so the eyebrow cannot claim "Now showing" for a film with
 * nothing to book.
 */
export interface HeroSlide {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  backdropUrl: string | null;
  posterUrl: string | null;
  trailerUrl: string | null;
  certificate: string | null;
  runtimeMinutes: number | null;
  criticRating: number | null;
  voteCount: number;
  releaseDate: string | null;
  bucket: "now_showing" | "coming_soon";
  genres: HeroGenre[];
  languages: HeroLanguage[];
}

export interface Session {
  accessToken: string;
  expiresIn: number;
  tokenType: "Bearer";
}

export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  /** False for accounts created by Google sign-in or a sign-in code. */
  hasPassword: boolean;
}

export interface CurrentUser {
  id: string;
  email: string;
  fullName: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface DeviceSession {
  id: string;
  deviceLabel: string | null;
  ip: string | null;
  createdAt: string;
  lastUsedAt: string;
  current: boolean;
}

const keep = (session: Session): Session => {
  setAccessToken(session.accessToken);
  return session;
};

export const api = {
  register: (body: { email: string; password: string; fullName?: string }) =>
    send<{ status: string }>("/auth/register", { method: "POST", body, auth: false }),

  verifyEmail: (body: { email: string; token: string }) =>
    send<{ status: string }>("/auth/verify-email", { method: "POST", body, auth: false }),

  login: async (body: { email: string; password: string }) =>
    keep(await send<Session>("/auth/login", { method: "POST", body, auth: false })),

  requestLoginCode: (body: { email: string }) =>
    send<{ status: string }>("/auth/code/request", { method: "POST", body, auth: false }),

  verifyLoginCode: async (body: { email: string; code: string }) =>
    keep(await send<Session>("/auth/code/verify", { method: "POST", body, auth: false })),

  forgotPassword: (body: { email: string }) =>
    send<{ status: string }>("/auth/forgot-password", { method: "POST", body, auth: false }),

  resetPassword: (body: { email: string; token: string; password: string }) =>
    send<{ status: string }>("/auth/reset-password", { method: "POST", body, auth: false }),

  me: () => send<CurrentUser>("/auth/me"),

  profile: () => send<Profile>("/users/me"),

  updateProfile: (body: { fullName?: string | null }) =>
    send<Profile>("/users/me", { method: "PATCH", body }),

  /**
   * Multipart, so the body is FormData and the browser must set its own
   * Content-Type — it has to append the multipart boundary, which we cannot
   * know. `send` skips the header whenever the body is already FormData.
   */
  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append("avatar", file);
    return send<Profile>("/users/me/avatar", { method: "POST", body: form });
  },

  removeAvatar: () => send<Profile>("/users/me/avatar", { method: "DELETE" }),

  logoutOthers: () =>
    send<{ status: string; endedSessions: number }>("/auth/logout-others", { method: "POST" }),

  sessions: () => send<{ sessions: DeviceSession[] }>("/auth/sessions"),

  revokeSession: (id: string) =>
    send<{ status: string }>(`/auth/sessions/${id}`, { method: "DELETE" }),

  logout: () => send<{ status: string }>("/auth/logout", { method: "POST", auth: false }),

  logoutEverywhere: () => send<{ status: string }>("/auth/logout-all", { method: "POST" }),

  /** Full page navigation: the OAuth dance has to happen in the browser. */
  /**
   * The homepage hero. Public — `auth: false` keeps the bearer header off a
   * cacheable response, so a CDN cannot key it per user.
   */
  hero: (limit?: number) =>
    send<{ slides: HeroSlide[] }>(
      `/home/hero${limit === undefined ? "" : `?limit=${String(limit)}`}`,
      { auth: false },
    ),

  googleSignInUrl: () => `${BASE_URL}/auth/oauth/google`,
};

let refreshInFlight: Promise<boolean> | null = null;

async function rotate(): Promise<boolean> {
  try {
    const session = await send<Session>("/auth/refresh", {
      method: "POST",
      auth: false,
      skipRetry: true,
    });
    setAccessToken(session.accessToken);
    return true;
  } catch {
    setAccessToken(null);
    return false;
  }
}

/**
 * Spends the refresh cookie for a new access token. Returns false when there is
 * no live session — the normal answer for a first-time visitor, not an error.
 *
 * **Single-flighted, and that is not an optimisation.** A refresh token is
 * single-use: spending it returns a successor and marks the old one used.
 * Two overlapping refreshes therefore send the *same* secret, the server sees
 * a token being used twice, and — correctly — treats it as a stolen token and
 * revokes the whole session. Everything that can fire concurrently has to
 * collapse into one request: React StrictMode's double-mounted effects, two
 * components booting at once, or several API calls all meeting a 401 together.
 */
export function refreshSession(): Promise<boolean> {
  refreshInFlight ??= rotate().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

/** Field-level messages from a 422, keyed by field name. */
export function fieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof ApiError) || !Array.isArray(error.details)) return {};
  const issues = error.details as { path?: string; message?: string }[];
  return Object.fromEntries(
    issues
      .filter((issue) => issue.path && issue.message)
      .map((issue) => [issue.path, issue.message]),
  ) as Record<string, string>;
}
