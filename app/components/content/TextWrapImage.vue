<template>
  <div class="text-wrap-image-container">
    <figure
      class="image-wrapper"
      :class="{
        'float-left': align === 'left',
        'float-right': align === 'right',
        'mb-4': spacing === 'medium' || spacing === 'large',
        'mb-6': spacing === 'xlarge',
        'mr-4':
          align === 'left' && (spacing === 'medium' || spacing === 'large'),
        'mr-6': align === 'left' && spacing === 'xlarge',
        'ml-4':
          align === 'right' && (spacing === 'medium' || spacing === 'large'),
        'ml-6': align === 'right' && spacing === 'xlarge',
        'mr-2': align === 'left' && spacing === 'small',
        'ml-2': align === 'right' && spacing === 'small',
      }"
      :style="{
        width: `${width}px`,
        height: `${height}px`,
      }"
      role="group"
      :aria-labelledby="caption ? captionId : undefined"
      tabindex="0"
    >
      <AccessibleTooltip
        :text="alt"
        :location="align === 'left' ? 'right' : 'left'"
        :open-delay="100"
        :close-delay="500"
        :mobile-close-delay="4000"
      >
        <template v-slot="{ props }">
          <div class="image-content-wrapper" v-bind="props">
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
        class="image-caption text-center pa-1"
        :class="captionClass"
      >
        {{ caption }}
      </figcaption>
    </figure>
    <!-- Slot for content that will wrap around the image -->
    <slot></slot>
  </div>
</template>

<script setup>
/**
 * Text Wrap Image Component
 *
 * This component allows text to wrap around an image, with configurable alignment,
 * spacing, and styling. It uses the ImageWithSpinner component for image loading
 * and provides options for caption display. The component also displays the image's
 * alt text as a tooltip when users hover over or click on the image.
 *
 * Features:
 * - Text wrapping around images with configurable alignment (left/right)
 * - Customizable spacing between image and text
 * - Optional caption with proper semantic markup
 * - Loading spinner during image load
 * - Tooltip displaying alt text on hover/click
 * - Proper accessibility attributes and structure
 * - Auto-dismissing tooltips on mobile devices
 *
 * Usage in Markdown:
 * ```md
 * <TextWrapImage
 *   src="/illinois_seal_original.png"
 *   alt="Illinois State Seal"
 *   width="250"
 *   height="250"
 *   align="left"
 *   spacing="medium"
 *   caption="Illinois State Seal"
 * >
 *
 * Your markdown content goes here. It will wrap around the image based on the
 * alignment setting. You can include any markdown formatting within this content,
 * including **bold text**, *italic text*, lists, and more.
 *
 * </TextWrapImage>
 * ```
 *
 * @component
 * @requires ImageWithSpinner
 * @requires AccessibleTooltip
 */
import { useId } from "vue";
import ImageWithSpinner from "~/components/content/ImageWithSpinner.vue";
import AccessibleTooltip from "~/components/content/AccessibleTooltip.vue";

/**
 * Generate SSR-safe unique ID for the caption to associate it with the image
 * Uses Vue's useId() composable for consistent server/client IDs
 */
const captionId = useId();

const props = defineProps({
  /**
   * Source URL for the image
   */
  src: {
    type: String,
    required: true,
  },

  /**
   * Alt text for the image (required for accessibility)
   * Also used as tooltip content on hover/click
   */
  alt: {
    type: String,
    required: true,
    default: "Descriptive image with text wrapping around it",
    validator: (value) => {
      // Ensure alt text is not empty and not just a generic word like "Image"
      const trimmed = value.trim();
      return (
        trimmed !== "" &&
        trimmed.length > 5 &&
        !["image", "picture", "photo"].includes(trimmed.toLowerCase())
      );
    },
  },

  /**
   * Width of the image in pixels
   */
  width: {
    type: [Number, String],
    default: 150,
  },

  /**
   * Height of the image in pixels
   */
  height: {
    type: [Number, String],
    default: 150,
  },

  /**
   * Alignment of the image (left or right)
   */
  align: {
    type: String,
    default: "left",
    validator: (value) => ["left", "right"].includes(value),
  },

  /**
   * Spacing between the image and text
   */
  spacing: {
    type: String,
    default: "medium",
    validator: (value) =>
      ["small", "medium", "large", "xlarge"].includes(value),
  },

  /**
   * Optional caption for the image
   */
  caption: {
    type: String,
    default: "",
  },

  /**
   * CSS class for the caption
   */
  captionClass: {
    type: String,
    default: "text-caption",
  },

  /**
   * Color of the loading spinner
   */
  spinnerColor: {
    type: String,
    default: "primary",
  },

  /**
   * Whether to load the image eagerly
   */
  eager: {
    type: Boolean,
    default: true,
  },

  /**
   * Whether the image should cover its container
   */
  cover: {
    type: Boolean,
    default: false,
  },
});
</script>

<style>
/**
 * Container for the text-wrap-image component
 * Uses clearfix to ensure proper wrapping behavior
 * Note: Removed 'scoped' to ensure styles apply in markdown context
 */
.text-wrap-image-container {
  position: relative;
  width: 100%;
  display: block;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

/* Clear floats after the container */
.text-wrap-image-container::after {
  content: "";
  display: table;
  clear: both;
}

/**
 * Image wrapper styles
 * Controls the floating behavior and spacing
 */
.image-wrapper {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  display: block;
  max-width: 100%;
}

/**
 * Image content wrapper styles
 * Used for tooltip binding
 */
.image-content-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: block;
}

/* Force float left with important to override any conflicting styles */
.float-left {
  float: left !important;
}

/* Force float right with important to override any conflicting styles */
.float-right {
  float: right !important;
}

/**
 * Image caption styles
 * Clean, minimal styling that adapts to the current theme
 * No background color, just text that follows the theme's text color
 */
.image-caption {
  font-size: 0.875rem;
  margin-top: 0.5rem;
  padding: 0 0.5rem;
  color: rgb(var(--v-theme-on-background));
  opacity: 0.87; /* For proper contrast ratio */
  background: none; /* Explicitly remove any background */
  border: none; /* Remove any borders */
}

/* Focus styles for accessibility */
.image-wrapper:focus-visible {
  outline: 2px solid var(--v-theme-primary);
  outline-offset: 4px;
}

/* Add responsive adjustments for small screens */
@media (max-width: 600px) {
  .image-wrapper {
    float: none !important;
    margin: 0 auto 16px auto !important;
    width: 100% !important;
    max-width: 250px;
  }

  /* Ensure text doesn't wrap on mobile */
  .text-wrap-image-container {
    display: flex;
    flex-direction: column;
  }
}

/* Ensure proper text wrapping in Nuxt Content context */
:deep(.prose) .text-wrap-image-container p,
:deep(.content-renderer) .text-wrap-image-container p {
  display: inline;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .image-wrapper {
    transition: none;
  }
}
</style>
