# Astro Migration — Phase 7 (Headers / Perf / A11y) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Read this + `docs/superpowers/audits/2026-05-28-phase7-headers-perf-brief.md` + cited source. Verify with lightcap (perf+a11y) + curl (headers) on the deploy.

**Goal:** Lock in security headers (tighter CSP via `astro/public/_headers`), close the deferred perf gaps (LCP/CLS/images/fonts), add Plausible analytics, and confirm 100/100/100/100 across all routes — the last phase before teardown.

**Architecture:** Origin-layer `astro/public/_headers` (context-isolated, like `_redirects`) carries the tighter Astro CSP + security + cache headers. Perf: fix the hero LCP animation, missing image dims (CLS), latin-only fonts, and astro:assets `<Image>` for oversized images. Plausible via a deferred `<script>`. Evaluate Astro `experimental.csp` to drop `'unsafe-inline'`. Bump astro 6.4.0→6.4.2 + migrate to `markdown.processor`.

**Brief:** `docs/superpowers/audits/2026-05-28-phase7-headers-perf-brief.md`
**Verification:** lightcap perf+a11y per route; `curl -I` the deploy for CSP/headers; `/sitemap.xml` still 200. Branch `feat/astro-migration` (no merge to main). Commit per task; no Co-Authored-By trailer.

---

## Task 1: Foundation — astro 6.4.2, markdown.processor, latin fonts, _headers
- [ ] `cd astro && pnpm up astro@6.4.2` (in-range patch); `pnpm build` still green.
- [ ] **markdown.processor migration** (clears deprecation warning): `pnpm add @astrojs/markdown-remark`; in `astro.config.ts` replace `markdown: { syntaxHighlight:false, remarkPlugins:[remarkGfm], rehypePlugins:[[rehypeExternalLinks,{...}]] }` with `markdown: { syntaxHighlight:false, processor: unified-based }` per the 6.4 API: `import { createMarkdownProcessor } from '@astrojs/markdown-remark'` OR the documented `markdown.processor` shape — follow Astro 6.4 docs (Context7 if needed). If the API is awkward, KEEP the current remark/rehype config (warning is benign) and note it. Goal: no functional change to rendered markdown (verify a plan page still has external-link target=_blank + gfm).
- [ ] **latin-only fonts:** in `BaseLayout.astro` change the 4 `@fontsource/{roboto,raleway}/{400,700}.css` imports to the `latin-`prefixed variants (`@fontsource/roboto/latin-400.css`, etc.). Verify the files exist in node_modules.
- [ ] **`astro/public/_headers`:** create with the tighter CSP (brief §2, KEEP `'unsafe-inline' 'unsafe-eval'` for now — Task 5 may drop unsafe-inline) + all security headers + `object-src 'none'` + cache rules (`/_astro/*` immutable, `/*.html` revalidate) per brief §4.
- [ ] `pnpm build`; confirm `dist/_headers` present + font bundle smaller (count `dist/_astro/*.woff2`). Commit `build(astro): astro 6.4.2 + markdown.processor + latin fonts + _headers (tighter CSP)`.

## Task 2: Plausible analytics
- [ ] Add to `BaseLayout.astro` `<head>` (after SEO): `<script is:inline defer data-domain="vpp.icjia.illinois.gov" src="https://plausible.icjia.cloud/js/script.js"></script>`. NO preconnect (§9). (CSP already allows plausible in script-src+connect-src from Task 1.)
- [ ] `pnpm build`; confirm the script tag in `dist/index.html`. Commit `feat(astro): add self-hosted Plausible analytics`.

## Task 3: LCP + CLS fixes (zero/low file change)
- [ ] **Hero LCP:** in `HomeHero.astro`, remove the `fadeSlideUp` animation (opacity:0 + animation-delay) from the IMAGE column/element only — keep text-side animations. The eager+fetchpriority hero image must be visible immediately (not hidden 800ms).
- [ ] **Stratton portrait height:** in `home.js`, add `height: 182` to `letters.stratton.photo` (natural 600×728 → 150w→182h); confirm `HomeLetter.astro` emits `height`.
- [ ] **Footer logo dims:** in `Footer.astro`, add `width="250" height="175"` to the ICJIA `<img>`.
- [ ] `pnpm build`; serve; lightcap `run_audit` mobile on `/` → confirm LCP improved + CLS down. Commit `perf(astro): fix hero LCP animation + image dimensions (CLS)`.

## Task 4: Image optimization (astro:assets <Image>)
- [ ] Move oversized images from `astro/public/images/` to `astro/src/assets/images/` and render via `<Image>` (astro:assets + Sharp, already a dep): seal (Header, w40 h40), Adams portrait (HomeLetter, w150 h150 webp lazy), Stratton (w150 h182 webp lazy), PPT_circles/PPT_pyramid (TextCenteredImage, w~1600 webp lazy). Keep hero `vpp-cover.webp` in public (only the animation was the issue). NOTE: the OG/JSON-LD `illinois-seal.png` + `og-image-vpp-2025.png` MUST stay in `public/` (external hotlink/absolute URL) — only move the seal used in chrome, or keep both copies.
- [ ] Update the components to `import` the asset + use `<Image src={...} .../>`. The references/data files that point at `/images/...` for OG stay absolute (public).
- [ ] `pnpm build`; confirm smaller image output + `<img>` tags have width/height. lightcap `run_audit` → image-delivery savings realized. Commit `perf(astro): optimize seal/portraits/lightbox images via astro:assets`.

## Task 5: experimental.csp evaluation (drop unsafe-inline if it works)
- [ ] Enable `experimental: { csp: true }` in `astro.config.ts` (per Astro docs — it auto-hashes inline scripts/styles). `pnpm build`; serve; in a real browser (Chrome DevTools MCP) load `/`, `/search/`, `/plan/goals-and-recommendations/` and CHECK THE CONSOLE for CSP violations (theme no-flash, Alpine, dialog, search, references must all still work).
- [ ] IF clean: update `astro/public/_headers` CSP to drop `'unsafe-inline'` from script-src + style-src (keep `'unsafe-eval'` for Alpine); rebuild; re-verify no console CSP errors + all interactions work. IF experimental.csp conflicts with Alpine/inline (violations or broken JS): revert (`csp:false`), KEEP `'unsafe-inline'`, and document the decision in the brief/checklist. Either way the site must work.
- [ ] Commit `feat(astro): experimental.csp drop unsafe-inline` OR `docs(astro): keep unsafe-inline (experimental.csp incompatible with Alpine)`.

## Task 6: Full a11y + perf sweep (gate)
- [ ] Serve the final build. For ALL 16 routes (brief §7): lightcap `run_a11y` → 100; spot `run_audit` (mobile) on home + a plan page + search → record Perf/BP/SEO (target ≥99, a11y/BP/SEO 100). Interaction re-check (Chrome MCP): theme toggle, dropdowns, mobile drawer, references popup, search, image modal, TOC — all still work under the new CSP.
- [ ] Fix any a11y findings (e.g. dialog focus-trap, contrast). Re-audit.
- [ ] Push; on the deploy: `curl -I https://feat-astro-migration--vpp-2025.netlify.app/` → confirm the CSP + HSTS + X-Frame-Options headers are present (the `_headers` applied); `/sitemap.xml` still 200; theme/search/references work on the live preview.
- [ ] Commit any fixes; verify deploy green.

## Phase 7 Done-Gate
- [ ] `astro/public/_headers` applied on the deploy (curl shows tighter CSP + HSTS + COOP + Permissions-Policy + frame-ancestors); no jsdelivr/google-fonts in CSP; `object-src 'none'`.
- [ ] Plausible loads (deferred, no preconnect); CSP allows it.
- [ ] Home LCP materially improved (hero visible immediately); CLS ≤ ~0.02; image-delivery savings realized; latin-only fonts.
- [ ] experimental.csp decision made + documented; site works under the final CSP (no console violations); all interactions verified.
- [ ] lightcap: A11y 100 + SEO 100 + BP 100 on all routes; Perf ≥99 on key routes; no Vue/Vuetify; build + deploy green.

When complete: Phases 1–7 are done. **Phase 8 (teardown to Astro-only + README rewrite) requires the user's explicit thumbs-up to merge to main** — write the Phase 8 plan but do NOT execute the teardown/merge without approval.
