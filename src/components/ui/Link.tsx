import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

/**
 * Drop-in replacement for `next/link`: keeps the `href` prop (react-router's
 * own Link takes `to`) so existing call sites are unchanged. Plain anchors are
 * used for external links and `#` placeholders, which react-router can't route.
 */

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
  replace?: boolean;
  /** Accepted and ignored — react-router has no prefetch concept. */
  prefetch?: boolean;
  scroll?: boolean;
};

function isRoutable(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

export default function Link({
  href,
  children,
  replace,
  prefetch: _prefetch,
  scroll: _scroll,
  ...rest
}: LinkProps) {
  if (!isRoutable(href)) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={href} replace={replace} {...rest}>
      {children}
    </RouterLink>
  );
}
