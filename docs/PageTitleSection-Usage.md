# PageTitleSection Component - Usage Guide

## Overview

The `PageTitleSection` component provides a standardized, reusable page title system for consistent typography and styling across the entire project. It implements infographic-style design with professional animations and full accessibility compliance.

## Features

- **Infographic-style typography**: Large, impactful font sizes (5rem base)
- **Professional animations**: Fade-in with staggered timing
- **Full responsive design**: Proportional scaling across all devices
- **Theme compatibility**: Works seamlessly in light and dark themes
- **Accessibility compliance**: WCAG 2.1 AA standards
- **Flexible content**: Supports both props and slots
- **Optional visual elements**: Border separator option

## Basic Usage

### Simple Implementation with Props

```vue
<template>
  <div class="page">
    <PageTitleSection
      title="Page Title"
      description="Page description text that provides context and information about the content."
      :show-border="true"
    />

    <!-- Your page content here -->
  </div>
</template>

<script setup>
import PageTitleSection from "~/components/content/PageTitleSection.vue";
</script>
```

### Advanced Usage with Slots

```vue
<template>
  <div class="page">
    <PageTitleSection :show-border="true">
      <template #title>
        Custom <strong>Title</strong> with <em>Formatting</em>
      </template>
      <template #description>
        <p>
          Custom description with <strong>bold text</strong> and
          <em>emphasis</em>.
        </p>
        <p>Multiple paragraphs are supported for complex descriptions.</p>
      </template>
    </PageTitleSection>

    <!-- Your page content here -->
  </div>
</template>

<script setup>
import PageTitleSection from "~/components/content/PageTitleSection.vue";
</script>
```

## Component Props

| Prop          | Type    | Default | Description                                                   |
| ------------- | ------- | ------- | ------------------------------------------------------------- |
| `title`       | String  | `''`    | Main page title text (can be overridden by title slot)        |
| `description` | String  | `''`    | Page description text (can be overridden by description slot) |
| `showBorder`  | Boolean | `false` | Whether to show the bottom border separator                   |

## Styling Specifications

### Typography

- **Base font size**: 5rem (infographic-style)
- **Font weight**: 700 (bold)
- **Font family**: 'Roboto', sans-serif
- **Letter spacing**: -0.03em (tight for modern appearance)
- **Line height**: 1.1 (compact for impact)

### Responsive Scaling

- **Desktop (>960px)**: 5rem
- **Tablet (≤960px)**: 4rem (80% scaling)
- **Mobile (≤768px)**: 3rem (60% scaling)
- **Small mobile (≤600px)**: 2.25rem (45% scaling)

### Animations

- **Title animation**: Fade-in with slide-up, 0.2s delay
- **Description animation**: Fade-in with slide-up, 0.4s delay
- **Duration**: 0.8s with ease timing
- **Reduced motion support**: Animations disabled for accessibility

## Implementation Examples

### News Page Implementation

```vue
<template>
  <div class="news-page">
    <PageTitleSection
      title="News & Updates"
      description="Stay informed about the latest developments in Illinois violence prevention initiatives, community programs, funding announcements, and policy updates."
      :show-border="true"
    />

    <div class="page-content">
      <!-- News content here -->
    </div>
  </div>
</template>
```

### About Page Implementation

```vue
<template>
  <div class="about-page">
    <PageTitleSection
      title="About Us"
      description="Learn about our mission, values, and approach to violence prevention across Illinois."
      :show-border="false"
    />

    <div class="page-content">
      <!-- About content here -->
    </div>
  </div>
</template>
```

### Custom Formatted Title

```vue
<template>
  <div class="strategic-page">
    <PageTitleSection :show-border="true">
      <template #title>
        Strategic <strong>Priorities</strong> 2025-2029
      </template>
      <template #description>
        <p>
          Comprehensive framework for <em>violence prevention</em> across
          Illinois.
        </p>
      </template>
    </PageTitleSection>

    <div class="page-content">
      <!-- Strategic priorities content here -->
    </div>
  </div>
</template>
```

## Page Layout Integration

### Recommended Page Structure

```vue
<template>
  <div class="page-container">
    <!-- 1. Page Title Section -->
    <PageTitleSection
      title="Your Page Title"
      description="Your page description"
      :show-border="true"
    />

    <!-- 2. Main Content Area -->
    <div class="page-content">
      <div class="container">
        <!-- Your page content -->
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Page background (if needed) */
.page-container {
  background: #fafafa; /* Soft light theme background */
}

/* Dark theme background override */
:root[data-theme="dark"] .page-container {
  background: rgb(var(--v-theme-surface));
}

/* Content spacing */
.page-content {
  padding: 4.5rem 0; /* Generous spacing after title */
}

/* Responsive content spacing */
@media (max-width: 768px) {
  .page-content {
    padding: 3rem 0;
  }
}
</style>
```

## Accessibility Features

- **Semantic HTML**: Proper heading hierarchy with `<h1>` tags
- **ARIA compliance**: Screen reader friendly structure
- **Focus management**: Proper focus styles for keyboard navigation
- **Reduced motion**: Respects user motion preferences
- **Color contrast**: Meets WCAG 2.1 AA standards (7:1 ratio preferred)
- **Responsive text**: Scales appropriately for readability

## Theme Compatibility

The component automatically adapts to both light and dark themes using CSS custom properties:

- **Light theme**: Uses theme surface colors with high contrast text
- **Dark theme**: Automatically adjusts colors for optimal readability
- **Border colors**: Theme-aware with appropriate opacity levels

## Best Practices

1. **Use consistent border styling**: Apply `show-border="true"` when you need visual separation
2. **Keep descriptions concise**: Aim for 1-2 sentences for optimal impact
3. **Use slots for complex content**: When you need custom formatting or multiple paragraphs
4. **Maintain responsive spacing**: Follow the recommended page structure for consistent layouts
5. **Test in both themes**: Ensure your content works well in light and dark modes

## Migration from Existing Pages

To migrate existing pages to use the PageTitleSection component:

1. **Identify the current title section** in your page
2. **Extract the title and description text**
3. **Replace the existing HTML** with the PageTitleSection component
4. **Remove old CSS styles** related to page titles
5. **Test responsive behavior** and theme compatibility
6. **Verify accessibility** with screen readers and keyboard navigation

This component system ensures consistent, professional, and accessible page titles across the entire project while reducing code duplication and maintenance overhead.
