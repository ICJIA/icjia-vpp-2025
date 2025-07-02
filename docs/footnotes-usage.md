# Footnote Usage Guide

This document explains how to use footnotes in the Violence Prevention Plan for Illinois: 2025-2029 project.

## Overview

The project supports GitHub Flavored Markdown (GFM) footnote syntax, which is processed client-side to create accessible, WCAG 2.1 AA compliant footnotes.

## Basic Syntax

### Footnote References

To create a footnote reference in your text, use the syntax `[^identifier]`:

```markdown
This statement needs a citation[^1].
```

### Footnote Definitions

Define footnotes at the end of your document using the syntax `[^identifier]: content`:

```markdown
[^1]: This is the footnote content that provides additional information.
```

## Examples

### Simple Footnotes

```markdown
The Violence Prevention Plan[^plan] aims to reduce violence across Illinois[^state].

[^plan]: The comprehensive plan covers 2025-2029 and includes community-based interventions.

[^state]: Illinois has implemented various violence prevention strategies over the past decade.
```

### Footnotes with Formatting

```markdown
Research shows significant impact[^research].

[^research]: According to the **Illinois Criminal Justice Information Authority** study, community interventions reduced violence by _25%_ in participating areas.
```

### Footnotes with Links

```markdown
For more information, see the official guidelines[^guidelines].

[^guidelines]: Visit the [ICJIA website](https://icjia.illinois.gov) for comprehensive resources and documentation.
```

### Multiple Paragraph Footnotes

```markdown
Complex topics require detailed explanations[^complex].

[^complex]:
    This footnote contains multiple paragraphs to provide comprehensive information.

    The second paragraph continues the explanation with additional details that support the main content.

    A third paragraph can be added if necessary to complete the explanation.
```

### Reusing Footnotes

```markdown
The same source can be referenced multiple times[^source]. Later in the document, you can reference it again[^source].

[^source]: This footnote will be referenced twice but only appear once in the footnotes section.
```

## Accessibility Features

The footnote implementation includes several accessibility features:

- **Keyboard Navigation**: All footnote links are fully keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and semantic markup
- **High Contrast**: 8:1 contrast ratio in both light and dark themes
- **Reduced Motion**: Respects user's motion preferences for smooth scrolling
- **Focus Management**: Proper focus handling for keyboard users

## Styling

Footnotes are automatically styled to match the site's design system:

- **Light Theme**: Blue color scheme with high contrast
- **Dark Theme**: Indigo color scheme with high contrast
- **Responsive Design**: Optimized for mobile and desktop viewing
- **Hover Effects**: Subtle animations that respect reduced motion preferences

## Best Practices

1. **Use Descriptive Identifiers**: Instead of `[^1]`, consider `[^study-2023]` for better organization
2. **Keep Footnotes Relevant**: Only include information that directly supports the main content
3. **Limit Length**: Keep footnotes concise; consider moving lengthy explanations to the main text
4. **Consistent Formatting**: Use consistent formatting within footnote content
5. **Test Accessibility**: Always test footnotes with keyboard navigation and screen readers

## Technical Implementation

The footnote functionality is implemented using:

- **Client-side Processing**: JavaScript plugin processes footnote syntax after page load
- **Semantic HTML**: Uses proper HTML5 semantic elements and ARIA attributes
- **CSS Styling**: SCSS styles with theme support and accessibility features
- **Smooth Scrolling**: Respects user preferences for reduced motion

## File Locations

- **Plugin**: `plugins/footnotes.client.js`
- **Styles**: `assets/css/main.scss` (footnote section)
- **Test Page**: `content/footnote-test.md`
- **Documentation**: `docs/footnotes-usage.md`

## Testing

To test footnote functionality:

1. Navigate to `/footnote-test` in development
2. Verify footnote links work correctly
3. Test keyboard navigation (Tab, Enter)
4. Test with screen readers
5. Verify both light and dark theme appearance
6. Test reduced motion preferences

## Troubleshooting

If footnotes are not working:

1. Check that the footnote plugin is loaded
2. Verify footnote syntax is correct
3. Ensure content is wrapped in appropriate containers
4. Check browser console for JavaScript errors
5. Verify CSS styles are loading correctly
