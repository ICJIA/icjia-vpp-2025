# Sitemap Configuration Documentation

## Overview

The sitemap configuration system for the Violence Prevention Plan for Illinois: 2025-2029 automatically generates XML sitemaps following the official sitemaps.org protocol. This system integrates seamlessly with the existing site configuration and route discovery infrastructure.

## Purpose

The sitemap generation system serves multiple critical functions:

1. **SEO Optimization**: Provides search engines with a comprehensive map of all site content
2. **Content Discovery**: Ensures all pages are discoverable by search crawlers
3. **Automated Maintenance**: Automatically updates as content is added or modified
4. **Standards Compliance**: Follows sitemaps.org protocol specifications
5. **Integration**: Works with existing blacklist and route discovery systems

## Configuration File Structure

The sitemap configuration is stored in `/config/sitemap.config.json` and follows this structure:

### Sitemap Settings (`sitemap`)

```json
{
  "sitemap": {
    "outputPath": "public/sitemap.xml",
    "baseUrl": "https://vpp-2025.netlify.app/",
    "defaultChangeFreq": "monthly",
    "defaultPriority": 0.6,
    "priorities": {
      "/": 1.0,
      "/about": 0.8,
      "/plan": 0.8,
      "/resources": 0.8,
      "/contact": 0.8
    },
    "changeFrequencies": {
      "/": "weekly",
      "/about": "monthly",
      "/plan": "monthly",
      "/resources": "weekly",
      "/contact": "monthly"
    },
    "exclusions": {
      "frontmatterKey": "includeInSiteMap",
      "frontmatterValue": false,
      "patterns": [
        "/sandbox",
        "/sandbox-*",
        "/404",
        "/error"
      ]
    }
  }
}
```

#### Key Properties

- **`outputPath`**: Where to write the generated sitemap.xml file
- **`baseUrl`**: Base URL for all sitemap entries (from site config or environment)
- **`defaultChangeFreq`**: Default change frequency for pages not specifically configured
- **`defaultPriority`**: Default priority for pages not specifically configured
- **`priorities`**: Page-specific priority values (0.0 to 1.0)
- **`changeFrequencies`**: Page-specific change frequencies
- **`exclusions`**: Rules for excluding pages from the sitemap

### Validation Settings (`validation`)

```json
{
  "validation": {
    "validateXML": true,
    "maxUrls": 50000,
    "requireLastMod": false,
    "allowDuplicates": false
  }
}
```

- **`validateXML`**: Whether to validate generated XML against sitemap schema
- **`maxUrls`**: Maximum number of URLs allowed in sitemap
- **`requireLastMod`**: Whether lastmod dates are required for all entries
- **`allowDuplicates`**: Whether to allow duplicate URLs in sitemap

### Logging Settings (`logging`)

```json
{
  "logging": {
    "showProgress": true,
    "showStats": true,
    "logLevel": "NORMAL"
  }
}
```

## Priority Guidelines

Priority values help search engines understand the relative importance of pages:

- **1.0**: Homepage and most critical pages
- **0.8**: Main section pages (About, Plan, Resources, Contact)
- **0.6**: Content pages and secondary sections (default)
- **0.4**: Supporting pages and utilities
- **0.2**: Archive or less important content

## Change Frequency Guidelines

Change frequency hints help search engines optimize crawling:

- **`always`**: Pages that change every time they're accessed
- **`hourly`**: Pages updated multiple times per day
- **`daily`**: Pages updated daily
- **`weekly`**: Pages updated weekly (good for dynamic content)
- **`monthly`**: Pages updated monthly (good for static content)
- **`yearly`**: Pages that rarely change
- **`never`**: Archived content that won't change

## Exclusion Rules

### Frontmatter Exclusions

Pages can be excluded by adding frontmatter to markdown files:

```yaml
---
title: "Page Title"
includeInSiteMap: false
---
```

### Pattern Exclusions

Pages matching specific patterns are automatically excluded:

- `/sandbox` - Development sandbox pages
- `/sandbox-*` - All sandbox variants
- `/404` - Error pages
- `/error` - Error handling pages

### Automatic Exclusions

The system automatically excludes:

- Pages matching blacklist patterns from search indexing
- Duplicate URLs (keeps first occurrence)
- Invalid or malformed URLs
- Pages with template syntax artifacts

## Integration with Existing Systems

### Site Configuration

The sitemap generator integrates with:

- **`config/routes.config.json`**: Source of all discoverable routes
- **`config/site.config.json`**: Base URL and blacklist patterns
- **Existing logging system**: Color-coded output and verbosity levels

### Build Process

Sitemap generation is integrated into all build commands:

```bash
# Development
yarn dev              # Includes sitemap generation
yarn dev:verbose      # Verbose sitemap logging
yarn dev:quiet        # Quiet sitemap logging

# Production Build
yarn build            # Includes sitemap generation
yarn build:verbose    # Verbose sitemap logging
yarn build:quiet      # Quiet sitemap logging

# Static Generation
yarn generate         # Includes sitemap generation
yarn generate:verbose # Verbose sitemap logging
yarn generate:quiet   # Quiet sitemap logging
```

### Manual Generation

Generate sitemap independently:

```bash
yarn create:sitemap           # Normal logging
yarn create:sitemap --verbose # Detailed logging
yarn create:sitemap --quiet   # Minimal logging
```

## File Locations

- **Configuration**: `/config/sitemap.config.json`
- **Generator Script**: `/scripts/generate-sitemap.js`
- **Output**: `/public/sitemap.xml`
- **Documentation**: `/docs/sitemap.config.md`

## XML Output Format

The generated sitemap follows the standard XML format:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://vpp-2025.netlify.app/</loc>
    <lastmod>2025-05-25T12:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Additional URLs... -->
</urlset>
```

## Best Practices

### Configuration Management

1. **Regular Review**: Periodically review priorities and change frequencies
2. **Content Alignment**: Ensure priorities reflect actual content importance
3. **Frequency Accuracy**: Set realistic change frequencies based on actual update patterns

### Performance Considerations

1. **Build Time**: Large numbers of pages may increase build time
2. **File Size**: Keep sitemap under 50MB and 50,000 URLs
3. **Validation**: Enable XML validation during development

### SEO Optimization

1. **Priority Distribution**: Use full range of priority values (0.0-1.0)
2. **Change Frequency**: Align frequencies with actual content update patterns
3. **URL Consistency**: Ensure all URLs are canonical and accessible

## Troubleshooting

### Common Issues

1. **Missing Routes**: Check if routes are properly discovered in site config
2. **Excluded Pages**: Verify exclusion rules and frontmatter settings
3. **Invalid XML**: Enable validation to catch XML formatting issues
4. **Duplicate URLs**: Check for multiple routes mapping to same path

### Debug Mode

Enable detailed logging to troubleshoot issues:

```bash
yarn create:sitemap --verbose
```

This will show:
- Route discovery process
- Exclusion decisions
- URL sanitization
- XML generation steps
- Validation results

## Future Enhancements

Potential improvements for the sitemap system:

1. **Image Sitemaps**: Support for image-specific sitemap entries
2. **News Sitemaps**: Support for news content with publication dates
3. **Multilingual Support**: Support for hreflang attributes
4. **Automatic Submission**: Integration with search engine submission APIs
5. **Sitemap Index**: Support for multiple sitemaps with index file
