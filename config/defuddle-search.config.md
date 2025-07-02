# Defuddle-Enhanced Search Index Configuration

## Overview

This document describes the Defuddle-enhanced search index generation system implemented for the Statewide Violence Prevention Plan for Illinois: 2025-2029 project. This system significantly improves search functionality by capturing all visible content from rendered pages, including content that was previously missing from the search index.

## Purpose

The Defuddle-enhanced search indexing system was implemented to address critical gaps in the previous search index generation, specifically:

- **Missing Homepage Content**: Main headings like "Rex adipiscing bis umbra sol gloria bis amet" were not being indexed
- **Missing About Page Content**: Section headings like "About Us", "Anima Lumen Manus", "Our Values" were not searchable
- **MDC Component Content**: Content within Nuxt Content MDC components (`::hero-section`, `::feature-section`, etc.) was not being extracted
- **Incomplete Text Extraction**: The previous Vue component parsing approach was missing significant amounts of visible content

## How It Works

### 1. Defuddle Integration

The system uses [Defuddle](https://github.com/kepano/defuddle) by [Stephan Ango (kepano)](https://github.com/kepano), a library designed to extract clean, main content from web pages by removing clutter and non-essential elements.

**Key Benefits:**

- Extracts only the main content, ignoring navigation, sidebars, and other UI elements
- Provides consistent HTML output suitable for search indexing
- Handles complex page structures and component hierarchies
- Maintains semantic structure while cleaning up the content

### 2. Processing Pipeline

The enhanced search index generation follows this pipeline:

1. **Markdown Processing**: Converts markdown files to HTML with basic formatting
2. **Defuddle Extraction**: Uses Defuddle to extract clean content from the HTML
3. **Content Sanitization**: Applies security filters to prevent XSS and other attacks
4. **Index Generation**: Creates search index items with title, content, path, and metadata
5. **Deduplication**: Removes duplicate entries based on path
6. **Output**: Saves the index as JSON for use by the Fuse.js search system

### 3. Content Capture Improvements

**Before (Previous System):**

- Homepage: Minimal content, missing main headings
- About Page: Garbled content mixing Vue code with text
- Total Word Count: ~500 words across all content

**After (Defuddle System):**

- Homepage: 197 words, all headings and content captured
- About Page: 322 words, all sections and headings captured
- Total Word Count: 3,267 words across all content
- **6x improvement in content capture**

## Search Index Structure

The generated search index follows this enhanced structure with both `path` and `fullPath` fields:

```json
[
  {
    "title": "Statewide Violence Prevention Plan for Illinois: 2025-2029 - Home",
    "content": "Rex adipiscing bis umbra sol gloria bis amet. Rex adipiscing bis umbra sol gloria bis amet ventus sit rex caelum est ideme...",
    "path": "/",
    "fullPath": "https://vpp-2025.netlify.app",
    "description": "The Statewide Violence Prevention Plan for Illinois: 2025-2029 provides resources and tools for violence prevention initiatives across Illinois.",
    "frontmatter": {
      "title": "Statewide Violence Prevention Plan for Illinois: 2025-2029 - Home",
      "description": "The Statewide Violence Prevention Plan for Illinois: 2025-2029 provides resources and tools for violence prevention initiatives across Illinois.",
      "ogTitle": "Statewide Violence Prevention Plan for Illinois: 2025-2029 - Home",
      "ogDescription": "Resources and tools for violence prevention initiatives across Illinois."
    },
    "type": "markdown",
    "sourceFile": "index.md",
    "wordCount": 197
  },
  {
    "title": "Statewide Violence Prevention Plan for Illinois: 2025-2029 - About Us",
    "content": "About Us Sed do eiusmod tempor incididunt. Anima Lumen Manus Carmen mare vita idem Lorem elit anima lumen manus...",
    "path": "/about",
    "fullPath": "https://vpp-2025.netlify.app/about",
    "description": "Learn about the Statewide Violence Prevention Plan for Illinois: 2025-2029, our mission, values, and approach to violence prevention across Illinois.",
    "frontmatter": {
      "title": "Statewide Violence Prevention Plan for Illinois: 2025-2029 - About Us",
      "description": "Learn about the Statewide Violence Prevention Plan for Illinois: 2025-2029, our mission, values, and approach to violence prevention across Illinois."
    },
    "type": "markdown",
    "sourceFile": "about.md",
    "wordCount": 322
  }
]
```

### Field Descriptions

- **`title`**: Page title extracted from frontmatter or content
- **`content`**: Clean, plain text content extracted by Defuddle (HTML tags and markdown formatting removed)
- **`path`**: Normalized route path (homepage uses `/` instead of `/index`)
- **`fullPath`**: Complete URL combining baseURL with path for external integrations
- **`description`**: Page description from frontmatter or auto-generated excerpt
- **`frontmatter`**: Original frontmatter data from the markdown file
- **`type`**: Content type (`markdown` or `static-html`)
- **`sourceFile`**: Original source file name
- **`wordCount`**: Number of words in the extracted content

### Path and fullPath Implementation

#### Homepage Path Normalization

The system automatically normalizes homepage paths for consistency with web standards:

- **Input**: `/index` (from `index.md`)
- **Output**: `/` (standard homepage path)
- **fullPath**: Exactly the baseURL without trailing path (`https://vpp-2025.netlify.app`)

#### Other Pages

All other pages maintain their natural paths:

- **Input**: `/about` (from `about.md`)
- **Output**: `/about` (unchanged)
- **fullPath**: baseURL + path (`https://vpp-2025.netlify.app/about`)

#### BaseURL Integration

The system reads the baseURL from `config/site.config.json`:

```json
{
  "urls": {
    "baseUrl": "https://vpp-2025.netlify.app/"
  }
}
```

If the site configuration is unavailable, it falls back to the default: `https://vpp-2025.netlify.app`

## Configuration

### Script Location

- **Main Script**: `scripts/generate-search-index-defuddle.js`
- **Package Script**: `yarn create:search-index-defuddle`

### Command Line Options

```bash
# Basic usage
yarn create:search-index-defuddle

# With detailed logging
yarn create:search-index-defuddle --log-level Detailed

# With concise logging
yarn create:search-index-defuddle --log-level Concise
```

### Integration with Build Process

The Defuddle-enhanced indexing is now the default for all build processes:

```json
{
  "scripts": {
    "build": "yarn create:search-index-defuddle && ...",
    "dev": "yarn create:search-index-defuddle && ...",
    "generate": "yarn create:search-index-defuddle && ..."
  }
}
```

## Dependencies

### Required Packages

- `defuddle@^0.6.4` - Main content extraction library
- `jsdom@^26.1.0` - DOM implementation for Node.js (already in devDependencies)
- `glob@^11.0.2` - File pattern matching (already installed)

### Compatibility

- **Node.js**: Requires Node.js 18+ with ES modules support
- **Nuxt**: Compatible with Nuxt 3.x
- **Browser**: Generated index works with existing Fuse.js search implementation

## Security Features

The Defuddle-enhanced system maintains all existing security features:

1. **Content Sanitization**: Removes script tags, style tags, and dangerous patterns
2. **Input Validation**: Validates all content before indexing
3. **XSS Prevention**: Sanitizes content to prevent cross-site scripting
4. **Blacklist Support**: Respects existing blacklist configuration for excluded files

## Performance

### Processing Speed

- **Markdown Files**: ~20-50ms per file
- **Total Processing**: ~2-3 seconds for entire site
- **Index Size**: Optimized JSON output (~100KB for current content)

### Search Performance

- **Index Loading**: <100ms
- **Search Queries**: <10ms per query
- **Memory Usage**: Minimal impact on browser performance

## Troubleshooting

### Common Issues

1. **URL Errors in Defuddle**:

   - These are internal Defuddle warnings and don't affect functionality
   - Content is still extracted successfully despite the error messages

2. **Missing Content**:

   - Check if files are blacklisted in `config/fuse.config.json`
   - Verify markdown frontmatter is properly formatted
   - Ensure content has sufficient text (minimum 10 words)

3. **Build Integration**:

   - The script runs automatically during build processes
   - Manual execution: `yarn create:search-index-defuddle`
   - Check output in `public/data/search-index.json`

4. **Missing baseURL Configuration**:

   - If `config/site.config.json` is missing or malformed, the system uses fallback defaults
   - Verify the site configuration file exists and has proper structure
   - Check that `urls.baseUrl` is correctly set in the site configuration

5. **Incorrect fullPath Values**:

   - Ensure the baseURL in site configuration doesn't have trailing slashes
   - Homepage should have fullPath equal to baseURL exactly
   - Other pages should have fullPath as baseURL + path
   - Run verification: Check `public/data/search-index.json` for correct fullPath values

6. **Path Normalization Issues**:
   - Homepage should always use path `/` not `/index`
   - Verify no duplicate entries exist for homepage
   - Check that all paths start with `/`

## Future Enhancements

### Planned Improvements

1. **Static HTML Processing**: Enhanced support for processing generated HTML files
2. **Vue Page Integration**: Better extraction from Vue pages using static generation
3. **Content Optimization**: Further improvements to content extraction accuracy
4. **Performance Optimization**: Caching and incremental updates

### Monitoring

- Monitor search index size and generation time
- Track search result quality and user feedback
- Regular audits of content capture completeness

## Attribution and Acknowledgments

This implementation is made possible by the excellent work of:

- **[Defuddle](https://github.com/kepano/defuddle)** by [Stephan Ango (kepano)](https://github.com/kepano) - A powerful library for extracting clean, readable content from web pages
- **[Nuxt Content](https://content.nuxt.com/)** - The file-based CMS for Nuxt applications that powers our content management
- **[Fuse.js](https://fusejs.io/)** - The lightweight fuzzy-search library that provides our search functionality

## Related Documentation

- [Fuse.js Configuration](./fuse.config.md)
- [Site Configuration](./site.config.md)
- [Search Implementation](../pages/search.vue)
- [Audit Logs](../audit-log-project.md)

---

_Last Updated: May 25, 2025_
_Implementation Date: May 25, 2025_
_Version: 1.1.0 - Enhanced with fullPath Implementation_
