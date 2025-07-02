# Sitemap Configuration Documentation

## Overview

The sitemap configuration system for the Violence Prevention Plan for Illinois: 2025-2029 automatically generates XML sitemaps following the official sitemaps.org protocol. This system integrates seamlessly with the existing site configuration and route discovery infrastructure to provide comprehensive SEO optimization.

## Purpose

The sitemap configuration serves multiple critical functions:

1. **SEO Optimization**: Provides search engines with a comprehensive map of all site content for improved indexing
2. **Content Discovery**: Ensures all pages are discoverable by search crawlers through automated route detection
3. **Automated Maintenance**: Automatically updates as content is added or modified during builds
4. **Standards Compliance**: Follows sitemaps.org protocol specifications for maximum search engine compatibility
5. **Integration**: Works seamlessly with existing blacklist and route discovery systems

## Configuration File Structure

The sitemap configuration is stored in `/config/sitemap.config.json` and follows this comprehensive structure:

### Main Configuration Sections

```json
{
  "sitemap": {
    "outputPath": "public/sitemap.xml",
    "baseUrl": "https://vpp-2025.netlify.app/",
    "defaultChangeFreq": "monthly",
    "defaultPriority": 0.6,
    "priorities": { ... },
    "changeFrequencies": { ... },
    "exclusions": { ... }
  },
  "validation": { ... },
  "logging": { ... },
  "metadata": { ... }
}
```

## Detailed Configuration Options

### Sitemap Settings (`sitemap`)

#### Basic Settings

- **`outputPath`** (string): Where to write the generated sitemap.xml file

  - Default: `"public/sitemap.xml"`
  - Example: `"public/sitemap.xml"`

- **`baseUrl`** (string): Base URL for all sitemap entries

  - Default: `"https://vpp-2025.netlify.app/"`
  - Note: Should match your production domain

- **`defaultChangeFreq`** (string): Default change frequency for pages not specifically configured

  - Default: `"monthly"`
  - Options: `"always"`, `"hourly"`, `"daily"`, `"weekly"`, `"monthly"`, `"yearly"`, `"never"`

- **`defaultPriority`** (number): Default priority for pages not specifically configured
  - Default: `0.6`
  - Range: `0.0` to `1.0`

#### Priority Configuration (`priorities`)

Page-specific priority values help search engines understand relative importance:

```json
{
  "priorities": {
    "/": 1.0,
    "/about": 0.8,
    "/plan": 0.8,
    "/resources": 0.8,
    "/contact": 0.8
  }
}
```

**Priority Guidelines**:

- **1.0**: Homepage and most critical pages
- **0.8**: Main section pages (About, Plan, Resources, Contact)
- **0.6**: Content pages and secondary sections (default)
- **0.4**: Supporting pages and utilities
- **0.2**: Archive or less important content

#### Change Frequency Configuration (`changeFrequencies`)

Page-specific change frequencies help search engines optimize crawling:

```json
{
  "changeFrequencies": {
    "/": "weekly",
    "/about": "monthly",
    "/plan": "monthly",
    "/resources": "weekly",
    "/contact": "monthly"
  }
}
```

**Change Frequency Guidelines**:

- **`always`**: Pages that change every time they're accessed
- **`hourly`**: Pages updated multiple times per day
- **`daily`**: Pages updated daily
- **`weekly`**: Pages updated weekly (good for dynamic content)
- **`monthly`**: Pages updated monthly (good for static content)
- **`yearly`**: Pages that rarely change
- **`never`**: Archived content that won't change

#### Exclusion Rules (`exclusions`)

Controls which pages are excluded from the sitemap:

```json
{
  "exclusions": {
    "frontmatterKey": "includeInSiteMap",
    "frontmatterValue": false,
    "patterns": ["/sandbox", "/sandbox-*", "/404", "/error"]
  }
}
```

**Exclusion Types**:

1. **Frontmatter Exclusions**: Pages can be excluded by adding frontmatter to markdown files:

   ```yaml
   ---
   title: "Page Title"
   includeInSiteMap: false
   ---
   ```

2. **Pattern Exclusions**: Pages matching specific patterns are automatically excluded:

   - `/sandbox` - Development sandbox pages
   - `/sandbox-*` - All sandbox variants (glob pattern)
   - `/404` - Error pages
   - `/error` - Error handling pages

3. **Automatic Exclusions**: The system automatically excludes:
   - Pages matching blacklist patterns from search indexing
   - Duplicate URLs (keeps first occurrence)
   - Invalid or malformed URLs
   - Pages with template syntax artifacts

### Validation Settings (`validation`)

Controls XML validation and content limits:

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
- **`maxUrls`**: Maximum number of URLs allowed in sitemap (sitemaps.org limit: 50,000)
- **`requireLastMod`**: Whether lastmod dates are required for all entries
- **`allowDuplicates`**: Whether to allow duplicate URLs in sitemap

### Logging Settings (`logging`)

Controls output verbosity and progress reporting:

```json
{
  "logging": {
    "showProgress": true,
    "showStats": true,
    "logLevel": "NORMAL"
  }
}
```

- **`showProgress`**: Display progress information during generation
- **`showStats`**: Show final statistics after completion
- **`logLevel`**: Logging verbosity (`"DETAILED"`, `"NORMAL"`, `"CONCISE"`)

### Metadata (`metadata`)

Project information and versioning:

```json
{
  "metadata": {
    "description": "Sitemap configuration for Violence Prevention Plan for Illinois: 2025-2029",
    "version": "1.0.0",
    "lastUpdated": "2025-05-25"
  }
}
```

## Integration with Existing Systems

### Site Configuration Integration

The sitemap generator integrates with:

- **`config/routes.config.json`**: Source of all discoverable routes and page metadata
- **`config/site.config.json`**: Base URL and blacklist patterns for consistent exclusions
- **Existing logging system**: Color-coded output and verbosity levels matching project standards

### Build Process Integration

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

## File Locations and Structure

- **Configuration**: `/config/sitemap.config.json`
- **Generator Script**: `/scripts/generate-sitemap.js`
- **Output**: `/public/sitemap.xml`
- **Documentation**: `/config/sitemap.config.md` (this file)
- **Robots.txt Reference**: `/public/robots.txt` (includes sitemap URL)

## XML Output Format

The generated sitemap follows the standard XML format specified by sitemaps.org:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://vpp-2025.netlify.app/</loc>
    <lastmod>2025-05-25T12:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://vpp-2025.netlify.app/about</loc>
    <lastmod>2025-05-25T11:30:00.000Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Additional URLs... -->
</urlset>
```

## Best Practices

### Configuration Management

1. **Regular Review**: Periodically review priorities and change frequencies to ensure they reflect actual content importance and update patterns
2. **Content Alignment**: Ensure priorities reflect the actual user journey and content hierarchy
3. **Frequency Accuracy**: Set realistic change frequencies based on actual content update patterns, not aspirational goals

### Performance Considerations

1. **Build Time**: Large numbers of pages may increase build time; monitor and optimize if necessary
2. **File Size**: Keep sitemap under 50MB and 50,000 URLs as per sitemaps.org specifications
3. **Validation**: Enable XML validation during development to catch formatting issues early

### SEO Optimization

1. **Priority Distribution**: Use the full range of priority values (0.0-1.0) to help search engines understand content hierarchy
2. **Change Frequency**: Align frequencies with actual content update patterns for optimal crawling efficiency
3. **URL Consistency**: Ensure all URLs are canonical and accessible to search engines

## Troubleshooting

### Common Issues

1. **Missing Routes**: Check if routes are properly discovered in site configuration
2. **Excluded Pages**: Verify exclusion rules and frontmatter settings
3. **Invalid XML**: Enable validation to catch XML formatting issues
4. **Duplicate URLs**: Check for multiple routes mapping to the same path

### Debug Mode

Enable detailed logging to troubleshoot issues:

```bash
yarn create:sitemap --verbose
```

This will show:

- Route discovery process and source files
- Exclusion decisions and reasoning
- URL sanitization steps
- XML generation and validation results
- Final statistics and file locations

## Related Documentation

- **[Site Configuration](./site.config.md)**: General site configuration and metadata
- **[Routes Configuration](./routes.config.md)**: Page discovery and routing metadata
- **[Search Configuration](./fuse.config.md)**: Search functionality and content indexing
- **[Menu Configuration](./menu.config.md)**: Navigation structure and menus

_Last Updated: May 25, 2025_
