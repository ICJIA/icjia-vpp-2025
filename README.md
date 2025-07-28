# Statewide Violence Prevention Plan for Illinois: 2025-2029

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
- Subtle animations with reduced motion support
- Dark/light theme with persistent user preferences
- Full-text search functionality across all content with Defuddle-enhanced content extraction

## Dev Site

The development version of this site is available at:

**[https://vpp-2025.netlify.app](https://vpp-2025.netlify.app)**

This development site is automatically updated with the latest changes from the main branch and serves as a preview environment before production deployment.

## Access the Violence Prevention Plan

The Statewide Violence Prevention Plan for Illinois: 2025-2029 is available in multiple formats to serve different user needs:

### For Human Readers

- **[Read Online](https://vpp-2025.netlify.app)**: Interactive web version with full navigation, search, and accessibility features
- **[Download PDF](https://vpp-2025.netlify.app/files/Full_Report_Statewide_Violence_Prevention_Plan_2025-2029_2025_Update.pdf)**: Complete plan as a downloadable PDF document

### Machine-Readable Formats for AI & Developers

For AI models, researchers, and developers who need programmatic access to the Violence Prevention Plan text:

- **[llms.txt](https://vpp-2025.netlify.app/llms.txt)**: Optimized format following the [llms.txt standard](https://llmstxt.org/) for AI model consumption and analysis
- **[JSON Format](https://vpp-2025.netlify.app/vpp-plan-2025-2029.json)**: Structured data in JSON format for web applications and APIs
- **[CSV Format](https://vpp-2025.netlify.app/vpp-plan-2025-2029.csv)**: Tabular data format for spreadsheet analysis and data processing
- **[YAML Format](https://vpp-2025.netlify.app/vpp-plan-2025-2029.yaml)**: Human-readable structured data format for configuration and data exchange

These machine-readable formats enable:

- **AI Analysis**: Large language models can directly consume the llms.txt format for comprehensive plan analysis
- **Research Applications**: Structured data formats support academic research and policy analysis
- **Developer Integration**: JSON and CSV formats facilitate integration with custom applications and data visualization tools

This multi-format approach ensures the Violence Prevention Plan is accessible to both human readers and automated systems, supporting transparency and enabling innovative uses of public policy data.

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

- **[Project Audit Log](https://vpp-2025.netlify.app/documentation/audit-log/)**: Complete security implementation history
- **[Search Security Audit](docs/search-security-audit.md)**: Detailed search functionality security assessment

_Last Security Review: July 28, 2025_
_Next Scheduled Review: October 28, 2025_

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

### Accessibility Resources

- **[Accessibility Documentation](https://vpp-2025.netlify.app/accessibility/documentation)**: Comprehensive user guide to accessibility features and WCAG 2.1 AA compliance
- **[Accessibility Audit Log](https://vpp-2025.netlify.app/accessibility/audit-log)**: Technical assessment and chronological record of accessibility improvements

### Documentation Portal

- **[Developer Documentation Portal](https://vpp-2025.netlify.app/documentation/)**: Complete technical documentation including:
  - **[Component Documentation](https://vpp-2025.netlify.app/documentation/components/)**: Vue component API reference and usage examples
  - **[JSDoc API Reference](https://vpp-2025.netlify.app/documentation/jsdoc/)**: Detailed API documentation for all functions and modules
  - **[Project Documentation](https://vpp-2025.netlify.app/documentation/dev/)**: Development guidelines, build processes, and technical specifications

### External Standards and Guidelines

- **[WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)**: Web Content Accessibility Guidelines 2.1
- **[Illinois Information Technology Accessibility Act (IITAA) 2.1 Standards](https://doit.illinois.gov/initiatives/accessibility/iitaa/iitaa-2-1-standards.html)**: State accessibility requirements

These resources are available through the Nuxt Content v3 system and static documentation generation:

- **[User-facing accessibility documentation](https://vpp-2025.netlify.app/accessibility/documentation)**: Complete accessibility guide and features
- **[Technical accessibility audit log](https://vpp-2025.netlify.app/accessibility/audit-log)**: Chronological record of accessibility improvements
- **[Developer documentation portal](https://vpp-2025.netlify.app/documentation/)**: Component and API references with technical specifications
