# Astro Migration — Phase 5 (Interactivity) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Implementers read both the cited legacy source AND `docs/superpowers/audits/2026-05-28-phase5-interactivity-brief.md`, then verify via screenshot-diff + Chrome DevTools MCP interaction tests.

**Goal:** Port the interactive subsystems — the must-preserve **pop-up references/citations**, **Fuse.js search**, the **news listing**, the **contact** page, and the **TextCenteredImage modal** — matching prod behavior.

**Architecture:** Build scripts (`generate-references.js`, `generate-search-index-defuddle.js`) → `astro/scripts/`, run as `prebuild`, emit JSON to `astro/public/data/`. References popups = the framework-agnostic DOM logic from `references.client.js` extracted into an Astro `<script>` module loaded by BaseLayout. Search = an Alpine island that lazy-loads Fuse + the index. News = a content collection + listing (empty state, since no content). Contact = static markdown via the catch-all. Image modal = native `<dialog>`. Footnotes/FeedbackForm/TextWrapImage = skipped (disabled/superseded on prod).

**Tech Stack:** Fuse.js, Alpine 3, astro-icon, native `<dialog>`, the existing Node build scripts.

**Brief:** `docs/superpowers/audits/2026-05-28-phase5-interactivity-brief.md`
**Verification:** prod `https://vpp.icjia.illinois.gov` + interaction tests. Branch `feat/astro-migration` (no merge to main). Commit per task; no Co-Authored-By trailer.

---

## Task 1: Build scripts + data + deps
**Files:** create `astro/scripts/generate-references.js`, `astro/scripts/generate-search-index-defuddle.js`; modify `astro/package.json`; emit `astro/public/data/{references.json,search-index.json}` + `astro/public/config/fuse.config.json`.
- [ ] Copy `scripts/generate-references.js` → `astro/scripts/`; FIX the content path to `content/plan/references.md` (read from the repo root `/content`, which is fine — root content is the canonical references source) OR read from `astro/src/content/plan/references.md`; set output to `astro/public/data/references.json`. Run it; confirm ~19 references with `{references:{key:{...fullCitation}}}` shape.
- [ ] Copy `scripts/generate-search-index-defuddle.js` → `astro/scripts/`; use the MARKDOWN-ONLY pass (read `astro/src/content/**/*.md`); output `astro/public/data/search-index.json`; copy `config/fuse.config.json` → `astro/public/config/fuse.config.json`. Run it; confirm index items with `{title,content,path,description,...}` and news excluded.
- [ ] `cd astro && pnpm add fuse.js` and any deps the index script imports (`defuddle`, `jsdom`, `gray-matter`, `glob` — check its `import`s).
- [ ] `astro/package.json`: add `"prebuild": "node scripts/generate-references.js && node scripts/generate-search-index-defuddle.js"` (keep `"build":"astro build"` — pnpm runs prebuild automatically).
- [ ] Verify `pnpm build` runs prebuild then builds; `astro/public/data/*.json` exist. Commit `feat(astro): port references + search-index build scripts + data`.

## Task 2: References popups (CRITICAL)
**Files:** create `astro/src/scripts/references.js`; modify `astro/src/layouts/BaseLayout.astro`.
- [ ] Extract the DOM logic from `app/plugins/references.client.js` into `astro/src/scripts/references.js` as `export function initReferences()` (strip the Nuxt plugin wrapper + `nuxtApp.hook`): fetch `/data/references.json` once (module cache); `querySelectorAll('[data-ref]')`; per span build a `<div role="tooltip" id=...>` (parent-appended, absolute-positioned above/flip-below); triggers mouseenter(50ms)/mouseleave/focus/blur/touchstart(4s auto-hide)/keydown Enter-Space/Escape; multi-key (`a,b`) → join fullCitations. Styling per brief (light/dark bg, white, rounded, max-w-400, fade). **A11y fix:** set `aria-describedby`=tooltip id on show, remove on hide; span `cursor:help` + `tabindex=0`.
- [ ] Load in `BaseLayout.astro`: `<script>import { initReferences } from "../scripts/references.js"; if (document.readyState!=="loading") initReferences(); else document.addEventListener("DOMContentLoaded", initReferences);</script>` (Astro bundles it; CSP-hash handled in Phase 7).
- [ ] Verify (Chrome DevTools MCP) on `/plan/public-health-approach/`: hover a `[data-ref]` → tooltip with full citation; focus → shows; Escape → hides; multi-key span shows both. Commit `feat(astro): pop-up references/citations (must-preserve)`.

## Task 3: Search page (Fuse)
**Files:** create `astro/src/pages/search.astro`; create `astro/src/scripts/search-highlight.js` (ported from `app/utils/sanitize.js`).
- [ ] Port the excerpt/highlight helpers from `app/utils/sanitize.js` into a browser ES module.
- [ ] `search.astro`: BaseLayout + `PageTitleSection` (title "Search") + an Alpine `x-data` search island: lazy `init()` on input focus (`import('fuse.js')` + fetch `/data/search-index.json` + `/config/fuse.config.json`), 300ms debounce, min 2 chars, 5 states (idle/initializing/no-query/no-results/results). Results: title + path (`mdi:link-variant`) + `<mark>`-highlighted excerpt + "View content →" `<a href={path}>`. A11y per brief (role=status/region, live count, input aria-label, autofocus). Match `app/pages/search.vue` UI.
- [ ] Verify (Chrome DevTools MCP): type a query (e.g. "violence"), confirm results render with highlights + correct links; empty/no-results states. Commit `feat(astro): Fuse.js search page`.

## Task 4: News listing
**Files:** modify `astro/src/content.config.ts`; create `astro/src/pages/news/index.astro` (+ `NewsCard` inline or component).
- [ ] Add `news` collection (glob `./src/content/news`; schema title/summary/date/image + passthrough).
- [ ] `news/index.astro`: BaseLayout + PageTitleSection ("News") + `getCollection('news')` sorted date DESC → NewsCard grid; **empty state** "No News Available" when none (current). NewsCard (static): horizontal card (200px image / date chip+title+summary+"Read More →"), stacks <768px, image fallback `/images/illinois-seal.webp`. Match `news.vue`/`NewsCard.vue`. No nav link.
- [ ] Verify `pnpm build` emits `/news/` (empty state). Commit `feat(astro): news listing (empty state) + collection`.

## Task 5: Contact page (static)
**Files:** modify `astro/src/pages/[...slug].astro`.
- [ ] Remove `contact` from the page-exclusion set so `content/contact.md` renders via the catch-all (the commented `::FeedbackForm` is inert in markdown). Verify `/contact/` builds + shows address/phone/email; no form. Commit `feat(astro): enable static contact page`.

## Task 6: TextCenteredImage modal
**Files:** modify `astro/src/components/content/TextCenteredImage.astro`.
- [ ] Add click-to-enlarge via a native `<dialog>` (free focus-trap + Escape): image `cursor-pointer role="button" tabindex="0"` + "Click image to enlarge" hint; Alpine (or a tiny inline script) opens `dialog.showModal()` on click/Enter; modal shows full image `max-h-[75vh] object-contain` + caption + close button; backdrop click + Escape close. Match `app/components/content/TextCenteredImage.vue`.
- [ ] Verify (Chrome DevTools MCP) on `/plan/goals-and-recommendations/`: click an image → modal opens; Escape/close/backdrop closes. Commit `feat(astro): TextCenteredImage click-to-enlarge modal`.

## Task 7: Verification gate
- [ ] Serve; screenshot-diff `/search`, `/news/`, `/contact/` vs prod (desktop+mobile, light+dark). lightcap `run_a11y` + `run_audit` per route → A11y 100.
- [ ] Interaction tests (Chrome DevTools MCP): references popups (hover/focus/Escape/multi-key) on a plan page; search query→results; image modal open/close; contact static.
- [ ] Push; verify branch deploy. Confirm root `/content` + Nuxt reference untouched.

## Phase 5 Done-Gate
- [ ] Pop-up references work (hover/focus/keyboard/touch, multi-key, Escape, a11y) — must-preserve ✓.
- [ ] Fuse search: results + highlights + states + links match prod.
- [ ] /news empty-state listing + /contact static render; both match prod.
- [ ] TextCenteredImage modal opens/closes (focus-trapped).
- [ ] lightcap A11y 100 on /search, /news, /contact; no Vue/Vuetify; build + deploy green.

When complete, write the Phase 6 (SEO) plan.
