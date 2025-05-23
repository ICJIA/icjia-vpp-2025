<template>
  <div class="text-wrap-image-container">
    <div
      class="image-wrapper"
      :class="{
        'float-left': align === 'left',
        'float-right': align === 'right',
        'mb-4': spacing === 'medium' || spacing === 'large',
        'mb-6': spacing === 'xlarge',
        'mr-4': (align === 'left' && (spacing === 'medium' || spacing === 'large')),
        'mr-6': (align === 'left' && spacing === 'xlarge'),
        'ml-4': (align === 'right' && (spacing === 'medium' || spacing === 'large')),
        'ml-6': (align === 'right' && spacing === 'xlarge'),
        'mr-2': (align === 'left' && spacing === 'small'),
        'ml-2': (align === 'right' && spacing === 'small')
      }"
      :style="{
        width: `${width}px`,
        height: `${height}px`
      }"
    >
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
      <div v-if="caption" class="image-caption text-center pa-1" :class="captionClass">
        {{ caption }}
      </div>
    </div>
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
 * and provides options for caption display.
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
 */
import ImageWithSpinner from '~/components/content/ImageWithSpinner.vue';

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
   */
  alt: {
    type: String,
    required: true,
    validator: (value) => value.trim() !== ''
  },

  /**
   * Width of the image in pixels
   */
  width: {
    type: [Number, String],
    default: 150
  },

  /**
   * Height of the image in pixels
   */
  height: {
    type: [Number, String],
    default: 150
  },

  /**
   * Alignment of the image (left or right)
   */
  align: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value)
  },

  /**
   * Spacing between the image and text
   */
  spacing: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'xlarge'].includes(value)
  },

  /**
   * Optional caption for the image
   */
  caption: {
    type: String,
    default: ''
  },

  /**
   * CSS class for the caption
   */
  captionClass: {
    type: String,
    default: 'text-caption'
  },

  /**
   * Color of the loading spinner
   */
  spinnerColor: {
    type: String,
    default: 'primary'
  },

  /**
   * Whether to load the image eagerly
   */
  eager: {
    type: Boolean,
    default: true
  },

  /**
   * Whether the image should cover its container
   */
  cover: {
    type: Boolean,
    default: false
  }
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
 * Provides a subtle background that works in both light and dark themes
 */
.image-caption {
  background-color: rgba(var(--v-theme-surface-variant), 0.7);
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: 0.875rem;
  border-top: 1px solid rgba(var(--v-theme-outline), 0.2);
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
</style>
