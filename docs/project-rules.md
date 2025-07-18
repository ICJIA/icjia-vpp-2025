# Project Rules and Standards

**Last Updated: July 18, 2025**

## Overview

This document defines the mandatory rules and standards for the Violence Prevention Plan for Illinois: 2025-2029 project. These rules ensure consistency, maintainability, and quality across all development work.

## Framework and Architecture

### Nuxt 4.0.0 with Modern Directory Structure

**Current Status**: Successfully migrated to Nuxt 4.0.0 with new directory structure (completed July 2025).

#### Nuxt 4 Migration Summary

The project has been successfully migrated from Nuxt 3 to Nuxt 4.0.0, implementing the new directory structure and build system improvements:

**Key Changes from Nuxt 3 to Nuxt 4:**

- **New App Directory Structure**: All application code moved to `app/` directory
- **Enhanced Build Output**: Uses `.output/` directory instead of legacy build directories
- **Improved Performance**: Better tree-shaking and bundle optimization
- **TypeScript Integration**: Enhanced TypeScript support with better type inference
- **Backward Compatibility**: Maintains compatibility with existing Nuxt 3 patterns

#### Directory Structure Rules

**Current Project Structure (Nuxt 4.0.0):**

1. **App Directory** (`app/`): All application code organized under the new Nuxt 4 structure:

   ```
   app/
   ├── app.vue                    # Root application component
   ├── error.vue                  # Global error page
   ├── router.options.ts          # Router configuration
   ├── assets/                    # Static assets and CSS
   │   └── css/                   # Global stylesheets
   ├── components/                # Vue components
   │   ├── content/               # Content-specific components
   │   ├── dev/                   # Development utilities
   │   └── seo/                   # SEO components
   ├── composables/               # Composition API utilities
   ├── layouts/                   # Layout templates
   │   └── default.vue            # Default layout
   ├── pages/                     # Route pages
   │   ├── [...slug].vue          # Dynamic content pages
   │   ├── index.vue              # Homepage
   │   ├── news.vue               # News section
   │   └── search.vue             # Search page
   ├── plugins/                   # Nuxt plugins
   │   ├── *.client.js            # Client-side plugins
   │   ├── *.ts                   # TypeScript plugins
   │   └── vuetify.ts             # Vuetify configuration
   └── utils/                     # Utility functions
       ├── config-loader.js       # Configuration utilities
       ├── logger.js              # Logging system
       └── sanitize.js            # Content sanitization
   ```

2. **Root Directory**: Configuration and content remain in project root:

   ```
   ├── content/                   # Nuxt Content files
   │   ├── accessibility/         # Accessibility documentation
   │   ├── legal/                 # Legal pages
   │   ├── news/                  # News articles (disabled)
   │   └── plan/                  # Main plan content
   ├── config/                    # Configuration files
   │   ├── *.config.json          # JSON configurations
   │   └── *.config.md            # Configuration documentation
   ├── scripts/                   # Build and utility scripts
   ├── server/                    # Server-side code
   ├── public/                    # Static public assets
   ├── docs/                      # Internal project documentation
   └── tests/                     # Test files
   ```

3. **Build Output** (`.output/`): Nuxt 4's optimized build directory:

   ```
   .output/
   ├── nitro.json                 # Nitro configuration
   └── public/                    # Generated static files
       ├── _nuxt/                 # Bundled assets
       ├── data/                  # Generated data files
       └── [pages]                # Static HTML pages
   ```

4. **Legacy Directories**: These directories may exist but are not part of the active build:
   - `dist/` - Legacy build output (replaced by `.output/`)
   - `out/` - Legacy documentation output

#### Import Path Rules

- **Config Imports**: Use relative paths from app directory: `../../../config/`
- **Utility Imports**: Build scripts import from `app/utils/` directory
- **Component Auto-imports**: Components auto-import from `app/components/`
- **Composable Auto-imports**: Composables auto-import from `app/composables/`

#### Migration Compliance

- **Zero Breaking Changes**: All functionality preserved during Nuxt 4 migration
- **Performance Standards**: Bundle size optimized with Nuxt 4 improvements
- **Build Compatibility**: All build commands (`yarn dev`, `yarn build`, `yarn generate`) work without changes
- **Accessibility Preservation**: WCAG 2.1 AA compliance maintained throughout migration

## Package Manager Standard

### Rule: Yarn is the Official Package Manager

**Mandatory**: All script run examples, documentation, and internal processes must use Yarn, not npm.

#### Implementation Requirements

1. **Documentation Examples**: All command examples in documentation must use `yarn` syntax

   ```bash
   # Correct
   yarn dev
   yarn build
   yarn generate

   # Incorrect
   npm run dev
   npm run build
   npm run generate
   ```

2. **Package.json Scripts**: Internal script calls must use `yarn` instead of `npm run`

   ```json
   {
     "scripts": {
       "build": "yarn create:accessibility-html && yarn create:search-index-defuddle && nuxt build"
     }
   }
   ```

3. **Package Execution**: Use `npx` for package execution (Yarn 1.22.22 does not support dlx)

   ```bash
   # Correct
   npx serve .output/public

   # Note: yarn dlx is not available in Yarn 1.22.22
   ```

#### Exceptions

- **README.md**: May show both yarn and npm examples for user choice, but yarn must be listed first as recommended
- **Legacy Documentation**: When referencing historical commands, the original package manager may be mentioned for context

#### Rationale

- **Performance**: Yarn provides faster dependency resolution and installation
- **Reliability**: Deterministic dependency resolution with yarn.lock
- **Consistency**: Single package manager across all project processes
- **Developer Experience**: Consistent commands across all documentation

## Accessibility Standards

### Rule: WCAG 2.1 AA Compliance is Mandatory

**Mandatory**: All UI/UX updates must follow WCAG 2.1 AA compliance standards without exception.

#### Implementation Requirements

1. **Color Contrast**: Minimum 4.5:1 ratio for all UI elements (7:1 preferred)
2. **Keyboard Navigation**: All interactive elements must be keyboard accessible
3. **Screen Reader Support**: Proper ARIA labels and semantic HTML
4. **Focus States**: Visible focus indicators for all interactive elements
5. **Documentation**: All accessibility features must be documented in audit logs

#### Compliance Resources

- [Illinois Information Technology Accessibility Act (IITAA) 2.1 Standards](https://doit.illinois.gov/initiatives/accessibility/iitaa/iitaa-2-1-standards.html)
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa)

## Documentation Standards

### Rule: Comprehensive Documentation is Required

**Mandatory**: All new features, components, and configuration changes must include complete documentation.

#### Implementation Requirements

1. **JSDoc Comments**: All functions, components, and composables must have JSDoc documentation
2. **Configuration Documentation**: All config files must have accompanying .md documentation
3. **Usage Examples**: All reusable components must include usage examples
4. **Audit Logs**: All significant changes must be documented in audit logs

## Code Quality Standards

### Rule: Consistent Code Style and Quality

**Mandatory**: All code must follow established patterns and quality standards.

#### Implementation Requirements

1. **Vue 3 Composition API**: Use `<script setup>` syntax consistently
2. **Naming Conventions**:
   - Components: PascalCase (e.g., `AuthWizard.vue`)
   - Composables: camelCase (e.g., `useAuthState.js`)
   - Files/Directories: lowercase-with-dashes
3. **Error Handling**: Proper try/catch blocks and user feedback
4. **Performance**: Optimize for Core Web Vitals and accessibility

## Configuration Management

### Rule: Centralized Configuration System

**Mandatory**: Use the established configuration system for all site-wide settings.

#### Implementation Requirements

1. **Site Configuration**: Use `config/site.config.json` for general settings
2. **Routes Configuration**: Auto-generated `routes.config.json` for page discovery
3. **Menu Configuration**: Use `config/menu.config.json` for navigation
4. **Search Configuration**: Use `config/fuse.config.json` for search settings
5. **Documentation**: All configuration files must have accompanying .md documentation

## Logging Standards

### Rule: Unified Logging System

**Mandatory**: Use the unified logging system for all server-side scripts and browser components.

#### Implementation Requirements

1. **Server Scripts**: Use `utils/logger.js` with scoped loggers
2. **Browser Components**: Use `composables/useConsoleLogger.js`
3. **Verbosity Levels**: Support DETAILED, NORMAL, and CONCISE levels
4. **Color Consistency**: Maintain green/red/yellow/cyan color scheme
5. **Message Grouping**: Use grouped messages for build processes

## Testing Requirements

### Rule: Comprehensive Testing Coverage

**Mandatory**: All new features must include appropriate tests.

#### Implementation Requirements

1. **Unit Tests**: All utility functions and composables must have unit tests
2. **Component Tests**: All Vue components must have component tests
3. **Integration Tests**: Complex features must have integration tests
4. **Accessibility Tests**: All UI components must include accessibility tests

## Git Workflow Standards

### Rule: Structured Git Workflow

**Mandatory**: Follow established git workflow patterns.

#### Implementation Requirements

1. **Branch Naming**: `feature/short-description`, `bugfix/issue-description`
2. **Commit Messages**: Present tense with clear descriptions
3. **Pull Requests**: Detailed descriptions with issue references
4. **Code Review**: At least one review before merging
5. **Clean History**: Squash commits when merging

## Environment Configuration

### Rule: Secure Environment Management

**Mandatory**: Proper handling of environment variables and secrets.

#### Implementation Requirements

1. **Environment Files**: Use `.env` files (not committed to git)
2. **Sample Files**: Provide `.env.sample` files with required variables
3. **Runtime Config**: Use Nuxt's `runtimeConfig` for server-side variables
4. **Public Config**: Use `publicRuntimeConfig` for client-side variables
5. **Security**: Never expose API keys or secrets in client-side code

## Performance Standards

### Rule: Performance Budget Compliance

**Mandatory**: All changes must meet established performance budgets.

#### Performance Targets

- Total bundle size: <250KB (compressed)
- First Contentful Paint: <1.8s on 4G connections
- Time to Interactive: <3.5s on 4G connections
- Largest Contentful Paint: <2.5s
- First Input Delay: <100ms
- Cumulative Layout Shift: <0.1

#### Implementation Requirements

1. **Image Optimization**: Use WebP format and proper sizing
2. **Code Splitting**: Implement dynamic imports where appropriate
3. **Lazy Loading**: Load off-screen components lazily
4. **Bundle Analysis**: Monitor bundle size during development

## Enforcement

### Compliance Monitoring

1. **Code Review**: All rules are enforced during code review process
2. **Automated Testing**: Linting and testing enforce code quality standards
3. **Documentation Review**: Documentation completeness checked before merge
4. **Accessibility Testing**: Manual and automated accessibility testing required

### Violation Handling

1. **Minor Violations**: Address in code review feedback
2. **Major Violations**: Require fixes before merge approval
3. **Repeated Violations**: Additional training or process review
4. **Critical Violations**: Immediate escalation and remediation

## Updates and Maintenance

### Rule Modification Process

1. **Proposal**: Document proposed rule changes with rationale
2. **Review**: Team review and discussion of proposed changes
3. **Approval**: Formal approval required for rule modifications
4. **Documentation**: Update this document and communicate changes
5. **Implementation**: Gradual rollout with support and training

### Regular Review

- **Quarterly**: Review rule effectiveness and compliance
- **Project Milestones**: Assess rules during major project phases
- **Post-Implementation**: Evaluate rule impact after significant changes

## Changelog

### July 18, 2025 - Nuxt 4.0.0 Migration Documentation Update

- **Updated Framework Section**: Documented successful migration to Nuxt 4.0.0
- **New Directory Structure**: Added comprehensive documentation of new `app/` directory structure
- **Build Output Changes**: Documented transition from legacy build directories to `.output/` directory
- **Migration Summary**: Added detailed explanation of key changes from Nuxt 3 to Nuxt 4
- **Import Path Updates**: Updated import path rules for new directory structure
- **Legacy Directory Notes**: Documented legacy directories that may exist but are not part of active build

### May 25, 2025 - Initial Project Rules Documentation

- **Initial Creation**: Established comprehensive project rules and standards
- **Framework Standards**: Defined Nuxt 3 standards and directory structure (pre-migration)
- **Accessibility Requirements**: Established WCAG 2.1 AA compliance standards
- **Code Quality Standards**: Defined coding patterns and quality requirements

_Last Updated: July 18, 2025_
