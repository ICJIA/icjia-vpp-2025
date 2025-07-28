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

### Search System
- Uses Fuse.js for fuzzy search functionality
- Search index automatically generated from all content
- Enhanced with Defuddle for better content extraction
- Debug search interface available at `/debug-search.html`

### Accessibility Features
- WCAG 2.1 AA compliant
- Skip links for keyboard navigation
- Screen reader announcements via `useAnnouncer()`
- High contrast themes (8:1 color ratios)
- 44px minimum touch targets
- Reduced motion support

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