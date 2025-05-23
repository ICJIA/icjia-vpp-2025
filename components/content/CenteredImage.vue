<template>
  <figure
    class="centered-image-container"
    role="group"
    :aria-labelledby="caption ? captionId : undefined"
    tabindex="0"
  >
    <AccessibleTooltip
      :text="alt"
      location="top"
      :open-delay="100"
      :close-delay="500"
      :mobile-close-delay="4000"
    >
      <template v-slot="{ props }">
        <div class="image-wrapper" v-bind="props">
          <ImageWithSpinner
            :src="src"
            :alt="alt"
            :width="width"
            :height="height"
            :spinner-color="spinnerColor"
            :spinner-size="24"
            :eager="eager"
            :cover="cover"
          />
        </div>
      </template>
    </AccessibleTooltip>
    <figcaption
      v-if="caption"
      :id="captionId"
      class="image-caption text-center"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script setup>
/**
 * Centered Image Component
 *
 * A reusable component that displays an image centered in its container with optional caption.
 * The image is displayed as a block element with proper responsive behavior and accessibility features.
 *
 * Features:
 * - Horizontally centered image with responsive sizing
 * - Optional caption with proper semantic markup
 * - Loading spinner during image load
 * - Tooltip displaying alt text on hover/click
 * - Proper accessibility attributes and structure
 * - Consistent styling in both light and dark themes
 * - Subtle box shadow effect
 * - Auto-dismissing tooltips on mobile devices
 *
 * @example Basic usage
 * ```vue
 * <CenteredImage
 *   src="/path/to/image.jpg"
 *   alt="Descriptive alt text"
 *   width="500"
 *   height="300"
 * />
 * ```
 *
 * @example With caption
 * ```vue
 * <CenteredImage
 *   src="/path/to/image.jpg"
 *   alt="Descriptive alt text"
 *   width="500"
 *   height="300"
 *   caption="This is a caption for the image"
 * />
 * ```
 *
 * @example In markdown content
 * ```md
 * <CenteredImage
 *   src="/path/to/image.jpg"
 *   alt="Descriptive alt text"
 *   width="500"
 *   height="300"
 *   caption="This is a caption for the image"
 * />
 * ```
 *
 * @component
 * @requires ImageWithSpinner
 * @requires AccessibleTooltip
 */
import { ref, onMounted } from 'vue';
import ImageWithSpinner from '~/components/content/ImageWithSpinner.vue';
import AccessibleTooltip from '~/components/content/AccessibleTooltip.vue';

/**
 * Component props
 */
const props = defineProps({
  /**
   * Source URL for the image
   */
  src: {
    type: String,
    required: true
  },

  /**
   * Alt text for the image (required for accessibility)
   * Cannot be empty - validated to ensure proper accessibility
   * Also used as tooltip content on hover/click
   */
  alt: {
    type: String,
    required: true,
    default: 'Descriptive image for content',
    validator: (value) => {
      // Ensure alt text is not empty and not just a generic word like "Image"
      const trimmed = value.trim();
      return trimmed !== '' && trimmed.length > 5 && !['image', 'picture', 'photo'].includes(trimmed.toLowerCase());
    }
  },

  /**
   * Width of the image in pixels
   * If null, the image will use its natural width up to 100% of container
   */
  width: {
    type: Number,
    default: null
  },

  /**
   * Height of the image in pixels
   * If null, the image will use its natural height
   */
  height: {
    type: Number,
    default: null
  },

  /**
   * Optional caption for the image
   * Displayed below the image with proper semantic markup
   */
  caption: {
    type: String,
    default: ''
  },

  /**
   * Color of the loading spinner
   * Uses Vuetify color system
   */
  spinnerColor: {
    type: String,
    default: 'primary'
  },

  /**
   * Whether to load the image eagerly
   * When true, the image loads immediately rather than when it enters viewport
   */
  eager: {
    type: Boolean,
    default: false
  },

  /**
   * Whether the image should use object-fit: cover
   * When true, the image will fill its container while maintaining aspect ratio
   * When false, the image will use object-fit: contain
   */
  cover: {
    type: Boolean,
    default: false
  }
});

/**
 * Unique ID for the caption to associate it with the image
 * Generated on component mount for proper ARIA relationships
 */
const captionId = ref('');

/**
 * Generate a unique ID for the caption on mount
 */
onMounted(() => {
  captionId.value = `caption-${Math.random().toString(36).substring(2, 9)}`;
});
</script>

<style>
/**
 * Container for the centered image component
 * Uses block display and auto margins for centering
 * Note: Not using 'scoped' to ensure styles apply in markdown context
 */
.centered-image-container {
  display: block;
  margin: 2rem auto;
  width: 100%;
  max-width: 100%;
  text-align: center;
}

/**
 * Image wrapper styles
 * Controls the appearance and behavior of the image
 * Uses inline-block with text-align: center on parent for proper centering
 */
.centered-image-container .image-wrapper {
  display: inline-block;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 100%;
}

/**
 * Dark theme box shadow adjustment
 * Uses a subtle glow effect with semi-transparent light color
 * to create depth against dark backgrounds
 */
:root[data-theme="dark"] .centered-image-container .image-wrapper {
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.07),
              0 2px 4px rgba(255, 255, 255, 0.03),
              0 0 1px rgba(255, 255, 255, 0.1);
}

/**
 * Image caption styles
 * Clean, minimal styling that adapts to the current theme
 * No background color, just text that follows the theme's text color
 */
.centered-image-container .image-caption {
  font-size: 0.875rem;
  margin-top: 0.50rem;
  padding: 0 0.5rem;
  color: rgb(var(--v-theme-on-background));
  opacity: 0.87; /* For proper contrast ratio */
  background: none; /* Explicitly remove any background */
  border: none; /* Remove any borders */
}

/* Focus styles for accessibility */
.centered-image-container:focus-visible {
  outline: 2px solid var(--v-theme-primary);
  outline-offset: 4px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .centered-image-container .image-wrapper {
    transition: none;
  }
}
</style>
