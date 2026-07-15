export const AUTH_STORAGE_KEY = "idsspl_auth_session";
export const AUTH_COOKIE_NAME = "idsspl_auth_session";
export const SESSION_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

export const STATIC_LOGIN_ID = "idsspl@gmail.com";
export const STATIC_PASSWORD = "Idsspl@1234";
export const STATIC_OTP = "123456";

type AuthSession = {
  userId: string;
  expiresAt: number;
};

export function createAuthSession(userId: string) {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const session: AuthSession = { userId, expiresAt };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));

  const maxAgeSeconds = Math.floor(SESSION_DURATION_MS / 1000);
  document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${maxAgeSeconds}; samesite=lax`;

  return session;
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as AuthSession;
    if (!session.expiresAt || Date.now() > session.expiresAt) {
      clearAuthSession();
      return null;
    }
    return session;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}
