# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Primary Development Workflow
```bash
# Development server (runs on http://localhost:8000)
yarn dev

# Fast development (skips build scripts)
yarn dev:fast

# Production build
yarn build

# Static site generation
yarn generate

# Run tests
yarn test
yarn test:watch
yarn test:coverage

# Linting
yarn lint
yarn lint:fix
```

### Build Script Commands
```bash
# Generate search index (required for search functionality)
yarn create:search-index-defuddle

# Generate site configuration from content discovery
yarn create:site-config

# Generate sitemap
yarn create:sitemap

# Generate LLMs.txt format
yarn create:llms-txt

# Generate plan JSON data
yarn create:plan-json

# Sync accessibility audit logs
yarn sync:accessibility-audit

# Generate documentation
yarn create:docs

# Generate references
yarn create:references
```

### Verbose/Quiet Build Options
All development and build commands support verbose and quiet modes:
```bash
yarn dev:verbose    # Detailed logging
yarn dev:quiet      # Minimal logging
yarn build:verbose
yarn build:quiet
yarn generate:verbose
yarn generate:quiet
```

### Utility Commands
```bash
# Clean build artifacts and cache
yarn clean

# Clean data files and config
yarn clean:data

# Clean and fresh development start
yarn dev:clean

# Debug tools
yarn debug:search    # Debug search index generation
yarn debug:config    # Debug site configuration
yarn dev:tools       # Run both debug commands

# Development server with serve after generation
yarn generate:serve

# Rebuild SQLite dependencies (if needed)
yarn rebuild-sqlite

# Check Sass implementation
yarn check-sass
```

## Project Architecture

### Technology Stack
- **Nuxt 4.0.0** (compatibility mode) with SSG (Static Site Generation)
- **Vue 3** with Composition API
- **Vuetify 3** for UI components
- **Nuxt Content v3** for markdown content management
- **Fuse.js** for search functionality
- **Vitest** for testing
- **Yarn** as package manager

### Directory Structure (Nuxt 4)
```
app/                    # Nuxt 4 app directory
├── components/
│   ├── content/       # Main content components (Home*, About*, App*)
│   ├── dev/           # Development utilities (ConsoleLogger)
│   └── seo/           # SEO components (StructuredData)
├── composables/       # Vue composables for state management
├── layouts/           # Layout templates
├── pages/             # Route pages ([...slug].vue, index.vue)
├── plugins/           # Nuxt plugins (client-side)
├── utils/             # Utility functions
└── app.vue           # Root component

config/               # JSON configuration files
├── menu.config.json  # Navigation configuration
├── routes.config.json # Route definitions
├── site.config.json  # Site settings
└── *.config.md       # Configuration documentation

scripts/              # Build automation scripts
content/              # Markdown content files
```

### Key Architectural Patterns

#### Configuration-Driven Development
- All site behavior controlled via JSON configs in `/config/`
- Build scripts auto-generate configurations from content discovery
- Access configs via `useSiteSettings()` composable

#### Hybrid Content System
- Combines Nuxt Content (markdown) with Vue pages
- `[...slug].vue` catch-all route handles dynamic content
- `useContentFetcher()` composable handles loading and error states

#### Component Organization
- **Section-based**: Large pages split into focused components (HomeHero, HomeGoals, etc.)
- **Accessibility-first**: All components include ARIA labels and keyboard navigation
- **Theme-aware**: Light/dark theme support via `useTheme()` composable

#### Build Pipeline Automation
- `generate-site-config.js`: Auto-discovers all pages, creates routing config
- `generate-search-index-defuddle.js`: Creates search index with Defuddle content extraction
- Build scripts run automatically during dev/build commands

### Key Composables
- `useTheme()`: Cookie-based theme management (prevents FOUC)
- `useContentFetcher()`: Content loading with error handling
- `useSiteSettings()`: Access to site configuration
- `useConsoleLogger()`: Development logging system
- `useAnnouncer()`: Screen reader announcements for accessibility

### VueUse Integration
- Leverage VueUse composables (already installed) whenever possible instead of writing custom solutions
- Always check VueUse documentation (https://vueuse.org/) before implementing common UI/UX patterns
- Prefer VueUse solutions for consistent code style, reduced boilerplate, and tested implementations
- Use core VueUse composables for common needs:
  - `useLocalStorage`/`useSessionStorage` for persistent state
  - `useDark`/`usePreferredDark` for theme management
  - `useMediaQuery` for responsive design logic
  - `useScroll`/`useIntersectionObserver` for scroll-based interactions
  - `useFetch`/`useAxios` for data fetching (alongside Nuxt's built-in fetching)
  - `useEventListener` for DOM event handling
  - `useTimeoutFn`/`useIntervalFn` for timing operations
- Document any custom implementations that could be replaced by VueUse in future refactoring
- Combine VueUse composables with Vuetify components for optimal developer experience
- Consider VueUse's ecosystem packages for specialized needs (e.g., `@vueuse/motion`, `@vueuse/sound`)
- **Important**: When using with Nuxt 3, some VueUse functions will NOT be auto-imported in favor of Nitro's built-in alternatives. For example, `useStorage()` from VueUse requires explicit import to avoid conflict with Nitro's built-in `useStorage()`. Always check for potential naming conflicts with Nuxt/Nitro built-ins.

### Search System
- Uses Fuse.js for fuzzy search functionality
- Search index automatically generated from all content
- Enhanced with Defuddle for better content extraction
- Debug search interface available at `/debug-search.html`

### Accessibility Features
- **CRITICAL**: All new UI/UX updates MUST follow WCAG 2.1 AA compliance standards without exception
- **CRITICAL**: Ensure all accessibility follows the guidelines for Illinois Information Technology Accessibility Act (IITAA) 2.1 Standards: https://doit.illinois.gov/initiatives/accessibility/iitaa/iitaa-2-1-standards.html
- Target WCAG 2.1 AA compliance as the primary goal, with some AAA features implemented where feasible
- Maintain color contrast ratios of at least 4.5:1 for all UI elements (AA requirement), with 8:1 preferred where possible
- Skip links for keyboard navigation
- Screen reader announcements via `useAnnouncer()`
- High contrast themes (8:1 color ratios)
- 44px minimum touch targets
- Reduced motion support
- Proper keyboard navigation for all interactive elements
- ARIA labels for all interactive elements without visible text
- Focus states for all interactive elements that match hover states
- Test with screen readers before submitting any UI changes
- Semantic HTML elements
- Associated labels for all form elements
- Text alternatives for non-text content
- Proper heading hierarchy and landmark regions
- Document accessibility features in code comments
- All accessibility features must be documented in the audit log

### Content Management
- Markdown files in `/content/` with frontmatter
- Support for custom MDC components
- Table of contents auto-generation from H2 headings
- Reference system for citations and footnotes

### Testing
- **Vitest** with Vue Testing Library
- Tests located in `/tests/` directory
- Component tests, composable tests, and plugin tests
- Coverage reporting with v8 provider

## Code Style & Naming Conventions

### Core Principles
- Write concise, technical JavaScript code (not TypeScript)
- Use Vue 3 Composition API with `<script setup>` syntax
- Follow mobile-first responsive design with Vuetify 3
- Maintain the Nuxt Content 3 directory structure (/content inside /components)

### Structure & Naming
- **Files**: Structure as exported component → composables → helpers → static content
- **Directories**: lowercase-with-dashes (e.g., `components/auth-wizard`)
- **Components**: PascalCase (e.g., `AuthWizard.vue`)
- **Composables**: camelCase (e.g., `useAuthState.js`)
- **Variables**: Descriptive with auxiliary verbs (e.g., `isLoading`, `hasError`)

### Vue & Nuxt Best Practices
- Use Composition API patterns: `ref`, `reactive`, `computed`, `watch`, `provide/inject`
- Leverage Nuxt 3 auto-imports for components and composables
- Use `useFetch`/`useAsyncData` for data fetching
- Implement SEO with `useHead` and `useSeoMeta`
- Handle SSR limitations (e.g., localStorage unavailable during SSR)
- Use Suspense for async components and lazy loading for routes

## Audit Log Requirements

### Purpose
- Maintain chronological records of all significant changes in `audit-log-project.md` and `audit-log-accessibility.md`
- Use current Chicago date with command: `TZ='America/Chicago' date +"%Y-%m-%d"`

### Required Format
Each entry must include:
1. **Date and Title**: YYYY-MM-DD format with descriptive title
2. **Summary**: 1-2 sentence overview of what changed and why
3. **Files Modified/Created**: List with specific changes to each file
4. **Technical Notes**: Implementation details helpful for developers

### Guidelines
- Entries in reverse chronological order (newest at top)
- Be specific about changes and rationale
- Include ALL significant changes
- Generate dates based on current date when creating entries
- Focus on information helpful for new developers
- Update audit log after each change

## Common Development Tasks

### Adding New Content
1. Create markdown file in `/content/` directory
2. Run `yarn create:site-config` to update routing
3. Run `yarn create:search-index-defuddle` to update search index

### Adding New Components
- Place in appropriate subdirectory under `app/components/`
- Follow existing patterns for accessibility and theming
- Include JSDoc comments for documentation generation

### Modifying Site Configuration
- Edit JSON files in `/config/` directory
- Run `yarn create:site-config` to regenerate merged configuration
- Configuration changes require dev server restart

### Working with Themes
- Theme definitions in `app/plugins/vuetify.ts`
- Use `useTheme()` composable for theme state
- CSS custom properties available for theme-aware styling

### Build Scripts
- All build scripts support `--verbose` and `--quiet` flags
- Scripts automatically run during normal build process
- Can be run individually for debugging

### Console Logging
- Development logging available via `useConsoleLogger()`
- Console output can be filtered in browser dev tools
- Production logging controlled via environment variables