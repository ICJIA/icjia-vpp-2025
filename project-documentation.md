# Statewide Violence Prevention Plan for Illinois: 2025-2029 - Project Documentation

**Last Updated: July 31, 2025**

## Table of Contents

- [🚀 Quick Start for New Developers](#-quick-start-for-new-developers)
- [Project Overview](#project-overview)
- [Recent Major Updates](#recent-major-updates)
- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [Directory Structure](#directory-structure)
- [Development Guidelines](#development-guidelines)
- [Key Components](#key-components)
- [Build System & Scripts](#build-system--scripts)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Setup Instructions](#setup-instructions)
- [Development Workflow](#development-workflow)
- [Build and Deployment](#build-and-deployment)
- [Accessibility Standards](#accessibility-standards)
- [UI/UX Guidelines](#uiux-guidelines)
- [Navigation Structure](#navigation-structure)
- [Content Management](#content-management)
- [Maintenance](#maintenance)

---

## 🚀 Quick Start for New Developers

Welcome to the Violence Prevention Plan for Illinois project! This section will help you get up and running quickly.

### Essential First Steps

1. **Clone and Setup** (5 minutes):

   ```bash
   git clone https://github.com/ICJIA/icjia-vpp-2025.git
   cd icjia-vpp-2025
   yarn install
   yarn dev
   ```

2. **Access the Development Server**:
   - **Main Site**: http://localhost:8000
   - **Documentation Portal**: http://localhost:8000/documentation/
   - **Search**: http://localhost:8000/search
   - **Tools Documentation**: http://localhost:8000/documentation/tools/

3. **Read Key Documentation**:
   - **Development Guidelines**: `.augment-guidelines` (project coding standards)
   - **Tools Reference**: `tools.md` (all project tools and links)
   - **Audit Logs**: `audit-log-project.md` and `audit-log-accessibility.md`

### Development Workflow

#### Daily Development Commands

```bash
# Start development server with all build processes
yarn dev

# Generate production build
yarn generate

# Run specific build scripts
yarn create:search-index-defuddle    # Update search index
yarn create:tools-docs               # Generate tools documentation
yarn create:site-config              # Update site configuration
```

#### Making Changes

1. **Content Changes**: Edit files in `/content/` directory (markdown files)
2. **Component Changes**: Edit files in `/app/components/` directory (Vue files)
3. **Styling Changes**: Use Vuetify classes or edit component `<style>` sections
4. **Configuration**: Edit files in `/config/` directory (JSON files)

### Key Commands

| Command                             | Purpose                  | When to Use                 |
| ----------------------------------- | ------------------------ | --------------------------- |
| `yarn dev`                          | Start development server | Daily development           |
| `yarn generate`                     | Build for production     | Before deployment           |
| `yarn create:search-index-defuddle` | Update search index      | After content changes       |
| `yarn create:tools-docs`            | Generate tools docs      | After updating tools.md     |
| `yarn create:site-config`           | Update site config       | After config changes        |
| `yarn sync:accessibility-audit`     | Sync accessibility logs  | After accessibility updates |
| `yarn sync:project-audit`           | Sync project logs        | After project updates       |

### Important Files to Know

#### Configuration Files (Edit These)

- **`config/site.config.json`**: Main site configuration (contact info, URLs, etc.)
- **`config/menu.config.json`**: Navigation menu structure
- **`nuxt.config.ts`**: Nuxt framework configuration
- **`package.json`**: Dependencies and build scripts

#### Content Files (Edit These)

- **`content/index.md`**: Homepage content
- **`content/plan/`**: All plan sections (Executive Summary, Goals, etc.)
- **`content/accessibility/`**: Accessibility documentation
- **`content/legal/`**: Privacy Policy, Terms of Service

#### Generated Files (Don't Edit These)

- **`public/config/`**: Auto-generated from `/config/` files
- **`public/data/`**: Auto-generated search and routing data
- **`public/documentation/`**: Auto-generated documentation
- **`.nuxt/` and `.output/`**: Build artifacts

#### Key Component Files

- **`app/layouts/default.vue`**: Main page layout with header/footer
- **`app/components/content/AppHeader.vue`**: Navigation header
- **`app/components/content/AppFooter.vue`**: Site footer
- **`app/pages/index.vue`**: Homepage component

### Project Architecture Quick Overview

```
🏗️ Architecture Pattern: JAMstack (Nuxt 4 + Static Generation)
🎨 UI Framework: Vuetify 3 (Material Design)
📝 Content: Nuxt Content v3 (Markdown files)
🔍 Search: Fuse.js with custom content extraction
🎯 Accessibility: WCAG 2.1 AA compliant
🌙 Themes: Light/Dark with cookie persistence
📱 Responsive: Mobile-first design
```

### Common Development Tasks

#### Adding New Content

1. Create markdown file in appropriate `/content/` subdirectory
2. Add frontmatter with title, description, etc.
3. Run `yarn create:search-index-defuddle` to update search
4. Test with `yarn dev`

#### Modifying Navigation

1. Edit `config/menu.config.json` for main navigation
2. Edit `config/site.config.json` for dropdown menus
3. Run `yarn create:site-config` to regenerate
4. Test navigation functionality

#### Updating Styles

1. Use Vuetify classes when possible (e.g., `class="text-h4 mb-4"`)
2. For custom styles, add to component `<style scoped>` sections
3. Follow existing color and spacing patterns
4. Test in both light and dark themes

#### Accessibility Considerations

- **Always** include `alt` text for images
- **Always** use semantic HTML elements
- **Always** test keyboard navigation
- **Always** check color contrast (4.5:1 minimum)
- **Always** test with screen readers when possible

### Getting Help

1. **Documentation Portal**: http://localhost:8000/documentation/
2. **Tools Reference**: http://localhost:8000/documentation/tools/
3. **Audit Logs**: Check recent changes and patterns
4. **Code Comments**: Look for JSDoc comments in components
5. **Configuration**: Check `/config/` files for examples

### Next Steps

After completing the quick start:

1. Read the full [Project Overview](#project-overview) section
2. Review [Development Guidelines](#development-guidelines)
3. Understand [Accessibility Standards](#accessibility-standards)
4. Explore [Key Components](#key-components)
5. Check [Build System & Scripts](#build-system--scripts)

---

## Project Overview

### Repository Information

- **Project Name**: Statewide Violence Prevention Plan for Illinois: 2025-2029
- **Repository**: [https://github.com/ICJIA/icjia-vpp-2025](https://github.com/ICJIA/icjia-vpp-2025)
- **Live Site**: [https://vpp-2025.netlify.app](https://vpp-2025.netlify.app)
- **Organization**: Illinois Criminal Justice Information Authority (ICJIA)
- **License**: MIT

### Project Purpose and Goals

This project serves as the official web presence for the Statewide Violence Prevention Plan for Illinois: 2025-2029. The plan represents a comprehensive, evidence-based approach to preventing violence through collaborative efforts across state, municipal, and community-based agencies.

**Key Objectives:**

- Present the 2025-2029 violence prevention goals and recommendations
- Provide accessible, WCAG 2.1 AA-compliant documentation
- Offer comprehensive search functionality across all content
- Support both light and dark themes with persistent user preferences
- Deliver responsive design optimized for all devices

### Target Audience

- State and local government officials
- Community-based organizations
- Violence prevention practitioners
- Researchers and academics
- General public interested in violence prevention

### Key Features

- Modern, responsive design using Vuetify 3 components
- Accessibility-first development approach (WCAG 2.1 AA compliant)
- Dynamic content rendering with Nuxt Content v3
- Full-text search functionality with Defuddle-enhanced content extraction
- Subtle animations with reduced motion support
- Dark/light theme with persistent user preferences
- Comprehensive documentation for developers and users
- Automated build processes with configurable logging levels

## Recent Major Updates

### Nuxt 4 Migration (July 18, 2025)

The project has been successfully migrated from Nuxt 3 to Nuxt 4, bringing significant improvements in performance, developer experience, and modern development patterns.

#### Migration Highlights

**Directory Structure Modernization:**

- **Primary Source Directory**: Moved from root-level directories to `app/` directory structure
- **Components**: `components/` → `app/components/`
- **Composables**: `composables/` → `app/composables/`
- **Layouts**: `layouts/` → `app/layouts/`
- **Pages**: `pages/` → `app/pages/`
- **Plugins**: `plugins/` → `app/plugins/`
- **Assets**: `assets/` → `app/assets/`
- **Utils**: `utils/` → `app/utils/`

**Content Management:**

- **Content Directory**: Remains at root level (`/content/`) as per Nuxt Content v3 requirements
- **Public Assets**: Remains at root level (`/public/`) for static file serving
- **Configuration**: Build and configuration files remain at root level

**Performance Improvements:**

- **Faster Build Times**: Enhanced build pipeline with optimized dependency resolution
- **Improved Hot Reload**: Faster development server with better file watching
- **Enhanced SSR**: Better server-side rendering performance and reliability
- **Modern Bundling**: Updated bundling strategies for smaller output sizes

#### Theme System Enhancements (July 18, 2025)

**Cookie-Based Theme Persistence:**

- **Migration from localStorage**: Converted theme storage from localStorage to cookies for SSR compatibility
- **FOUC Elimination**: Eliminated Flash of Unstyled Content through server-side theme application
- **Cross-Browser Compatibility**: Enhanced Safari compatibility with optimized cookie settings
- **SSR Integration**: Theme preferences applied during server-side rendering for consistent initial page load

**Technical Implementation:**

- **useHead Integration**: Uses Nuxt's `useHead` to set `data-theme` attribute during SSR
- **Dual Approach**: Combines SSR-compatible `useHead` with client-side `document.setAttribute` for immediate feedback
- **Cookie Configuration**: Optimized `sameSite` and `secure` settings for cross-browser compatibility
- **Vuetify Integration**: Synchronized theme management between custom theme system and Vuetify

**Browser Compatibility:**

- **Chrome**: Full compatibility maintained
- **Safari**: Enhanced compatibility with specialized cookie settings
- **Firefox**: Full compatibility maintained
- **Edge**: Full compatibility maintained

### Tools Documentation System (July 31, 2025)

**Comprehensive Developer Tooling Reference:**

- **Tools Documentation**: Created `tools.md` with comprehensive list of project tools and resources
- **Automated HTML Generation**: Built `scripts/generate-tools-documentation.js` for converting markdown to styled HTML
- **Documentation Portal Integration**: Added Tools card to `/documentation/` portal for easy access
- **Build Process Integration**: Integrated into all build, dev, and generate scripts for automatic updates

**Key Features:**

- **Organized Sections**: Core Framework & UI, Content & Documentation, Search & Typography, Development & Source, Accessibility Resources
- **Direct Links**: All tools include working links to official documentation
- **Theme Support**: Light/dark theme toggle with localStorage persistence
- **Accessibility Compliance**: WCAG 2.1 AA compliant with proper focus states and reduced motion support
- **Responsive Design**: Works across all device sizes with professional styling

### Search Functionality Improvements (July 31, 2025)

**Enhanced Search Accuracy and Consistency:**

- **Highlighting Fixes**: Resolved inconsistent highlighting between partial searches ("preven") and complete words ("prevention")
- **Result Consistency**: Fixed issue where adding letters to search terms reduced valid results
- **Validation Logic**: Improved search term validation to prevent false positives while maintaining comprehensive results
- **Bidirectional Matching**: Enhanced fuzzy search to catch spelling errors while prioritizing exact matches

**Technical Improvements:**

- **Sanitization Logic**: Updated `utils/sanitize.js` with better validation for search term matching
- **Search Component**: Enhanced `pages/search.vue` with improved exact vs partial match detection
- **Error Handling**: Added robust fallback logic for regex operations
- **Performance**: Maintained fast search performance while improving accuracy

### Address Standardization (July 31, 2025)

**Updated Organization Address Information:**

- **Current Address**: Standardized all references to "60 E Van Buren St, Suite 650, Chicago, IL 60605"
- **Legacy Address Removal**: Updated all instances of "300 W. Adams Street" to current address
- **Comprehensive Update**: Updated documentation portal, legal pages, structured data, and configuration files
- **Historical Preservation**: Maintained historical address references in audit logs for documentation purposes

**Files Updated:**

- **Documentation Portal**: Footer address information
- **Legal Pages**: Terms of Service and Privacy Policy contact information
- **Structured Data**: SEO and schema markup address information
- **Configuration Files**: Site configuration and public config files

### Documentation Portal Enhancements (July 31, 2025)

**Improved Layout and Navigation:**

- **Three-Card Layout**: Optimized grid to display three cards across instead of two for better space utilization
- **Accessibility Audit Log**: Added dedicated card for accessibility documentation
- **Streamlined Footer**: Removed external GitHub link for cleaner, more focused documentation experience
- **Responsive Design**: Enhanced mobile and tablet layouts with optimized card sizing

## Technology Stack

### Core Framework

- **Nuxt 4** (v4.0.0) - Vue.js meta-framework with modern directory structure and enhanced performance
  - **Migration Completed**: July 18, 2025 - Full migration from Nuxt 3 to Nuxt 4
  - **Modern Directory Structure**: Uses `app/` as primary source directory instead of root-level directories
  - **Enhanced Performance**: Improved build times and runtime performance
  - **Backward Compatibility**: Maintains compatibility with existing Nuxt 3 patterns
- **Vue 3** (v3.5.0) - Progressive JavaScript framework with Composition API
- **Node.js** - JavaScript runtime (requires Node.js 18+)

### UI Framework & Styling

- **Vuetify 3** (v3.8.5) - Material Design component framework
- **Material Design Icons** (@mdi/font v7.4.47) - Icon library
- **Sass** (v1.71.1) - CSS preprocessor for custom styling
- **Google Fonts** - Typography (Roboto, Lato, Raleway families)

### Content Management

- **Nuxt Content v3** (@nuxt/content v3.6.3) - File-based CMS for markdown content
- **Gray Matter** (v4.0.3) - YAML frontmatter parsing
- **Remark/Rehype** - Markdown processing pipeline with GFM support

### Build Tools & Development

- **Vite** - Fast build tool and development server
- **Vitest** (v3.1.3) - Unit testing framework with Vue Test Utils
- **ESBuild** - JavaScript bundler and minifier
- **PostCSS** - CSS processing and optimization

### Search & Utility Libraries

- **Defuddle** (v0.6.4) - Enhanced content extraction for search indexing
- **Fuse.js** (v7.1.0) - Fuzzy search library for client-side search
- **VueUse** (v13.2.0) - Collection of Vue composition utilities
- **Better SQLite3** (v11.10.0) - Database for content processing

### Analytics & Monitoring

- **Plausible Analytics** (@nuxtjs/plausible v1.2.0) - Privacy-focused analytics

### Deployment & Hosting

- **Netlify** - Static site hosting with automatic deployments
- **Nitro** - Server engine for static site generation

## Architecture Overview

### High-Level Architecture

The project follows a JAMstack architecture pattern with Nuxt 4's modern directory structure:

- **JavaScript**: Vue 3 with Nuxt 4 framework using `app/` source directory (migrated July 18, 2025)
- **APIs**: Static content via Nuxt Content, search via client-side Fuse.js
- **Markup**: Pre-generated static HTML with dynamic hydration
- **Theme Management**: Cookie-based persistence with SSR-compatible theme application

### Data Flow Patterns

1. **Content Processing**: Markdown files → Nuxt Content → Static generation
2. **Search Indexing**: Content files → Defuddle extraction → Fuse.js index
3. **Configuration**: JSON configs → Build scripts → Public assets
4. **Accessibility**: Audit logs → Sync scripts → Documentation pages

### Key Design Patterns

- **Composition API**: Vue 3 composables for reusable logic
- **Component-Based Architecture**: Modular, reusable Vue components
- **File-Based Routing**: Automatic route generation from file structure
- **Static Site Generation**: Pre-rendered pages for optimal performance
- **Progressive Enhancement**: Core functionality works without JavaScript

### Integration Points

- **Nuxt Content**: Markdown content processing and rendering
- **Vuetify**: Material Design component integration
- **VueUse**: Utility composables for common functionality
- **Defuddle**: Enhanced search content extraction
- **Plausible**: Privacy-focused analytics integration

## Directory Structure

```
icjia-vpp-2025/
├── nuxt.config.ts             # Nuxt configuration
├── package.json               # Dependencies and scripts
├── vitest.config.js           # Testing configuration
├── tsconfig.json              # TypeScript configuration
├──
├── app/                       # PRIMARY SOURCE DIRECTORY (Nuxt 4)
│   ├── app.vue                # Root application component
│   ├── error.vue              # Error page component
│   ├── router.options.ts      # Router configuration
│   ├──
│   ├── assets/                # Static assets and styles
│   │   └── css/
│   │       └── main.scss      # Global SCSS styles
│   ├──
│   ├── components/            # Vue components
│   │   ├── content/           # Content-specific components
│   │   ├── dev/               # Development utilities
│   │   └── seo/               # SEO-related components
│   ├──
│   ├── composables/           # Vue composables
│   │   ├── useAnnouncer.js    # Accessibility announcements
│   │   ├── useConsoleLogger.js # Logging utilities
│   │   ├── useContentFetcher.js # Content fetching logic
│   │   ├── useReferences.js   # Reference management
│   │   ├── useReportNavigation.js # Navigation utilities
│   │   ├── useSiteSettings.js # Site configuration
│   │   └── useTheme.js        # Cookie-based theme management (added July 18, 2025)
│   ├──
│   ├── layouts/               # Layout components
│   │   └── default.vue        # Default page layout
│   ├──
│   ├── pages/                 # Page components
│   │   ├── [...slug].vue      # Dynamic catch-all page
│   │   ├── index.vue          # Homepage
│   │   ├── news.vue           # News listing page
│   │   └── search.vue         # Search page
│   ├──
│   ├── plugins/               # Nuxt plugins
│   │   ├── console-logger.client.js    # Client-side logging
│   │   ├── error-handler.client.js     # Error handling
│   │   ├── footnotes.client.js         # Footnote functionality
│   │   ├── markdown-components.ts      # Markdown component registration
│   │   ├── references.client.js        # Reference processing
│   │   ├── refresh-scroll.client.js    # Scroll behavior
│   │   ├── scroll-behavior.client.js   # Scroll management
│   │   └── vuetify.ts                  # Vuetify configuration
│   └──
│   └── utils/                 # Utility functions
├──
├── content/                   # Markdown content files
│   ├── accessibility/         # Accessibility documentation
│   ├── legal/                 # Legal pages
│   ├── news/                  # News and updates
│   ├── plan/                  # Main plan content
│   ├── contact.md             # Contact information
│   ├── download.md            # Download page
│   └── index.md               # Homepage content
├──
├── public/                    # Static public files
│   ├── config/                # Generated configuration files
│   ├── data/                  # Generated data files
│   ├── documentation/         # Generated documentation
│   ├── files/                 # PDF and document files
│   ├── images/                # Image assets
│   ├── favicon.ico            # Site favicon
│   ├── llms.txt               # LLM-readable content
│   ├── robots.txt             # Search engine directives
│   ├── sitemap.xml            # Site map
│   └── vpp-plan-2025-2029.*   # Plan data in multiple formats
├──
├── scripts/                   # Build and utility scripts
│   ├── generate-documentation.js      # JSDoc documentation generation
│   ├── generate-llms-txt.js           # LLM content generation
│   ├── generate-plan-json.js          # Plan data generation
│   ├── generate-search-index-defuddle.js # Enhanced search indexing
│   ├── generate-site-config.js        # Site configuration
│   ├── generate-sitemap.js            # Sitemap generation
│   └── sync-accessibility-audit-logs.js # Accessibility sync
├──
├── server/                    # Server-side code
│   └── tsconfig.json          # Server TypeScript configuration
├──
├── .output/                   # Nuxt 4 build output directory
├── .nuxt/                     # Nuxt build cache
├── tests/                     # Test files
├── config/                    # Source configuration files
├── docs/                      # Project documentation
├── audit-log-accessibility.md # Accessibility audit log
└── audit-log-project.md      # Project audit log
```

### Key Configuration Files

- **nuxt.config.ts**: Main Nuxt configuration with modules, CSS, and build settings
- **package.json**: Dependencies, scripts, and project metadata
- **vitest.config.js**: Testing framework configuration
- **config/**: Source configuration files for various build processes
- **public/config/**: Auto-generated configuration copies (do not edit directly)

### Generated vs. Source Files

- **Source Files**: All files in `/app/`, `/config/`, `/content/`, `/scripts/`, etc.
- **Generated Files**: Files in `/public/config/`, `/public/data/`, `/public/documentation/`, `/.nuxt/`, `/.output/`
- **Build Artifacts**: `.nuxt`, `.output` directories (excluded from version control)

## Key Components

### Layout Components

- **default.vue**: Main application layout with navigation, footer, and theme management
- **app.vue**: Root application component with global providers and error boundaries

### Content Components

- **ContentDisplay.vue**: Primary content rendering component with accessibility features
- **SimpleContentDisplay.vue**: Simplified content display for specific use cases
- **AccessibleTooltip.vue**: Enhanced tooltip component with mobile auto-hide and ARIA support

### Page Components

- **[...slug].vue**: Dynamic catch-all page for content routing
- **index.vue**: Homepage with feature cards and navigation
- **search.vue**: Full-text search interface with Fuse.js integration
- **news.vue**: News and updates listing page

### Utility Components

- **SEO components**: Meta tag management and structured data
- **Development components**: Debug utilities and development aids

### State Management Components

The project uses Vue 3 Composition API with composables for state management:

- **useSiteSettings**: Global site configuration and theme management
- **useTheme**: Cookie-based theme persistence with SSR support (added July 18, 2025)
- **useAnnouncer**: Accessibility announcements for screen readers
- **useContentFetcher**: Content loading and caching logic
- **useReportNavigation**: Navigation state and circular navigation

## API Documentation

### External API Integrations

The project primarily uses static content with minimal external API dependencies:

#### Plausible Analytics API

- **Purpose**: Privacy-focused website analytics
- **Configuration**: Configured in `nuxt.config.ts` with custom domain
- **Endpoint**: `https://plausible.icjia.cloud`
- **Authentication**: Domain-based (no API keys required)

#### Google Fonts API

- **Purpose**: Web font loading for typography
- **Configuration**: Managed via `@nuxtjs/google-fonts` module
- **Fonts**: Roboto, Lato, Raleway families with various weights
- **Optimization**: Preconnect and font-display optimizations

### Internal API Patterns

The project uses file-based content management with build-time processing:

#### Content API (Nuxt Content)

```javascript
// Fetch single content item (Nuxt 4 with app/ directory)
const { data: page } = await $content("/plan/executive-summary").findOne();

// Query multiple content items
const { data: pages } = await $content("/plan").find();

// Search content
const { data: results } = await $content().search("violence prevention");
```

#### Search API (Client-side)

```javascript
// Initialize search
const fuse = new Fuse(searchIndex, fuseOptions);

// Perform search
const results = fuse.search(query);

// Enhanced search with Defuddle
const enhancedResults = await searchWithDefuddle(query);
```

### Data Processing Workflows

1. **Content Processing**: Markdown → Nuxt Content → Static HTML
2. **Search Indexing**: Content → Defuddle extraction → Fuse.js index
3. **Configuration Generation**: Source configs → Build scripts → Public assets
4. **Asset Optimization**: Images → Compression → WebP conversion

### Error Handling Strategies

- **Client-side**: Global error handler plugin with user-friendly messages
- **Build-time**: Comprehensive error logging in build scripts
- **Content**: Graceful fallbacks for missing content or broken links
- **Search**: Fallback to basic search if enhanced search fails

## Database Schema

This project uses a file-based content management system rather than a traditional database. However, it does use SQLite for content processing during build time.

### Content Structure

Content is organized using YAML frontmatter and markdown:

```yaml
---
title: "Page Title"
date: 2025-06-20
description: "Page description for SEO"
tags: ["violence-prevention", "public-health"]
author: "Author Name"
---
# Markdown Content
Content body in markdown format...
```

### Data Models

#### Page Content Model

- **title**: String (required) - Page title
- **date**: Date - Publication/update date
- **description**: String - SEO description
- **tags**: Array - Content categorization
- **author**: String - Content author
- **body**: Markdown - Main content body

#### Search Index Model

- **id**: String - Unique page identifier
- **title**: String - Page title
- **content**: String - Processed content text
- **url**: String - Page URL
- **tags**: Array - Content tags
- **excerpt**: String - Content summary

### Content Validation Rules

- All pages must have title and description
- Dates must be in YYYY-MM-DD format
- Content must be valid markdown
- Images must have alt text for accessibility

### Migration and Seeding Strategies

- Content migration via markdown file imports
- Build-time validation and processing
- Automated content indexing during builds
- Version control for content history

## Setup Instructions

### Prerequisites and System Requirements

⚠️ **IMPORTANT PLATFORM COMPATIBILITY WARNING** ⚠️

This project framework is **NOT compatible with vanilla Windows** (native Windows without WSL2). Development requires one of these supported platforms:

1. **Windows with WSL2** (Windows Subsystem for Linux 2) - **REQUIRED** for Windows users
2. **macOS** (Apple Silicon M1/M2/M3/M4 preferred over Intel for better performance)
3. **Linux** (Debian/Ubuntu distributions recommended, other distributions may work but are not supported)

**Technical Reasoning**: Node.js development tools, file system operations, and build processes work more reliably on Unix-like systems. Many npm packages, build tools, and file watchers have compatibility issues with native Windows environments.

#### System Requirements

- **Node.js**: Version 18+ with ES modules support
- **Package Manager**: Yarn v1.22.22 (specified in package.json)
- **Memory**: Minimum 4GB RAM (8GB recommended for development)
- **Storage**: At least 2GB free space for dependencies and build artifacts

### Step-by-Step Installation Process

#### 1. Clone the Repository

```bash
git clone https://github.com/ICJIA/icjia-vpp-2025.git
cd icjia-vpp-2025
```

#### 2. Install Dependencies

```bash
# Using Yarn (recommended and required)
yarn install

# Verify installation
yarn --version  # Should show 1.22.22
```

#### 3. Environment Configuration

The project uses environment-specific configurations but does not require a `.env` file for basic development.

**Optional Environment Variables:**

- `NUXT_PUBLIC_PLAUSIBLE_DOMAIN`: Analytics domain (defaults to disabled)
- `NODE_ENV`: Environment mode (development/production)

#### 4. Initial Build Setup

```bash
# Run initial build processes to generate required files
yarn dev:fast  # Quick development server without full build
# OR
yarn dev       # Full development build with all generation scripts
```

### Verification Steps and Troubleshooting

#### Verify Installation

1. **Development Server**: `yarn dev` should start server on http://localhost:8000
2. **Build Process**: `yarn build` should complete without errors
3. **Tests**: `yarn test` should run test suite successfully

#### Common Issues and Solutions

**Windows Users (WSL2 Required):**

- **Error**: `ENOENT: no such file or directory, scandir` → **Solution**: Use WSL2, not native Windows
- **Error**: `gyp ERR! stack Error: Can't find Python executable` → **Solution**: Use WSL2 with proper Linux environment
- **Error**: File watchers not working or extremely slow → **Solution**: Use WSL2 file system, not Windows file system
- **Performance**: Store projects in WSL2 file system (`/home/username/`) not Windows file system (`/mnt/c/`)

**General Development Issues:**

- **Port Conflicts**: Change port in package.json scripts if 8000 is occupied
- **Memory Issues**: Increase Node.js memory limit: `NODE_OPTIONS="--max-old-space-size=4096"`
- **Build Failures**: Clear cache with `yarn clean` and retry
- **Missing Dependencies**: Delete `node_modules` and run `yarn install` again

#### Platform-Specific Setup

**Windows with WSL2 (MANDATORY for Windows Users):**

1. Install WSL2 and Ubuntu distribution
2. Install Node.js within WSL2 environment
3. Install VS Code with "Remote - WSL" extension
4. Clone and develop within WSL2 file system

**macOS (Fully Supported):**

1. Install Node.js via Homebrew: `brew install node`
2. Install Yarn: `npm install -g yarn@1.22.22`
3. Clone repository and follow standard setup

**Linux (Fully Supported):**

1. Install Node.js via package manager or NodeSource
2. Install Yarn: `npm install -g yarn@1.22.22`
3. Clone repository and follow standard setup

## Development Workflow

### Git Workflow and Branching Strategy

#### Branch Naming Conventions

- **Feature branches**: `feature/short-description`
- **Bug fixes**: `bugfix/issue-description`
- **Hotfixes**: `hotfix/critical-issue`
- **Documentation**: `docs/update-description`

#### Workflow Process

1. **Create Feature Branch**: `git checkout -b feature/new-feature`
2. **Make Changes**: Implement feature with proper commits
3. **Test Locally**: Run `yarn test` and `yarn build` to verify
4. **Create Pull Request**: Submit PR with detailed description
5. **Code Review**: At least one reviewer required
6. **Merge**: Squash commits when merging to maintain clean history

#### Commit Message Standards

- Use present tense with clear descriptions
- Reference issue numbers when applicable
- Examples:
  - `Add accessibility features to navigation component`
  - `Fix search indexing for special characters (#123)`
  - `Update WCAG compliance documentation`

### Code Standards and Formatting Rules

#### JavaScript/Vue Standards

- **Vue 3 Composition API**: Use `<script setup>` syntax
- **ES6+ Features**: Use modern JavaScript features
- **Destructuring**: Prefer destructuring for props and reactive references
- **Naming Conventions**:
  - **Components**: PascalCase (e.g., `AuthWizard.vue`)
  - **Composables**: camelCase (e.g., `useAuthState.js`)
  - **Variables**: Descriptive with auxiliary verbs (e.g., `isLoading`, `hasError`)

#### File and Directory Naming

- **Directories**: lowercase-with-dashes (e.g., `components/auth-wizard`)
- **Vue Files**: PascalCase (e.g., `ContentDisplay.vue`)
- **JavaScript Files**: camelCase (e.g., `useContentFetcher.js`)
- **Markdown Files**: lowercase-with-dashes (e.g., `executive-summary.md`)

#### Code Organization

- **Structure**: Exported component → composables → helpers → static content
- **Imports**: Group and order: Vue imports → third-party → local components → composables
- **Comments**: Use JSDoc for functions and components

### Testing Approach and Procedures

#### Testing Framework

- **Vitest**: Primary testing framework with Vue Test Utils
- **Coverage**: V8 coverage provider with HTML reports
- **Environment**: jsdom for DOM simulation

#### Test Types

1. **Unit Tests**: Individual component and composable testing
2. **Integration Tests**: Component interaction testing
3. **Accessibility Tests**: ARIA and keyboard navigation testing

#### Running Tests

```bash
# Run all tests
yarn test

# Watch mode for development
yarn test:watch

# Generate coverage report
yarn test:coverage
```

#### Test File Organization

- **Location**: `/tests/` directory
- **Naming**: `*.test.js` or `*.spec.js`
- **Structure**: Mirror source file structure

### Common Development Tasks and Procedures

#### Starting Development

```bash
# Quick start (skips build scripts)
yarn dev:fast

# Full development build
yarn dev

# Development with verbose logging
yarn dev:verbose
```

#### Content Management

1. **Adding Content**: Create markdown files in `/content/` directory
2. **Content Structure**: Use YAML frontmatter for metadata
3. **Images**: Place in `/public/images/` with descriptive alt text
4. **Navigation**: Update `/config/menu.config.json` for menu changes

#### Build and Generation Scripts

```bash
# Individual script execution
yarn create:search-index-defuddle    # Generate search index
yarn create:site-config              # Generate site configuration
yarn create:sitemap                  # Generate sitemap
yarn create:llms-txt                 # Generate LLM-readable content
yarn sync:accessibility-audit        # Sync accessibility logs

# Clean build artifacts
yarn clean

# Debug specific processes
yarn debug:search                    # Debug search indexing
yarn debug:config                    # Debug configuration generation
```

#### Accessibility Development

1. **Test with Screen Readers**: Use NVDA, JAWS, or VoiceOver
2. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
3. **Color Contrast**: Verify 8:1 contrast ratio (exceeding WCAG AA 4.5:1)
4. **Update Audit Log**: Document accessibility changes in audit logs

#### Performance Optimization

1. **Bundle Analysis**: Monitor build output size
2. **Image Optimization**: Use WebP format and appropriate sizing
3. **Code Splitting**: Implement dynamic imports for large components
4. **Core Web Vitals**: Monitor LCP, CLS, and FID metrics

## Build and Deployment

### Build Process Overview

The project uses a comprehensive build pipeline that generates static assets, processes content, and creates optimized production builds.

#### Build Pipeline Stages

1. **Accessibility Sync**: Synchronize accessibility audit logs
2. **Search Indexing**: Generate enhanced search index with Defuddle
3. **Site Configuration**: Generate site configuration files
4. **Sitemap Generation**: Create XML sitemap for SEO
5. **LLM Content**: Generate LLM-readable content file
6. **Plan Data**: Generate plan data in multiple formats
7. **Nuxt Build**: Compile and optimize application

### Build Scripts and Commands

#### Development Builds

```bash
# Standard development build
yarn dev

# Quick development (skips generation scripts)
yarn dev:fast

# Verbose development build with detailed logging
yarn dev:verbose

# Quiet development build with minimal logging
yarn dev:quiet

# Clean development build (clears cache first)
yarn dev:clean
```

#### Production Builds

```bash
# Standard production build
yarn build

# Verbose production build with detailed logging
yarn build:verbose

# Quiet production build with minimal logging
yarn build:quiet

# Static site generation for deployment
yarn generate

# Generate and serve locally
yarn generate:serve
```

#### Individual Build Scripts

```bash
# Content and configuration generation
yarn create:search-index-defuddle    # Enhanced search indexing
yarn create:site-config              # Site configuration
yarn create:sitemap                  # XML sitemap
yarn create:llms-txt                 # LLM-readable content
yarn create:plan-json                # Plan data formats
yarn sync:accessibility-audit        # Accessibility logs

# Utility scripts
yarn clean                          # Clear build artifacts
yarn clean:data                     # Clear generated data files
```

### Content Generation Workflows

#### Search Index Generation

- **Input**: All markdown content files, configuration
- **Process**: Defuddle content extraction, Fuse.js index creation
- **Output**: `/public/data/search-index.json`
- **Features**: Enhanced content extraction, metadata preservation

#### Site Configuration Generation

- **Input**: Source configuration files in `/config/`
- **Process**: Validation, merging, route generation
- **Output**: `/config/site.config.json`, `/public/config/routes.config.json`
- **Features**: Route discovery, metadata extraction

#### Sitemap Generation

- **Input**: All discoverable routes and content
- **Process**: URL generation, priority assignment, validation
- **Output**: `/public/sitemap.xml`
- **Features**: SEO optimization, automatic updates

### Deployment Configuration and Process

#### Netlify Deployment

The project is configured for automatic deployment on Netlify:

**Build Settings:**

- **Build Command**: `yarn generate`
- **Publish Directory**: `.output/public`
- **Node Version**: 18+

**Deployment Triggers:**

- **Automatic**: Push to main branch
- **Manual**: Deploy previews for pull requests
- **Scheduled**: Optional scheduled rebuilds

#### Environment-Specific Configurations

**Development Environment:**

- **URL**: http://localhost:8000
- **Analytics**: Disabled
- **Logging**: Verbose
- **Hot Reload**: Enabled

**Production Environment:**

- **URL**: https://vpp-2025.netlify.app
- **Analytics**: Plausible (if configured)
- **Logging**: Minimal
- **Optimization**: Full

#### Deployment Checklist

1. **Pre-deployment**:
   - Run `yarn test` to ensure all tests pass
   - Run `yarn build` to verify build success
   - Check accessibility compliance
   - Verify content accuracy

2. **Deployment**:
   - Push to main branch for automatic deployment
   - Monitor build logs for errors
   - Verify deployment success

3. **Post-deployment**:
   - Test live site functionality
   - Verify search functionality
   - Check accessibility features
   - Monitor performance metrics

### Environment Variables and Configuration

#### Required Environment Variables

None required for basic functionality.

#### Optional Environment Variables

- `NUXT_PUBLIC_PLAUSIBLE_DOMAIN`: Analytics domain
- `NODE_ENV`: Environment mode (development/production)
- `NODE_OPTIONS`: Node.js runtime options (e.g., memory limits)

#### Configuration Files

- **nuxt.config.ts**: Main Nuxt configuration
- **package.json**: Dependencies and scripts
- **vitest.config.js**: Testing configuration
- **config/**: Source configuration files
- **public/config/**: Generated configuration files (auto-generated)

## Accessibility Standards

### WCAG 2.1 AA Compliance Requirements

The project maintains strict adherence to Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards, with many features exceeding requirements to approach AAA level compliance.

#### Core Accessibility Principles

**1. Perceivable**

- **Color Contrast**: 8:1 contrast ratio for all UI elements (exceeding 4.5:1 AA requirement)
- **Text Alternatives**: All images have descriptive alt text
- **Scalable Text**: Text can be resized up to 200% without loss of functionality
- **Visual Structure**: Clear visual hierarchy and layout

**2. Operable**

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Focus Management**: Visible focus indicators and logical tab order
- **Touch Targets**: Minimum 44px touch targets for mobile accessibility
- **User-Controlled Animations**: Respects prefers-reduced-motion preferences

**3. Understandable**

- **Clear Content Structure**: Proper heading hierarchy and semantic markup
- **Consistent Navigation**: Predictable navigation patterns across pages
- **Descriptive Labeling**: Clear labels and instructions for all form elements
- **Error Prevention**: Input validation and clear error messages

**4. Robust**

- **Semantic HTML**: Proper use of HTML5 semantic elements
- **ARIA Support**: Appropriate ARIA attributes and landmarks
- **Assistive Technology**: Compatible with screen readers and other AT
- **Future-Proof**: Standards-compliant code for long-term compatibility

### IITAA 2.1 Standards Adherence

The project complies with Illinois Information Technology Accessibility Act (IITAA) 2.1 Standards:

#### Technical Standards

- **Section 508 Compliance**: Meets federal accessibility requirements
- **WCAG 2.1 AA**: Full compliance with international standards
- **State Requirements**: Adheres to Illinois-specific accessibility mandates
- **Regular Auditing**: Ongoing accessibility assessment and improvement

#### Implementation Features

- **Screen Reader Support**: Tested with NVDA, JAWS, and VoiceOver
- **Keyboard Navigation**: Complete keyboard accessibility
- **High Contrast**: Enhanced contrast ratios for visual accessibility
- **Mobile Accessibility**: Touch-friendly interface with proper target sizes

### Accessibility Features Implementation

#### Specialized Components

**AccessibleTooltip Component**

- Auto-dismiss functionality on mobile devices (4-second timeout)
- Proper ARIA attributes for screen reader compatibility
- Responsive behavior based on device type
- Keyboard navigation support

**Enhanced Navigation**

- Skip-to-content links for keyboard users
- Proper ARIA landmarks and roles
- Descriptive button labels and tooltips
- Focus management for dynamic content

**Content Accessibility**

- Semantic HTML structure throughout
- Proper heading hierarchy (h1 → h2 → h3)
- Descriptive link text and button labels
- Alternative text for all images

#### Screen Reader Support

- **ARIA Live Regions**: Dynamic content announcements
- **Landmark Navigation**: Proper page structure for AT navigation
- **Content Structure**: Logical reading order and relationships
- **State Announcements**: Interactive element state changes

#### Keyboard Navigation

- **Tab Order**: Logical keyboard navigation sequence
- **Focus Indicators**: Visible focus states for all interactive elements
- **Keyboard Shortcuts**: Standard keyboard interaction patterns
- **Escape Handling**: Proper modal and dropdown dismissal

### Accessibility Testing and Validation

#### Testing Tools and Methods

- **Automated Testing**: Integrated accessibility linting and validation
- **Manual Testing**: Regular keyboard and screen reader testing
- **Color Contrast**: Verified with contrast analysis tools
- **User Testing**: Feedback from users with disabilities

#### Assistive Technology Compatibility

**Screen Readers:**

- NVDA (Windows) - Fully supported
- JAWS (Windows) - Fully supported
- VoiceOver (macOS/iOS) - Fully supported
- TalkBack (Android) - Fully supported

**Input Methods:**

- Keyboard-only navigation - Fully supported
- Voice recognition software - Compatible
- Switch controls - Compatible
- Eye tracking devices - Compatible

#### Accessibility Audit Process

1. **Regular Audits**: Quarterly accessibility assessments
2. **Documentation**: Comprehensive audit logs maintained
3. **Issue Tracking**: Accessibility issues prioritized and resolved
4. **Compliance Verification**: Regular WCAG and IITAA compliance checks

### Accessibility Documentation and Maintenance

#### Audit Logs

- **audit-log-accessibility.md**: Detailed accessibility change log
- **content/accessibility/audit-log.md**: Public accessibility documentation
- **Sync Process**: Automated synchronization between audit logs

#### Developer Guidelines

- **Component Standards**: Accessibility requirements for all components
- **Testing Requirements**: Mandatory accessibility testing for new features
- **Code Review**: Accessibility considerations in all code reviews
- **Training**: Ongoing accessibility education for development team

## UI/UX Guidelines

### Design Principles

#### Visual Design Philosophy

- **Subtle and Muted**: Clean color palettes with neutral grays and subtle blues
- **Professional Appearance**: Appropriate for government and academic audiences
- **Accessibility First**: Design decisions prioritize accessibility and usability
- **Responsive Design**: Mobile-first approach with progressive enhancement

#### Color Palette and Themes

**Light Theme:**

- **Primary Background**: Clean light backgrounds (#F8F9FA)
- **Secondary Background**: Enhanced card contrast (#FFFFFF)
- **Navbar**: Light grey (#F2F2F2)
- **Text**: High contrast dark text for readability

**Dark Theme (Default):**

- **Primary Background**: Professional dark backgrounds
- **Secondary Background**: Enhanced card contrast for better definition
- **Navbar**: Darker blue (#1A2234)
- **Text**: High contrast light text for readability

#### Typography Standards

- **Primary Font**: Roboto (body text, UI elements)
- **Secondary Font**: Lato (headings, emphasis)
- **Accent Font**: Raleway (special headings, branding)
- **Font Weights**: 100, 300, 400, 700, 900 available
- **Line Height**: 1.6 for optimal readability

##### Font Size System

**Global Default Font Size**: 16px (browser default)

- The project does not explicitly set a global font size on html or body elements
- Relies on browser defaults (typically 16px) for optimal accessibility and user preference respect
- All font sizes are defined using `rem` units relative to this 16px base

**Heading Font Sizes** (relative to 16px base):

- **H1**: `1.8rem` (≈28.8px)
- **H2**: `1.5rem` (≈24px)
- **H3**: `1.25rem` (≈20px)
- **Body Text**: Browser default (≈16px)
- **Code**: `0.875rem` (≈14px)

**Key Benefits**:

- **Accessibility**: Users can adjust browser font size and all text scales proportionally
- **Consistency**: Relative sizing maintains visual hierarchy across different user preferences
- **Standards Compliance**: Follows modern web development best practices by respecting browser defaults

### Theme Management

#### Theme System Implementation

- **Default Theme**: Dark mode as default for professional appearance
- **Theme Toggle**: Labeled switch component with clear light/dark indication
- **Persistence**: Cookie-based storage for SSR compatibility (migrated July 18, 2025)
- **SSR Integration**: Theme applied during server-side rendering to eliminate FOUC
- **Cross-Browser Support**: Enhanced Safari compatibility with optimized cookie settings
- **System Preference**: Respects user's system theme preference initially

#### Theme Switching Features

- **Smooth Transitions**: CSS transitions for polished theme switching
- **Component Consistency**: All components support both themes
- **Accessibility**: Theme toggle includes proper ARIA labels and keyboard support
- **Visual Feedback**: Clear indication of current theme state

### Component Usage Patterns

#### Button Standards

- **Primary Actions**: Use v-btn with 'to' attribute for navigation
- **Secondary Actions**: Standard button styling with appropriate contrast
- **Touch Targets**: Minimum 44px for mobile accessibility
- **Focus States**: Visible focus indicators matching hover states

#### Card Design Patterns

- **Three-Section Layout**: Icon, title, key focus areas
- **Horizontal Alignment**: CSS Grid/Flexbox with fixed heights
- **Responsive Spacing**: Generous on desktop, compact on mobile
- **Click Navigation**: Entire cards clickable for better UX

#### Image and Media Guidelines

- **Alt Text**: Required descriptive alt text for all images
- **Modal Display**: Images open in Vuetify modal windows at 95% viewport width
- **No Extra Spacing**: Images without unnecessary borders or padding
- **Caption Styling**: Font-weight 700 for better visual prominence

### Responsive Design Standards

#### Breakpoint Strategy

- **Mobile First**: Design for mobile, enhance for larger screens
- **Vuetify Breakpoints**: xs, sm, md, lg, xl following Material Design
- **Touch Optimization**: 44px minimum touch targets on mobile
- **Content Adaptation**: Different spacing behavior between desktop and mobile

#### Mobile Optimization

- **Navigation**: Simplified navigation patterns for mobile
- **Touch Targets**: Enhanced spacing for touch interaction
- **Content Density**: Reduced spacing on mobile for better mobile UX
- **Performance**: Optimized loading and rendering for mobile devices

#### Desktop Enhancement

- **Generous Spacing**: More spacious layouts on larger screens
- **Advanced Navigation**: Full navigation features and hover states
- **Multi-Column Layouts**: Utilize available screen real estate
- **Enhanced Interactions**: Hover effects and advanced UI patterns

### Animation and Motion

#### Animation Principles

- **Subtle and Professional**: One-time animations on component load
- **Accessibility First**: Respects prefers-reduced-motion preferences
- **Performance Optimized**: GPU-accelerated animations where possible
- **Purposeful Motion**: Animations enhance UX, not distract

#### Reduced Motion Support

- **System Preference**: Automatically detects and respects user preference
- **Graceful Degradation**: Full functionality without animations
- **Alternative Feedback**: Non-motion feedback for state changes
- **User Control**: Option to disable animations if needed

### Accessibility Integration

#### Visual Accessibility

- **High Contrast**: 8:1 contrast ratio exceeding WCAG requirements
- **Color Independence**: Information not conveyed by color alone
- **Scalable Text**: Text scales up to 200% without loss of functionality
- **Clear Visual Hierarchy**: Proper use of headings and visual structure

#### Interaction Accessibility

- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Focus Management**: Logical tab order and visible focus indicators
- **Screen Reader Support**: Proper ARIA labels and semantic markup
- **Touch Accessibility**: Appropriate touch target sizes and spacing

## Navigation Structure

### Menu Configuration and Management

#### Menu System Architecture

- **Single Source of Truth**: `/config/menu.config.json` controls all navigation
- **Hierarchical Structure**: Parent menus with structured submenus
- **Dynamic Generation**: Menu items generated from configuration during build

#### Primary Navigation Structure

**"The 2024-2029 Plan" Parent Menu:**

- Executive Summary
- Violence Prevention from a Public Health Approach
- Guiding Principles
- Planning Process
- Goals and Recommendations
- References

**Additional Navigation:**

- Home
- News
- Contact
- Download
- More (consolidated menu with three-dot icon)

#### Consolidated "More" Menu System

- **Desktop**: Three-dot icon for compact navigation
- **Mobile**: "More" text link for clarity
- **Contents**: Legal pages, accessibility documentation, additional resources

### Routing Patterns and Implementation

#### Hash-Based Routing

- **Smooth Scrolling**: 80px offset for fixed navigation
- **URL Fragments**: Support for deep linking to content sections
- **Accessibility**: Proper focus management for hash navigation

#### File-Based Routing

- **Automatic Routes**: Nuxt generates routes from file structure
- **Dynamic Routes**: `[...slug].vue` handles content routing
- **Catch-All**: Flexible routing for content management system

#### Circular Navigation

- **Report Pages**: Previous/next navigation between plan sections
- **Page Titles**: Actual page titles from YAML frontmatter
- **Summaries**: Brief descriptions for context
- **Visual Navigation**: Prominent navigation arrows with proper positioning

### Content Organization Patterns

#### Content Hierarchy

```
/content/                       # Content files (outside app/ directory)
├── index.md                    # Homepage
├── plan/                       # Main plan content
│   ├── front-cover.md
│   ├── executive-summary.md
│   ├── public-health-approach.md
│   ├── guiding-principles.md
│   ├── planning-process.md
│   ├── goals-and-recommendations.md
│   └── references.md
├── accessibility/              # Accessibility documentation
├── legal/                      # Legal pages
├── news/                       # News and updates
├── contact.md                  # Contact information
└── download.md                 # Download page
```

#### URL Structure

- **Clean URLs**: `/plan/executive-summary` (no .html extension)
- **Logical Hierarchy**: URLs reflect content organization
- **SEO Friendly**: Descriptive URLs for search engines
- **Consistent Patterns**: Predictable URL structure

### Footer Navigation and Links

#### Footer Structure

- **Organization Info**: ICJIA contact information and address
- **Quick Links**: Key navigation items
- **Downloads**: PDF and LLMs with icons
- **Legal**: Privacy policy, terms of service
- **Accessibility**: Links to accessibility documentation

#### Link Styling Standards

- **Anchor Links**: Heavier font weight (600-700) for consistency
- **No Underlines**: Clean appearance for buttons and download pages
- **Consistent Styling**: Uniform link appearance across site
- **Accessibility**: Proper contrast and focus states

## Content Management

### Working with Nuxt Content v3

#### Content File Structure

All content is managed through markdown files with YAML frontmatter:

```yaml
---
title: "Page Title"
date: 2025-06-20
description: "SEO description"
tags: ["violence-prevention", "public-health"]
---
# Page Content
Markdown content goes here...
```

#### Content Processing Pipeline

1. **Markdown Parsing**: Nuxt Content processes markdown files
2. **Frontmatter Extraction**: YAML metadata parsed and available
3. **Content Transformation**: Markdown converted to HTML
4. **Component Integration**: Custom components available in markdown
5. **Search Indexing**: Content indexed for search functionality

### Markdown Files and YAML Frontmatter

#### Required Frontmatter Fields

- **title**: Page title (required)
- **description**: SEO description (required)
- **date**: Publication/update date (YYYY-MM-DD format)

#### Optional Frontmatter Fields

- **tags**: Array of content tags
- **author**: Content author
- **lastModified**: Last modification date
- **featured**: Boolean for featured content

#### Markdown Extensions

- **GitHub Flavored Markdown**: Tables, strikethrough, task lists
- **Custom Components**: Vue components available in markdown
- **Footnotes**: Automatic footnote processing
- **Syntax Highlighting**: Code block highlighting (when enabled)

### Image Management and Optimization

#### Image Storage

- **Location**: `/public/images/` directory
- **Organization**: Logical subdirectories by content type
- **Naming**: Descriptive filenames with hyphens

#### Image Requirements

- **Alt Text**: Required for all images (accessibility)
- **Formats**: WebP preferred, fallback to PNG/JPG
- **Sizing**: Appropriate dimensions for use case
- **Optimization**: Compressed for web delivery

#### Image Component Usage

```markdown
![Descriptive alt text](/images/example-image.webp)
```

### Content Validation and Quality Assurance

#### Automated Validation

- **Frontmatter Validation**: Required fields checked during build
- **Link Validation**: Internal links verified
- **Image Validation**: Alt text and file existence checked
- **Markdown Validation**: Syntax and structure validation

#### Content Standards

- **Writing Style**: Clear, professional, accessible language
- **Structure**: Proper heading hierarchy (h1 → h2 → h3)
- **Links**: Descriptive link text, no "click here"
- **Accessibility**: Alt text, proper markup, clear structure

## Maintenance

### Audit Log Procedures

#### Accessibility Audit Logs

- **Primary Log**: `audit-log-accessibility.md` (detailed technical log)
- **Public Log**: `content/accessibility/audit-log.md` (user-facing)
- **Sync Process**: Automated synchronization via `yarn sync:accessibility-audit`
- **Update Frequency**: After each accessibility-related change

#### Project Audit Logs

- **Technical Changes**: `audit-log-project.md`
- **Format**: Chronological entries with date, summary, files modified
- **Content**: Implementation details, rationale, technical notes
- **Maintenance**: Updated with each significant project change

### Testing Guidelines and Procedures

#### Automated Testing

```bash
# Run full test suite
yarn test

# Watch mode for development
yarn test:watch

# Coverage reporting
yarn test:coverage
```

#### Manual Testing Checklist

1. **Functionality**: All features work as expected
2. **Accessibility**: Keyboard navigation, screen reader compatibility
3. **Performance**: Page load times, Core Web Vitals
4. **Cross-Browser**: Chrome, Firefox, Safari, Edge
5. **Mobile**: Responsive design, touch targets
6. **Content**: Accuracy, links, images

#### Accessibility Testing

- **Screen Readers**: Test with NVDA, JAWS, VoiceOver
- **Keyboard Navigation**: Tab through all interactive elements
- **Color Contrast**: Verify 8:1 contrast ratios
- **Mobile Accessibility**: Touch targets, screen reader compatibility

### Ongoing Development Practices

#### Regular Maintenance Tasks

- **Dependency Updates**: Monthly security and feature updates
- **Content Review**: Quarterly content accuracy review
- **Accessibility Audit**: Quarterly comprehensive accessibility assessment
- **Performance Monitoring**: Ongoing Core Web Vitals monitoring

#### Documentation Maintenance

- **Code Documentation**: JSDoc comments for all functions
- **README Updates**: Keep setup instructions current
- **Audit Logs**: Document all significant changes
- **API Documentation**: Update with any API changes

#### Quality Assurance

- **Code Reviews**: All changes require review
- **Testing Requirements**: Tests for new features
- **Accessibility Compliance**: WCAG 2.1 AA verification
- **Performance Standards**: Meet Core Web Vitals targets

---

**Document Version**: 2.0
**Last Updated**: July 18, 2025
**Next Review**: October 18, 2025

**Major Updates in Version 2.0:**

- Nuxt 4 migration completed with modern directory structure
- Cookie-based theme system with SSR compatibility
- Enhanced cross-browser support (especially Safari)
- FOUC elimination through server-side theme application
- Updated architecture documentation reflecting Nuxt 4 patterns
