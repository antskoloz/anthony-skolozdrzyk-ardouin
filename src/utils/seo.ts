import type { AstroGlobal } from "astro";

const SITE_NAME = "Decline Code Lookup";

/** Prefixes a root-relative path with the configured base path (e.g. "/decline-code-lookup"). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export function buildCanonicalUrl(astro: AstroGlobal, path: string): string {
  return new URL(withBase(path), astro.site).toString();
}

export function pageTitle(title: string): string {
  return `${title} | ${SITE_NAME}`;
}

export { SITE_NAME };
