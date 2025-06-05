<template>
  <div class="text-centered-image-container" :class="spacingClass">
    <figure
      class="centered-image-wrapper"
      role="group"
      :aria-labelledby="props.caption ? captionId : undefined"
      tabindex="0"
    >
      <AccessibleTooltip
        :text="props.alt"
        location="top"
        :open-delay="0"
        :close-delay="500"
        :mobile-close-delay="2000"
      >
        <template v-slot="{ props: tooltipProps }">
          <div class="image-content-wrapper" v-bind="tooltipProps">
            <ImageWithSpinner
              :src="props.src"
              :alt="props.alt"
              :width="props.width"
              :height="props.height"
              :spinner-color="props.spinnerColor"
              :spinner-size="props.spinnerSize"
              :eager="props.eager"
              :cover="props.cover"
              :aspect-ratio="props.aspectRatio"
            />
          </div>
        </template>
      </AccessibleTooltip>
      <figcaption
        v-if="props.caption"
        :id="captionId"
        class="image-caption text-center pa-2"
        :class="props.captionClass"
      >
        {{ props.caption }}
      </figcaption>
    </figure>
  </div>
</template>

<script setup>
/**
 * Text Centered Image Component
 *
 * This component displays an image centered within its container with optional caption.
 * Unlike TextWrapImage, this component centers the image and prevents text wrapping around it.
 * It uses the ImageWithSpinner component for loading states and AccessibleTooltip for
 * enhanced accessibility.
 *
 * Features:
 * - Horizontally centered image display
 * - Responsive design with full container width
 * - Optional caption with proper semantic markup
 * - Loading spinner during image load
 * - Tooltip displaying alt text on hover/click
 * - Proper accessibility attributes and structure
 * - WCAG 2.1 AA compliance
 * - Support for prefers-reduced-motion
 * - Configurable spacing options
 *
 * Usage in Nuxt Content MDC:
 * ```md
 * ::text-centered-image{src="/images/example.png" alt="Descriptive alt text" caption="Image Caption" spacing="medium"}
 * ::
 * ```
 *
 * @component
 * @requires ImageWithSpinner
 * @requires AccessibleTooltip
 * @example
 * <TextCenteredImage
 *   src="/images/example.png"
 *   alt="A descriptive alternative text for the image"
 *   caption="Optional image caption"
 *   spacing="medium"
 *   width="600"
 *   height="400"
 * />
 */
import { ref, onMounted, computed } from 'vue';
import ImageWithSpinner from '~/components/content/ImageWithSpinner.vue';
import AccessibleTooltip from '~/components/content/AccessibleTooltip.vue';

/**
 * Unique ID for the caption to associate it with the image
 * Generated on component mount for proper ARIA relationships
 * @type {import('vue').Ref<string>}
 */
const captionId = ref('');

/**
 * Generate a unique ID for the caption on mount
 * This ensures proper ARIA relationships between the image and its caption
 */
onMounted(() => {
  captionId.value = `caption-${Math.random().toString(36).substring(2, 9)}`;
});

/**
 * Component props with comprehensive validation and documentation
 */
const props = defineProps({
  /**
   * Source URL for the image
   * @type {string}
   */
  src: {
    type: String,
    required: true
  },

  /**
   * Alt text for the image (required for accessibility)
   * Also used as tooltip content on hover/click
   * Must be descriptive and longer than 5 characters
   * @type {string}
   */
  alt: {
    type: String,
    required: true,
    validator: (value) => {
      // Ensure alt text is not empty and not just a generic word like "Image"
      const trimmed = value.trim();
      return (
        trimmed !== '' &&
        trimmed.length > 5 &&
        !['image', 'picture', 'photo'].includes(trimmed.toLowerCase())
      );
    }
  },

  /**
   * Width of the image in pixels or CSS value
   * @type {number|string}
   */
  width: {
    type: [Number, String],
    default: undefined
  },

  /**
   * Height of the image in pixels or CSS value
   * @type {number|string}
   */
  height: {
    type: [Number, String],
    default: undefined
  },

  /**
   * Aspect ratio of the image (e.g., '16/9' or 1.78)
   * @type {string|number}
   */
  aspectRatio: {
    type: [String, Number],
    default: undefined
  },

  /**
   * Spacing around the image component
   * Controls margin and padding based on predefined spacing scale
   * @type {string}
   */
  spacing: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'xlarge'].includes(value)
  },

  /**
   * Optional caption for the image
   * Displayed below the image with proper semantic markup
   * @type {string}
   */
  caption: {
    type: String,
    default: ''
  },

  /**
   * CSS class for the caption styling
   * @type {string}
   */
  captionClass: {
    type: String,
    default: 'text-caption'
  },

  /**
   * Color of the loading spinner
   * Can be any Vuetify color theme value
   * @type {string}
   */
  spinnerColor: {
    type: String,
    default: 'primary'
  },

  /**
   * Size of the loading spinner in pixels
   * @type {number|string}
   */
  spinnerSize: {
    type: [Number, String],
    default: 40
  },

  /**
   * Whether to load the image eagerly (not lazy)
   * @type {boolean}
   */
  eager: {
    type: Boolean,
    default: true
  },

  /**
   * Whether the image should cover its container
   * @type {boolean}
   */
  cover: {
    type: Boolean,
    default: false
  }
});

/**
 * Computed CSS class for spacing
 * Maps spacing prop to appropriate CSS classes
 * @returns {string} CSS class name for spacing
 */
const spacingClass = computed(() => {
  return `spacing-${props.spacing}`;
});
</script>

<style>
/**
 * Text Centered Image Component Styles
 *
 * These styles implement centered image display with responsive behavior,
 * accessibility features, and proper spacing. The component is designed
 * to work seamlessly with Nuxt Content and maintain WCAG 2.1 AA compliance.
 *
 * Note: Styles are not scoped to ensure proper rendering in markdown context
 */

/**
 * Main container for the centered image component
 * Uses flexbox for centering and provides responsive behavior
 */
.text-centered-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  position: relative;
}

/**
 * Spacing variations for the container
 * Provides consistent spacing options across the application
 */
.text-centered-image-container.spacing-small {
  margin: 1rem 0;
}

.text-centered-image-container.spacing-medium {
  margin: 1.5rem 0;
}

.text-centered-image-container.spacing-large {
  margin: 2rem 0;
}

.text-centered-image-container.spacing-xlarge {
  margin: 3rem 0;
}

/**
 * Image wrapper with proper semantic structure
 * Uses figure element for semantic correctness and accessibility
 */
.centered-image-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

/**
 * Image content wrapper for tooltip binding
 * Ensures proper tooltip positioning and interaction
 */
.image-content-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  position: relative;
}

/**
 * Image caption styling
 * Follows project design system with proper contrast and typography
 */
.image-caption {
  font-size: 0.875rem;
  line-height: 1.4;
  margin-top: 0.75rem;
  padding: 0 1rem;
  color: rgb(var(--v-theme-on-background));
  opacity: 0.87; /* Ensures proper contrast ratio for WCAG AA compliance */
  background: none;
  border: none;
  text-align: center;
  max-width: 100%;
  word-wrap: break-word;
}

/**
 * Focus styles for accessibility
 * Provides clear focus indication for keyboard navigation
 */
.centered-image-wrapper:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 4px;
  border-radius: 8px;
}

/**
 * Responsive adjustments for mobile devices
 * Ensures optimal display on smaller screens
 */
@media (max-width: 768px) {
  .text-centered-image-container {
    margin: 1rem 0;
  }

  .text-centered-image-container.spacing-large,
  .text-centered-image-container.spacing-xlarge {
    margin: 1.5rem 0;
  }

  .image-caption {
    font-size: 0.8125rem;
    padding: 0 0.5rem;
    margin-top: 0.5rem;
  }
}

/**
 * High contrast mode support
 * Ensures visibility in high contrast environments
 */
@media (prefers-contrast: high) {
  .centered-image-wrapper {
    border: 2px solid rgb(var(--v-theme-on-background));
  }

  .image-caption {
    opacity: 1;
    font-weight: 600;
  }
}

/**
 * Reduced motion support
 * Respects user preference for reduced motion
 */
@media (prefers-reduced-motion: reduce) {
  .centered-image-wrapper,
  .image-content-wrapper {
    transition: none;
  }
}

/**
 * Dark theme adjustments
 * Ensures proper contrast and visibility in dark mode
 */
:root[data-theme="dark"] .image-caption {
  color: rgb(var(--v-theme-on-background));
  opacity: 0.9;
}

/**
 * Print styles
 * Ensures proper rendering when printed
 */
@media print {
  .text-centered-image-container {
    margin: 1rem 0;
    break-inside: avoid;
  }

  .image-caption {
    color: black;
    opacity: 1;
  }
}
</style>
