import { useMemo } from "react";
import {
  useLocation,
  useNavigate,
  useSearchParams as useRouterSearchParams,
} from "react-router-dom";

/**
 * Drop-in replacement for `next/navigation`, backed by react-router.
 * Keeps the same call sites the app already uses: `router.push`,
 * `router.replace`, `router.back`, `usePathname`, `useSearchParams`.
 */

type Router = {
  push: (href: string) => void;
  replace: (href: string) => void;
  back: () => void;
  forward: () => void;
  /** No-op: there is no server render to revalidate in a SPA. */
  refresh: () => void;
  /** No-op: react-router has no prefetch concept. */
  prefetch: (href: string) => void;
};

export function useRouter(): Router {
  const navigate = useNavigate();

  return useMemo<Router>(
    () => ({
      push: (href) => navigate(href),
      replace: (href) => navigate(href, { replace: true }),
      back: () => navigate(-1),
      forward: () => navigate(1),
      refresh: () => {},
      prefetch: () => {},
    }),
    [navigate]
  );
}

export function usePathname(): string {
  return useLocation().pathname;
}

/** Returns the read-only `URLSearchParams`, matching next/navigation's shape. */
export function useSearchParams(): URLSearchParams {
  const [searchParams] = useRouterSearchParams();
  return searchParams;
}
