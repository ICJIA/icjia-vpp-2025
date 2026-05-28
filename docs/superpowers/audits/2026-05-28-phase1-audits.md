# Phase 1 Audits — 2026-05-28

Branch: `feat/astro-migration`. Audits performed against the Nuxt source (repo root `app/` + `content/`). The Astro app in `astro/` was excluded.

---

## 1. MDC Token Inventory

Grep command used:
```bash
grep -rnE '^::?[A-Za-z]' content/ | sort
```

Three content files contain MDC tokens. One token (`::FeedbackForm`) is commented out and therefore inactive at build time; it is included for completeness.

| Content file | MDC token(s) | Whole-body or interleaved | Strategy |
|---|---|---|---|
| `content/index.md` | `::home-hero`, `::home-letters`, `::home-lieutenant-governor`, `::home-statistics` (commented), `::home-approach` (commented), `::home-goals`, `::home-principles` (commented), `::home-stakeholders` (commented), `::home-news{:item-count=3}` (commented), `::home-action` | Whole-body — the file is composed entirely of MDC component blocks with no interleaved prose paragraphs; all text is slots passed into each component | Strategy 1 (compose in page — discard markdown body) |
| `content/contact.md` | `::FeedbackForm` (currently wrapped in an HTML comment — disabled) | Interleaved — active body is standard prose (address, phone, links); the FeedbackForm block is commented out | MDX (convert to `.mdx` and import Astro component when re-enabled; for now the active page is prose-only and can be treated as plain markdown) |
| `content/plan/goals-and-recommendations.md` | `::text-centered-image{...}` × 2 | Interleaved — two image blocks are embedded mid-document between substantial prose paragraphs | MDX (convert to `.mdx` and import `TextCenteredImage` as an Astro component) |

### Notes

- `content/index.md` — `app/pages/index.vue` is authoritative for the home page (see Section 3). The MDC body in this file is already superseded by the page component and will be discarded under Strategy 1.
- `content/contact.md` — the `::FeedbackForm` token is disabled (HTML comment). The active page is plain prose and can be migrated as plain `.md` in Phase 2. If FeedbackForm is re-enabled before Phase 4, re-classify to MDX.
- `content/plan/goals-and-recommendations.md` — the two `::text-centered-image` blocks are inline with ~50 lines of body prose each; MDX is the correct strategy. The Astro equivalent of `TextCenteredImage` must be built in Phase 4 (plan pages).

---

## 2. Dead-Component List

Grep methodology: for each candidate component, two checks were performed:

1. **Code references** — `grep -rIl --exclude-dir=node_modules -e "$Name" app/ content/` excluding the component's own file AND the plugin registration file (`app/plugins/markdown-components.js`). A count of 0 means the component is never directly imported or composed in any page/layout/other component outside the plugin.
2. **MDC-token references** — `grep -rnE '^::(kebab-case-name)' content/` to check whether the component is invoked as an MDC block token in any content file.

The plugin (`app/plugins/markdown-components.js`) globally registers components for the Nuxt Content MDC renderer. Registration alone is not a "live" reference — it only counts if the token actually appears in a content file.

| Component | External code refs (excl. plugin) | MDC-token refs in `content/` | Verdict |
|---|---|---|---|
| `AboutApproach.vue` | 0 | 0 (no `::about-approach` in any `.md`) | **Drop** — no `/about` route exists in `app/pages/` and no content file invokes this token. Registered in plugin but never reached. |
| `AboutContact.vue` | 0 | 0 (no `::about-contact`) | **Drop** — same rationale as `AboutApproach`. The live `/contact` route uses `content/contact.md` which invokes `::FeedbackForm`, not this component. |
| `AboutHero.vue` | 0 (note: `[...slug].vue` contains `bodyStr.includes("about-hero")` as a layout-detection heuristic, but no content file ever emits this token) | 0 (no `::about-hero` in any `.md`) | **Drop** — the layout-detection string in `[...slug].vue` is a guard for a token that never appears; the component itself is never rendered. |
| `AboutStory.vue` | 0 | 0 (no `::about-story`) | **Drop** — no `/about` route or content file invokes this. |
| `AboutValues.vue` | 0 | 0 (no `::about-values`) | **Drop** — no `/about` route or content file invokes this. |
| `CenteredImage.vue` | 0 (only own file + plugin) | 0 (no `::centered-image` in any `.md`; the live token is `::text-centered-image` → `TextCenteredImage.vue`) | **Drop** — superseded by `TextCenteredImage.vue`; never invoked. |
| `FeatureCard.vue` | 1 (used internally by `FeatureSection.vue`) | 0 | **Keep (verify in its phase)** — used as a sub-component of `FeatureSection`. Cannot drop without dropping `FeatureSection` first. |
| `FeatureSection.vue` | 0 (only own file + plugin; `[...slug].vue` contains `bodyStr.includes("feature-section")` as a layout-detection heuristic only) | 0 (no `::feature-section` in any `.md`) | **Drop** — the `[...slug].vue` string check is a never-triggered guard. No content file invokes this token. If dropped, `FeatureCard.vue` also becomes dead. |
| `HomeHighlights.vue` | 0 (only plugin) | 0 (no `::home-highlights` in any `.md`) | **Drop** — registered in plugin but never invoked. |

### Summary

Confirmed-drop candidates (zero code refs + zero MDC-token refs): `AboutApproach`, `AboutContact`, `AboutHero`, `AboutStory`, `AboutValues`, `CenteredImage`, `FeatureSection`, `HomeHighlights`.

`FeatureCard` is kept pending `FeatureSection` drop confirmation — if `FeatureSection` is dropped in Phase 4/5, `FeatureCard` drops with it.

Do NOT port these 8 components to Astro. They can be archived or deleted in the cleanup step of whatever phase handles the `app/components/content/` directory.

---

## 3. Home Source of Truth

**Conclusion: `app/pages/index.vue` is authoritative. The `content/index.md` MDC body is discarded for the home page (Strategy 1).**

Evidence:

- `app/pages/index.vue` directly imports and renders the home sections: `HomeHero`, `HomeLetters`, `HomeGoals` (immediate), and `LazyHomeLieutenantGovernor`, `LazyHomeAction` (async via `defineAsyncComponent`). It uses no `<ContentDoc>` or `<ContentRenderer>` — the Nuxt Content pipeline is bypassed entirely for this route.
- `content/index.md` is composed entirely of MDC block components (`::home-hero`, `::home-letters`, etc.) with no standalone prose. Even if the content file were rendered it would only invoke the same Vue components — but it is not rendered by the page.
- The currently-active home sections are: `HomeHero`, `HomeLetters`, `HomeLieutenantGovernor`, `HomeGoals`, `HomeAction`. Five other sections (`HomeStatistics`, `HomeApproach`, `HomePrinciples`, `HomeStakeholders`, `HomeNews`) are commented out in `content/index.md` and absent from `pages/index.vue` — they are disabled but not yet dead (they retain their Vue component implementations and are still registered in the plugin).

**Migration implication (Phase 2):** The Astro home page (`astro/src/pages/index.astro`) composes the Home* Astro components directly, consistent with Strategy 1. The `content/index.md` file has no role in the Astro build for the home page.

---

## 4. Phase 1 Lighthouse / Visual Baseline (Smoke Page)

These results were measured by the controller against the `index.astro` smoke page and are transcribed verbatim here as the Phase 1 baseline.

### Scores (mobile, `index.astro`)

| Category | Score |
|---|---|
| Accessibility | 100 |
| Performance | 97 |
| Best Practices | 96 |
| SEO | 100 |

### Sub-100 causes

**Performance (97) — CLS 0.10:** Caused by `@fontsource` font swap during load. Deferred to Phase 7 (font preload / `font-display` strategy). No action required in Phases 2–6.

**Best Practices (96) — single console error:** `GET /favicon.png` returns 404. Root cause: no `astro/public/` directory exists yet; the site's `public/favicon.png` is available and will be migrated during the public-asset step (Phase 2 or Phase 3). The console is otherwise clean — no JavaScript errors, no Alpine errors, no icon errors.

### Visual verification

- Desktop (1072 px) — dark mode: renders correctly. 3-column → 1-column responsive grid collapses as expected. Semantic design tokens applied. Raleway display headings render. Three inline MDI icons are tinted primary / secondary / accent.
- Mobile (390 px) — dark mode: renders correctly with same behavior.
- Light-mode capture deferred to Phase 2 (real theme toggle implementation not yet in place on the smoke page).

---

*Audits completed 2026-05-28. Branch: `feat/astro-migration`.*
