# Changelog

All notable changes to the Violence Prevention Plan for Illinois: 2025-2029 web application.

---

## Security Summary

This application is deployed as a **static site on Netlify** with no server-side code, which eliminates entire classes of vulnerabilities (SQL injection, SSRF, auth bypass, etc.). The following security measures are in place:

- **Content Security Policy (CSP)**: Restrictive policy with `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`. The only external source is the self-hosted Plausible analytics endpoint; fonts, icons, and styles are self-hosted (no jsDelivr / Google Fonts dependency). Shipped via `astro/public/_headers`.
- **HTTP Security Headers**: Full suite including HSTS (1 year + preload), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy (camera/mic/geo/payment denied), Cross-Origin-Opener-Policy same-origin.
- **No external scripts/styles**: Fonts (`@fontsource`), icons (astro-icon inline SVG), and CSS are self-hosted and bundled — the only third-party request is the deferred Plausible analytics script.
- **Input Sanitization**: XSS prevention in the search-highlight module — query and content are HTML-escaped before any `<mark>` insertion; search queries limited to 50 characters.
- **No Persistent Storage**: Only sessionStorage used for theme preference — no cookies, no user data stored.
- **Domain Redirect**: Legacy `vpp-2025.netlify.app` redirects to `vpp.icjia.illinois.gov` with 301.
- **Cache Strategy**: HTML files always revalidate (`max-age=0, must-revalidate`); hashed `/_astro/*` assets immutable for 1 year.

**Known limitations**: CSP keeps `'unsafe-eval'` (required by Alpine.js's expression evaluator) and `'unsafe-inline'` (for the inline no-flash theme script + Alpine island handlers), mitigated by the restrictive `default-src`/`connect-src` and `object-src 'none'`.

---

## Accessibility Summary

This application targets **WCAG 2.1 AA compliance** and **Illinois IITAA 2.1 Standards**. As of 2026-06-11, **axe-core reports 0 violations across all 16 pages (AA)** and **Lighthouse reports A11y:100 on all 16 pages** (full Lighthouse on the home page: Performance 100, A11y 100, Best Practices 100, SEO 100 desktop; A11y 100 mobile).

### Accessibility Features
- **Color contrast**: 8:1+ ratios in both light and dark themes (exceeds AA 4.5:1 requirement)
- **Skip links**: Full keyboard navigation with visible skip-to-content links
- **Screen reader support**: `#announcer-polite` / `#announcer-assertive` aria-live regions in `BaseLayout.astro` (search announces result counts), proper landmark roles, aria-labels on all interactive elements
- **Touch targets**: 44px minimum enforced on all interactive elements
- **Reduced motion**: Global `prefers-reduced-motion` support disabling all animations, including page transitions
- **Form accessibility**: Labels, aria-describedby, aria-required, live regions for validation feedback
- **Heading hierarchy**: Proper semantic heading order (H1 > H2 > H3) verified across all pages
- **Theme support**: Dark/light themes (session-only, defaults dark) with a no-flash inline `<head>` script preventing FOUC
- **Images**: Descriptive alt text on all content images, decorative elements marked `aria-hidden="true"`
- **Focus indicators**: 3px outline with 2px offset on all focusable elements, visible in both themes

### Audit History
| Date | Tool | Result |
|------|------|--------|
| 2026-07-17 | SiteImprove (production = pre-migration Nuxt site) | All 38 Level A + all 11 Level AA rules 100/100; only sub-100 items are 3 AAA rules + 1 editorial check. Branch-only light-mode AA fixes applied in [2.1.1] |
| 2026-06-11 | axecap + lightcap (Astro) | axe AA: 0 violations / 16 pages; Lighthouse A11y:100 / 16 pages; home full audit 100×4 desktop + A11y:100 mobile |
| 2026-04-13 | axecap + lightcap | axe AA: 0 violations / 13 pages; Lighthouse: A11y:100, BP:100, SEO:100 on all 13 pages |
| 2026-04-11 | axe-core 4.11.2 | 0 violations / 13 pages (desktop AA, mobile AA, best practices — 39 audits total) |
| 2026-04-08 | Google Lighthouse | CLS eliminated on all pages; avg perf 77→93; a11y 100 on all pages |
| 2026-03-24 | axe-core 4.10.2 | 0 violations / 20 pages |
| 2025-12-22 | axe-core | 98.8% compliance (all issues fixed) |
| 2025-10-29 | Google Lighthouse + axe | Full audit, all issues resolved |
| 2025-09-15 | Lighthouse | Skip link audit, footer fixes, dark mode fixes |
| 2025-08-11 | Lighthouse | Accessibility + performance optimization |

---

## [2.1.1] - 2026-07-17 — SiteImprove follow-up: light-mode AA fixes + AAA improvements

Driven by the 2026-07-17 SiteImprove score breakdown of production (still the pre-migration Nuxt site): every Level A (38/38) and Level AA (11/11) rule already scores 100/100 — the four sub-100 items are WCAG AAA (1.4.6 enhanced contrast, 2.5.5 enhanced target size, 1.4.8 line height) or SiteImprove editorial ("overuse of italics"), none required for ADA Title II / IITAA 2.1. Reviewing the Astro branch against those findings surfaced two light-mode AA regressions (invisible to prior axe scans, which audit the dark-default theme); both are fixed here along with the low-risk AAA improvements.

### Fixed
- **Light-mode AA contrast (WCAG 1.4.3)**: plan-page TOC "On this page" label was `text-on-surface/60` = 4.00:1 → now `/75` = 6.34:1 (`ReportNavigation.astro`); image-enlarge hint's dark variant was `dark:text-on-surface/50` = 4.48:1 on surface → now `dark:…/60` ≥ 5.78:1 (`TextCenteredImage.astro`).
- **`.footnotes` light-mode trap**: hardcoded GitHub-dark gray `#8b949e` = 2.95:1 on light backgrounds. Dormant (no content uses footnotes yet) but now theme-split: `#57606a` light (6.12:1) / `#8b949e` dark (6.15:1), matching border colors (`global.css`).
- **Search clear-button icon at the 1.4.11 knife edge**: the ✕ control's `text-on-surface/50` computed to exactly 3.00:1 in light mode — the UI-component minimum with zero margin. Now `/70` (5.36:1 light / 7.31:1 dark); hover unchanged (`search.astro`).

### Changed
- **Line height ≥ 1.5 on all small-text paragraphs (WCAG 1.4.8 AAA)**: `leading-relaxed`/`leading-normal` added to the nine `text-sm`/`text-xs` `<p>` elements that computed to 1.33–1.43 — search state panels + result paths (`search.astro`), news empty state (`news/index.astro`), TOC label (`ReportNavigation.astro`), image caption + hint (`TextCenteredImage.astro`).
- **44×44px pointer targets on the last small controls (WCAG 2.5.5 AAA)**: desktop navbar dropdown buttons and footer bottom-row links get the invisible pseudo-element hit area already used by ThemeToggle — visual size, layout, and the nav underline animation are unchanged. Scanners that measure raw element boxes may not credit these, but the actual pointer target is 44px.
- **Reference citation markers to AAA contrast (WCAG 1.4.6)**: light `#00695c` (6.34:1) → `#00594e` (7.92:1); dark `#4db6ac` (5.99:1 on surface) → `#66c9bf` (7.43:1 on surface, 9.62:1 on plan pages) (`global.css`).

### Not changed (documented decisions)
- **Blockquote italics stay** (`global.css` `font-style: italic`): SiteImprove's "overuse of italics" is an editorial best-practice check, not WCAG — removing italics is a design decision deferred to the team.
- **Muted-text hierarchy stays at `/70`–`/75`** (5.4–6.3:1): passes AA everywhere; pushing all secondary text to 7:1 (AAA) would flatten the visual hierarchy for no compliance gain.

---

## [2.1.0] - 2026-06-11 — Pre-merge Review Fixes (a11y, search, SEO, dead links)

Fixes from the pre-merge assessment of the Astro migration branch: a full code review plus runtime audits (axe-core, Lighthouse, functional browser testing) of every page.

### Fixed
- **Dead footer links on every page**: the legacy `/docs` TypeDoc portal (incl. `/docs/accessibility/`) was not migrated but the footer + README still linked it — links removed until a docs/accessibility page ships (`astro/src/data/nav.js`, `README.md`).
- **Search query blocklist mangled legitimate terms**: "evaluation" became "uation", "important" became "ant" (the blocklist stripped `eval`, `import`, etc.). Removed — the query only ever reaches Fuse and escape-first highlighters, so the blocklist added no safety (`search-highlight.js`).
- **Search**: home-page result rendered an invalid `href="//"`; titles/paths were double-escaped (a future `&`/`'` in a title would display as literal entities) (`search.astro`).
- **Search index polluted with MDX code**: `import … from "….astro"` statements from `.mdx` content leaked into user-visible excerpts; the generator now strips ESM statements (`generate-search-index-defuddle.js`).
- **TOC clicks**: URL hash never updated and the "move focus to heading" call silently failed (headings aren't focusable) — now sets `tabindex="-1"`, focuses the heading, and pushes the hash (`plan/[slug].astro`).
- **Sticky navbar never actually stuck**: the header's `position: sticky` was confined inside the header-height Alpine wrapper div (zero room to travel), so the navbar scrolled off-screen. The wrapper is now `display: contents`, making `<body>` the sticky containing block — the navbar stays pinned while drawer/backdrop keep their root-level z-stacking above the scroll-top FAB (`Header.astro`).
- **Anchor/TOC scroll offset doubled**: `scroll-padding-top: 80px` on `html` and `scroll-margin-top: 80px` on markdown headings are additive per the CSSOM spec, so scroll targets landed 160px down (with no pinned navbar above them, see previous item). Removed the heading `scroll-margin-top`; the single 80px `scroll-padding-top` now lands clicked/linked headings ~15px below the pinned 65px navbar — verified for both TOC clicks and direct `#hash` page loads (`global.css`).
- **Light-mode contrast (WCAG 1.4.3)**: `text-on-surface/55`–`/60` body text computed to 3.4–4.0:1 in light mode (search state panels, news empty state, image-modal hint) and the search input placeholder to ~2.6:1 — bumped to `/70` in light (≥5.3:1) while preserving the passing dark-mode values via `dark:` splits.
- **ThemeToggle pill never rendered its background**: conflicting Tailwind utilities (`bg-transparent` vs `bg-on-surface/5`, `p-0` vs `px-2 py-1`) — conflict removed.
- **Vuetify leftovers**: `rgb(var(--v-theme-primary))` (undefined in this build) on the resources / organizational-highlights placeholder headings → `var(--color-primary)`.
- **hreflang alternates pointed every page at the homepage** — removed (single-language site; alternates were wrong for SEO).

### Added
- **Branded 404 page** (`src/pages/404.astro` → `dist/404.html`, served automatically by Netlify; previously users got Netlify's unbranded default despite `netlify.toml` claiming otherwise).
- **Mobile drawer focus management** (`@alpinejs/focus`, `x-trap.noscroll`): focus trapped while open, body scroll locked, Escape closes and restores focus to the hamburger — the drawer was `aria-modal="true"` with none of that.
- **44px touch targets**: hamburger now 44×44 (`p-2.5`); theme toggle gets a 44px-tall invisible `::after` hit area (visual pill unchanged).
- **Reference tooltips meet WCAG 1.4.13**: pointer can move onto the tooltip to read/select long citations (was `pointer-events: none` + instant hide); 300ms hover grace, Escape dismisses, keyboard show/hide preserved.
- **`/search?q=` deep links** — the WebSite SearchAction JSON-LD advertised `?q=` but the page never read it; now prefills and runs the search.

### Changed
- **Entrance animations are transform-only slide-ups (no opacity fades)** on HomeHero, HomeGoals, HomeAction, and PageTitleSection: automated a11y scanners (axe, SiteImprove) sample mid-fade and flag fading text as false-positive contrast failures — and skip `opacity:0` content entirely. Text is now fully opaque and machine-readable at every animation frame; stagger timing and reduced-motion gating unchanged. Also fixed `.hero-para:nth-child` selectors that never matched (second paragraph skipped its animation).
- **`scroll-behavior: smooth` gated** behind `prefers-reduced-motion: no-preference` (CSS-initiated smooth scrolls ignored the user's motion preference; the global animation guard can't neutralize scroll-behavior).
- **Sitemap excludes** `/news/` (built but unlinked empty placeholder — per direction, News stays dormant and out of any sitemap) and `/plan/` (noindexed meta-refresh redirect; a noindexed URL in a sitemap is contradictory). Now 13 URLs.
- **News collection removed until the section launches**: an empty/missing collection made every build warn; `/news/` still renders its empty state, and re-enable steps (collection + detail route + sitemap) are documented in `content.config.ts`.
- **robots.txt**: dropped stale Nuxt-era rules (`/documentation/`, `/debug-search.html`, `/*sandbox*` — none of these paths exist in the Astro build).

### Verification (2026-06-11, local preview build)
- **axe-core AA: 0 violations across all 16 pages** (every built page except the `/plan/` meta-refresh redirect).
- **Lighthouse A11y: 100 on all 16 pages**; full Lighthouse on home: Performance 100 / A11y 100 / Best Practices 100 / SEO 100 (desktop) and A11y 100 (mobile).
- Light-mode contrast verified by computed blend math (`/70` ≈ 5.3:1 light; preserved dark values ≥4.7:1).
- Functional (real browser input): search results + `<mark>` highlighting + live-region announcements + `?q=` deep link; reference tooltips (hover-persist, focus, Escape); mobile drawer (trap cycles, scroll lock, Escape closes + restores focus); TOC click (hash + heading focus); clean build with zero warnings (17 pages).

---

## [2.0.0] - 2026-05-28 — Migration to Astro / Tailwind / Alpine

Complete rebuild of the site from **Nuxt 4 + Vue 3 + Vuetify 3 + Nuxt Content** to **Astro 6.4 + Tailwind CSS 4 + Alpine.js 3**, pixel-matched to the prior site and verified against the production reference. No Vue/Vuetify ships.

### Changed
- **Framework**: Nuxt/Vue/Vuetify → Astro (static) + Tailwind 4 (utility-first, `@theme` design tokens lifted from the Vuetify palette) + Alpine 3 for the few interactive islands. Package manager yarn → pnpm 10.
- **Content**: Nuxt Content → Astro content collections over the same local markdown/MDX (`astro/src/content/{plan,legal,news}` + top-level pages). Markdown via remark-gfm + rehype-external-links.
- **Chrome**: header (nav, dropdowns, mobile drawer), footer, theme toggle, scroll-to-top rebuilt as native HTML + Tailwind + Alpine.
- **Icons**: Material Design Icons via `astro-icon` (tree-shaken inline SVG) — replaces the `@mdi/font` webfont + jsDelivr CDN dependency.
- **Fonts**: self-hosted via `@fontsource` (Roboto + Raleway, latin subset) — replaces Google Fonts.
- **Images**: optimized with Astro `<Image>` (Sharp) — ~1.6 MB → ~232 KB across the seal, portraits, and lightbox images.
- **Search**: Fuse.js + the defuddle-generated index preserved (same behavior); generators ported to `astro/scripts/`, run at prebuild.

### Added
- Self-hosted Plausible analytics (deferred).
- Per-page SEO via `astro-seo` + JSON-LD (WebPage / GovernmentOrganization / WebSite / Article / BreadcrumbList); sitemap, `robots.txt`, `llms.txt`.
- Tighter CSP shipped in `astro/public/_headers` (drops jsDelivr/Google Fonts, adds `object-src 'none'`).
- Pop-up references/citations, footnote-free; the `/download` page rebuilt with working links + icons.

### Preserved
- Pixel-perfect visual parity, WCAG 2.1 AA / IITAA 2.1 compliance, dark-default session-only theme, the full plan content and routes.

### Verification
- Lighthouse (lightcap): A11y 100 / Best-Practices 100 / SEO 100 across all routes; Performance ~99 on the home page (LCP 3.7s → 2.0s after image + hero fixes).
- Migration record + the ICJIA Astro conversion checklist live under `docs/`.

---

## [1.1.1] - 2026-04-13 — Full Audit Pass & Broken Link Follow-up

### Accessibility
- Run full axecap (axe-core) AA audit across all 13 pages — 0 violations
- Run full lightcap (Lighthouse) audit across all 13 pages — Accessibility 100, Best Practices 100, SEO 100 on every page
- Verify skip-to-content and skip-to-navigation links render on every page (both targets `#main-content` and `#site-navigation` present)

### Fixes
- Strip auto-linked anchor on the `https://isp.illinois.gov/Home/Human Trafficking` reference in `plan/references.md` (Siteimprove broken-link follow-up); zero-width space inserted between protocol colon and `//` to prevent Nuxt Content auto-linkification while preserving visible text

### Notes
- `https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=397` was already stripped to plain text in 1.1.0 (commit ba6fa4f); the 4/13 Siteimprove report predates that fix — no code change required

---

## [1.1.0] - 2026-04-11 — Accessibility Audit, Broken Link Fixes & Image Optimization

### Accessibility
- Run full axe-core accessibility audit across all 13 pages with 3 audit types (desktop AA, mobile AA, best practices) — 39 total audits
- Confirm 0 violations across all audits; only "needs review" items for color-contrast (background images/gradients prevent automated contrast computation) and aria-valid-attr-value (Vuetify menu activator patterns)
- Update accessibility summary to reflect current axe-core 4.11.2 results

### Performance
- Convert site images to WebP where beneficial — total savings ~3.7 MB:
  - vpp-cover_small.png: 2,394 KB → 244 KB (90% reduction)
  - PPT_circles.png: 998 KB → 714 KB (29% reduction)
  - PPT_pyramid.png: 926 KB → 583 KB (37% reduction)
  - illinois-seal.png: 660 KB → 198 KB (70% reduction) — visual display only; PNG retained for apple-touch-icon and structured data
  - icjia-logo.png: 6 KB → 2 KB (62% reduction)
  - vpp-cover.png: 1,210 KB → 146 KB (88% reduction)
- Skipped DirectorAdamsResized.jpg (85 KB) and stratton-lg-cropped.jpg (19 KB) — WebP was larger than originals

### Broken Links (Siteimprove)
- Remove 6 broken external links flagged by Siteimprove across 4 files — link labels preserved, anchor tags removed pending updated URLs from original authors
- Affected links: CDC trauma-informed care (410 Gone), Healthy People 2030 evidence-based resources (404), SAMHSA trauma-informed approach (301→403), ILGA 20 ILCS 3930 statute (404), ISP human trafficking (404), ADA Title II overview (404)

### Configuration
- Regenerate routes.config.json, sitemap.xml, vpp-plan-2025-2029.json, and vpp-plan-2025-2029.yaml with current build timestamps

---

## [2026-04-08] - Performance, Security, AI Readiness & Deployment Fixes

### Performance
- Eliminate Cumulative Layout Shift (CLS) on all 13 pages — was 0.29–1.42, now 0 across the board
- Fix Vuetify `v-main` SSR hydration mismatch — pre-set `--v-layout-top: 64px` CSS variable so content renders at correct position from first paint
- Stabilize footer during hydration — add `flex-shrink: 0` and `contain: layout style` to prevent collapse
- Stabilize `.v-application__wrap` with `min-height: 100vh` to prevent flex redistribution during hydration
- Increase NuxtPage `min-height` from `70vh` to `100vh` — pushes footer below viewport fold so hydration flicker no longer registers as CLS
- Replace `fadeSlideUp` animation (transform-based, caused CLS) with `fadeIn` (opacity-only) in PageTitleSection
- Remove `margin-top: -60px` layout hack from PageTitleSection
- Change MDI icon stylesheet to async preload with `onload` swap + `<noscript>` fallback + font file preload
- Remove unused preconnect/dns-prefetch for `fonts.googleapis.com` and `fonts.gstatic.com` — fonts are built locally
- Silence verbose `console.log()` output in references, footnotes, and WASM monitor plugins

### Security
- Disable source maps in production Vite build — `sourcemap: true` was overriding the top-level Nuxt config, exposing internal code structure
- Remove framework version from generator meta tag — was disclosing "Nuxt 4.0.0", now just "Nuxt"
- Silence all console logging in `search.vue` — 34 `console.log/error/warn` calls were exposing file paths, config, and internal structure in production
- Fix memory leaks in `footnotes.client.js` — add `app:unmounted` cleanup for 2 MutationObservers, global click listener, and init timeout
- Fix memory leaks in `references.client.js` — add `app:unmounted` cleanup for MutationObserver, debounce timer, and init timeout

### Features
- Add JSON-LD structured data on homepage (GovernmentOrganization + WebSite schemas) via `useHead()` in script setup
- Add `article:published_time` and `article:modified_time` meta tags to all content pages
- Add hreflang tags (`en` + `x-default`) for search engine language clarity
- Add preconnect for jsdelivr CDN (MDI icons)
- Add `date` (2025-07-24) and `lastModified` (2026-04-08) frontmatter to all 13 content markdown files

### Fixes
- Fix "Page Not Found" on Netlify — Nuxt app manifest (`/_nuxt/builds/meta/*.json`) 404'd due to CDN cache mismatch; disabled `experimental.appManifest` since static sites don't need it
- Fix homepage hero image stacking below text — replaced `width/height` HTML attributes with CSS `aspect-ratio: 612 / 792` to prevent forcing 612px minimum column width in Vuetify grid
- Fix homepage StructuredData component hydration mismatch — replaced component with direct `useHead()` JSON-LD injection
- Fix Nuxt Content v3 custom frontmatter access — `lastModified` stored in `content.meta`, not top-level
- Replace dynamic `new Date().toISOString()` fallbacks in StructuredData.vue with static dates for consistent SSR output

### Accessibility
- Fix WCAG 2.5.3 (Label in Name) — hero image caption `aria-label` now starts with visible text "Click image to download"

### Performance Results
- Average Lighthouse performance score: **77 → 93**
- Pages scoring 90+: **1 → 12** (of 13)
- CLS passing (< 0.1): **2 → 13** (of 13)
- Accessibility: **100 on all pages** (maintained)
- SEO: **100 on all pages** (maintained)

---

## [2026-03-31] - Keyboard Focus Visibility Fix

### Fixes
- Fix keyboard focus indicators invisible across entire site — Vuetify 2 CSS variables (`--v-primary-base`) replaced with Vuetify 3 equivalents (`rgb(var(--v-theme-primary))`)
- Add missing `.focus-outline-visible` CSS class for scrollable regions

---

## [2026-03-24] - Accessibility, Security & Robustness Audit

### Security
- Fix MutationObserver memory leak in `[...slug].vue` — observer was module-scoped (`let`) instead of component-scoped (`ref`), accumulating observers on each navigation
- Fix MutationObserver in `content-links.client.ts` — plugin observer never cleaned up, added `data-docs-handled` attribute to prevent duplicate listener registration
- Fix search debounce timer not cleaned up on unmount in `search.vue` — stale search timers could fire after navigation
- Add `<NuxtErrorBoundary>` to `app.vue` — component errors now show a friendly fallback instead of crashing the entire application
- Add references.json caching in `useReferences.js` — eliminates N+1 fetch pattern with module-level cache and shared promise for concurrent requests
- Add `Permissions-Policy` header — denies camera, microphone, geolocation, and payment APIs
- Add `Cross-Origin-Opener-Policy: same-origin` header
- Add `form-action 'self'` to CSP — prevents form submission to external origins
- Fix cache strategy — default cache reduced from 1 year to 1 hour; immutable cache only for hashed `/_nuxt/` bundles; images cached for 30 days

### Accessibility
- Fix WCAG heading-order violation on `/news` page — news card titles changed from `<h3>` to `<h2>` to maintain proper heading hierarchy
- Fix page transition `prefers-reduced-motion` — blur/transform animations now explicitly disabled for motion-sensitive users
- Fix footer text contrast in light theme — increased opacity and added explicit `rgba(0,0,0,0.87)` override for WCAG AA 4.5:1 compliance
- Full axe-core 4.10.2 audit across all 20 pages — **0 violations**

### Documentation
- Trim `CLAUDE.md` from 289 lines to ~65 lines — removed discoverable information, kept behavioral rules
- Move `TEST_GUIDE.md` and temp audit entries to `markdown-documentation/`
- Generate `CHANGELOG.md` from git history with security and accessibility summaries

---

## [2026-02-12] - SEO, Testing & Focus Visibility

### Features
- Comprehensive SEO update with Open Graph image and complete meta tags
- Informational meta tags for developer tooling
- Comprehensive test suite with integration and E2E tests (332 tests across 14 files)

### Fixes
- Add visible focus indicators for WCAG 2.4.7 compliance
- Multiple OG image iterations (dark mode colors, centered text, standalone branded card)
- Fix unmount warning

### Maintenance
- Update core dependencies to latest compatible versions
- Create accessibility audit log with WCAG 2.4.7 fix entry

## [2026-01-15] - Documentation Portal

### Fixes
- Simplify docs portal for AAA WCAG 2.1 compliance
- Remove audit-log script
- Restore `generate:serve` command

## [2026-01-12] - Accessibility & Testing

### Fixes
- Accessibility report updates
- Redo tests and a11y / Siteimprove fixes

## [2026-01-05] - Documentation Portal Update

### Features
- Update documentation portal with TypeDoc integration

### Fixes
- TypeDoc Netlify deployment fixes

## [2025-12-22] - Full Accessibility Audit

### Fixes
- Full axe-core accessibility audit — fix all reported issues
- Accessibility audit fixes (December 23)
- Accessibility link in footer corrections (December 26)
- Netlify configuration fix (December 29)

## [2025-10-31] - Netlify Node Version

### Fixes
- Node version configuration for Netlify deployment

## [2025-09-15 to 2025-09-18] - Accessibility & Deployment

### Fixes
- Extensive accessibility fixes in dark mode
- Skip link audit for a11y compliance
- Footer accessibility fixes
- Lighthouse accessibility fixes
- Netlify TOML configuration
- Trailing slash hydration fix

### Maintenance
- Update Nuxt dependencies

## [2025-08-08 to 2025-08-15] - Production Deployment

### Features
- Google Search Console meta tag integration
- NuxtImg for homepage letters

### Fixes
- Redirect `vpp-app.netlify.app` to `vpp.icjia.illinois.gov`
- Update dev URL to live production URL
- Remove contact form, replace with text info
- Update PDF plan with letters
- Accessibility fixes for Lighthouse
- Lighthouse performance optimization
- Hydration error fixes
- Mobile navigation logo fix
- Redundant a11y tooltips cleanup

## [2025-08-01 to 2025-08-07] - Homepage & Bundle Optimization

### Fixes
- Vuetify bundle optimization
- Additional bundle optimizations
- Accessibility edits for homepage
- Homepage alternating sections and layout adjustments
- Privacy and accessibility pages
- Resources and highlights placeholder pages
- Learn more button on home hero
- Favicon fix
- Empty page layouts

## [2025-07-28 to 2025-07-31] - Security & Content

### Features
- State seal as branding icon

### Fixes
- Complete security audit and CSP configuration
- WASM allow in CSP
- Google Fonts CSP fix
- Bottom navigation for plan pages
- TOC styling and focus outline
- Search highlighting and context improvements
- Blockquote styling for accessibility
- Footer styling
- LLMs.txt spec
- Update Nuxt to 4.0.2

## [2025-07-18 to 2025-07-29] - Nuxt 4 Migration & Theme System

### Features
- Complete Nuxt 4 migration with zero breaking changes
- Nuxt 4 directory structure implementation
- Nuxt 4 compatibility mode

### Fixes
- Theme mode moved from localStorage to cookie for SSR/client sync
- Default to dark theme with Vuetify token replacement
- SSR/client hydration issue with theme
- Hydration warnings and timestamps
- Homepage hero and section layout
- Feedback form layout
- Sidebar layout and functionality
- Multiple Netlify build fixes (SQLite, Google Fonts, node-sass, package.json)
- Search index restricted to content directory

## [2025-07-02 to 2025-07-16] - Content & SEO

### Features
- Bundle reporting
- Audit log documentation section

### Fixes
- SEO fixes and robots.txt configuration
- JSDoc for Vue components
- Footer alignment
- Home section ordering
- Hydration warnings
- SSR fixes

## [2025-06-02 to 2025-06-20] - Plan Navigation & References

### Features
- Reference tooltips for citations
- Letters section on homepage
- Multiple download formats including LLMs.txt
- Global site config composable
- Configurable TOC label
- Project documentation
- Navigation arrows for plan pages

### Fixes
- SEO/Google rich results
- Plausible analytics integration
- Theme switch error on server
- Navigation menu organization
- Modal and centered image components
- Footer edits
- Dark mode as default
- Blockquote and callout styling

## [2025-05-25 to 2025-05-31] - Search System

### Features
- Defuddle-enhanced search index for content extraction
- Sitemap generation and validation

### Fixes
- Search input sanitization and XSS prevention
- Search refactoring and case-insensitivity
- TOC configuration and styling
- Catch-all page rendering
- Audit log date corrections

## [2025-05-22 to 2025-05-24] - Content System

### Features
- Debug functionality for content response
- Sample pages for Nuxt Content fetching examples
- JSON config for menus

### Fixes
- Content rendering with error checking
- Dynamic page fetching via Content v3
- Responsive app menu

## [2025-05-17 to 2025-05-21] - Accessibility Foundation

### Features
- Accessibility audit log
- Console logger (auto-disabled in production)
- 404 error handling improvements
- Terms of service scaffold
- VueUse composable guidelines

### Fixes
- Theme switch for accessibility with tooltip
- Accessibility contrast improvements
- Tooltip responsiveness
- Scroll-to-top on refresh and navigation
- Footer positioning for short pages
- Navbar responsiveness

## [2025-05-15 to 2025-05-16] - Initial Release

### Features
- Initial commit with Nuxt Content integration
- Content directory scaffolding
- Node version configuration (.nvmrc)
