# Site Configuration Documentation

## Overview

The site configuration system provides comprehensive management of site-wide settings, metadata, branding, and general configuration for the Violence Prevention Plan for Illinois: 2025-2029 project. This system centralizes all non-routing configuration in a single, well-structured file.

## Purpose

This configuration system serves multiple critical functions:
- **Metadata Management**: Centralizes project information, branding, and descriptions
- **URL Management**: Manages base URLs for different environments
- **Contact Information**: Stores organization and contact details
- **Feature Configuration**: Controls site features like search, themes, and accessibility
- **Legal Information**: Manages copyright, licensing, and legal page references
- **Build Configuration**: Stores build-time settings and environment information

## Configuration Structure

### `site.config.json` (Manual Configuration)

This file contains all general site configuration settings:

```json
{
  "metadata": {
    "projectName": "Violence Prevention Plan for Illinois: 2025-2029",
    "description": "The official web presence for the Violence Prevention Plan for Illinois: 2025-2029, featuring comprehensive violence prevention strategies and community resources.",
    "version": "1.0.0",
    "lastUpdated": "2025-05-25"
  },
  "branding": {
    "siteName": "Violence Prevention Plan for Illinois: 2025-2029",
    "shortName": "Illinois Violence Prevention Plan",
    "tagline": "Building safer communities through evidence-based violence prevention strategies",
    "logo": {
      "icon": "mdi-cube-outline",
      "favicon": "/favicon.png",
      "ogImage": "/images/og-image-default.jpg"
    }
  },
  "urls": {
    "baseUrl": "https://vpp-2025.netlify.app/",
    "devUrl": "http://localhost:8000",
    "repository": "https://github.com/ICJIA/icjia-vpp-2025",
    "organization": "https://icjia.illinois.gov"
  },
  "contact": {
    "organization": "Illinois Criminal Justice Information Authority",
    "website": "https://icjia.illinois.gov",
    "email": "info@icjia.illinois.gov",
    "address": {
      "street": "300 W. Adams Street, Suite 700",
      "city": "Chicago",
      "state": "Illinois",
      "zipCode": "60606",
      "country": "United States"
    }
  }
}
```

## Configuration Sections

### Metadata Section
Contains core project information and versioning:

| Property | Type | Description |
|----------|------|-------------|
| `projectName` | String | Full project name |
| `description` | String | Project description for SEO and documentation |
| `version` | String | Configuration version for tracking changes |
| `lastUpdated` | String | Date of last configuration update (YYYY-MM-DD) |

### Branding Section
Manages site branding and visual identity:

| Property | Type | Description |
|----------|------|-------------|
| `siteName` | String | Full site name for display |
| `shortName` | String | Abbreviated name for mobile/compact displays |
| `tagline` | String | Site tagline or mission statement |
| `logo.icon` | String | Material Design Icon identifier |
| `logo.favicon` | String | Path to favicon file |
| `logo.ogImage` | String | Default Open Graph image path |

### URLs Section
Manages environment-specific URLs:

| Property | Type | Description |
|----------|------|-------------|
| `baseUrl` | String | Production base URL |
| `devUrl` | String | Development server URL |
| `repository` | String | GitHub repository URL |
| `organization` | String | Parent organization website |

### Contact Section
Stores organization and contact information:

| Property | Type | Description |
|----------|------|-------------|
| `organization` | String | Organization name |
| `website` | String | Organization website |
| `email` | String | Contact email address |
| `address` | Object | Physical address details |

### Social Section
Social media and external platform links:

| Property | Type | Description |
|----------|------|-------------|
| `github` | String | GitHub profile/organization URL |
| `twitter` | String\|null | Twitter profile URL |
| `facebook` | String\|null | Facebook page URL |
| `linkedin` | String\|null | LinkedIn profile URL |

### Legal Section
Legal and compliance information:

| Property | Type | Description |
|----------|------|-------------|
| `license` | String | Software license type |
| `copyright` | String | Copyright notice template |
| `privacyPolicy` | String | Privacy policy page path |
| `termsOfService` | String | Terms of service page path |

### Features Section
Controls site functionality and features:

| Property | Type | Description |
|----------|------|-------------|
| `search.enabled` | Boolean | Enable/disable search functionality |
| `search.provider` | String | Search provider (e.g., "fuse.js") |
| `search.minCharacters` | Number | Minimum characters for search |
| `themes.enabled` | Boolean | Enable/disable theme switching |
| `themes.default` | String | Default theme ("light" or "dark") |
| `themes.options` | Array | Available theme options |
| `accessibility.wcagLevel` | String | Target WCAG compliance level |
| `accessibility.auditLog` | String | Accessibility audit log path |
| `accessibility.documentation` | String | Accessibility documentation path |

### Routing Section
Configuration for routing and page discovery:

| Property | Type | Description |
|----------|------|-------------|
| `blacklist.vue` | Array | Vue file patterns to exclude |
| `blacklist.markdown` | Array | Markdown file patterns to exclude |
| `titleExtraction.fallbackPattern` | String | Default title pattern |
| `titleExtraction.maxLength` | Number | Maximum title length |

### Logging Section
Unified logging system configuration:

| Property | Type | Description |
|----------|------|-------------|
| `level` | String | Verbosity level (DETAILED, NORMAL, CONCISE) |
| `showTimestamp` | Boolean | Whether to show timestamps in logs |
| `showPrefix` | Boolean | Whether to show log type prefixes |
| `groupMessages` | Boolean | Whether to group related messages |
| `buildSummary` | Boolean | Whether to show build summaries |
| `colors.success` | String | Color code for success messages |
| `colors.error` | String | Color code for error messages |
| `colors.warning` | String | Color code for warning messages |
| `colors.info` | String | Color code for info messages |
| `colors.debug` | String | Color code for debug messages |

### Build Section
Build-time configuration and metadata:

| Property | Type | Description |
|----------|------|-------------|
| `environment` | String | Target environment |
| `generatedAt` | String | ISO timestamp of last generation |
| `nodeVersion` | String\|null | Node.js version used for build |
| `nuxtVersion` | String\|null | Nuxt version used for build |

## Usage Examples

### Accessing Site Metadata

```vue
<script setup>
// Access site configuration in components
const siteConfig = await $fetch('/config/site.config.json');

// Use metadata
const siteName = siteConfig.branding.siteName;
const description = siteConfig.metadata.description;
const contactEmail = siteConfig.contact.email;
</script>
```

### Dynamic Branding

```vue
<template>
  <header>
    <h1>{{ siteName }}</h1>
    <p>{{ tagline }}</p>
  </header>
</template>

<script setup>
const siteConfig = await $fetch('/config/site.config.json');
const siteName = siteConfig.branding.siteName;
const tagline = siteConfig.branding.tagline;
</script>
```

### Environment-Specific URLs

```javascript
// Build script example
import siteConfig from '../config/site.config.json';

const baseUrl = process.env.NODE_ENV === 'development'
  ? siteConfig.urls.devUrl
  : siteConfig.urls.baseUrl;

console.log(`Building for: ${baseUrl}`);
```

### Logging Configuration

```javascript
// Script with unified logging
import { createLogger } from '../utils/logger.js';
import { createScriptLoggerConfig } from '../utils/config-loader.js';

const loggerConfig = await createScriptLoggerConfig('MyScript', {
  level: 'DETAILED', // Override config file setting
  groupMessages: true
});
const logger = createLogger(loggerConfig).createScope('MyScript');

logger.info('Script started');
logger.success('Operation completed');
```

## Integration Points

### Menu Configuration
The site configuration provides data that can be used in menu.config.json:

```json
{
  "header": {
    "branding": {
      "text": "{{ siteConfig.branding.siteName }}",
      "href": "{{ siteConfig.urls.baseUrl }}"
    }
  }
}
```

### SEO and Metadata
Components can use site configuration for consistent SEO:

```vue
<script setup>
const siteConfig = await $fetch('/config/site.config.json');

useHead({
  title: computed(() => `${pageTitle.value} - ${siteConfig.branding.siteName}`),
});

useSeoMeta({
  description: siteConfig.metadata.description,
  ogImage: siteConfig.branding.logo.ogImage,
});
</script>
```

### Footer Information
Automatically populate footer with contact and legal information:

```vue
<template>
  <footer>
    <div class="contact">
      <h3>{{ organization }}</h3>
      <p>{{ email }}</p>
      <address>{{ fullAddress }}</address>
    </div>
    <div class="legal">
      <p>{{ copyright }}</p>
      <a :href="privacyPolicy">Privacy Policy</a>
      <a :href="termsOfService">Terms of Service</a>
    </div>
  </footer>
</template>

<script setup>
const siteConfig = await $fetch('/config/site.config.json');
const { organization, email, address } = siteConfig.contact;
const { copyright, privacyPolicy, termsOfService } = siteConfig.legal;

const fullAddress = computed(() =>
  `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`
);
</script>
```

## Best Practices

### Configuration Management
1. **Version Control**: Keep site.config.json in version control
2. **Environment Variables**: Use environment-specific values where appropriate
3. **Validation**: Validate configuration structure during builds
4. **Documentation**: Keep this documentation updated when adding new fields

### Data Consistency
1. **Single Source of Truth**: Use site.config.json as the authoritative source for site metadata
2. **Avoid Duplication**: Reference configuration values rather than hardcoding
3. **Centralized Updates**: Update branding and contact information in one place
4. **Type Safety**: Consider adding TypeScript definitions for better development experience

### Performance Considerations
1. **Caching**: Configuration is static and can be cached aggressively
2. **Bundle Size**: Large configurations may impact client-side bundle size
3. **Build Time**: Complex configurations may slow down build processes
4. **Runtime Access**: Consider which data needs to be available at runtime vs build time

## File Locations

- **Configuration**: `/config/site.config.json` (manual configuration)
- **Public Access**: Configuration can be fetched at runtime via `/config/site.config.json`
- **Build Scripts**: Can import configuration directly from the file system

### Sitemap Generation

The site configuration provides base URL and routing settings used by the sitemap generation system:

```javascript
// Sitemap generator uses site configuration
import siteConfig from '../config/site.config.json';

const baseUrl = siteConfig.urls.baseUrl;
const blacklistPatterns = siteConfig.routing.blacklist;

// Generate sitemap with proper base URL and exclusions
```

## Related Documentation

- **[Routes Configuration](./routes.config.md)**: Page discovery and routing metadata
- **[Menu Configuration](./menu.config.md)**: Navigation structure and menus
- **[Search Configuration](./fuse.config.md)**: Search functionality and indexing
- **[Sitemap Configuration](../docs/sitemap.config.md)**: XML sitemap generation and SEO optimization

*Last Updated: May 25, 2025*


