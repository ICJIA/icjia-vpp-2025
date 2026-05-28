/**
 * SEO helpers for the Astro VPP site.
 *
 * Pure data functions — no Astro APIs, safe to import anywhere.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const SITE_ORIGIN = "https://vpp.icjia.illinois.gov";

export const SITE_NAME =
  "Statewide Violence Prevention Plan for Illinois: 2025-2029";

export const SITE_SHORT = "Illinois VPP";

/**
 * Default meta description (152 chars — verified in-band 80–160).
 *
 * NOTE: The source nuxt.config.ts description is 173 chars (out of band).
 * This is the same text truncated at a word boundary to ≤160.
 * The brief's "151 chars" note was a counting error in the brief.
 */
export const DEFAULT_DESCRIPTION =
  "The official web presence for the Statewide Violence Prevention Plan for Illinois: 2025-2029, featuring comprehensive violence prevention strategies and";

export const DEFAULT_KEYWORDS =
  "violence prevention, Illinois, public health, community safety, trauma-informed care, evidence-based practices";

export const DEFAULT_OG_IMAGE =
  SITE_ORIGIN + "/images/og-image-vpp-2025.png";

// ---------------------------------------------------------------------------
// Build-time assertion: DEFAULT_DESCRIPTION must be 80–160 chars
// ---------------------------------------------------------------------------

if (
  DEFAULT_DESCRIPTION.length < 80 ||
  DEFAULT_DESCRIPTION.length > 160
) {
  throw new Error(
    "DEFAULT_DESCRIPTION out of 80-160 band: " + DEFAULT_DESCRIPTION.length
  );
}

// ---------------------------------------------------------------------------
// Title helpers
// ---------------------------------------------------------------------------

/**
 * Build a page title ≤ `max` chars.
 *
 * Rules:
 * - Empty/falsy `pageTitle` → return `SITE_NAME` if it fits, else `SITE_SHORT`.
 * - Otherwise build `"<pageTitle> | Illinois VPP"`. If that fits, return it.
 * - If it's too long, truncate `pageTitle` at a word boundary so the full
 *   string (including ` | Illinois VPP`) stays ≤ `max`.
 */
export function truncateTitle(pageTitle: string, max = 60): string {
  const SUFFIX = " | " + SITE_SHORT; // " | Illinois VPP" = 16 chars

  if (!pageTitle) {
    return SITE_NAME.length <= max ? SITE_NAME : SITE_SHORT;
  }

  const full = pageTitle + SUFFIX;
  if (full.length <= max) return full;

  // Truncate the pageTitle portion so pageTitle + SUFFIX <= max
  const budget = max - SUFFIX.length;
  if (budget <= 0) return SITE_SHORT;

  let truncated = pageTitle.slice(0, budget);
  // Walk back to last word boundary
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > 0) {
    truncated = truncated.slice(0, lastSpace);
  }
  return truncated + SUFFIX;
}

// ---------------------------------------------------------------------------
// Description helper
// ---------------------------------------------------------------------------

/**
 * Return a meta description that is 80–160 chars.
 *
 * - If `d` is provided and already in-band (80–160), return it.
 * - If `d` is provided but > 160, truncate at a word boundary ≤ 160.
 * - Otherwise (no `d`, or `d` < 80), return `DEFAULT_DESCRIPTION`.
 */
export function truncateDescription(d?: string): string {
  if (!d) return DEFAULT_DESCRIPTION;

  if (d.length >= 80 && d.length <= 160) return d;

  if (d.length > 160) {
    let truncated = d.slice(0, 160);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 0) truncated = truncated.slice(0, lastSpace);
    return truncated;
  }

  // d.length < 80
  return DEFAULT_DESCRIPTION;
}

// ---------------------------------------------------------------------------
// JSON-LD builder functions
// ---------------------------------------------------------------------------

/** Shared ICJIA publisher sub-object (reused across builders). */
function icjiaPublisher() {
  return {
    "@type": "GovernmentOrganization",
    name: "Illinois Criminal Justice Information Authority",
    url: "https://icjia.illinois.gov",
    logo: {
      "@type": "ImageObject",
      url: SITE_ORIGIN + "/images/illinois-seal.png",
      width: 1200,
      height: 1198,
    },
  };
}

// ---------------------------------------------------------------------------

export interface WebPageJsonLdOptions {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt?: string;
  updatedAt?: string;
}

/**
 * WebPage JSON-LD (used on every page via BaseLayout).
 */
export function webPageJsonLd({
  title,
  description,
  url,
  image,
  publishedAt,
  updatedAt,
}: WebPageJsonLdOptions): Record<string, unknown> {
  const buildTime = new Date().toISOString();
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    image: image ?? DEFAULT_OG_IMAGE,
    inLanguage: "en-US",
    datePublished: publishedAt ?? buildTime,
    dateModified: updatedAt ?? buildTime,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
    publisher: icjiaPublisher(),
  };
}

// ---------------------------------------------------------------------------

/**
 * GovernmentOrganization JSON-LD (ICJIA — home page).
 */
export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: "Illinois Criminal Justice Information Authority",
    alternateName: "ICJIA",
    url: "https://icjia.illinois.gov",
    logo: {
      "@type": "ImageObject",
      url: SITE_ORIGIN + "/images/illinois-seal.png",
      width: 1200,
      height: 1198,
    },
    description:
      "The Illinois Criminal Justice Information Authority (ICJIA) aims to continue funding and supporting violence prevention efforts across Illinois.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "60 E Van Buren St, Suite 650",
      addressLocality: "Chicago",
      addressRegion: "IL",
      postalCode: "60605",
      addressCountry: {
        "@type": "Country",
        name: "US",
      },
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "cja.irc@illinois.gov",
    },
    sameAs: [
      "https://twitter.com/ICJIA_Illinois",
      "https://www.facebook.com/ICJIA",
      "https://www.linkedin.com/company/illinois-criminal-justice-information-authority",
    ],
  };
}

// ---------------------------------------------------------------------------

/**
 * WebSite JSON-LD with SearchAction (home page).
 *
 * Hardcoded dates match the source index.vue (datePublished 2025-07-24,
 * dateModified 2026-04-08) and the brief §3.
 */
export function webSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "Illinois Violence Prevention Plan",
    url: SITE_ORIGIN,
    datePublished: "2025-07-24",
    dateModified: "2026-04-08",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: SITE_ORIGIN + "/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ---------------------------------------------------------------------------

export interface ArticleJsonLdOptions {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  keywords?: string;
}

/**
 * Article JSON-LD (plan/[slug].astro + [...slug].astro).
 */
export function articleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  keywords,
}: ArticleJsonLdOptions): Record<string, unknown> {
  const fallbackDate = "2025-07-24";
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: {
      "@type": "Organization",
      name: "Illinois Criminal Justice Information Authority",
      url: "https://icjia.illinois.gov",
    },
    publisher: icjiaPublisher(),
    datePublished: datePublished ?? fallbackDate,
    dateModified: dateModified ?? datePublished ?? fallbackDate,
    url,
    image: DEFAULT_OG_IMAGE,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords:
      keywords ??
      "violence prevention, Illinois, public health, community safety",
    articleSection: "Violence Prevention",
    inLanguage: "en-US",
  };
}

// ---------------------------------------------------------------------------

/**
 * BreadcrumbList JSON-LD built from a URL pathname.
 *
 * Each slug segment is title-cased (hyphens → spaces, first letter of each
 * word uppercased). Absolute URLs are built with a trailing slash.
 *
 * Example: "/plan/executive-summary" →
 *   Home → Plan → Executive Summary
 */
export function breadcrumbJsonLd(pathname: string): Record<string, unknown> {
  const segments = pathname.split("/").filter(Boolean);

  const itemListElement: Record<string, unknown>[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_ORIGIN + "/",
    },
  ];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += "/" + segment;
    const name = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    itemListElement.push({
      "@type": "ListItem",
      position: index + 2,
      name,
      item: SITE_ORIGIN + currentPath + "/",
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}
