# Search Configuration Documentation

This document provides comprehensive documentation for the `fuse.config.json` file that defines the search functionality for the Violence Prevention Plan for Illinois: 2025-2029 application.

## Overview

The `fuse.config.json` file provides a centralized configuration for the application's search functionality, powered by [Fuse.js](https://fusejs.io/). This configuration controls how content is indexed, searched, and displayed to users, including:

1. Search algorithm parameters (fuzzy matching, relevance weights)
2. Content indexing rules (what files to include/exclude)
3. Text extraction strategies (what content to extract from different file types)
4. Duplicate content handling (how to merge content from multiple sources)
5. Path normalization (how to standardize URLs in the search index)

## File Structure

The configuration file is structured as follows:

```json
{
  "search": {
    "indexPath": "...",
    "fuseOptions": { ... },
    "debounceMs": 300,
    "minTermLength": 3,
    "excerptContextChars": 50
  },
  "indexing": {
    "blacklist": { ... },
    "paths": { ... },
    "duplicateHandling": { ... },
    "textExtraction": { ... },
    "normalization": { ... }
  }
}
```

## Search Configuration

The `search` section controls the runtime behavior of the search functionality:

| Property | Type | Description |
|----------|------|-------------|
| `indexPath` | String | Path to the generated search index JSON file, relative to the public directory |
| `fuseOptions` | Object | Configuration options passed directly to Fuse.js |
| `debounceMs` | Number | Milliseconds to wait after typing before executing a search |
| `minTermLength` | Number | Minimum number of characters required to trigger a search (currently set to 2) |
| `excerptContextChars` | Number | Number of characters to show before and after matched text in results |

### Fuse.js Options

The `fuseOptions` object contains settings that control the Fuse.js search algorithm:

| Property | Type | Description |
|----------|------|-------------|
| `keys` | Array | Fields to search within, with optional weights |
| `includeScore` | Boolean | Whether to include relevance score in results |
| `isCaseSensitive` | Boolean | Whether searches are case-sensitive |
| `threshold` | Number | Matching threshold (0.0 = exact match, 1.0 = match anything) |
| `distance` | Number | Maximum edit distance for fuzzy matching |
| `useExtendedSearch` | Boolean | Whether to use Fuse.js extended search syntax |
| `includeMatches` | Boolean | Whether to include match indices in results |

#### Search Keys and Weights

The `keys` array defines which fields to search within and their relative importance:

```json
"keys": [
  {
    "name": "title",
    "weight": 1.0
  },
  {
    "name": "content",
    "weight": 0.6
  },
  {
    "name": "description",
    "weight": 0.6
  },
  {
    "name": "path",
    "weight": 0.3
  }
]
```

Higher weights (0.0-1.0) make matches in those fields more important in the final relevance score.

## Indexing Configuration

The `indexing` section controls how content is processed and indexed:

### Blacklist

The `blacklist` object defines patterns for files to exclude from indexing:

```json
"blacklist": {
  "vue": [
    "sandbox.vue",
    "sandbox-*.vue"
  ],
  "markdown": [
    "sandbox.md",
    "sandbox-*.md"
  ]
}
```

This allows excluding development or test files from the search index.

### Paths

The `paths` object defines directory paths for content sources and output:

| Property | Type | Description |
|----------|------|-------------|
| `content` | String | Directory containing markdown content files |
| `pages` | String | Directory containing Vue page components |
| `output` | String | Directory where the search index will be saved |
| `outputFile` | String | Filename for the generated search index |

### Duplicate Handling

The `duplicateHandling` object controls how to handle content that exists in both Vue and Markdown formats:

| Property | Type | Description |
|----------|------|-------------|
| `preferMarkdown` | Boolean | Whether to prioritize markdown content over Vue content |
| `mergeMetadata` | Boolean | Whether to merge metadata from both sources |
| `minContentLength` | Number | Minimum content length to consider for merging |

When a page exists in both formats (e.g., `/about` as both a Vue component and a markdown file), the system will intelligently merge their content based on these settings.

### Text Extraction

The `textExtraction` object defines how to extract searchable text from different file types:

#### Vue Files

```json
"vue": {
  "elements": [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "li", "span", "div",
    "v-btn", "v-list-item-title", "v-card-title",
    "v-card-text", "v-card-subtitle",
    "v-list-item", "v-alert", "v-chip", "v-tooltip"
  ],
  "attributes": [
    "text", "label", "placeholder", "title", "alt"
  ],
  "metadata": {
    "titlePatterns": [
      "title:\\s*['\"]([^'\"]+)['\"]",
      "@page\\s*\\n\\s*\\*/\\s*[\\s\\S]*?['\"]([^'\"]+)['\"]"
    ],
    "descriptionPatterns": [
      "description:\\s*['\"]([^'\"]+)['\"]"
    ]
  }
}
```

- `elements`: HTML and Vue component tags to extract text from
- `attributes`: HTML attributes to extract text from
- `metadata`: Regular expression patterns to extract metadata from script sections

#### Markdown Files

```json
"markdown": {
  "removePatterns": [
    "```[\\s\\S]*?```",
    "`[^`]*`",
    "#{1,6}\\s+",
    "\\[([^\\]]+)\\]\\([^)]+\\)",
    "!\\[[^\\]]*\\]\\([^)]+\\)",
    "<[^>]*>"
  ]
}
```

- `removePatterns`: Regular expressions for markdown syntax to remove before indexing

### Normalization

The `normalization` object controls how paths are standardized in the search index:

| Property | Type | Description |
|----------|------|-------------|
| `removeExtensions` | Array | File extensions to remove from paths |
| `ensureLeadingSlash` | Boolean | Whether to ensure all paths start with a slash |
| `indexToRoot` | Boolean | Whether to convert `/index` paths to `/` |

## Component Content Extraction

The search indexing system recursively processes components to include their content in search results:

1. When indexing a Vue page, the system:
   - Extracts text from the page itself
   - Identifies all component imports in the page
   - Recursively processes each imported component
   - Extracts text from each component
   - Associates all component text with the parent page

2. This recursive process:
   - Follows component references to any depth (parent → child → grandchild)
   - Avoids circular references by tracking processed components
   - Limits recursion depth to prevent excessive processing
   - Merges all extracted text into the parent page's search entry

3. For components that use other components:
   - Text from all nested components is included
   - The component hierarchy is traversed automatically
   - All text is associated with the page that renders the components

## Usage Examples

### Adjusting Search Sensitivity

To make search more or less fuzzy (tolerant of typos and spelling errors):

```json
"fuseOptions": {
  "threshold": 0.6,  // Higher = more fuzzy (0.0-1.0)
  "distance": 150    // Higher = more tolerant of character transpositions
}
```

- For stricter matching: Lower the threshold (e.g., 0.3) and distance (e.g., 50)
- For more lenient matching: Raise the threshold (e.g., 0.7) and distance (e.g., 200)

### Changing Search Field Weights

To adjust which fields are more important in search results:

```json
"keys": [
  {
    "name": "title",
    "weight": 1.0  // Make title matches most important
  },
  {
    "name": "content",
    "weight": 0.8  // Increase importance of content matches
  }
]
```

### Excluding Files from Search

To exclude specific files or patterns from the search index:

```json
"blacklist": {
  "vue": [
    "sandbox.vue",
    "sandbox-*.vue",
    "draft-*.vue"  // Exclude draft pages
  ]
}
```

### Customizing Text Extraction

To extract text from additional Vue components:

```json
"elements": [
  // Existing elements...
  "v-expansion-panel-text",  // Add new component
  "v-timeline-item"          // Add new component
]
```

## Best Practices

1. **Search Sensitivity**
   - Start with a threshold around 0.5-0.6 for a good balance
   - Adjust based on user feedback and content characteristics
   - Higher thresholds (>0.7) may return too many irrelevant results
   - Lower thresholds (<0.3) may miss relevant results with minor typos

2. **Field Weights**
   - Give titles higher weight (0.8-1.0) as they're most relevant
   - Content should have moderate weight (0.5-0.7)
   - Paths should have lower weight (0.2-0.4) as they're less relevant
   - Test with your content to find the optimal balance

3. **Performance Considerations**
   - Keep the search index reasonably sized (<1MB if possible)
   - Exclude unnecessary files using the blacklist
   - Be selective about which HTML elements to extract text from
   - Consider limiting the depth of component recursion for very complex apps

4. **Content Extraction**
   - Focus on extracting meaningful text content, not UI elements or code
   - Remove non-content elements like code blocks and syntax markers
   - Extract metadata (titles, descriptions) for better search results
   - Ensure component content is properly associated with parent pages

5. **Duplicate Handling**
   - When content exists in both Vue and Markdown, prefer structured content from Markdown
   - Merge unique content from both sources for comprehensive search results
   - Use content overlap detection to avoid duplicating the same text
   - Prioritize metadata from the most authoritative source

## Limitations and Gotchas

1. **Client-Side Search Limitations**
   - The entire search index is loaded into the browser's memory
   - Very large indexes (>2MB) may impact performance
   - Consider server-side search for very large content collections

2. **Component Recursion**
   - Circular component references can cause infinite loops if not handled
   - Very deep component hierarchies may impact indexing performance
   - Global components may be referenced across many pages, potentially duplicating content

3. **Content Extraction Challenges**
   - Dynamic content loaded at runtime won't be included in the search index
   - Content in external APIs or databases isn't indexed
   - Complex formatting or custom components may require special handling

4. **Path Normalization**
   - Ensure path normalization rules match your routing configuration
   - Dynamic routes with parameters need special handling
   - Nested routes may require additional normalization rules

5. **Search Algorithm Tuning**
   - No single configuration works optimally for all content types
   - Test with representative queries and content
   - Adjust based on user feedback and search behavior analytics
