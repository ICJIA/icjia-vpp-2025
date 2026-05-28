# Phase 5 Interactivity Port Brief (Nuxt/Vuetify → Astro/Tailwind/Alpine)

> Research for porting interactive subsystems. Implementers read this + cited source, verify via screenshot-diff + interaction tests (Chrome DevTools MCP). Match prod exactly.

## Scope clarifications (match prod)
- **Footnotes:** content has NO `[^1]` footnotes — the `[data-ref]` citations ARE the system. Footnotes plugin = SKIP (do not port).
- **Contact FeedbackForm:** `content/contact.md` has `::FeedbackForm` inside an HTML comment → DISABLED on prod. Contact = STATIC page (address/phone/email). Do NOT build the form (note: if re-enabled later, build an Alpine stub). Just un-exclude `contact` from `[...slug].astro`'s exclusion set — the commented MDC is ignored in markdown.
- **News:** `content/news/` is EMPTY (no articles) and News is `enabled:false` in the chrome (not linked). Build a minimal `/news` listing that shows the empty state + a `news` collection (for future). No `[slug]` article pages needed (no content). Don't add a nav link (matches prod).
- **AccessibleTooltip / TextWrapImage:** TextWrapImage not used in content → skip. Footer ICJIA tooltip → native `title` attr (low priority).
- **Search `?q=`:** current /search does NOT read `?q=`; match that (skip ?q= for exact parity).

## 1. References / citation popups — CRITICAL (must-preserve)
- **Data:** `scripts/generate-references.js` → `public/data/references.json`. Shape: `{ references: { "<key>": { id, authors[], year, title, url, type, shortCitation, fullCitation } } }` (19 entries). **PATH BUG to fix:** the script reads `content/references.md` but the file is `content/plan/references.md` — fix the path for the Astro copy; output to `astro/public/data/references.json`.
- **Markup:** inline `<span data-ref="key">(Short, 2021)</span>`; multiple keys comma-separated (`data-ref="a,b"`). Already styled (dotted underline, teal) in global.css from Phase 3. 8 spans live in astro plan content.
- **Behavior (port `app/plugins/references.client.js` — it's framework-agnostic DOM, no Vue):** on load, `querySelectorAll('[data-ref]')`, fetch `/data/references.json` once (module cache), build a `<div role="tooltip">` per span (append to the span's parent), position absolute above (flip below if no room). Triggers: mouseenter(50ms)/mouseleave, focus/blur, touchstart(show + 4s auto-hide), keydown Enter/Space show + Escape hide. Tooltip styling: light `rgba(33,33,33,0.95)`/dark `rgba(30,40,60,0.98)`, white text, `rounded`, `max-w-[400px]`, fade-in opacity+translateY, z-9999. **A11y FIX to add:** set `aria-describedby` on the trigger → tooltip id when shown (current impl omits it); span gets `cursor:help` + `tabindex="0"`.
- **Astro port:** extract the core fns (`enhanceReferenceElements`, `createTooltip`, fetch/cache) into `astro/src/scripts/references.js` (plain ES module, `export function initReferences()`); load in `BaseLayout.astro` (`<script>` calling it on `DOMContentLoaded`). Multi-key spans: concatenate the fullCitations.
- **Verify:** Chrome DevTools MCP on a plan page — hover/focus a `[data-ref]`, confirm the tooltip shows the full citation; Escape hides; keyboard reachable.

## 2. Search (Fuse.js)
- **Index:** `scripts/generate-search-index-defuddle.js` → `public/data/search-index.json`. Two passes (markdown + SSG-HTML). **For Phase 5 use the MARKDOWN-ONLY pass** (skip the dist/-HTML pass to avoid the build chicken-egg; markdown covers all content). Output `astro/public/data/search-index.json` + copy `config/fuse.config.json` → `astro/public/config/fuse.config.json`. News is blacklisted from the index (keep).
- **Index item shape:** `{ title, content, path, fullPath, description, frontmatter, type, sourceFile, wordCount }`.
- **Fuse opts (config/fuse.config.json):** keys title(1.0)/content(1.0)/description(0.6), threshold 0.8, distance 1000, ignoreLocation true, includeMatches/includeScore true, minMatchCharLength 3; UI: debounceMs 300, minTermLength 2, excerptContextChars 50.
- **Page:** `astro/src/pages/search.astro` — Alpine `x-data` lazy-init (on input focus: `import('fuse.js')` + fetch index+config), 300ms debounce, 5 UI states (idle "Ready to Search" / initializing spinner / no-query / no-results / results). Results: title + path (mdi:link-variant) + excerpt with `<mark>` highlight (bg `#ffeb3b` color `#000`) + "View content →". A11y: `role=status aria-live=polite` on state divs, results `role=region aria-label="Search results"`, live result count, input `aria-label="Search content"` autofocus. Port the highlight/excerpt logic from `app/utils/sanitize.js`.
- **Add `fuse.js`** to astro/package.json. Read `app/pages/search.vue` for the exact UI/states.

## 3. News (minimal)
- Add `news` collection to `content.config.ts` (glob `./src/content/news`; schema title/summary/date/image/passthrough).
- `astro/src/pages/news/index.astro` — `getCollection('news')` sorted date DESC, single-col grid, NewsCard per item; **empty state** ("No News Available") when none (current case). NewsCard = static Astro (horizontal card: 200px image left / date chip+title+summary+"Read More" right; stacks <768px; image fallback `/images/illinois-seal.webp`). Read `app/pages/news.vue` + `NewsCard.vue`. No nav link.

## 4. Contact (static)
- Remove `contact` from the `EXCLUDED_PAGE_IDS` in `astro/src/pages/[...slug].astro` so `content/contact.md` renders via the catch-all (static info; the commented `::FeedbackForm` is ignored). Confirm it renders address/phone/email.

## 5. TextCenteredImage modal (deferred from Phase 3)
- Update `astro/src/components/content/TextCenteredImage.astro`: add click-to-enlarge. Use a **native `<dialog>`** (free focus-trap + Escape) toggled by Alpine (`$refs.dlg.showModal()` / `.close()`), or an Alpine overlay. Image gets `cursor-pointer role="button" tabindex="0"` + "Click image to enlarge" hint; modal shows full image `max-h-[75vh] object-contain` + caption + close button. Backdrop click + Escape close. Read `app/components/content/TextCenteredImage.vue` (Vuetify v-dialog `width=95vw`).

## Build scripts → astro/scripts/ + package.json
- Copy `generate-references.js` (fix content path → `content/plan/references.md`; output `astro/public/data/references.json`).
- Copy `generate-search-index-defuddle.js` (markdown-only pass; output `astro/public/data/search-index.json` + fuse config copy).
- `astro/package.json`: add `fuse.js` (+ defuddle/jsdom/gray-matter etc. as the index script needs — check its imports); `"prebuild": "node scripts/generate-references.js && node scripts/generate-search-index-defuddle.js"`, keep `"build": "astro build"`. (Netlify runs `pnpm build` → prebuild runs first.)

## Task breakdown
5.1 build scripts + data (references.json + search-index.json + fuse.config + deps + prebuild) →
5.2 references popups (script + BaseLayout wiring + a11y) [needs 5.1 data] →
5.3 search page [needs 5.1] →
5.4 news listing + collection →
5.5 contact (un-exclude) →
5.6 TextCenteredImage modal →
5.7 gate (interaction tests + screenshot-diff + lightcap).

## Source refs
`config/fuse.config.json`, `scripts/generate-{references,search-index-defuddle}.js`, `app/pages/{search,news}.vue`, `app/components/content/{SearchInterface,NewsCard,FeedbackForm,TextCenteredImage,ReferenceTooltip,AccessibleTooltip}.vue`, `app/plugins/references.client.js`, `app/composables/useReferences.js`, `app/utils/sanitize.js`, `content/contact.md`, `content/plan/references.md`.
