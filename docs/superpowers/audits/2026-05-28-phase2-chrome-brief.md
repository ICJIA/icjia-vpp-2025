# Phase 2 Chrome Port Brief (Nuxt/Vuetify → Astro/Tailwind/Alpine)

> Research extracted from the legacy chrome components to drive the Phase 2 plan. Implementers should read this AND the cited source files, then verify via screenshot-diff vs prod (`https://vpp.icjia.illinois.gov`).

## Dynamic dropdown data (hardcode as static arrays in `astro/src/data/nav.js`)

Source: `AppHeader.vue` computed props read `site.config.json` → `ui.navigation.readThePlanMenu` / `ui.navigation.moreMenu`. No API. Hardcode:

**"Read the Plan" dropdown** (internal links, no icons):
1. `Cover: Statewide Violence Plan for Illinois: 2025-2029` → `/plan/front-cover`
2. `Executive Summary` → `/plan/executive-summary`
3. `Violence Prevention from a Public Health Approach` → `/plan/public-health-approach`
4. `Guiding Principles` → `/plan/guiding-principles`
5. `Planning Process` → `/plan/planning-process`
6. `Goals and Recommendations` → `/plan/goals-and-recommendations`
7. `References` → `/plan/references`

**"More" dropdown:**
- `Resources` → `/resources` (`mdi:book-open-variant`)
- `Organizational and Agency Highlights` → `/organizational-and-agency-highlights` (`mdi:trophy`)
- `--- divider ---` (desktop only; skipped in mobile drawer)
- `Search` → `/search` (`mdi:magnify`)
- `Contact` → `/contact` (`mdi:email-outline`)
- (News & Translate are `enabled:false` → never render)

**Branding text variants:** full="Statewide Violence Prevention Plan for Illinois: 2025-2029"; md=same; sm="Statewide Violence Prevention Plan: 2025-2029"; xs="Statewide Violence Prevention".

## Breakpoints (CRITICAL — use Vuetify's px values via Tailwind arbitrary variants, NOT Tailwind defaults)

Vuetify: sm=600, md=960, lg=1280, xl=1920. Tailwind defaults differ (sm=640, lg=1024, xl=1280), so for pixel-parity use arbitrary variants like `min-[960px]:` / `max-[959px]:`.
- Desktop nav shows at **≥960px** (`min-[960px]:flex`); hamburger shows **<960px** (`max-[959px]:block`).
- Download pill: visible **≥960px** only (desktop); in mobile drawer otherwise.
- Branding text: xs `<600`; sm `600–1279`; md `1280–1919`; full `≥1920`.

## Tokens & exact styles (we already have the matching @theme tokens)

- **App-bar:** `bg-app-bar` (light `#F2F2F2` / dark `#1A2234`), height **64px**, `elevation=0` but 1px bottom border (`border-b border-on-surface/10`), `backdrop-blur-[10px]`, sticky top.
- **Brand text:** `text-primary`, bold; xl/md sizes 1.25rem, sm/xs 1rem. Logo `/images/illinois-seal.webp` 32px (xs/sm) / 40px (md+), hover `scale-105`.
- **Nav text links:** `text-on-app-bar`, bold, `mx-2`; hover = 2px primary underline expanding from center to 60% (`::after`/`after:` pseudo).
- **Download pill:** `rounded-full` font-bold, NOT a default primary button. Light: bg `#ffffff`, text `#0747a6`, `border border-black/5`, shadow; hover bg `#f8f8f8` text `#053285` `-translate-y-px`. Dark: bg `#2a3441` text `#93c5fd` `border-white/5`; hover bg `#334155` text `#bfdbfe`.
- **Dropdown card:** shadow (elevation-4), `rounded` (4px), `min-w-[200px] w-max overflow-hidden`. Items: `border-l-[3px] border-transparent pl-4`, min-h 44px; hover `bg-primary/10 border-l-primary`; focus `outline-2 outline-primary` inset. Divider `my-2 opacity-30`. Chevron `mdi:chevron-down` scaled 1.2.
- **ThemeSwitch:** `ml-8` from nav. Pill wrapper `rounded-[1.5rem]`, bg `surface-variant/10` (dark `white/5`); track 2rem×1rem, thumb 0.75rem; icons `mdi:weather-night` (dark, yellow) / `mdi:white-balance-sunny` (light, orange); label "Dark"/"Light" hidden `<480px`; focus ring 3px primary. No ripple.
- **Mobile drawer:** right-side off-canvas, **width 280px**, `z-[9999]`, temporary (overlay + dismiss on outside-click/ESC). Light bg `#ffffff`, dark bg `surface` `#1E293B`. Section headings ("READ THE PLAN" / "MORE") `border-l-4 border-primary`, `text-primary` uppercase, `pointer-events-none`, `role=heading aria-level=2`. Items `border-l-2 border-primary/20 ml-4 pl-8` min-h 44px, hover `bg-primary/8`. Middle-truncate text (Read=35 chars, More=30). ThemeSwitch centered at top (`mb-4`). No "Home" item.
- **Footer:** light bg `#d1d5db`, dark bg `background` `#0F172A`; padding `48px 0 32px` (mobile `32px 0 24px`); max-w 1200px. ICJIA logo `/images/icjia-logo.webp` 100px tall, hidden `<960px`. Brand text responsive (sm `≤959`, md `960-1279`, full `≥1280`), `text-primary` 600. Description max-w 700px, `text-on-background/90` (light force `rgba(0,0,0,0.87)`). Bottom row: `© {year} [ICJIA link] | Privacy | Documentation | Accessibility`; pipes hidden `<960px`; column layout `≤480px`. Documentation→`/docs/`, Accessibility→`/docs/accessibility/` (static, plain `<a>`).
- **ScrollToTop:** ALWAYS visible (no scroll threshold), fixed `bottom-5 right-5` (mobile `bottom-4 right-4`), `z-[1000]`, `rounded-full bg-primary` icon `mdi:chevron-up`, size ~52px (min 48/44), shadow; hover `-translate-y-0.5`; respects `prefers-reduced-motion` (auto vs smooth scroll).

## Interactions → Alpine

- **Dropdowns:** hover-open + click-toggle + 150ms debounced close on mouseleave + ESC + outside-click; **one open at a time**. Implement with a single Alpine scope on `<nav>`: `x-data="{ open: null, t: null }"`, each dropdown keyed (`'plan'`/`'more'`); `@mouseenter` set open=key (clear timer), `@mouseleave` debounce `open=null`, `@click` toggle, `@keydown.escape` close, `@click.outside` close.
- **Mobile drawer:** `x-data="{ drawer: false }"` on header root; hamburger toggles (icon `mdi:menu`↔`mdi:close`); drawer `x-show="drawer" x-transition` slide from right; `@click.away`/`@keydown.escape.window` close; close on any nav link click.
- **ThemeToggle:** Alpine `x-data` init reads `document.documentElement.classList.contains('dark')`; toggle flips `.dark` class + `data-theme` attr on `<html>` + writes `sessionStorage['theme']` (matches the BaseLayout no-flash script which reads `sessionStorage.getItem('theme')`, default dark). NOTE: the no-flash script key must match — BaseLayout currently uses `sessionStorage.getItem("theme")`; keep that key.
- **ScrollToTop:** static `<button>` + inline onclick `window.scrollTo({top:0,behavior: matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})`. No Alpine needed.

## A11y / landmarks (avoid duplication)

- BaseLayout structure: the chrome components OWN the landmarks. `Header.astro` = the single `<header role="banner">` containing `<nav id="site-navigation" aria-label="Main Navigation">` (skip-link target). `Footer.astro` = single `<footer role="contentinfo">`. `#main-content` lives in BaseLayout's `<main>`. Exactly ONE banner + ONE contentinfo + ONE main — do not nest/duplicate.
- Hamburger: `id="mobile-menu-trigger" aria-label="Toggle navigation menu"`, `aria-expanded`, `aria-controls`.
- Dropdown activators: `aria-haspopup="true" aria-expanded`. Chevrons + decorative icons `aria-hidden="true"`. `aria-current="page"` on active links.
- ThemeToggle: `role="switch" aria-checked`, labelled by visible "Dark/Light" text; `aria-live` announcement of the change.

## MDI icons needed (astro-icon, mdi: set)
`mdi:menu`, `mdi:close`, `mdi:chevron-down`, `mdi:chevron-up`, `mdi:weather-night`, `mdi:white-balance-sunny`, `mdi:book-open-variant`, `mdi:trophy`, `mdi:magnify`, `mdi:email-outline`.

## Assets to migrate to `astro/public/` (needed this phase)
`/images/illinois-seal.webp` (header logo), `/images/icjia-logo.webp` (footer logo), `/favicon.png` (clears the Phase 1 BP console 404). Copy from root `public/`.

## Source files (read for remaining detail)
`app/components/content/AppHeader.vue` (1115), `AppFooter.vue` (448), `AppSidebar.vue` (375), `ThemeSwitch.vue` (232), `app/components/ui/ScrollToTop.vue` (145), `config/menu.config.json`, `config/site.config.json` (`ui.navigation`).
