# Phase 4 Home-Page Port Brief (Nuxt/Vuetify → Astro/Tailwind/Alpine)

> Research for porting the component-driven home page. Implementers read this + cited source, verify via screenshot-diff vs prod. The home is the biggest visual surface — pixel-match matters most.

## Scope: 5 ACTIVE sections only (others are commented out in `app/pages/index.vue` → not on prod)
Composition order (replace the smoke `index.astro`):
1. **HomeHero** — `.section-primary`
2. **HomeLetters** (Adams) — `.section-secondary`
3. **HomeLieutenantGovernor** (Stratton) — `.section-primary`
4. **HomeGoals** (3 cards) — `.section-secondary`
5. **HomeAction** (3 cards) — `.section-primary`

DEAD/disabled (data preserved in home.js for future, NOT rendered): HomeStatistics, HomeApproach, HomePrinciples, HomeStakeholders, HomeNews (News needs the Phase-5 news collection), HomeHighlights (fully dead). `IntersectionSection` lazy wrappers → DROP (render eagerly).

## Section band system (add to global.css)
```css
.section-primary { background:#fafafa; border-top:1px solid #e0e0e0; }
.section-secondary { background:#e5e5e5; border-top:1px solid #e0e0e0; }
:root.dark .section-primary { background:#1a2234; border-top:none; }
:root.dark .section-secondary { background:#1e2a3a; border-top:none; }
```
Bands go on the full-bleed `<section>`; inner `<div class="container mx-auto px-4 max-w-screen-xl">`. Each section `py-16` (64px). Section heading pattern: `text-5xl min-[960px]:text-6xl font-bold font-sans` (Vuetify text-h3→text-md-h2). The global `.markdown-body h2 border-bottom` does NOT apply here (these are section `<h2>` outside `.markdown-body`) — but note prod section headings do NOT have the border; keep them borderless.

## Animations (pure CSS — NO motion library)
`@keyframes fadeSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }`, 0.6–0.8s, staggered `animation-delay`. Wrap in `@media (prefers-reduced-motion: no-preference)`; reduced-motion shows final state immediately. Port as scoped `<style>` per component.

## Per-section specs

### HomeHero (`.section-primary`) — LCP-critical
Two-col grid `grid grid-cols-1 gap-8 min-[960px]:grid-cols-2`; left `min-[960px]:pr-12` text, right image (`mt-8 min-[960px]:mt-0`).
- h1 `.hero-title`: 36px → `min-[960px]:54px` → `min-[1200px]:60px`, weight 600, Roboto, letter-spacing -0.02em, lh 1.2. Highlight span "Statewide Violence Prevention Plan" = `text-primary`; rest " for Illinois: 2025-2029" normal.
- 2 body paragraphs (text below), `text-base leading-relaxed`.
- 2 buttons (`flex flex-col sm:flex-row gap-5`): "Download" filled primary `rounded-full px-8 py-3` → `/download`; "Learn More" outlined primary `rounded-full px-8 py-3` → smooth-scroll to letters section.
- Image: `/images/vpp-cover.webp`, aspect 612/792, `max-w-[580px]` (→620/750/800 at 1200/1400/1600), `rounded`, shadow, hover `-translate-y-1`; **`loading="eager" fetchpriority="high"`** (LCP); wrapped in `<a href="/download">`; caption "Click image to download". (Decorative float circles optional/low-priority.)

### HomeLetters (Adams, `.section-secondary`) + HomeLieutenantGovernor (Stratton, `.section-primary`)
Nearly identical → build ONE `HomeLetter.astro` with props `{ letter, band }`, used twice.
- Centered h2 heading.
- Elevated card: `rounded-xl` (12px), `shadow-[0_8px_32px_rgba(0,0,0,0.1)]`, `border border-on-surface/8`, `bg-surface`, hover `-translate-y-0.5`; inner padding `p-8 min-[960px]:p-12`.
- Photo floated left: `float-left w-[150px] mr-5 mb-2 rounded-lg [shape-outside:margin-box]`; text wraps (`.message-text` overflow-hidden clears float). Body `text-[1.1rem] leading-[1.7]`. Signature `font-semibold clear-left mt-8` (light: `#000`).
- Adams photo `/images/DirectorAdamsResized.jpg` (150×150); Stratton `/images/stratton-lg-cropped.jpg` (150w).

### HomeGoals (`.section-secondary`)
Centered h2 "Recommendations and Resources" + subtitle (`text-xl text-on-surface max-w-[800px] mx-auto`). Grid `grid grid-cols-1 min-[768px]:grid-cols-3 gap-8 min-[768px]:gap-10`. 3 goal cards (each an `<a href={url}>`):
- Card: `min-h-[320px] min-[1024px]:min-h-[350px] p-6 min-[1024px]:p-8 rounded-2xl shadow border border-black/5 bg-surface dark:bg-[#2a3441]`, hover `-translate-y-1` + bigger shadow, focus `outline-2 outline-primary`.
- `<Icon size 80 text-primary>` + h3 (`text-[1.375rem] font-bold` centered) + p (`text-[0.9375rem] leading-relaxed text-on-surface/87` centered). Stagger fadeSlideUp 0/200/400ms.
- Data (icons `mdi:clipboard-list` /plan/goals-and-recommendations, `mdi:book-open-variant` /resources, `mdi:trophy` /organizational-and-agency-highlights). Full text in home.js.

### HomeAction (`.section-primary`)
Centered h2 "For More Information" + subtitle. Grid `grid grid-cols-1 min-[600px]:grid-cols-2 min-[900px]:grid-cols-3 gap-6 min-[600px]:gap-8`. 3 cards (each `<a href>`, whole card clickable):
- Card internal `grid grid-rows-[auto_auto_1fr_auto]` (icon/title/desc/button — button pinned bottom). `min-h-[320px] min-[1024px]:min-h-[350px] rounded-xl` + same shadow/border/dark-bg; hover `-translate-y-2`.
- `<Icon size 64 text-primary>` + h3 (`text-[2rem] min-[1024px]:text-[2.25rem] font-extrabold tracking-[-0.025em]`) + p + outlined pill button (`min-w-[120px]`) with trailing `mdi:arrow-right`.
- Data (icons `mdi:download` /download, `mdi:book-open-page-variant` /plan/front-cover, `mdi:email` /contact). Full text in home.js.

## `astro/src/data/home.js` (extract hardcoded content — full text in source/agent brief)
Exports: `hero` (titleHighlight, titleSuffix, paragraphs[2], buttons[2], image), `letters.{adams,stratton}` (heading, photo, body, signature[2]), `goals[3]`, `action` (heading, subtitle, cards[3]). Icons in `mdi:` colon form. (Optionally include disabled `statistics/principles/approach/stakeholders` data commented for future.)

## Images to copy to `astro/public/images/` (verify present, copy from root public/ if missing)
`vpp-cover.webp` (LCP), `DirectorAdamsResized.jpg`, `stratton-lg-cropped.jpg`. (Disabled Approach/Stakeholders use external Pexels URLs — N/A.)

## index.astro composition
BaseLayout (title "Violence Prevention Plan for Illinois: 2025-2029" + description) → HomeHero → HomeLetter(adams, secondary) → HomeLetter(stratton, primary) → HomeGoals → HomeAction. Components in `astro/src/components/home/`.

## Gotchas
1. **LCP**: hero image `loading="eager" fetchpriority="high"` (source had lazy — flips LCP).
2. **Bands full-bleed** on `<section>`, container inside.
3. **No motion lib** — CSS fadeSlideUp only; respect reduced-motion.
4. **Card dark bg** `#2a3441` (intentionally ≠ surface `#1e293b`).
5. **Message photo** `float-left` + `shape-outside:margin-box`; signature `clear-left`.
6. **"Learn More"** smooth-scroll to letters section (tiny Alpine `@click` or `<a href="#letters">` + `scroll-padding-top:80px`). Add `id` to the letters section.
7. Goal/Action cards = `<a href>` wrappers (no Alpine needed); inner button decorative (`aria-hidden`).
8. Section headings borderless (unlike `.markdown-body h2`).

## Source refs
`app/pages/index.vue` (5-15), `app/components/content/Home{Hero,Letters,LieutenantGovernor,Goals,GoalCard,Action}.vue`, `app/assets/css/main.scss` (1044-1082 bands), `app/plugins/vuetify.js` (theme), `public/images/`.
