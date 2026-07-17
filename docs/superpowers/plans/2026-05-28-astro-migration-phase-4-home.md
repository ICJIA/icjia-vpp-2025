# Astro Migration — Phase 4 (Home Page) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Implementers read both the cited legacy source AND `docs/superpowers/audits/2026-05-28-phase4-home-brief.md`, then verify via screenshot-diff vs prod.

**Goal:** Replace the smoke `index.astro` with the real home page — the 5 active sections (Hero, Adams letter, Lt. Governor letter, Goals, Action) composed as Astro components, pixel-matched to prod.

**Architecture:** Strategy 1 (compose components, discard `content/index.md`). Hardcoded content → `astro/src/data/home.js`. Section band system (`.section-primary`/`.section-secondary` alternating) in global.css. Pure-CSS `fadeSlideUp` entrance animations (no motion lib), reduced-motion respected. Cards are `<a>` wrappers (no Alpine); only "Learn More" smooth-scroll needs a trivial handler. Disabled sections (Statistics/Approach/Principles/Stakeholders/News) are NOT rendered (match prod).

**Tech Stack:** Astro, Tailwind 4, astro-icon (mdi), Alpine (only "Learn More").

**Brief:** `docs/superpowers/audits/2026-05-28-phase4-home-brief.md`
**Verification reference:** prod `https://vpp.icjia.illinois.gov/` (home, desktop 1280 + mobile 390, light + dark).
**Branch:** `feat/astro-migration` (no merge to main). Commit per task; no Co-Authored-By trailer.

---

## File map
- Create `astro/src/data/home.js` (extracted content)
- Modify `astro/src/styles/global.css` (section band classes + reduced-motion)
- Create `astro/src/components/home/HomeHero.astro`, `HomeLetter.astro`, `HomeGoals.astro`, `HomeAction.astro`
- Replace `astro/src/pages/index.astro` (smoke → real home)
- Copy (if missing) `astro/public/images/{vpp-cover.webp,DirectorAdamsResized.jpg,stratton-lg-cropped.jpg}`

---

## Task 1: home.js data + section bands + images
- [ ] **Step 1** — Create `astro/src/data/home.js` with the EXACT content from the brief / `app/components/content/Home*.vue` (hero: titleHighlight/titleSuffix/2 paragraphs/2 buttons/image; letters.adams + letters.stratton: heading/photo/body/signature; goals[3]; action: heading/subtitle/cards[3]). Icons in `mdi:` colon form. Copy body text verbatim from the source components.
- [ ] **Step 2** — Append the section-band classes to `astro/src/styles/global.css` (`.section-primary`/`.section-secondary` light + `:root.dark` per the brief). Add a global reduced-motion guard if not present.
- [ ] **Step 3** — Ensure images exist: `ls astro/public/images/vpp-cover.webp astro/public/images/DirectorAdamsResized.jpg astro/public/images/stratton-lg-cropped.jpg`; copy any missing from root `public/images/`.
- [ ] **Step 4** — `cd astro && pnpm build` succeeds.
- [ ] **Step 5** — Commit `git add astro/src/data/home.js astro/src/styles/global.css astro/public/images && git commit -m "feat(astro): home data + section bands + images"`.

## Task 2: HomeHero.astro
- [ ] **Step 1** — Build `astro/src/components/home/HomeHero.astro` per the brief: `.section-primary` band, two-col grid (text left / image right), h1 with `text-primary` highlight span + responsive sizes, 2 paragraphs, 2 pill buttons (Download `<a href="/download/">` filled; "Learn More" → smooth-scroll to the letters section — use a small inline handler or anchor). Image `<a href="/download/"><img src="/images/vpp-cover.webp" loading="eager" fetchpriority="high" .../></a>` with caption + responsive max-widths + hover lift. Add scoped `fadeSlideUp` stagger (reduced-motion safe). Read `app/components/content/HomeHero.vue` for exact values.
- [ ] **Step 2** — Verify via a temporary mount in index (or probe): `pnpm build` succeeds; hero image has `fetchpriority="high"`.
- [ ] **Step 3** — Commit `git add astro/src/components/home/HomeHero.astro && git commit -m "feat(astro): HomeHero (LCP image, two-col, CTA buttons)"`.

## Task 3: HomeLetter.astro (Adams + Stratton)
- [ ] **Step 1** — Build `astro/src/components/home/HomeLetter.astro` with props `{ letter, band }` (band = "primary"|"secondary" → the band class; `letter` = `{heading, photo, body, signature}`). Centered h2; elevated `rounded-xl` card (shadow/border/bg per brief); float-left photo (`float-left w-[150px] mr-5 mb-2 rounded-lg [shape-outside:margin-box]`); body `text-[1.1rem] leading-[1.7]`; signature `clear-left font-semibold mt-8`. The letters section needs an `id` (e.g. `id="letters-section"`) for the Hero "Learn More" scroll target — put it on the Adams instance (first letter) or accept a prop `sectionId`. Read `HomeLetters.vue` + `HomeLieutenantGovernor.vue`.
- [ ] **Step 2** — `pnpm build` succeeds.
- [ ] **Step 3** — Commit `git add astro/src/components/home/HomeLetter.astro && git commit -m "feat(astro): HomeLetter (message card, used for Adams + Stratton)"`.

## Task 4: HomeGoals.astro
- [ ] **Step 1** — Build `astro/src/components/home/HomeGoals.astro` per brief: `.section-secondary`, centered h2 "Recommendations and Resources" + subtitle, `grid grid-cols-1 min-[768px]:grid-cols-3 gap-8` of 3 goal cards. Each card = `<a href={goal.url + '/'}>` with `<Icon name={goal.icon} class="w-20 h-20 text-primary"/>` + h3 + description; card styling (rounded-2xl, shadow, border, `dark:bg-[#2a3441]`, hover lift, focus outline). Stagger animation. Map from `goals` in home.js. Read `HomeGoals.vue` + `HomeGoalCard.vue`.
- [ ] **Step 2** — `pnpm build` succeeds.
- [ ] **Step 3** — Commit `git add astro/src/components/home/HomeGoals.astro && git commit -m "feat(astro): HomeGoals (3-card grid)"`.

## Task 5: HomeAction.astro
- [ ] **Step 1** — Build `astro/src/components/home/HomeAction.astro` per brief: `.section-primary`, centered h2 "For More Information" + subtitle, `grid grid-cols-1 min-[600px]:grid-cols-2 min-[900px]:grid-cols-3 gap-6` of 3 action cards. Each card = `<a href={card.url + '/'}>` with internal `grid grid-rows-[auto_auto_1fr_auto]` (icon 64 / big title `text-[2rem] font-extrabold` / description / outlined pill button with trailing `mdi:arrow-right`, `aria-hidden` on the decorative button). Card styling + hover `-translate-y-2`. Map from `action` in home.js. Read `HomeAction.vue`.
- [ ] **Step 2** — `pnpm build` succeeds.
- [ ] **Step 3** — Commit `git add astro/src/components/home/HomeAction.astro && git commit -m "feat(astro): HomeAction (3-card grid)"`.

## Task 6: Compose index.astro + verification gate
- [ ] **Step 1** — Replace `astro/src/pages/index.astro`: BaseLayout (real title + description) → `<HomeHero {hero}/>` → `<HomeLetter letter={letters.adams} band="secondary" sectionId="letters-section"/>` → `<HomeLetter letter={letters.stratton} band="primary"/>` → `<HomeGoals {goals}/>` → `<HomeAction {action}/>`. Import data from `home.js`.
- [ ] **Step 2** — `cd astro && pnpm build`; confirm `dist/index.html` now has the 5 sections (hero title, both letters, 3 goal cards, 3 action cards) and is NO LONGER the smoke page.
- [ ] **Step 3 (GATE)** — Serve (`pnpm preview --port 4321`); viewcap the home at **desktop 1280 + mobile 390, light + dark** (full page, tiled) and screenshot-diff vs prod `https://vpp.icjia.illinois.gov/`. Confirm: hero layout/title/image, both message cards (float photo), goals 3-col, action 3-col, band alternation, section spacing. lightcap `run_a11y` + `run_audit` (mobile) → A11y 100; check LCP (hero image) is reasonable. Verify "Learn More" scrolls to letters (Chrome DevTools MCP), goal/action cards link correctly.
- [ ] **Step 4** — Stop preview; push; verify branch deploy renders the home; confirm production (Nuxt) still untouched.

---

## Phase 4 Done-Gate
- [ ] Home renders the 5 active sections, pixel-matched to prod (desktop+mobile, light+dark); disabled sections absent (matches prod).
- [ ] Hero LCP image `eager`+`fetchpriority=high`; "Learn More" scrolls to letters; cards link correctly.
- [ ] Band alternation + section rhythm + card styling (incl. dark `#2a3441`) match.
- [ ] lightcap A11y 100; no Vue/Vuetify; build + deploy green.

When complete, write the Phase 5 (Interactivity) plan.
