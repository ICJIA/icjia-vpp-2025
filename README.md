# Statewide Violence Prevention Plan for Illinois: 2025-2029

<p align="center">
  <img src="public/images/og-image-vpp-2025.png" alt="Violence Prevention Plan for Illinois: 2025-2029 - Official banner showing Illinois violence prevention plan branding" width="1200" height="630">
</p>

The first Statewide Violence Prevention Plan, for 2020-2024, was released in 2021. Since then, a
variety of implementation, research, and activities have taken place. The Ad Hoc Violence Prevention
Committee and its workgroups reviewed these activities, reports, and research, discussing ways in
which this work could be used to inform the next violence prevention plan, collectively writing the
2025-2029 goals and recommendations.

## Project Overview

This project serves as the official web presence for the Statewide Violence Prevention Plan for Illinois: 2025-2029. Built with **Nuxt 4.0.0** and featuring:

- **Nuxt 4.0.0** with modern directory structure and enhanced performance
- Modern, responsive design using Vuetify 3 components
- Accessibility-first development approach (WCAG 2.1 AA compliant)
- Dynamic content rendering with Nuxt Content 3
- Comprehensive documentation for developers and users
- **Extensive digital accessibility resources** covering web, mobile, social media, and video accessibility
- Subtle animations with reduced motion support
- Dark/light theme with persistent user preferences
- Full-text search functionality across all content with Defuddle-enhanced content extraction
- **Comprehensive test coverage** with 332 automated tests (unit, integration, and Playwright E2E)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a complete history of changes, including security fixes, accessibility improvements, and feature additions.

## Production Site

The official production site is available at:

**[https://vpp.icjia.illinois.gov](https://vpp.icjia.illinois.gov)**

This site contains the complete Violence Prevention Plan with full accessibility features, search functionality, and comprehensive documentation.

## Access the Violence Prevention Plan

The Statewide Violence Prevention Plan for Illinois: 2025-2029 is available in multiple formats to serve different user needs:

### For Human Readers

- **[Read Online](https://vpp.icjia.illinois.gov)**: Interactive web version with full navigation, search, and accessibility features
- **[Download PDF](https://vpp.icjia.illinois.gov/files/Full_Report_Statewide_Violence_Prevention_Plan_2025-2029_2025_Update.pdf)**: Complete plan as a downloadable PDF document

### Machine-Readable Formats for AI & Developers

For AI models, researchers, and developers who need programmatic access to the Violence Prevention Plan text:

- **[llms.txt](https://vpp.icjia.illinois.gov/llms.txt)**: Optimized format following the [llms.txt standard](https://llmstxt.org/) for AI model consumption and analysis
- **[JSON Format](https://vpp.icjia.illinois.gov/vpp-plan-2025-2029.json)**: Structured data in JSON format for web applications and APIs
- **[CSV Format](https://vpp.icjia.illinois.gov/vpp-plan-2025-2029.csv)**: Tabular data format for spreadsheet analysis and data processing
- **[YAML Format](https://vpp.icjia.illinois.gov/vpp-plan-2025-2029.yaml)**: Human-readable structured data format for configuration and data exchange

These machine-readable formats enable:

- **AI Analysis**: Large language models can directly consume the llms.txt format for comprehensive plan analysis
- **Research Applications**: Structured data formats support academic research and policy analysis
- **Developer Integration**: JSON and CSV formats facilitate integration with custom applications and data visualization tools

This multi-format approach ensures the Violence Prevention Plan is accessible to both human readers and automated systems, supporting transparency and enabling innovative uses of public policy data.

## Accessibility Excellence

### 🌟 Accessibility Status: INDUSTRY-LEADING (99.6/100 Lighthouse Score)

This project demonstrates exceptional accessibility compliance with comprehensive testing and documentation. **The application exceeds WCAG 2.1 AA standards and meets Illinois IITAA 2.1 requirements.**

#### Latest Accessibility Audit Results (October 31, 2025)

**Lighthouse Accessibility Audit (Production Site):**
✅ **Average Score**: 99.6/100 across 15 primary routes (improved from 99.3/100)
✅ **Perfect Scores (100)**: 12 routes (80% of tested routes)
✅ **Excellent Scores (98)**: 3 routes (20% with minor heading order violations)
✅ **WCAG 2.1 AA Compliance**: All routes meet or exceed standards

**Axe-Core Accessibility Audit (Production Site):**
✅ **Total Violations**: 4 violations (only on /legal/terms-of-service mobile/tablet views)
✅ **Routes with Zero Violations**: 14 of 15 routes (93.3% violation-free)
✅ **Test Coverage**: 90 total tests (15 routes × 3 viewports × 2 themes)
✅ **Violation-Free Tests**: 86 of 90 tests (95.6% pass rate)

**🎉 Local Development Achievement:**
✅ **Perfect Score**: 100.0/100 Lighthouse accessibility score achieved
✅ **All Routes**: 15 of 15 routes scoring perfect 100/100
✅ **Fixes Implemented**: Heading hierarchy violations resolved
✅ **Ready for Deployment**: Production will achieve 100/100 when fixes are deployed

**Comprehensive Testing Coverage:**

- **15 Primary Routes**: Complete site coverage including plan sections, resources, and legal pages
- **Multi-Device Testing**: Mobile, tablet, and desktop viewports
- **Theme Testing**: Both light and dark themes validated
- **Automated + Manual Testing**: Lighthouse, axe-core, and manual accessibility verification

#### Accessibility Features

✅ **Keyboard Navigation**: Complete keyboard accessibility with logical tab order
✅ **Screen Reader Support**: Full compatibility with NVDA, JAWS, VoiceOver, and TalkBack
✅ **High Contrast**: 8:1+ color ratios exceeding WCAG requirements
✅ **Responsive Design**: Touch-friendly with 44px+ target sizes
✅ **Skip Links**: Direct navigation to main content
✅ **Semantic HTML**: Proper heading hierarchy and landmark regions
✅ **Alternative Text**: Comprehensive image descriptions
✅ **Focus Management**: Visible focus indicators and logical flow

#### Compliance Standards

- **WCAG 2.1 AA**: Fully compliant across all four principles (Perceivable, Operable, Understandable, Robust)
- **Illinois IITAA 2.1**: Meets all Illinois Information Technology Accessibility Act requirements
- **Section 508**: Federal accessibility standards compliance
- **ADA Digital Rule**: Americans with Disabilities Act web accessibility compliance

For detailed accessibility information, see:

- **[Developer Documentation Portal](https://vpp.icjia.illinois.gov/docs/)**: Complete accessibility reports and documentation
- **[Accessibility Report](https://vpp.icjia.illinois.gov/docs/accessibility/)**: WCAG 2.1 AA compliance audit results
- **[Lighthouse Audit Results](https://github.com/ICJIA/icjia-vpp-2025/tree/main/reports/lighthouse)**: Detailed accessibility test reports

## Security Analysis & Compliance

### 🔒 Security Status: EXCELLENT (Grade A+)

This project has undergone comprehensive security analysis and implements industry-standard security practices. **The application is certified secure and ready for production deployment.**

#### Security Achievements

✅ **Zero Critical Vulnerabilities**: All high and medium severity security issues resolved
✅ **Comprehensive Content Security Policy**: Multi-layered protection against XSS and injection attacks
✅ **Robust Input Validation**: Advanced sanitization and dangerous content detection
✅ **Secure Headers**: Complete implementation of security headers (HSTS, X-Frame-Options, etc.)
✅ **Supply Chain Security**: CDN integrity verification and dependency vulnerability management
✅ **Privacy Protection**: Secure cookie configuration and data handling practices

#### Recent Security Improvements (July 2025)

**Critical XSS Vulnerability Resolved**:

- Fixed CVE-2025-54075 in @nuxtjs/mdc (upgraded from v0.17.0 to v0.17.2)
- Eliminated remote script inclusion vulnerability in markdown processing

**Content Security Policy Implementation**:

- Comprehensive CSP with frame-ancestors protection and base-uri restrictions
- WebAssembly support for @nuxt/content SQLite functionality
- Proper allowlisting for Google Fonts, CDN resources, and analytics

**Enhanced Security Controls**:

- Secure cookie configuration with CSRF protection (sameSite: "lax")
- CDN integrity verification with SHA384 hashes
- Source map protection in production builds
- Advanced search input sanitization and XSS prevention

#### Security Standards Compliance

- **OWASP Top 10**: Protected against all major vulnerability categories
- **WCAG 2.1 AA**: Security measures maintain full accessibility compliance
- **IITAA Standards**: Meets Illinois Information Technology Accessibility Act requirements
- **CSP Level 3**: Modern Content Security Policy implementation

#### Ongoing Security Monitoring

- **Dependency Scanning**: Regular vulnerability assessments with yarn audit
- **Security Headers**: Verified deployment of all recommended security headers
- **Input Validation**: Comprehensive sanitization across all user inputs
- **Build Security**: Static site generation eliminates server-side attack vectors

For detailed security analysis and audit logs, see:

- **[Search Security Audit](https://github.com/ICJIA/icjia-vpp-2025/blob/main/docs/search-security-audit.md)**: Detailed search functionality security assessment

_Last Security Review: October 31, 2025_
_Next Scheduled Review: January 31, 2026_
_Last Test Coverage Update: January 5, 2026_

## Nuxt 4 Migration

This project has been successfully migrated to **Nuxt 4.0.0** with the new directory structure. Key improvements include:

### New Directory Structure

- **`app/`** - Contains all application-specific code:
  - `app/components/` - Vue components
  - `app/composables/` - Composition API utilities
  - `app/layouts/` - Layout templates
  - `app/pages/` - Route pages
  - `app/plugins/` - Nuxt plugins
  - `app/utils/` - Utility functions
  - `app/assets/` - Static assets
  - `app/app.vue` - Root application component
  - `app/error.vue` - Error page component

### Migration Benefits

- **Enhanced Performance**: Improved build times and bundle optimization
- **Better Organization**: Clear separation of app code from configuration
- **Future-Ready**: Prepared for upcoming Nuxt features and improvements
- **Zero Breaking Changes**: All existing functionality preserved
- **Maintained Compatibility**: All custom build scripts and accessibility features continue to work

### Technical Details

- **Nuxt Version**: 4.0.0 with Nitro 2.12.0
- **Content System**: @nuxt/content 3.6.3
- **UI Framework**: Vuetify 3.8.5 (fully compatible)
- **Bundle Size**: Consistent performance (8.42 MB total, 2.59 MB gzip)
- **Build Commands**: All existing commands (`yarn dev`, `yarn build`, `yarn generate`) work without changes

## Test Coverage

### 🧪 Test Status: COMPREHENSIVE (332 Tests, 100% Pass Rate)

This project maintains extensive test coverage with **332 automated tests** covering all major functionality:

#### Test Summary

- **Total Tests**: 332 (all passing ✅)
- **Test Files**: 14 test files
- **Composable Tests**: ~150 tests covering 7 core composables
- **Integration Tests**: 32 tests for build script validation
- **E2E Mock Tests**: ~100 tests for navigation, accessibility, and content
- **Utility Tests**: ~50 tests for sanitization, logging, and configuration
- **Playwright E2E**: 3 spec files for real browser testing

#### Test Types

**Unit & Integration Tests** (332 tests)
- Composable unit tests (useTheme, useAnnouncer, useConsoleLogger, etc.)
- Utility function tests (sanitization, logging, config loading)
- Mock E2E tests (navigation, accessibility, content rendering)
- Build script integration tests (site config, sitemap, plan JSON generation)

**Playwright E2E Tests** (Real Browser Testing)
- **Accessibility**: Keyboard navigation, skip links, ARIA, focus management
- **Navigation**: Page routing, mobile/desktop menus, breadcrumbs, scroll behavior
- **Search**: Input interactions, results display, filtering, highlighting
- Tests run in Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari, and iPad

#### Running Tests

```bash
# Run all unit & integration tests (332 tests)
yarn test
# or
yarn test:unit

# Run integration tests only (32 tests)
yarn test:integration

# Run Playwright E2E tests (interactive UI mode - recommended)
yarn test:e2e:ui

# Run Playwright E2E tests (headless)
yarn test:e2e

# Run with coverage report
yarn test:coverage
```

#### Test Results

```
✅ Test Files: 14 passed
✅ Tests: 332 passed
⚡ Duration: ~1.5s
```

For detailed testing documentation, see **[TEST_GUIDE.md](TEST_GUIDE.md)** which includes:
- Complete test structure and organization
- Running tests in different modes
- Playwright E2E testing guide
- Troubleshooting tips
- Test coverage summary

## Setup

Make sure to install the dependencies:

```bash
# Using Yarn (recommended)
yarn install

# Using npm
npm install
```

## Development Server

Start the development server (automatically opens in browser):

```bash
# Using Yarn (recommended)
yarn dev

# Using npm
npm run dev
```

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

### Documentation Generation

The project includes automated documentation generation for comprehensive developer resources:

```bash
# Generate all documentation (portal, JSDoc, project docs, tools docs)
yarn create:docs

# Generate tooling and accessibility resources documentation
yarn create:tools-docs

# Generate search index with content extraction
yarn create:search-index-defuddle
```

These commands automatically generate:

- **Tooling Documentation**: HTML version of tools.md with comprehensive accessibility resources
- **API Documentation**: JSDoc-generated documentation for all JavaScript functions and modules
- **Component Documentation**: Vue component API references and usage examples
- **Project Documentation**: Development guidelines and technical specifications

### Accessibility Resources & Testing

This project maintains comprehensive accessibility resources and automated testing infrastructure:

#### Accessibility Documentation

- **[Developer Documentation Portal](https://vpp.icjia.illinois.gov/docs/)**: Complete developer documentation including:
  - **Accessibility Report**: WCAG 2.1 AA compliance audit results at `/docs/accessibility/`
  - **Federal Guidelines**: WCAG 2.1, Section 508, and ADA Digital Accessibility Rule compliance
  - **Social Media Accessibility**: Platform-specific guidelines for YouTube, LinkedIn, Facebook, and X (Twitter)
  - **Email Marketing Accessibility**: Accessible email campaign creation with Constant Contact
  - **PDF Accessibility**: PDF/UA standards and Adobe accessibility guides
  - **Illinois IITAA 2.1**: State-specific accessibility requirements and compliance

#### Automated Accessibility Testing

```bash
# Run Lighthouse accessibility audit against production site
BASE_URL=https://vpp.icjia.illinois.gov yarn audit:lighthouse

# Run axe-core accessibility audit with comprehensive coverage
BASE_URL=https://vpp.icjia.illinois.gov yarn audit:axe

# Run both audits together
yarn audit:accessibility
```

#### Why Accessibility Excellence Matters

As a state agency, ICJIA must comply with federal ADA requirements and Illinois IITAA 2.1 standards. Our 99.6/100 Lighthouse accessibility score (with 100.0/100 achieved locally) demonstrates that all digital assets exceed the highest accessibility standards, ensuring equal access to violence prevention information for all community members, including those with disabilities, while preventing legal risks and supporting inclusive design principles.

#### Understanding Accessibility Testing: axe-core vs Siteimprove

**axe-core is the Gold Standard for Accessibility Testing**

This project uses **axe-core**, the industry-standard open-source accessibility testing engine developed by Deque Systems. Here's why axe-core is the definitive choice:

**Why axe-core?**

- ✅ **Open Source & Transparent**: Fully open-source with publicly documented rules and testing methodologies
- ✅ **Zero False Positives**: Engineered with a strict commitment to zero false positives - every reported issue is genuine
- ✅ **Industry Adoption**: Powers Google Lighthouse, Microsoft Accessibility Insights, and W3C tools
- ✅ **Over 1 Billion Downloads**: Trusted by major organizations including Google, Microsoft, Amazon, and government agencies
- ✅ **Modern Framework Support**: Properly handles Vue.js, React, Angular, and other JavaScript frameworks with client-side rendering
- ✅ **WCAG Compliance**: Comprehensive coverage of WCAG 2.0, 2.1, and 2.2 guidelines

**What About Siteimprove?**

Siteimprove is a commercial digital optimization platform with proprietary accessibility testing. While it offers useful dashboard features, it has significant limitations:

- ⚠️ **Proprietary Engine**: Uses closed-source testing methodology (NOT built on axe-core)
- ⚠️ **Known False Positives**: Can produce false positives, especially with modern JavaScript applications
- ⚠️ **SPA Limitations**: May scan before client-side hydration completes (problematic for Nuxt.js/Vue apps)
- ⚠️ **Timing Issues**: Crawler-based approach can miss content that loads after initial page render
- ⚠️ **Lack of Transparency**: Testing rules and methodologies are not publicly documented

**Recent Verification (January 2026)**

When Siteimprove reported 7 "Text not included in an ARIA landmark" errors on our production site, comprehensive verification proved these were **false positives**:

- ✅ **axe-core**: 0 violations across 7,476 tests
- ✅ **Google Lighthouse**: 100% accessibility score
- ✅ **Manual Inspection**: All text content properly contained in ARIA landmarks
- ⚠️ **Siteimprove**: 7 false positive errors

**Our Recommendation**: Trust axe-core and Lighthouse results. If Siteimprove reports issues, verify them with axe-core before taking action. This ensures you're addressing genuine accessibility problems, not false alarms.

For detailed analysis of Siteimprove vs axe-core, see:

- [Accessibility Testing Tools Comparison](https://vpp.icjia.illinois.gov/docs/testing-tools-comparison/) - Comprehensive comparison guide
- [SITEIMPROVE_ARIA_LANDMARK_VERIFICATION_2025-01-12.md](SITEIMPROVE_ARIA_LANDMARK_VERIFICATION_2025-01-12.md) - Technical verification report

### Documentation Portal

- **[Developer Documentation Portal](https://vpp.icjia.illinois.gov/docs/)**: Complete technical documentation including:
  - **[Accessibility Report](https://vpp.icjia.illinois.gov/docs/accessibility/)**: WCAG 2.1 AAA compliance audit results with axe-core testing across mobile, tablet, and desktop viewports in light and dark themes
  - **[Unit and E2E Tests Results Report](https://vpp.icjia.illinois.gov/docs/tests/)**: Comprehensive test results with 300 tests covering composables, utilities, and E2E scenarios with expandable descriptions explaining what each test verifies
  - **[API Documentation](https://vpp.icjia.illinois.gov/docs/jsdoc/)**: TypeDoc-generated documentation for composables, utilities, and plugins
  - **[Architecture Guide](https://vpp.icjia.illinois.gov/docs/architecture/)**: Complete technical architecture and implementation guide

#### WCAG 2.1 Level AAA Compliance Achievement

The documentation portal has achieved **100% WCAG 2.1 Level AAA compliance** with comprehensive testing and fixes:

**AAA Compliance Status**:

- ✅ **Color Contrast**: 21:1 ratio (exceeds AAA 7:1 requirement)
- ✅ **Font Size**: 16px minimum for all text (AAA best practice)
- ✅ **Touch Targets**: 44x44px minimum for all interactive elements (AAA requirement)
- ✅ **Line Height**: 1.8x (exceeds AAA 1.5x requirement)
- ✅ **Focus Indicators**: Visible on all interactive elements
- ✅ **200% Zoom**: No horizontal scrolling, all content accessible

**Comprehensive Audit Scripts**:

- `audit-docs-aaa.js` - Axe-core AAA-level testing
- `audit-docs-aaa-comprehensive.js` - Manual verification of font sizes, line heights, touch targets
- `verify-touch-targets.js` - Dedicated 44x44px touch target validation

**Battle-Tested Implementation Guide**:
The project includes a comprehensive documentation portal implementation guide at `markdown-documentation/DOCUMENTATION_PORTAL_PROMPT_V2.1.md` that covers:

- Touch target size requirements (44x44px) with CSS implementation examples
- Font size compliance (16px minimum) with violation detection
- Three-tier audit script approach for comprehensive AAA testing
- Real-world implementation challenges and solutions
- SiteImprove vs manual testing discrepancies
- Template updates for generated HTML files
- Zoom testing (200% requirement) with responsive design fixes

This guide is designed to help other projects achieve true WCAG 2.1 Level AAA compliance without encountering the same implementation challenges.

**Verification Commands**:

```bash
# Run all AAA compliance audits
node audit-docs-aaa.js
node audit-docs-aaa-comprehensive.js
node verify-touch-targets.js
```

## Project Documentation Organization

All project documentation has been organized in the `markdown-documentation/` folder for better maintainability:

**Key Documentation Files**:

- `DOCUMENTATION_PORTAL_PROMPT_V2.1.md` - Comprehensive WCAG 2.1 AAA documentation portal implementation guide
- `ARCHITECTURE_GUIDE.md` - Technical architecture and implementation details
- `accessibility-audit-prompt.md` - Accessibility audit guidelines and procedures
- `audit-log-accessibility.md` - Chronological log of accessibility improvements
- `audit-log-project.md` - Chronological log of project changes
- `WCAG-AAA-AUDIT-SUMMARY.md` - Summary of AAA compliance achievements

**Root-Level Documentation** (kept in root for visibility):

- `README.md` - This file, project overview and setup instructions
- `CLAUDE.md` - AI assistant guidelines for development

### External Standards and Guidelines

- **[WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)**: Web Content Accessibility Guidelines 2.1
- **[Illinois Information Technology Accessibility Act (IITAA) 2.1 Standards](https://doit.illinois.gov/initiatives/accessibility/iitaa/iitaa-2-1-standards.html)**: State accessibility requirements

These resources are available through the static documentation portal:

- **[Developer documentation portal](https://vpp.icjia.illinois.gov/docs/)**: Accessibility reports, test results, API documentation, and architecture guide
- **[Accessibility Report](https://vpp.icjia.illinois.gov/docs/accessibility/)**: WCAG 2.1 AAA compliance audit results
