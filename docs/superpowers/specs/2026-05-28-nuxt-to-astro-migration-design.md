# Nuxt 4/Vuetify → Astro 6/Tailwind 4/Alpine 3 — Migration Design

- **Date:** 2026-05-28
- **Branch:** `feat/astro-migration` (must NOT merge to `main` until explicit thumbs-up)
- **Status:** Approved design; next step is the implementation plan
- **Canonical playbook:** `docs/astro-conversion-checklist-v6.5.md` (the ICJIA Astro migration checklist; `vpp` is a named target in its lineage)

## 1. Context & motivation

The VPP site (Violence Prevention Plan for Illinois: 2025–2029) currently runs **Nuxt 4 + Vue 3 + Vuetify 3 + Nuxt Content v3** (SSG), deployed to Netlify. We are migrating it to **Astro 6 + Tailwind 4 + Alpine 3**.

**Why:** performance *and* accessibility compliance (WCAG 2.1 AA / ADA Title II / IITAA 2.1). Nuxt+Vuetify ceilings on mobile Lighthouse and ships problematic default ARIA; Astro static + native HTML + a single utility stylesheet eliminates the source of non-compliance rather than fighting the framework.

**Key divergence from the checklist:** the checklist assumes a **Strapi GraphQL** content source (§3). VPP does not use Strapi — content is **14 local markdown files** under `/content/` via Nuxt Content v3. This *simplifies* the migration: a local glob content collection (the §4 "v3 update" / SFS path) replaces the Strapi loader entirely.

## 2. Locked decisions

1. **Fidelity:** pixel-perfect *visuals* + functionally identical, but **drop Vuetify-era cruft** (always-on `ConsoleLogger`, the runtime scrollable-region `MutationObserver` hack, `IntersectionSection` lazy-load, nested ARIA landmarks, vestigial IDs, `wasm-monitor`). "Modern guts, identical surface."
2. **Stack:** full removal of Vue/Vuetify → Astro/Tailwind/Alpine. No Vue runtime ships.
3. **Search:** keep **Fuse.js + defuddle** index (not Pagefind) — preserves exact search behavior/ranking/UI.
4. **Verification:** **side-by-side screenshot diff** (current Nuxt build locally and/or prod `vpp.icjia.illinois.gov`, mobile + desktop, light + dark) **+ lightcap 100/100/100/100** per route, as the per-phase done-gate.
5. **Tailwind utilities first** — especially the layout grid. Maximize Tailwind built-ins (`grid`, `flex`, `container`, spacing scale, responsive prefixes, `@theme` tokens, `dark:` variants) over bespoke CSS.
6. **Structure:** build in an `astro/` subdirectory with the Nuxt app left runnable at the repo root for diffing; switch yarn → **pnpm 10**; flip `netlify.toml` `base="astro/"` at cutover.
7. **Pop-up references/citations** on internal pages are a **must-preserve** feature.
8. **Netlify branch deploys are enabled**; the `netlify` CLI is globally installed — deploy previews are available for per-phase audits.

## 3. Architecture & directory structure

```
icjia-vpp-2025/                  # feat/astro-migration branch
├── (existing Nuxt app at root — untouched, runnable for diff until cutover)
├── astro/
│   ├── src/
│   │   ├── assets/              # images Sharp should optimize (Image/Picture)
│   │   ├── content/             # local .md/.mdx (same 14 files as root /content)
│   │   ├── content.config.ts    # glob loader + permissive Zod schemas (NOT Strapi)
│   │   ├── components/
│   │   │   ├── ui/              # Tailwind primitives: Card, Button, Icon, Chip…
│   │   │   ├── chrome/          # Header, Footer, Sidebar, ThemeToggle, ScrollToTop
│   │   │   ├── home/            # Hero, Letters, Goals, Approach, Principles…
│   │   │   ├── content/         # PageTitle, ReportNav, ReferenceTooltip, images…
│   │   │   └── islands/         # Alpine: Search, MobileMenu, References, Feedback…
│   │   ├── layouts/BaseLayout.astro   # head + skip-links + header/footer + JSON-LD
│   │   ├── lib/                 # config-loader, markdown, references, dates
│   │   ├── pages/               # one .astro per route template
│   │   └── styles/global.css    # Tailwind 4 entry + @theme tokens + minimal custom rules
│   ├── scripts/                 # ported build scripts (search index, sitemap, llms, plan-json, references)
│   ├── public/                  # favicon, robots.txt, llms.txt, og image, /data/*.json
│   └── package.json             # packageManager pnpm@10; pnpm.onlyBuiltDependencies: [esbuild, sharp]
├── start-dev-server             # §19 pnpm-based launcher
└── netlify.toml                 # base flipped to "astro/" at cutover
```

**Astro config:** `output:'static'`, `trailingSlash:'always'`, `@tailwindcss/vite` (Tailwind 4, not the v3 PostCSS plugin), `@astrojs/sitemap`, `site:'https://vpp.icjia.illinois.gov'`.

## 4. Tech & subsystem mapping

| Current (Nuxt/Vuetify) | Astro/Tailwind/Alpine target |
|---|---|
| `<v-app>` / `<v-main>` shell | `BaseLayout.astro` + semantic `<header>/<main>/<footer>` landmarks |
| Vuetify components (`v-card`, `v-btn`, `v-icon`, grid) | Hand-built Tailwind `ui/` primitives matched pixel-for-pixel; layout via Tailwind grid/flex utilities |
| Vuetify theme (dark default, session-only) | `darkMode:'class'` + no-flash inline head script (CSP-hashed) + Alpine toggle; session-only persistence preserved |
| MDI webfont via jsdelivr CDN | Inline the handful of actually-used SVG icons (CSP-clean, faster, identical render) |
| `@nuxtjs/google-fonts` (Roboto, Raleway 400/700) | Self-host via `@fontsource` (§6); same families/weights |
| `IntersectionSection` client lazy-load | Dropped — static HTML needs no lazy hydration |
| `ConsoleLogger`, scrollable-region `MutationObserver`, `wasm-monitor`, console plugins | Dropped — dev-only / Vuetify workarounds |
| Vue reactivity | Alpine `x-data` islands **only** where real interaction exists |

**Alpine islands (the only JS that ships):** mobile menu, theme toggle, scroll-to-top, Fuse search, pop-up references/citations, footnote interactions, FeedbackForm stub. Everything else is static HTML.

## 5. Content & rendering pipeline

- **Local glob content collection** (§4 "v3 update" path). `content.config.ts` defines `plan`, `news`, `legal`, and top-level page collections with **permissive Zod schemas**, reading the same markdown files.
- **Markdown:** Astro remark/rehype + `remark-gfm`, footnotes, manual heading-anchor behavior (current config disables Vuetify's auto anchors), `rehype-external-links`. Shiki stays **disabled** (matches current `highlight:false`).
- **MDC handling (§6):**
  - **Home page → Strategy 1 (direct render):** `index.astro` composes the Astro `home/` components directly (mirrors `pages/index.vue`); the `::home-*` markdown body is discarded. No MDC plumbing.
  - **Content files that embed components mid-prose** (`::text-centered-image`, `::FeedbackForm`, `::home-news` — ~3–4 files): convert those specific files to **`.mdx`** and import the Astro components. Pure-prose files stay `.md`.
  - A **pre-Phase-3 MDC token audit** (grep `content/` for `^::?[a-z]` tokens) confirms the full inventory before porting.
- **JSON config** (`site/menu/routes/fuse/sitemap.config.json`) → read by `lib/` helpers, replacing `useSiteSettings()` / `config-loader`. Build scripts are framework-agnostic Node and port nearly as-is into `astro/scripts/`.

## 6. Route & component inventory

**Routes (all static-prerendered):** `/`; 7× `/plan/*` (front-cover, executive-summary, public-health-approach, goals-and-recommendations, planning-process, guiding-principles, references) + `/plan`→`/plan/front-cover` redirect; `/resources`; `/organizational-and-agency-highlights`; `/download`; `/contact`; `/legal/privacy-policy`; `/news`; `/search`; `[...slug]` catch-all; `404`. (`/sandbox` excluded, as today.)

**~44 components grouped for porting:**
- **Chrome:** AppHeader (1,115 LOC — highest effort), AppFooter, AppSidebar, ThemeSwitch, ScrollToTop
- **Home:** Hero, Letters, LieutenantGovernor, Goals(+Card), Approach, Principles(+Card), Statistics(+Card), Stakeholders, News, Action
- **Content:** ContentDisplay, PageTitleSection, HeroSection, ReportNavigation, NewsCard, image components (Centered/TextWrap/TextCentered/WithSpinner)
- **Citations (must-preserve):** ReferenceTooltip + AccessibleTooltip + `useReferences` + `references.client.js` + `generate-references.js` → Alpine island with identical pop-up behavior + data source
- **Special:** SearchInterface (Fuse island), FeedbackForm (stub), DownloadPlanButton, StructuredData (→ JSON-LD in layout)
- **Drop:** ConsoleLogger, IntersectionSection, dev/console plugins, wasm-monitor
- **Phase 1 dead-component audit:** several `About*` / `Feature*` components may be unused (no `/about` route); confirmed-dead ones are dropped, not ported.

## 7. Build principles (apply throughout)

- Tailwind utilities first, **especially layout** — `grid grid-cols-*`, `flex`, `container`, gap/spacing scale, responsive prefixes. No hand-rolled CSS grid.
- Design system in `@theme` tokens (brand colors, Roboto/Raleway, spacing) reused as utilities, not duplicated as custom classes.
- `global.css` custom rules reserved for what utilities can't express: `.markdown-body` typography, skip-link, `sr-only`, citation-popup internals.
- Dark mode via `darkMode:'class'` + `dark:` variants — no parallel stylesheet.

## 8. Phase plan (each phase screenshot-diff + lightcap gated)

| Phase | Scope | Done-gate |
|---|---|---|
| **1 — Foundation** | Branch + `astro/` scaffold, pnpm, Tailwind 4 `@theme` tokens matched to Vuetify theme + `main.scss`, Alpine, self-host fonts, inline icon SVGs, `BaseLayout`, astro.config, preview netlify, dev-server script; dead-component audit + MDC token audit | Builds clean; tokens render brand-accurate |
| **2 — Chrome** | Header (nav + mobile-menu Alpine island + theme toggle + search affordance), Footer, Sidebar, ScrollToTop, skip-links, announcer live regions | Chrome screenshot-diff (mobile+desktop, light+dark); lightcap 100 on a bare page |
| **3 — Content pipeline** | Content collection + markdown render + ReportNavigation + PageTitleSection + `[...slug]` + 7 plan pages + legal + resources + org-highlights | Per-route screenshot-diff; lightcap 100/100/100/100 |
| **4 — Home** | `index.astro` composing all `home/` components (Strategy 1) | Home screenshot-diff at all breakpoints, both themes |
| **5 — Interactivity** | Pop-up references/citations island (must-preserve), footnotes, tooltips, Fuse `/search`, `/news` listing, `/download` + DownloadPlanButton, `/contact`, FeedbackForm stub | Functional-parity checklist + screenshot-diff |
| **6 — SEO/discovery** | astro-seo per-page meta/OG/Twitter, JSON-LD (StructuredData→layout), sitemap, robots.txt, llms.txt, canonical + trailing-slash | Meta/OG parity vs current |
| **7 — Headers/perf/a11y** | Strict CSP w/ hashed inline scripts (keep `unsafe-eval` per §11), `_headers` defense-in-depth, safe CSS lazy-load, font-weight trim, full-route a11y sweep | lightcap 100/100/100/100 all routes; clean CSP console |
| **8 — Teardown & cleanup** | Once all phases verify: delete the root Nuxt/Vue/Vuetify app (`app/`, `nuxt.config.ts`, `content.config.ts`, `server/`, Nuxt build scripts, vuetify/vue deps, yarn lockfile, `.nuxt`/`.output`), remove stray non-`/docs` markdown + log files, promote `astro/` to the deploy base, and rewrite `README.md` for the Astro/Tailwind/Alpine stack | Repo is Astro-only: `grep -rIl -e vuetify -e "from \"vue\"" --exclude-dir=node_modules` is clean; `pnpm build` from the promoted base succeeds; `README.md` reflects the new stack; `LICENSE` + `/docs` (checklist + migration docs) intact |

## 9. Verification harness (the pixel-perfect gate)

- **Reference:** current Nuxt build served locally (port A) vs new Astro preview (port B); prod `vpp.icjia.illinois.gov` and the Netlify branch-deploy preview as secondary references.
- **Visual:** viewcap per-route screenshots at **mobile (390px) + desktop (1280px) × light + dark**. A route is "done" only when it visually matches.
- **Lighthouse/a11y:** lightcap `run_audit` (mobile) + `run_a11y` per route → 100/100/100/100.
- **Functional-parity checklist** per interactive feature: search ranking/results, theme persistence + no-flash, mobile menu, **pop-up references (trigger, positioning, content, dismiss, keyboard/focus)**, footnotes, scroll-to-top, form stub.

## 10. Cutover (§17) + teardown (Phase 8)

Tag `v1-final` (the last legacy commit — this is the rollback point); flip `netlify.toml` `base="astro/"` + publish `astro/dist`; run `check:links`; mobile Lighthouse on the deploy; verify Plausible registers a real request; **visual skip-link Tab test** on the homepage; smoke-test search / menu / references / forms.

**Teardown (Phase 8) — the merged branch must be Astro/Tailwind/Alpine ONLY.** After verification passes, the root Nuxt app and Vue/Vuetify footprint are deleted, stray non-`/docs` markdown + logs are removed, and `README.md` is rewritten for the new stack. **Keep:** `README.md` (updated), `LICENSE`, everything under `/docs` (the checklist + migration spec/plans/audits), and the `astro/` app (promoted to root or kept as the deploy base — decide at teardown). Because the Nuxt app is removed rather than kept alongside, **rollback is via the `v1-final` tag / pre-merge `main`**, not a coexisting legacy app.

**Merge to `main` only on the user's explicit thumbs-up.**

**Teardown ambiguity to resolve with the user before deleting:** whether `CHANGELOG.md` is kept at root (it conflicts with the user's standing "always keep + update CHANGELOG" preference, so default to KEEP unless told otherwise), and the exact list of non-`/docs` markdown/log files to remove (e.g., `markdown-documentation/`, `audit-log-*.md`, `*-audit-*.log`, root analysis docs).

## 11. Risks / watch-items

1. **AppHeader (1,115 LOC)** — highest-effort port (nav + drawer + theme + search).
2. **Dark + light pixel parity** doubles the screenshot surface per route.
3. **Pop-up references** — must match trigger/position/content/focus exactly; dedicated verification.
4. **CSP inline-script hashing** for the no-flash theme script (§11 trap: Astro inlines small bundled `<script>` blocks).
5. **Home source of truth** — `pages/index.vue` (component-driven) wins over `content/index.md`; confirm in Phase 4.

## 12. Out of scope

Strapi (n/a — local markdown), Pagefind (keeping Fuse), a real FeedbackForm backend (stays a stub unless changed), any redesign or new features.

## 13. Open items to confirm during planning

- Exact MDC token inventory + which content files become `.mdx` (Phase 1 audit).
- Confirmed-dead component list (Phase 1 audit).
- Exact `@theme` token values extracted from the current Vuetify theme + `main.scss`.
- Final list of MDI icons actually used (for SVG inlining).
