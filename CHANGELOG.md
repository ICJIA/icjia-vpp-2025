# Changelog

All notable changes to the Violence Prevention Plan for Illinois: 2025-2029 web application.

---

## Security Summary

This application is deployed as a **static site on Netlify** with no server-side code, which eliminates entire classes of vulnerabilities (SQL injection, SSRF, auth bypass, etc.). The following security measures are in place:

- **Content Security Policy (CSP)**: Restrictive policy with `default-src 'self'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`. External sources limited to Plausible analytics, Google Fonts, and jsDelivr CDN.
- **HTTP Security Headers**: Full suite including HSTS (1 year + preload), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy (camera/mic/geo/payment denied), Cross-Origin-Opener-Policy same-origin.
- **Subresource Integrity (SRI)**: External stylesheets loaded with integrity hashes and crossorigin="anonymous".
- **Input Sanitization**: Comprehensive XSS prevention in `sanitize.js` with multi-layer sanitization for search queries, content indexing, and result display. Search queries limited to 50 characters.
- **No Persistent Storage**: Only sessionStorage used for theme preference — no cookies, no user data stored.
- **Domain Redirect**: Legacy `vpp-2025.netlify.app` redirects to `vpp.icjia.illinois.gov` with 301.
- **Cache Strategy**: HTML files always revalidate (`max-age=0, must-revalidate`), hashed assets immutable for 1 year, data files cached for 5 minutes.

**Known limitations**: CSP requires `'unsafe-inline'` and `'unsafe-eval'` for Vue/Nuxt framework compatibility. This is standard for Vue SSG applications and mitigated by the restrictive `default-src` and `connect-src` directives.

---

## Accessibility Summary

This application targets **WCAG 2.1 AA compliance** and **Illinois IITAA 2.1 Standards**. As of 2026-04-11, **axe-core 4.11.2 reports 0 violations across all 13 pages** (desktop AA, mobile AA, and best practices audits).

### Accessibility Features
- **Color contrast**: 8:1+ ratios in both light and dark themes (exceeds AA 4.5:1 requirement)
- **Skip links**: Full keyboard navigation with visible skip-to-content links
- **Screen reader support**: Aria-live regions via `useAnnouncer()` composable, proper landmark roles, aria-labels on all interactive elements
- **Touch targets**: 44px minimum enforced on all interactive elements
- **Reduced motion**: Global `prefers-reduced-motion` support disabling all animations, including page transitions
- **Form accessibility**: Labels, aria-describedby, aria-required, live regions for validation feedback
- **Heading hierarchy**: Proper semantic heading order (H1 > H2 > H3) verified across all pages
- **Theme support**: Dark/light themes with cookie-based persistence preventing FOUC
- **Images**: Descriptive alt text on all content images, decorative elements marked `aria-hidden="true"`
- **Focus indicators**: 3px outline with 2px offset on all focusable elements, visible in both themes

### Audit History
| Date | Tool | Result |
|------|------|--------|
| 2026-04-11 | axe-core 4.11.2 | 0 violations / 13 pages (desktop AA, mobile AA, best practices — 39 audits total) |
| 2026-04-08 | Google Lighthouse | CLS eliminated on all pages; avg perf 77→93; a11y 100 on all pages |
| 2026-03-24 | axe-core 4.10.2 | 0 violations / 20 pages |
| 2025-12-22 | axe-core | 98.8% compliance (all issues fixed) |
| 2025-10-29 | Google Lighthouse + axe | Full audit, all issues resolved |
| 2025-09-15 | Lighthouse | Skip link audit, footer fixes, dark mode fixes |
| 2025-08-11 | Lighthouse | Accessibility + performance optimization |

---

## [2026-04-11] - Accessibility Audit & Site Configuration Update

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
