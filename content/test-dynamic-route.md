---
title: "Test Dynamic Route"
description: "A test page to verify the dynamic catch-all route functionality works correctly."
ogTitle: "Test Dynamic Route - Violence Prevention Plan for Illinois: 2025-2029"
ogDescription: "Testing the dynamic catch-all route system for automatic markdown content rendering."
---

::about-hero
# Test Dynamic Route

This is a test page to verify that the dynamic catch-all route (`[...slug].vue`) is working correctly with proper layout and styling.
::

---

::about-story
# Features Being Tested

This page tests the **dynamic catch-all route functionality** with the same layout components used by existing pages.

## Automatic Content Resolution

This page should be accessible at `/test-dynamic-route` without a corresponding Vue file, using the same visual layout as other content pages.

## MDC Support

Vue components should work within this markdown content, providing consistent styling and layout.

### Key Testing Areas

- **SEO Metadata**: The page should have proper title and meta tags from frontmatter
- **Accessibility**: All accessibility features should be maintained
- **Theme Support**: The page should work in both light and dark themes
- **Layout Consistency**: Should match the visual appearance of existing pages

## Content Examples

### Text Content

This is regular markdown text that should be rendered properly with the project's styling, including **bold text**, *italic text*, and proper paragraph spacing.

### Lists

- Item one with proper spacing
- Item two with consistent styling
- Item three with theme-appropriate colors

### Code Block

```javascript
// This is a code block
const testFunction = () => {
  console.log('Dynamic route is working!');
};
```

### Blockquote

> This is a blockquote to test styling consistency with other pages and ensure proper contrast ratios in both light and dark themes.
::

---

::about-values
# Integration Tests

#search-system
## Search System

This content should be automatically indexed by the search system and appear in search results.

#site-configuration
## Site Configuration

The page should appear in the site configuration discovery and routing systems.

#sitemap-generation
## Sitemap Generation

The page should be included in sitemap generation for SEO purposes.

#navigation-access
## Navigation Access

The page should be accessible through direct URL navigation with proper error handling.
::

---

::about-approach
# Accessibility Features

#semantic-structure
## Semantic Structure

Proper heading hierarchy (H1, H2, H3) and semantic HTML structure for screen readers.

#keyboard-navigation
## Keyboard Navigation

Full keyboard navigation support with visible focus indicators.

#screen-reader-support
## Screen Reader Support

Compatible with screen readers and assistive technologies.

#theme-accessibility
## Theme Accessibility

Maintains proper contrast ratios and accessibility in both light and dark themes.
::

---

::about-contact
# Test Results

If you can see this page with the same visual layout, styling, and spacing as the About page, then the dynamic catch-all route is working correctly!

*This test page was created on May 25, 2025 to verify dynamic catch-all route functionality.*
::
