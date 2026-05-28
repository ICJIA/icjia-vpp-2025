# Phase 3 Content-Pipeline Port Brief (Nuxt Content → Astro collections)

> Research for porting the local-markdown content pipeline. Implementers read this + the cited source, verify via screenshot-diff vs prod + lightcap 100. Interactive pop-up references/footnote tooltips are Phase 5; the markdown RENDERING (incl. citation/footnote markup + styling) is Phase 3.

## Content collections (`astro/src/content.config.ts`)
Local glob loader on `../../content` (root `/content`). Collections: `plan` (`plan/**/*.{md,mdx}`), `pages` (top-level `*.{md,mdx}`), `legal` (`legal/**/*.{md,mdx}`). **Permissive Zod** — fields actually used: `title, description, date, lastModified, ogTitle, ogDescription, ogImage, twitterCard, showTOC(bool), showBorder(bool, contact only), keywords(string|string[])`. **No `order` field** — plan order comes from `config/site.config.json` → `ui.navigation.readThePlanMenu` (hardcode as `astro/src/data/planOrder.js`, the 7 routes in order: front-cover, executive-summary, public-health-approach, guiding-principles, planning-process, goals-and-recommendations, references).

## Markdown pipeline (`astro.config.ts` `markdown:`)
- `syntaxHighlight: false` (matches Nuxt `highlight:false` → plain `<pre><code>`).
- `remarkPlugins: [remarkGfm]` (tables/strikethrough/task-lists/GFM footnotes if ever used — current content has NO `[^1]` footnotes).
- `rehypePlugins: [[rehypeExternalLinks, { target:'_blank', rel:['noopener','noreferrer'] }]]`.
- Heading IDs: Astro applies `rehype-slug` by default → IDs present (TOC needs them). Nuxt's `anchorLinks:false` only suppressed the visible anchor icon → do NOT add `rehype-autolink-headings`.
- **Strip `{target="_blank" rel="noopener noreferrer"}` remark-attr syntax** from `references.md` links (Astro renders it as literal text) — `rehype-external-links` applies target/rel automatically instead.
- Install: `remark-gfm`, `rehype-external-links`.

## Page templates
- `astro/src/pages/plan/[slug].astro` (getStaticPaths over `plan` collection; `entry.id.replace('plan/','')` → slug) and `astro/src/pages/[...slug].astro` for the rest.
- `astro/src/pages/plan/index.astro` → `return Astro.redirect('/plan/front-cover/', 301)` (trailingSlash:'always').
- Template: `<BaseLayout title description>` → `<PageTitleSection>` → `.markdown-body` wrapping `<Content />` (from `entry.render()`) → `<ReportNavigation>` (plan pages). Hide the first `<h1>` in body (it duplicates the title) via `.markdown-body h1:first-of-type{display:none}`.
- **DEAD heuristics — DO NOT PORT** (`[...slug].vue:405-429`): the `needsStandardHeader` string-checks for `"::"`, `"about-hero"`, `"hero-section"`, `"feature-section"`. Each Astro page is explicit. `ContentDisplay.vue`/`SimpleContentDisplay.vue` are unused — skip. `useContentFetcher`/`content-links.client.ts` not needed in SSG.

## Route inventory (Phase 3)
`/plan/{front-cover,executive-summary,public-health-approach,guiding-principles,planning-process,goals-and-recommendations,references}`, `/resources`, `/organizational-and-agency-highlights`, `/download`, `/legal/privacy-policy`, `/plan`(redirect). **`/contact` has `::FeedbackForm`** → stub/skip until Phase 5. `/` + `/sandbox` excluded. `goals-and-recommendations` → **`.mdx`** (2× `::text-centered-image`).

## ReportNavigation
Prev/next linear over `planOrder` (no wrap; no prev on first, no next on last). TOC sidebar from `entry.render().headings` filtered `depth===2`, only when `showTOC:true`, `md+` only. TOC interactivity (active-section highlight on scroll, smooth-scroll w/ 80px navbar offset) → small Alpine/`<script>` island. Styling: TOC list `border-l-2 border-on-surface/20`, item min-h 44px `pl-10`; active dot `#00e676` scale 1.3 + glow, inactive dot `#1976d2` 12px; active link `text-primary font-bold`.

## PageTitleSection
`<section>` min-h 25vh, centered flex; light bg `#eeeeee` / dark `#1b2530`; optional `border-bottom on-surface/12` (showBorder). `<h1>` 5rem/700 Roboto, letter-spacing -0.03em, `text-on-surface/95`; responsive 4rem(≤960)/3rem(≤768)/2.25rem(≤600); opacity fade-in (motion-reduce off). Optional description 1.125rem `on-surface/80` max-w 800px.

## `.markdown-body` typography (add to `global.css` — the ONE place custom CSS is expected)
Headings: h1 1.8rem/600 (first-of-type display:none); h2 1.5rem/600, `border-bottom on-surface/20`, pb .75 mb 2rem; h3 1.25rem/600. **Indent system:** `.markdown-body h2 ~ * { margin-left:2rem }` (1.5rem ≤768, 1rem ≤480), `h2 ~ h2 { margin-left:0 }`. p mb1 lh1.6; ul/ol pl1.5 mb1; li mb.5. Links `text-primary underline`, hover no-underline, focus outline; light override link `#0747a6`/hover `#0b3d91`. Blockquote `border-l-4 border-primary` italic 600, light bg `#f1f3f4`/dark `#2d3748`. Code: pre `rounded p-4`, light `#f6f7f8`/`#24292f`, dark `#0d1117`/`#fff`; inline code padded chip; `≤768px pre { margin:1rem -1rem; border-radius:0 }`. img `max-w-full mx-auto rounded shadow`. **`[data-ref]` citations** (visual now, interactive Phase 5): `cursor-help font-600 underline dotted border-b-dotted`; light `#00695c`/dark `#4db6ac`. Footnotes: `.footnotes` small muted; add `scroll-margin-top: 80px` to headings (replaces footnotes.client.js scroll offset). Page bg: `.dynamic-content-page` light `#fafafa`/dark surface; plan pages dark `#0d1117`; light text `#000`.

## Plugins → drop
`content-links.client.ts` (SPA `/docs/` interceptor — unneeded in SSG). `footnotes.client.js` (styles standard footnotes that never appear + scroll offset → replace with CSS + `scroll-margin-top`).

## Content bugs to fix during the port
1. `content/plan/public-health-approach.md:74` — `<span data-ref="centers-2019">(CDC, 2019</span>` missing `)` before `</span>`.
2. `content/plan/references.md` — strip the top `<style scoped>` block (port rules to `.markdown-body .references-list`) and the `{target=...}` link-attr syntax.

## Gotchas
`<style scoped>` in md → renders as global `<style>` (strip it). `{attr}` → literal text (strip). `goals-and-recommendations` must be `.mdx` + a `TextCenteredImage.astro` (Alpine click-to-enlarge modal — that modal is Phase 5; render the image inline now). `front-cover` likely no TOC. All internal links + redirects use trailing slash.

## Source refs
`content.config.ts`, `nuxt.config.ts` (76-96, 303-356), `app/pages/[...slug].vue` (405-429, 442-575, 1398-1703), `PageTitleSection.vue`, `ReportNavigation.vue`, `useReportNavigation.js`, `app/assets/css/main.scss` (537-810, 1084-1523), `config/site.config.json`.
