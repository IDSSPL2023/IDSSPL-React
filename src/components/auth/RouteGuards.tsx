import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuthSession } from "@/lib/auth";

/**
 * Replaces the Next.js `proxy.ts` middleware. Same two rules, enforced in the
 * browser against the static session instead of a request cookie:
 *   - not logged in + private route -> /login
 *   - logged in + /login           -> /dashboard
 */

/** Guards every page under the `(root)` layout. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();

  if (!getAuthSession()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

/** Guards the `(auth)` pages: a signed-in user never sees the login screen. */
export function PublicRoute({ children }: { children: ReactNode }) {
  if (getAuthSession()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
