# Violence Prevention Plan for Illinois: 2025-2029

The first Statewide Violence Prevention Plan, for 2020-2024, was released in 2021. Since then, a
variety of implementation, research, and activities have taken place. The Ad Hoc Violence Prevention
Committee and its workgroups reviewed these activities, reports, and research, discussing ways in
which this work could be used to inform the next violence prevention plan, collectively writing the
2025-2029 goals and recommendations.

## Project Overview

This project serves as the official web presence for the Violence Prevention Plan for Illinois: 2025-2029. It features:

- Modern, responsive design using Vuetify 3 components
- Accessibility-first development approach (WCAG 2.1 AA compliant)
- Dynamic content rendering with Nuxt Content
- Comprehensive documentation for developers and users
- Subtle animations with reduced motion support
- Dark/light theme with persistent user preferences
- Full-text search functionality across all content with Defuddle-enhanced content extraction

## Key Dependencies

This project is built on several exceptional open-source libraries that make our advanced functionality possible:

### Core Framework and Content Management
- **[Nuxt 3](https://nuxt.com/)** - The intuitive Vue framework that powers our application architecture
- **[Nuxt Content](https://content.nuxt.com/)** - File-based CMS that enables our dynamic content rendering and markdown processing
- **[Vue 3](https://vuejs.org/)** - The progressive JavaScript framework providing our reactive UI components
- **[Vuetify 3](https://vuetifyjs.com/)** - Material Design component framework ensuring consistent, accessible UI elements

### Search and Content Processing
- **[Defuddle](https://github.com/kepano/defuddle)** by [Stephan Ango](https://github.com/kepano) - Advanced content extraction library that powers our enhanced search indexing by extracting clean, readable content from rendered pages
- **[Fuse.js](https://fusejs.io/)** - Lightweight fuzzy-search library providing our powerful, tolerant search functionality across all site content

### Development and Accessibility Tools
- **[VueUse](https://vueuse.org/)** - Collection of essential Vue composition utilities that enhance our development efficiency
- **[Vitest](https://vitest.dev/)** - Fast unit testing framework ensuring code quality and reliability

These dependencies enable us to provide a modern, accessible, and highly functional web experience while maintaining excellent performance and developer experience.

## Recent Major Updates (May 25, 2025)

### Defuddle-Enhanced Search Index with fullPath Implementation
- **Enhanced Search Index**: Implemented comprehensive fullPath field providing complete URL information for all indexed content
- **Homepage Path Normalization**: Standardized homepage path from `/index` to `/` following web conventions
- **Site Configuration Integration**: Enhanced baseURL integration with fallback defaults for robust URL construction
- **6x Performance Improvement**: Achieved dramatic improvement in content capture (from ~500 to 3,267 words across all content)
- **Clean Search Results**: Removed HTML tags and markdown formatting for professional, readable search results
- **Comprehensive Documentation**: Updated all search-related documentation with fullPath implementation details

### Comprehensive Search Security Audit and Enhancement
- **Security**: Conducted comprehensive security audit and implemented robust multi-layered protection
- **XSS Protection**: Enhanced sanitization, dangerous content detection, and safe result rendering
- **DoS Prevention**: Query length limits, debouncing, and rate limiting measures
- **Content Security**: Comprehensive search index sanitization removing potentially dangerous code
- **Compliance**: Meets OWASP security standards while maintaining full accessibility

### Comprehensive Sitemap Generation System
- **New**: Automated XML sitemap generation following sitemaps.org protocol
- **Features**: Configurable priorities, change frequencies, intelligent exclusions, URL sanitization
- **Integration**: Seamlessly integrates with existing site configuration and build pipeline
- **SEO**: Automatically referenced in robots.txt for optimal search engine discovery

### Unified Logging System
- **New**: Comprehensive logging system that works consistently across Node.js and browser environments
- **Features**: Configurable verbosity levels (DETAILED, NORMAL, CONCISE), color-coded output, message grouping
- **Command Line**: Support for `--verbose` and `--quiet` flags on all build scripts

### Configuration System Reorganization
- **Reorganized**: Site configuration system for improved clarity and separation of concerns
- **New**: `site.config.json` for general site configuration (metadata, branding, contact info, logging)
- **Updated**: `routes.config.json` focuses specifically on page discovery and routing metadata
- **Removed**: `site.config.base.json` (consolidated into `site.config.json`)

### Package Manager Standardization
- **Standardized**: Yarn as the official package manager for all operations
- **Updated**: All script examples and documentation now use `yarn` commands
- **New**: Verbose and quiet script variants (e.g., `yarn dev:verbose`, `yarn build:quiet`)

### Documentation and Standards
- **New**: [Project Rules](./docs/project-rules.md) document establishing mandatory development standards
- **New**: [Logging System](./docs/logging-system.md) comprehensive documentation
- **New**: [Sitemap Configuration](./docs/sitemap.config.md) comprehensive sitemap documentation
- **Updated**: All configuration documentation to reflect new system organization

## Site Structure

The site is organized into the following main sections:

### Core Pages
- **Home (/)**: Main landing page with project overview and key highlights
- **About (/about)**: Detailed information about the Violence Prevention Plan project
- **Search (/search)**: Defuddle-enhanced full-text search functionality across all site content with clean, readable results
- **Dynamic Content ([slug])**: Catch-all page that renders any markdown content from `/content/` directory

### Projects Section
- **Youth Intervention (/projects/youth-intervention)**: Information about youth-focused violence prevention initiatives
- **Community Outreach (/projects/community-outreach)**: Details about community engagement and outreach programs

### External Resources
The navigation also provides quick access to external resources:
- CDC Violence Prevention resources
- WHO Violence Prevention information
- Illinois Criminal Justice Information Authority (ICJIA) website

### Accessibility Resources
- **Accessibility Documentation**: User guide to accessibility features (available at `/accessibility-documentation.html`)
- **Accessibility Audit Log**: Technical assessment of compliance status (available at `/audit-log-accessibility.html`)

### Development Tools and Systems
- **Unified Logging System**: Comprehensive logging that works consistently across Node.js and browser environments
- **Configurable Verbosity**: DETAILED, NORMAL, and CONCISE logging levels with command-line support
- **Package Manager**: Yarn is the official package manager with verbose/quiet script variants
- **Configuration Management**: Centralized configuration system with comprehensive documentation

*Last Updated: May 25, 2025*

## Dev Site

The development version of this site is available at:

**[https://vpp-2025.netlify.app](https://vpp-2025.netlify.app)**

This development site is automatically updated with the latest changes from the main branch and serves as a preview environment before production deployment.

## Setup

Make sure to install the dependencies:

```bash
# Using Yarn (recommended)
yarn install

# Using npm
npm install
```

## Development Server

Start the development server on http://localhost:8000 (automatically opens in browser):

```bash
# Using Yarn (recommended)
yarn dev

# Using npm
npm run dev
```

This command will:
1. Generate accessibility documentation HTML files
2. Create a fresh Defuddle-enhanced search index with fullPath support
3. Generate site configuration with page discovery and deduplication
4. Generate XML sitemap with SEO-optimized metadata
5. Start the development server on http://localhost:8000

## Production Build

Generate a static site for production:

```bash
# Using Yarn (recommended)
yarn generate

# Using npm
npm run generate
```

### Verbose and Quiet Builds

The project now supports configurable logging levels for all build operations:

```bash
# Detailed logging (DETAILED level)
yarn dev:verbose
yarn build:verbose
yarn generate:verbose

# Minimal logging (CONCISE level)
yarn dev:quiet
yarn build:quiet
yarn generate:quiet
```

This command will:
1. Generate accessibility documentation HTML files
2. Create a fresh Defuddle-enhanced search index with fullPath support
3. Generate site configuration with page discovery and deduplication
4. Generate XML sitemap with SEO-optimized metadata
5. Generate the static site with Nuxt

Build the application for server-side rendering:

```bash
# Using Yarn (recommended)
yarn build

# Using npm
npm run build
```

Locally preview production build:

```bash
# Using Yarn (recommended)
yarn preview

# Using npm
npm run preview
```

## Testing

The project includes a comprehensive test suite using Vitest and Vue Test Utils:

```bash
# Run all tests
yarn test

# Run tests in watch mode during development
yarn test:watch

# Run tests with coverage report
yarn test:coverage
```

## Audit Logs

This project maintains detailed audit logs to track all significant changes made to the codebase. The audit logs serve as chronological records providing transparency and accountability for external reviewers and future developers.

- [Project Audit Log](./audit-log-project.md)  Tracks all development changes, features, and improvements
- [Accessibility Audit Log](./audit-log-accessibility.md)  Documents accessibility assessments and compliance status

## Development Practices

### Project Structure

The project follows a structured organization pattern:

- **Pages**: Follows the same structure as the content directory for proper routing
  - `/pages/projects/` contains pages that render content from `/content/projects/`
  - This alignment ensures proper Vue Router navigation and content fetching
- **Content**: Organized in a hierarchical structure that matches the routing
  - `/content/projects/` contains markdown files for project-related pages
  - Content files include frontmatter for metadata (title, description, etc.)
- **Components**: Reusable UI elements organized by function
  - `ContentDisplay.vue` provides a standardized way to render markdown content
  - `ImageWithSpinner.vue` handles image loading with accessibility features
- **Config**: Configuration files with comprehensive documentation
  - `menu.config.json` and `menu.config.md` for navigation structure
  - `fuse.config.json` and `fuse.config.md` for search functionality
  - `site.config.json` and `site.config.md` for general site configuration
  - Auto-generated files like `routes.config.json` for runtime routing metadata

### Content Management

The project uses Nuxt Content for dynamic content rendering:

- Markdown files in the `/content` directory are automatically available as routes
- Content is fetched using the `useContentFetcher` composable
- Dynamic rendering with proper loading states and error handling
- Fallback content displayed when content fetching fails
- SEO metadata derived from content frontmatter
- Defuddle-enhanced search functionality with automatically generated search index that captures all visible content, including fullPath support for complete URL information

### Configuration Documentation

The project uses a comprehensive configuration system with accompanying markdown documentation for all major features. Configuration files are located in the `/config/` directory and are automatically processed during build operations.

#### Configuration Files Overview

| File | Purpose | Generated | Documentation |
|------|---------|-----------|---------------|
| `menu.config.json` | Navigation structure for header and footer | Manual | [Menu Configuration](./config/menu.config.md) |
| `fuse.config.json` | Search functionality settings and indexing rules | Manual | [Search Configuration](./config/fuse.config.md) |
| `defuddle-search.config.md` | Defuddle-enhanced search system documentation | Manual | [Defuddle Search Configuration](./config/defuddle-search.config.md) |
| `site.config.json` | General site configuration and metadata | Manual | [Site Configuration](./config/site.config.md) |
| `sitemap.config.json` | XML sitemap generation settings and SEO metadata | Manual | [Sitemap Configuration](./config/sitemap.config.md) |
| `routes.config.json` | Complete site page catalog and routing metadata | Auto-generated | [Routes Configuration](./config/routes.config.md) |

#### Auto-Generated Configuration Files

The following configuration files are automatically generated during the build process:

**Routes Configuration (`routes.config.json`)**
- **Generated during**: `yarn dev`, `yarn build`, `yarn generate`
- **Purpose**: Comprehensive catalog of all pages in the project with metadata
- **Contains**: Page titles, paths, URLs, types (content/vue/combined), and source file references
- **Features**: Intelligent deduplication, title extraction, blacklist filtering
- **Current Status**: Contains 5 total pages (4 content pages, 5 Vue pages, 4 combined pages)
- **Runtime Access**: Available via site configuration composables

#### Manual Configuration Files

**Menu Configuration (`menu.config.json`)**
- **Purpose**: Defines navigation structure for header and footer menus
- **Contains**: Menu items, external links, dropdown structures, accessibility settings
- **Usage**: Processed by navigation components for consistent site navigation

**Search Configuration (`fuse.config.json`)**
- **Purpose**: Controls search functionality and content indexing
- **Contains**: Fuse.js settings, blacklist patterns, text extraction rules
- **Features**: Fuzzy search parameters, duplicate handling, content normalization

**Site Configuration (`site.config.json`)**
- **Purpose**: General site configuration including metadata, branding, and settings
- **Contains**: Project metadata, branding information, contact details, feature flags, routing settings, logging configuration
- **Usage**: Provides centralized configuration for site-wide settings and metadata
- **New Features**: Includes unified logging system configuration with verbosity levels and color schemes

**Sitemap Configuration (`sitemap.config.json`)**
- **Purpose**: Controls XML sitemap generation for SEO optimization following sitemaps.org protocol
- **Contains**: Priority settings, change frequencies, exclusion rules, validation options, logging configuration
- **Features**: Configurable priorities for different page types, intelligent exclusions, URL sanitization, automatic route discovery
- **Output**: Generates `/public/sitemap.xml` automatically referenced in robots.txt for search engine discovery
- **Integration**: Uses existing route discovery and blacklist systems for consistent content management

#### Configuration Documentation

Each configuration system includes comprehensive markdown documentation:

- **[Menu Configuration](./config/menu.config.md)**: Navigation structure and dropdown menus
- **[Search Configuration](./config/fuse.config.md)**: Search functionality and content indexing
- **[Defuddle Search Configuration](./config/defuddle-search.config.md)**: Enhanced search system with fullPath support and 6x performance improvement
- **[Defuddle-Enhanced Search System](./docs/defuddle-enhanced-search-system.md)**: Comprehensive documentation of the enhanced search architecture and implementation
- **[Site Configuration](./config/site.config.md)**: General site configuration and metadata
- **[Sitemap Configuration](./config/sitemap.config.md)**: XML sitemap generation and SEO optimization
- **[Routes Configuration](./config/routes.config.md)**: Automatic page discovery and routing metadata
- **[Search Security Audit](./docs/search-security-audit.md)**: Comprehensive security audit and protection measures
- **[Project Rules](./docs/project-rules.md)**: Mandatory standards and rules for development
- **[Logging System](./docs/logging-system.md)**: Unified logging system documentation

These documentation files provide:
- Detailed explanations of each configuration option
- Usage examples for common scenarios
- Best practices for modifying configurations
- Integration points with other systems
- Runtime and build-time access patterns
- Troubleshooting guides and limitations

### Project Standards and Rules

The project follows mandatory standards and rules documented in [Project Rules](./docs/project-rules.md):

#### Package Manager Standard
- **Yarn is the official package manager** for all operations
- All script examples and documentation use `yarn` commands
- Internal package.json scripts use `yarn` instead of `npm run`
- Package execution uses `yarn dlx` instead of `npx`

#### Development Standards
- **WCAG 2.1 AA compliance** is mandatory for all UI/UX updates
- **Comprehensive documentation** required for all new features
- **Unified logging system** must be used for all server-side scripts
- **Centralized configuration** system for all site-wide settings

### Code Documentation

The project follows strict documentation standards to ensure maintainability and knowledge transfer:

- Comprehensive JSDoc comments for all components, composables, and functions
- Detailed inline comments explaining complex logic
- CSS documentation explaining the purpose of style rules
- Accessibility considerations documented throughout the codebase
- Usage examples for reusable components and composables

### VueUse Integration

The project leverages [VueUse](https://vueuse.org/) composables for common functionality:

- `useLocalStorage` for persistent state management
- Timing utilities for animations and interactions
- DOM utilities for event handling and element interactions
- Sensor hooks for responsive design

### Unified Logging System

The project implements a comprehensive unified logging system that works consistently across both Node.js (server-side) and browser environments:

#### Features
- **Environment Detection**: Automatically detects Node.js vs browser and applies appropriate formatting
- **Configurable Verbosity**: Three levels (DETAILED, NORMAL, CONCISE) with smart filtering
- **Color-coded Output**: Consistent green/red/yellow/cyan color scheme across environments
- **Message Grouping**: Cleaner build output with grouped messages for related operations
- **Performance Timing**: Built-in timing functions for measuring operation duration
- **Scoped Logging**: Context-specific loggers for better organization

#### Server-Side Usage
```javascript
import { createLogger } from '../utils/logger.js';
const logger = createLogger(config).createScope('MyScript');
logger.success('✅ Operation completed successfully!');
```

#### Browser Usage
```javascript
import { useConsoleLogger } from '~/composables/useConsoleLogger';
const { logUI, logError } = useConsoleLogger();
logUI('Button clicked', { id: 'submit-btn' });
```

#### Command Line Control
```bash
# Verbose output
yarn dev:verbose

# Quiet output
yarn build:quiet

# Individual script
node scripts/generate-site-config.js --verbose
```

**Note:** Console logging is currently enabled in all environments (including production) during the pre-launch phase for monitoring and debugging purposes. This will be revisited before the official launch.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Accessibility

The Violence Prevention Plan for Illinois: 2025-2029 is committed to providing an accessible experience for all users. The project targets WCAG 2.1 AA compliance as its primary standard, with many aspects exceeding AA requirements.

### Current Accessibility Compliance Status

Our project maintains excellent WCAG 2.1 AA compliance across all implemented components. Recent accessibility assessments confirm that:

- All components meet or exceed WCAG 2.1 AA standards
- Many elements exceed AA requirements, approaching AAA levels where feasible
- All interactive elements are fully keyboard accessible with visible focus states
- All content maintains proper color contrast ratios (minimum 4.5:1, with many elements exceeding 7:1)
- The site is fully compatible with major screen readers and assistive technologies
- Specialized accessibility components ensure consistent behavior across the application

### Key Accessibility Features

- Skip-to-content functionality for keyboard users
- Proper semantic structure with appropriate ARIA landmarks and roles
- Keyboard navigation for all interactive elements with visible focus states
- High contrast ratios (minimum 4.5:1, with many elements exceeding 7:1)
- Screen reader announcements for dynamic content using ARIA live regions
- Support for reduced motion preferences via CSS media queries
- Consistent focus management across all components
- Accessible image loading with proper ARIA attributes and loading states
- Accessible tooltips with auto-dismiss functionality on mobile devices
- Comprehensive JSDoc documentation of accessibility features

### Specialized Accessibility Components

- **AccessibleTooltip**: Enhanced tooltips with proper ARIA attributes and mobile auto-dismiss
- **Screen Reader Announcer**: System for announcing dynamic content changes to screen readers
- **Accessibility Documentation Utilities**: Tools for accessing and generating accessibility documentation

### Developer Documentation

The codebase includes comprehensive JSDoc comments and inline documentation that explain:

- How accessibility features are implemented
- The purpose of ARIA attributes and roles
- Reduced motion accommodations for animations
- Screen reader considerations for dynamic content
- Focus management techniques
- Color contrast requirements
- Mobile-specific accessibility considerations

This documentation helps ensure that future development maintains the project's high accessibility standards.

### Accessibility Resources

- [Accessibility Documentation](./accessibility-documentation.md): User guide to accessibility features
- [Accessibility Audit Log](./audit-log-accessibility.md): Technical assessment of compliance status

These resources are also available as HTML pages directly accessible via URL:
- `/accessibility-documentation.html`: User-facing documentation
- `/audit-log-accessibility.html`: Technical audit log
