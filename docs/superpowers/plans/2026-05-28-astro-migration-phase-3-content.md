# Astro Migration — Phase 3 (Content Pipeline) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Implementers read both the cited legacy source AND `docs/superpowers/audits/2026-05-28-phase3-content-brief.md`, then verify via screenshot-diff vs prod.

**Goal:** Render every non-home content route (7 plan pages + resources/org-highlights/download/legal) from Astro content collections with pixel-matched markdown typography, page titles, and report navigation.

**Architecture:** Copy `/content` → `astro/src/content` (root `/content` stays pristine for the Nuxt diff-reference). Astro content collections + remark-gfm + rehype-external-links render the markdown into a `.markdown-body` container. Per-route templates compose `PageTitleSection` + `<Content/>` + `ReportNavigation`. No Vue/Vuetify; TOC + future image-modal use Alpine. Dead Nuxt heuristics (`needsStandardHeader`, `content-links`/`footnotes` plugins, `useContentFetcher`) are NOT ported.

**Tech Stack:** Astro content collections, remark-gfm, rehype-external-links, Tailwind 4, Alpine 3.

**Brief:** `docs/superpowers/audits/2026-05-28-phase3-content-brief.md`
**Verification reference:** prod `https://vpp.icjia.illinois.gov` (per-route, desktop 1280 + mobile 390, light + dark).
**Branch:** `feat/astro-migration` (no merge to main). Commit per task; no Co-Authored-By trailer.

---

## File map
- Copy: `astro/src/content/**` (from root `/content`, transformed copy)
- Create: `astro/src/content.config.ts`, `astro/src/data/planOrder.js`
- Modify: `astro/astro.config.ts` (markdown pipeline), `astro/src/styles/global.css` (`.markdown-body` + page-bg + data-ref/footnote CSS), `astro/package.json` (+remark-gfm, +rehype-external-links)
- Create: `astro/src/components/content/PageTitleSection.astro`, `ReportNavigation.astro`, `TextCenteredImage.astro`
- Create: `astro/src/pages/plan/[slug].astro`, `astro/src/pages/plan/index.astro` (redirect), `astro/src/pages/[...slug].astro`

---

## Task 1: Content copy + collections + markdown pipeline + content fixes

**Files:** copy content; create `content.config.ts`, `data/planOrder.js`; modify `astro.config.ts`, `package.json`.

- [ ] **Step 1** — Install deps: `cd astro && pnpm add remark-gfm rehype-external-links`.
- [ ] **Step 2** — Copy content (excluding nothing; home/sandbox handled by routing later):
```bash
cd /Volumes/satechi/webdev/icjia-vpp-2025
mkdir -p astro/src/content
cp -R content/* astro/src/content/
```
- [ ] **Step 3** — Fix the two content BUGS in the COPY only (`astro/src/content/...`; leave root `/content` untouched):
  - `astro/src/content/plan/public-health-approach.md` line ~74: add the missing `)` → `...(CDC, 2019)</span>`.
  - `astro/src/content/plan/references.md`: delete the top `<style scoped>...</style>` block (its rules go into `global.css` in Task 2) and strip every `{target="_blank" rel="noopener noreferrer"}` / `{target="\_blank" ...}` attribute suffix from links (keep the `[text](url)` link itself — `rehype-external-links` re-applies target/rel).
- [ ] **Step 4** — Convert the component-bearing file to MDX: rename `astro/src/content/plan/goals-and-recommendations.md` → `.mdx`. At the top add `import TextCenteredImage from '../../components/content/TextCenteredImage.astro';` (in the MDX frontmatter/ESM area) and replace each `::text-centered-image{src="..." alt="..." ...}` MDC block with `<TextCenteredImage src="..." alt="..." caption="..." />` using the same attribute values. (The component is built in Task 5; if not yet present, this file will error until Task 5 — sequence Task 5 before building, or stub the component now.)
- [ ] **Step 5** — Create `astro/src/data/planOrder.js`:
```js
// Order is authoritative from the legacy site.config.json ui.navigation.readThePlanMenu.
export const planOrder = [
  { slug: "front-cover", title: "Cover: Statewide Violence Plan for Illinois: 2025-2029" },
  { slug: "executive-summary", title: "Executive Summary" },
  { slug: "public-health-approach", title: "Violence Prevention from a Public Health Approach" },
  { slug: "guiding-principles", title: "Guiding Principles" },
  { slug: "planning-process", title: "Planning Process" },
  { slug: "goals-and-recommendations", title: "Goals and Recommendations" },
  { slug: "references", title: "References" },
];
```
- [ ] **Step 6** — Create `astro/src/content.config.ts`:
```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const base = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  lastModified: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  twitterCard: z.string().optional(),
  showTOC: z.boolean().optional(),
  showBorder: z.boolean().optional(),
  keywords: z.union([z.string(), z.array(z.string())]).optional(),
});

export const collections = {
  plan: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/plan" }), schema: base }),
  legal: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/legal" }), schema: base }),
  pages: defineCollection({ loader: glob({ pattern: "*.{md,mdx}", base: "./src/content" }), schema: base }),
};
```
- [ ] **Step 7** — Modify `astro/astro.config.ts` — add a `markdown` block (keep existing config):
```ts
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";
// inside defineConfig({...}):
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }]],
  },
```
- [ ] **Step 8** — Verify: `cd astro && pnpm astro sync` (collections typegen succeeds) then `pnpm build` (after Task 5's component exists, or temporarily stub). Confirm `astro sync` reports the 3 collections.
- [ ] **Step 9** — Commit: `git add astro/src/content astro/src/content.config.ts astro/src/data/planOrder.js astro/astro.config.ts astro/package.json astro/pnpm-lock.yaml && git commit -m "feat(astro): content collections + markdown pipeline + content fixes"`. (Note in the body: fixed a missing-paren typo + stripped Vue-only \`<style scoped>\`/\`{attr}\` from the Astro copy; root /content untouched.)

---

## Task 2: `.markdown-body` typography in global.css

**Files:** modify `astro/src/styles/global.css`. Source: brief "`.markdown-body` typography" + `app/assets/css/main.scss` (537-810, 1084-1523) + `[...slug].vue` deep styles.

- [ ] **Step 1** — Append a `.markdown-body` section to `global.css` reproducing (from the brief): heading sizes/weights + h2 bottom-border + the `h2 ~ *` left-indent system (2/1.5/1rem responsive) + `h1:first-of-type{display:none}`; p/ul/ol/li spacing; links (primary, underline, hover/focus, light `#0747a6`/`#0b3d91`); blockquote (primary left-border, light `#f1f3f4`/dark `#2d3748`); code (inline chip + `pre` blocks light `#f6f7f8`/dark `#0d1117`, full-bleed `≤768px`); images (rounded + shadow); `[data-ref]` citation markers (cursor-help, dotted underline, light `#00695c`/dark `#4db6ac`); `.footnotes` muted + `[data-footnote-ref]::before/after` brackets; `scroll-margin-top: 80px` on headings; the `.references-list` hanging-indent rules ported from references.md's old `<style scoped>`.
- [ ] **Step 2** — Add page-bg rules: a `.content-page` wrapper light `#fafafa`/dark surface, plan pages dark `#0d1117`, light body text `#000`.
- [ ] **Step 3** — Build check: `pnpm build` succeeds; the CSS compiles.
- [ ] **Step 4** — Commit: `git add astro/src/styles/global.css && git commit -m "style(astro): add .markdown-body content typography (light+dark)"`.

---

## Task 3: PageTitleSection.astro

**Files:** create `astro/src/components/content/PageTitleSection.astro`. Source: `PageTitleSection.vue` + brief.

- [ ] **Step 1** — Props `{ title: string; description?: string; showBorder?: boolean; date?: string; showDate?: boolean }`. `<section>` min-h-[25vh] flex centered, light `bg-[#eeeeee]` / `dark:bg-[#1b2530]`, optional `border-b border-on-surface/12`. `<h1>` Roboto 5rem/700 `tracking-[-0.03em] text-on-surface/95`, responsive via arbitrary breakpoints (`max-[960px]:text-[4rem] max-[768px]:text-[3rem] max-[600px]:text-[2.25rem]`). Optional description `text-lg text-on-surface/80 max-w-[800px] mx-auto`. Opacity fade-in with `motion-reduce:opacity-100` (a tiny scoped `<style>` or Tailwind `motion-safe:animate-*` is fine here).
- [ ] **Step 2** — `pnpm build` compiles.
- [ ] **Step 3** — Commit: `git add astro/src/components/content/PageTitleSection.astro && git commit -m "feat(astro): add PageTitleSection"`.

---

## Task 4: ReportNavigation.astro (prev/next + TOC)

**Files:** create `astro/src/components/content/ReportNavigation.astro`. Source: `ReportNavigation.vue` + `useReportNavigation.js` + brief.

- [ ] **Step 1** — Props `{ currentSlug: string; headings: {depth:number;slug:string;text:string}[]; showTOC?: boolean }`. Import `planOrder`. Compute prev/next by index in `planOrder` (no wrap; omit prev on first, next on last). Render prev/next as `<a href={'/plan/'+slug+'/'}>` cards with the page titles.
- [ ] **Step 2** — TOC (when `showTOC`): from `headings.filter(h=>h.depth===2)`, render a list (`md+` only, `hidden min-[960px]:block`) of `<a href={'#'+slug}>` items with the dot styling (active `#00e676`, inactive `#1976d2`). Add a small Alpine/`<script>` for active-section-on-scroll + smooth scroll with 80px offset (the headings already have `scroll-margin-top:80px` from Task 2, so native anchor jumps also land correctly).
- [ ] **Step 3** — `pnpm build` compiles.
- [ ] **Step 4** — Commit: `git add astro/src/components/content/ReportNavigation.astro && git commit -m "feat(astro): add ReportNavigation (prev/next + TOC)"`.

---

## Task 5: TextCenteredImage.astro

**Files:** create `astro/src/components/content/TextCenteredImage.astro`. Source: `TextCenteredImage.vue` + `content/plan/goals-and-recommendations.md` usage.

- [ ] **Step 1** — Props `{ src: string; alt: string; caption?: string; }` (read the legacy component for the exact prop names/defaults used in the two MDC calls). Render a centered `<figure>` with `<img>` (rounded + shadow per `.markdown-body img`) and optional `<figcaption>`. **Click-to-enlarge modal is DEFERRED to Phase 5** — render the image inline only (no modal) for now; leave a TODO note in the component.
- [ ] **Step 2** — `pnpm build` compiles AND `goals-and-recommendations.mdx` now builds (its import resolves).
- [ ] **Step 3** — Commit: `git add astro/src/components/content/TextCenteredImage.astro && git commit -m "feat(astro): add TextCenteredImage (inline; modal deferred to Phase 5)"`.

---

## Task 6: Page templates (plan + catch-all + redirect)

**Files:** create `astro/src/pages/plan/[slug].astro`, `astro/src/pages/plan/index.astro`, `astro/src/pages/[...slug].astro`. Source: brief "Page template".

- [ ] **Step 1** — `plan/[slug].astro`: `getStaticPaths` over `getCollection('plan')` (param = `entry.id` minus any `plan/` prefix). Render `<BaseLayout title description>` → `<PageTitleSection title description showBorder>` → `<div class="content-page"><div class="markdown-body"><Content/></div></div>` (from `await render(entry)`, Astro 6: `import { render } from 'astro:content'`) → `<ReportNavigation currentSlug={slug} headings={headings} showTOC={entry.data.showTOC}>`.
- [ ] **Step 2** — `plan/index.astro`: `---\nreturn Astro.redirect('/plan/front-cover/', 301);\n---`.
- [ ] **Step 3** — `[...slug].astro`: `getStaticPaths` over `getCollection('pages')` + `getCollection('legal')` (legal entries map to `/legal/<slug>/`). EXCLUDE `index` (home, Phase 4) and `sandbox`. EXCLUDE `contact` for now (has FeedbackForm — Phase 5) OR render it without the form (decide: skip in this phase to avoid the stub). Render `PageTitleSection` + `.markdown-body` `<Content/>` (no ReportNavigation for non-plan pages).
- [ ] **Step 4** — Build: `cd astro && pnpm build`. Confirm all Phase-3 routes emit (`dist/plan/executive-summary/index.html`, `dist/resources/index.html`, `dist/legal/privacy-policy/index.html`, etc.) and `dist/plan/index.html` is the redirect.
- [ ] **Step 5** — Commit: `git add astro/src/pages && git commit -m "feat(astro): plan + content page templates + /plan redirect"`.

---

## Task 7: Per-route verification gate

No code — controller-run (MCP tools).

- [ ] **Step 1** — Serve (`pnpm preview --port 4321`).
- [ ] **Step 2** — For each Phase-3 route: viewcap at desktop 1280 + mobile 390, light + dark, and screenshot-diff vs the same route on prod `https://vpp.icjia.illinois.gov`. Confirm: PageTitleSection (5rem title, bg), markdown typography (headings/indent/blockquote/code/links), `[data-ref]` citation styling, TOC sidebar (plan pages w/ showTOC), prev/next nav order, the `goals-and-recommendations` inline images.
- [ ] **Step 3** — lightcap `run_a11y` + `run_audit` (mobile) per route → **A11y 100**; record perf/BP/SEO (perf deferred to Phase 7).
- [ ] **Step 4** — Verify interactions (Chrome DevTools MCP): TOC active-section-on-scroll + smooth scroll; external links open `_blank`; the `/plan` → `/plan/front-cover/` redirect.
- [ ] **Step 5** — Stop preview; push; verify the branch deploy renders the content routes.

---

## Phase 3 Done-Gate
- [ ] All 7 plan pages + resources/org-highlights/download/legal render, pixel-matched vs prod (desktop+mobile, light+dark).
- [ ] Markdown typography matches (headings, indent system, blockquote, code, links, images, `[data-ref]` citations).
- [ ] ReportNavigation prev/next in correct order; TOC (depth-2) on `showTOC` pages with active-section behavior.
- [ ] `/plan` redirects to `/plan/front-cover/`; external links `_blank`.
- [ ] lightcap A11y 100 per route; no Vue/Vuetify; build + deploy green.
- [ ] Root `/content` untouched (Nuxt reference still builds).

When complete, write the Phase 4 (Home) plan.
