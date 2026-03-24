# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
yarn dev              # Dev server on http://localhost:8000
yarn dev:fast         # Dev server (skips build scripts)
yarn build            # Production build
yarn generate         # Static site generation
yarn test             # Run tests (vitest)
yarn lint:fix         # Lint and auto-fix
yarn clean            # Clean build artifacts and cache
yarn dev:clean        # Clean + fresh dev start
```

Build scripts (`yarn create:search-index-defuddle`, `yarn create:site-config`, etc.) run automatically during `yarn dev` and `yarn build`. All support `--verbose` and `--quiet` flags. See `package.json` for the full list.

## Technology Stack

- **Nuxt 4** (SSG) / **Vue 3** Composition API / **Vuetify 3** / **Nuxt Content v3**
- **Fuse.js** for search / **Vitest** for testing / **Yarn** as package manager
- JavaScript only (not TypeScript) — write concise, technical JS code

## Code Style & Naming

- Use Vue 3 Composition API with `<script setup>` syntax
- Follow mobile-first responsive design with Vuetify 3
- **Directories**: lowercase-with-dashes (e.g., `components/auth-wizard`)
- **Components**: PascalCase (e.g., `AuthWizard.vue`)
- **Composables**: camelCase (e.g., `useAuthState.js`)
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
- Screen reader announcements via `useAnnouncer()` composable
- All accessibility changes must be documented in `audit-log-accessibility.md`

## VueUse

Prefer VueUse composables (already installed) over custom implementations. Watch for Nuxt/Nitro naming conflicts — e.g., `useStorage()` from VueUse must be explicitly imported to avoid conflict with Nitro's built-in.

## Audit Log Requirements

Maintain chronological records in `audit-log-project.md` and `audit-log-accessibility.md`. Use Chicago date: `TZ='America/Chicago' date +"%Y-%m-%d"`

Each entry must include:
1. **Date and Title**: YYYY-MM-DD format with descriptive title
2. **Summary**: 1-2 sentence overview of what changed and why
3. **Files Modified/Created**: List with specific changes to each file
4. **Technical Notes**: Implementation details helpful for developers

Entries in reverse chronological order. Update after each significant change.

## Key Patterns

- Site configuration is driven by JSON files in `/config/` — access via `useSiteSettings()`
- Content pages use `[...slug].vue` catch-all route with `useContentFetcher()`
- Theme management via `useTheme()` (session-only, defaults to dark)
- Adding new content: create markdown in `/content/`, then run `yarn create:site-config` and `yarn create:search-index-defuddle`
- Tests are in `/test/` (not `/tests/`)
