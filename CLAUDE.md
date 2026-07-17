# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Stack note:** This repo was migrated from Nuxt/Vue/Vuetify to **Astro/Tailwind/Alpine** (see `CHANGELOG.md` [2.0.0] and `docs/`). The app lives in `astro/`. All commands run from `astro/` unless noted.

## Development Commands

```bash
./start-dev-server            # (repo root) Astro dev on http://localhost:4321 (kills stale port, clears caches)
cd astro && pnpm dev          # Astro dev server
cd astro && pnpm build        # Production build (prebuild auto-generates references + search index)
cd astro && pnpm preview      # Serve the production build locally
```

Build scripts (`astro/scripts/generate-references.js`, `generate-search-index-defuddle.js`) run automatically via the `prebuild` step before `pnpm build`.

## Technology Stack

- **Astro 6.4** (static output) / **Tailwind CSS 4** (utility-first + `@theme` tokens) / **Alpine.js 3** (interactive islands only)
- Content via **Astro content collections** (local markdown/MDX); **Fuse.js** client-side search; **astro-icon** (MDI inline SVG); **@fontsource** self-hosted fonts; **Sharp** images; **astro-seo** + JSON-LD
- **pnpm** as package manager
- Prefer TypeScript-friendly `.astro`/`.ts`; concise, technical code

## Code Style & Naming

- `.astro` components with `<script setup>`-style frontmatter; Alpine `x-data` only where real interactivity exists
- Tailwind utilities first (esp. layout: `grid`/`flex`/`container`); reserve `global.css` custom rules for what utilities can't express (`.markdown-body`, skip-link, `sr-only`)
- **Directories**: lowercase-with-dashes — `astro/src/components/{chrome,home,content,ui}`
- **Components**: PascalCase `.astro` (e.g., `HomeHero.astro`)
- **Variables**: Descriptive with auxiliary verbs (e.g., `isLoading`, `hasError`)

## Accessibility Requirements

- **CRITICAL**: All UI/UX updates MUST follow WCAG 2.1 AA compliance without exception
- **CRITICAL**: Follow Illinois Information Technology Accessibility Act (IITAA) 2.1 Standards: https://doit.illinois.gov/initiatives/accessibility/iitaa/iitaa-2-1-standards.html
- Color contrast: 4.5:1 minimum (AA), 8:1 preferred
- 44px minimum touch targets
- `prefers-reduced-motion` support on all animations
- ARIA labels on all interactive elements without visible text
- Focus states must match hover states
- Semantic HTML, proper heading hierarchy, landmark regions
- Screen reader announcements via the `#announcer-polite` / `#announcer-assertive` live regions in `BaseLayout.astro`
- Verify accessibility with the `lightcap` (`run_a11y`) and `axecap` MCP tools; record notable a11y changes in `CHANGELOG.md` and/or under `docs/`

## Audit / change records

Record notable changes in `CHANGELOG.md` (reverse chronological, newest first, grouped by date). Use Chicago date: `TZ='America/Chicago' date +"%Y-%m-%d"`. Migration specs/plans/audits live under `docs/superpowers/`.

## Key Patterns

- Nav + home content data are static JS in `astro/src/data/` (`nav.js`, `home.js`); SEO helpers + JSON-LD in `astro/src/lib/seo.ts`
- Content collections defined in `astro/src/content.config.ts`; plan pages render via `astro/src/pages/plan/[slug].astro`, other markdown via `astro/src/pages/[...slug].astro`
- Theme: dark-default, session-only — the no-flash inline script in `BaseLayout.astro` + the Alpine `ThemeToggle`
- Adding content: create markdown in `astro/src/content/...`; `pnpm build` regenerates the search index automatically
- Interactive bits (search, references popups, mobile drawer, image modal) are Alpine/vanilla islands in `astro/src/scripts/` + component `<script>` blocks
- Markdown-bearing pages that need components use `.mdx`; raw Vue/Vuetify tags do NOT render in Astro (build custom `.astro` pages instead)
