# Astro Migration — Phase 2 (Chrome) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Implementers must read both the cited legacy source files AND `docs/superpowers/audits/2026-05-28-phase2-chrome-brief.md`, then verify via screenshot-diff vs prod.

**Goal:** Replace the Phase 1 chrome placeholders with the real, pixel-matched header, footer, mobile drawer, theme toggle, and scroll-to-top — native HTML + Tailwind utilities + Alpine islands, no Vue/Vuetify.

**Architecture:** Chrome components own the landmarks (`Header.astro` = the single `<header role="banner">` with `<nav id="site-navigation">`; `Footer.astro` = single `<footer role="contentinfo">`). Menu data is hardcoded in `src/data/nav.js` (no runtime config read). Interactivity is Alpine: dropdowns (one-open-at-a-time, hover+click+150ms debounce), right-side mobile off-canvas drawer (280px), and the theme toggle (sessionStorage, default dark). Breakpoints use Vuetify's exact px values via Tailwind arbitrary variants (`min-[960px]:`) for pixel-parity.

**Tech Stack:** Astro 6, Tailwind 4, Alpine 3, astro-icon (mdi).

**Brief (read first):** `docs/superpowers/audits/2026-05-28-phase2-chrome-brief.md`
**Spec:** `docs/superpowers/specs/2026-05-28-nuxt-to-astro-migration-design.md`
**Verification reference:** prod `https://vpp.icjia.illinois.gov` (and/or local Nuxt build) — compare chrome at desktop 1280px + mobile 390px, light + dark.
**Branch:** `feat/astro-migration` (no merge to main). Commit per task; no Co-Authored-By trailer.

---

## File map

- Create `astro/public/images/illinois-seal.webp`, `astro/public/images/icjia-logo.webp`, `astro/public/favicon.png` (copied from root `public/`)
- Create `astro/src/data/nav.js` — branding text variants, `readThePlan[]`, `more[]` (with divider), footer links
- Create `astro/src/components/chrome/ThemeToggle.astro`
- Create `astro/src/components/chrome/ScrollToTop.astro`
- Create `astro/src/components/chrome/Footer.astro` (replaces `FooterPlaceholder.astro`)
- Create `astro/src/components/chrome/Header.astro` (replaces `HeaderPlaceholder.astro`; includes the mobile drawer markup + Alpine)
- Modify `astro/src/layouts/BaseLayout.astro` — import the real Header/Footer + ScrollToTop; remove the placeholders
- Delete `astro/src/components/chrome/HeaderPlaceholder.astro` + `FooterPlaceholder.astro` once unreferenced

---

## Task 1: Chrome assets + nav data

**Files:** copy 3 assets into `astro/public/`; create `astro/src/data/nav.js`.

- [ ] **Step 1** — Copy assets:
```bash
cd /Volumes/satechi/webdev/icjia-vpp-2025
mkdir -p astro/public/images
cp public/images/illinois-seal.webp astro/public/images/
cp public/images/icjia-logo.webp astro/public/images/
cp public/favicon.png astro/public/
```
If any source file is missing, check `public/images/` for the actual filename/extension and report.

- [ ] **Step 2** — Create `astro/src/data/nav.js` exporting (use the exact labels/hrefs/icons from the brief's "Dynamic dropdown data" + "Branding text variants"):
```js
export const branding = {
  full: "Statewide Violence Prevention Plan for Illinois: 2025-2029",
  md:   "Statewide Violence Prevention Plan for Illinois: 2025-2029",
  sm:   "Statewide Violence Prevention Plan: 2025-2029",
  xs:   "Statewide Violence Prevention",
  href: "/",
  seal: "/images/illinois-seal.webp",
};
export const readThePlan = [
  { text: "Cover: Statewide Violence Plan for Illinois: 2025-2029", to: "/plan/front-cover" },
  { text: "Executive Summary", to: "/plan/executive-summary" },
  { text: "Violence Prevention from a Public Health Approach", to: "/plan/public-health-approach" },
  { text: "Guiding Principles", to: "/plan/guiding-principles" },
  { text: "Planning Process", to: "/plan/planning-process" },
  { text: "Goals and Recommendations", to: "/plan/goals-and-recommendations" },
  { text: "References", to: "/plan/references" },
];
export const more = [
  { text: "Resources", to: "/resources", icon: "mdi:book-open-variant" },
  { text: "Organizational and Agency Highlights", to: "/organizational-and-agency-highlights", icon: "mdi:trophy" },
  { divider: true },
  { text: "Search", to: "/search", icon: "mdi:magnify" },
  { text: "Contact", to: "/contact", icon: "mdi:email-outline" },
];
export const footerLinks = [
  { text: "Privacy", href: "/legal/privacy-policy/" },
  { text: "Documentation", href: "/docs/" },
  { text: "Accessibility", href: "/docs/accessibility/" },
];
```

- [ ] **Step 3** — Verify assets are served & data imports: `cd astro && pnpm build` succeeds; `ls astro/public/images/illinois-seal.webp astro/public/images/icjia-logo.webp astro/public/favicon.png`.

- [ ] **Step 4** — Commit: `git add astro/public astro/src/data/nav.js && git commit -m "feat(astro): add chrome assets + static nav data"`

---

## Task 2: ThemeToggle.astro

**Files:** Create `astro/src/components/chrome/ThemeToggle.astro`. Read `app/components/content/ThemeSwitch.vue` + brief "ThemeSwitch" + "ThemeToggle → Alpine".

- [ ] **Step 1** — Build a pill toggle: wrapper `rounded-[1.5rem]` with `bg-on-surface/5` (approx surface-variant/10), `inline-flex items-center gap-2 px-2 py-1`. Inside: sun/moon `<Icon>` (`mdi:weather-night` shown in dark, `mdi:white-balance-sunny` in light), a CSS pill switch track (2rem×1rem) with a thumb (0.75rem), and a "Dark"/"Light" label (`text-sm font-medium`, hidden `max-[480px]:hidden`). Use `<button role="switch" :aria-checked="dark.toString()" aria-label="Toggle dark mode">`.
- [ ] **Step 2** — Alpine: `x-data="{ dark: document.documentElement.classList.contains('dark') }"`. On click: `dark = !dark; document.documentElement.classList.toggle('dark', dark); document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light'); sessionStorage.setItem('theme', dark ? 'dark' : 'light')`. Drive icon/label/aria off `dark`. Include an `aria-live="polite"` `sr-only` span announcing "Switched to dark/light mode". (Key `'theme'` MUST match BaseLayout's no-flash script.)
- [ ] **Step 3** — Verify in isolation later (it's wired in Task 7). For now: `pnpm build` succeeds and the component compiles. Confirm no `localStorage` is used (session-only).
- [ ] **Step 4** — Commit: `git add astro/src/components/chrome/ThemeToggle.astro && git commit -m "feat(astro): add Alpine theme toggle (session-only, sun/moon)"`

---

## Task 3: ScrollToTop.astro

**Files:** Create `astro/src/components/chrome/ScrollToTop.astro`. Read `app/components/ui/ScrollToTop.vue` + brief "ScrollToTop".

- [ ] **Step 1** — A fixed, ALWAYS-visible FAB: `<button class="fixed bottom-5 right-5 max-[600px]:bottom-4 max-[600px]:right-4 z-[1000] rounded-full bg-primary p-3 shadow-lg ...">` with `<Icon name="mdi:chevron-up" />`, `aria-label="Scroll to top of page"`, min 48px (44px ≤600px). Hover `-translate-y-0.5` + stronger shadow; focus `outline-2 outline-primary`. Add `motion-reduce:transition-none`.
- [ ] **Step 2** — On click (and Enter/Space): `window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })`. Inline `onclick` (no Alpine needed); `@keydown.space.prevent` semantics via `type="button"`.
- [ ] **Step 3** — `pnpm build` succeeds; component compiles.
- [ ] **Step 4** — Commit: `git add astro/src/components/chrome/ScrollToTop.astro && git commit -m "feat(astro): add always-visible scroll-to-top FAB"`

---

## Task 4: Footer.astro

**Files:** Create `astro/src/components/chrome/Footer.astro`. Read `app/components/content/AppFooter.vue` + brief "Footer". Import `footerLinks`, `branding` from `nav.js`.

- [ ] **Step 1** — `<footer role="contentinfo">` (single contentinfo). Light bg `bg-[#d1d5db]` / dark `dark:bg-background`; padding `py-12` (mobile `py-8`); inner `max-w-[1200px] mx-auto px-6`. Center column: ICJIA logo (`/images/icjia-logo.webp` h-[100px], hidden `max-[959px]:hidden`, links to `https://icjia.illinois.gov` `target=_blank rel="noopener noreferrer"`), brand link (responsive text per brief), description paragraph (max-w-[700px], `text-on-background/90`, with inline ICJIA link).
- [ ] **Step 2** — Bottom row: `border-t border-on-background/10 pt-6 text-center`; flex-wrap row of `© {currentYear} [ICJIA link]`, then `footerLinks` with `|` pipe separators (`max-[959px]:hidden` on pipes); column layout `max-[480px]:flex-col`. Documentation/Accessibility are plain `<a href>` (static `/docs/` files). Compute year with `new Date().getFullYear()` in frontmatter.
- [ ] **Step 3** — Use Tailwind utilities for all layout (flex/grid). `pnpm build` succeeds.
- [ ] **Step 4** — Commit: `git add astro/src/components/chrome/Footer.astro && git commit -m "feat(astro): add real footer (ICJIA logo, links, responsive branding)"`

---

## Task 5: Header.astro (desktop nav + dropdowns) — the centerpiece

**Files:** Create `astro/src/components/chrome/Header.astro`. Read `app/components/content/AppHeader.vue` + brief "AppHeader" + "Breakpoints" + "Interactions → Alpine". Import `branding`, `readThePlan`, `more` from `nav.js`; import `ThemeToggle`.

- [ ] **Step 1** — `<header role="banner" class="sticky top-0 z-50 bg-app-bar text-on-app-bar border-b border-on-surface/10 backdrop-blur-[10px]">`. Inner container `max-w-[1600px] mx-auto h-16 flex items-center px-4 min-[600px]:px-6 min-[960px]:px-8`.
- [ ] **Step 2** — Branding: home link with seal `<img width=40 height=40>` (40px ≥960, 32px below) + 4 responsive text spans using arbitrary breakpoints: `max-[599px]:` xs, `min-[600px]:max-[1279px]:` sm, `min-[1280px]:max-[1919px]:` md, `min-[1920px]:` full. `text-primary` bold; sizes 1.25rem (md/full) vs 1rem (sm/xs). Logo hover `scale-105`.
- [ ] **Step 3** — Desktop `<nav id="site-navigation" aria-label="Main Navigation" class="hidden min-[960px]:flex items-center ml-auto">`. Scope Alpine for one-open-at-a-time: `x-data="{ open: null, timer: null, show(k){clearTimeout(this.timer); this.open=k}, hide(){this.timer=setTimeout(()=>this.open=null,150)} }"`.
- [ ] **Step 4** — "Read the Plan" dropdown: a `<button aria-haspopup="true" :aria-expanded="(open==='plan').toString()" @mouseenter="show('plan')" @click="open = open==='plan'?null:'plan'" @keydown.escape="open=null">Read the Plan <Icon mdi:chevron-down/></button>` and a panel `<div x-show="open==='plan'" @mouseenter="show('plan')" @mouseleave="hide()" @click.outside="open=null" class="absolute ... shadow-lg rounded min-w-[200px] w-max overflow-hidden bg-surface">` listing `readThePlan` items as `<a>` with `border-l-[3px] border-transparent pl-4 min-h-[44px] hover:bg-primary/10 hover:border-l-primary`. Mark `aria-current="page"` when `Astro.url.pathname` matches.
- [ ] **Step 5** — Download pill `<a href="/download/" class="hidden min-[960px]:inline-flex rounded-full font-bold px-4 py-2 ml-4 bg-white text-[#0747a6] border border-black/5 shadow-md hover:bg-[#f8f8f8] hover:text-[#053285] hover:-translate-y-px dark:bg-[#2a3441] dark:text-[#93c5fd] dark:border-white/5 dark:hover:bg-[#334155] dark:hover:text-[#bfdbfe]">Download</a>`.
- [ ] **Step 6** — "More" dropdown: same Alpine pattern keyed `'more'`; items render `<Icon>` + text; the `{divider:true}` entry → `<hr class="my-2 opacity-30">`.
- [ ] **Step 7** — Nav text-link hover underline: add a shared class with `after:` pseudo (2px primary, expands center→60% on hover/focus). `<ThemeToggle class="ml-8" />` at the end of the nav.
- [ ] **Step 8** — Hamburger button (visible `<960px`): `<button id="mobile-menu-trigger" class="min-[960px]:hidden ..." aria-label="Toggle navigation menu" :aria-expanded="drawer.toString()" aria-controls="mobile-drawer" @click="drawer=!drawer"><Icon :name="drawer?'mdi:close':'mdi:menu'"/></button>` — `drawer` comes from the header-root Alpine scope added in Task 6.
- [ ] **Step 9** — `pnpm build` succeeds; component compiles.
- [ ] **Step 10** — Commit: `git add astro/src/components/chrome/Header.astro && git commit -m "feat(astro): add header — branding, desktop nav, dropdowns, download, theme toggle"`

---

## Task 6: Mobile drawer (off-canvas)

**Files:** Modify `astro/src/components/chrome/Header.astro` to add the drawer markup + header-root Alpine scope. Read `app/components/content/AppSidebar.vue` + brief "Mobile drawer".

- [ ] **Step 1** — Wrap the header root in `x-data="{ drawer: false }"` so the hamburger (Task 5 Step 8) and drawer share state.
- [ ] **Step 2** — Add a right-side off-canvas: a backdrop `<div x-show="drawer" x-transition.opacity @click="drawer=false" class="fixed inset-0 z-[9998] bg-black/40 min-[960px]:hidden">` and a panel `<div id="mobile-drawer" x-show="drawer" x-transition:enter... class="fixed inset-y-0 right-0 z-[9999] w-[280px] bg-white dark:bg-surface overflow-y-auto" @keydown.escape.window="drawer=false">`.
- [ ] **Step 3** — Panel contents (per brief): `<ThemeToggle>` centered at top (`mb-4`); a "READ THE PLAN" heading (`border-l-4 border-primary text-primary uppercase pointer-events-none` `role="heading" aria-level="2"`) + `readThePlan` items (`border-l-2 border-primary/20 ml-4 pl-8 min-h-[44px] hover:bg-primary/10`, middle-truncate at 35 chars); a "MORE" heading + `more` items (skip the divider) with `<Icon>` + middle-truncate at 30 chars. Each item closes the drawer on click (`@click="drawer=false"`). Implement `truncateMiddle(s, n)` as a small JS helper in frontmatter.
- [ ] **Step 4** — `pnpm build` succeeds.
- [ ] **Step 5** — Commit: `git add astro/src/components/chrome/Header.astro && git commit -m "feat(astro): add right-side mobile drawer (Alpine off-canvas)"`

---

## Task 7: Wire into BaseLayout + full chrome verification gate

**Files:** Modify `astro/src/layouts/BaseLayout.astro`; delete the two placeholder files.

- [ ] **Step 1** — In `BaseLayout.astro`: replace the `HeaderPlaceholder`/`FooterPlaceholder` imports + usages with `Header`/`Footer`; add `import ScrollToTop` and render `<ScrollToTop />` before `</body>`. Keep the body's `flex min-h-dvh flex-col` and `main.flex-1` (sticky footer). Ensure `#main-content` (in main) and `#site-navigation` (in Header nav) both exist for the skip links.
- [ ] **Step 2** — Delete `HeaderPlaceholder.astro` + `FooterPlaceholder.astro`; grep to confirm no remaining references.
- [ ] **Step 3** — `cd astro && pnpm build` succeeds; the smoke `index.astro` still builds (it just gains real chrome).
- [ ] **Step 4 (GATE)** — Serve (`pnpm preview --port 4321`) and verify with the MCP tools (controller-run):
  - viewcap the header + footer at **desktop 1280 + mobile 390, light + dark**, and screenshot-diff against prod `https://vpp.icjia.illinois.gov` (header at top; footer via fullPage). Confirm: branding text matches at each breakpoint, download pill styling, nav underline hover, dropdown open/contents, mobile hamburger→drawer (280px right), theme toggle flips dark/light + persists in session, scroll-to-top FAB present, sticky footer.
  - lightcap `run_a11y` + `run_audit` (mobile) on `/` → **A11y 100**; confirm exactly one banner/main/contentinfo (no duplicate landmarks), and the favicon 404 is gone (asset migrated in Task 1).
- [ ] **Step 5** — Commit: `git add -A astro/src && git commit -m "feat(astro): wire real chrome into BaseLayout; remove placeholders"`; push; verify the branch deploy renders the chrome.

---

## Phase 2 Done-Gate
- [ ] Header/footer/drawer/theme-toggle/scroll-to-top render and behave identically to prod at desktop + mobile, light + dark (screenshot-diff).
- [ ] Dropdowns: hover+click, one-open-at-a-time, 150ms close, ESC/outside-click close, keyboard reachable.
- [ ] Mobile drawer: right-side 280px, opens/closes, links navigate + close it.
- [ ] Theme toggle persists within session, defaults dark, no-flash; `data-theme` + `.dark` both flip.
- [ ] lightcap A11y 100; exactly one banner/main/contentinfo; favicon 404 resolved.
- [ ] No Vue/Vuetify; build + branch deploy green.

When complete, write the Phase 3 (Content pipeline) plan.
