<template>
  <div class="image-container">
    <v-img
      :src="src"
      :alt="alt"
      :imageClass="imageClass"
      :cover="cover"
      :aspect-ratio="aspectRatio"
      :height="height"
      :width="width"
      :eager="eager"
      :lazy-src="lazySrc"
      @load="onImageLoad"
      @error="onImageError"
      :aria-busy="isLoading ? 'true' : 'false'"
      :aria-describedby="hasError ? `error-${uniqueId}` : undefined"
      role="img"
    >
      <template v-slot:placeholder>
        <div
          class="d-flex align-center justify-center fill-height"
          role="status"
          aria-live="polite"
        >
          <span class="sr-only">Loading image: {{ alt }}</span>
          <v-progress-circular
            :color="spinnerColor"
            :size="spinnerSize"
            :width="spinnerWidth"
            indeterminate
            aria-hidden="true"
          ></v-progress-circular>
        </div>
      </template>
    </v-img>
    <div v-if="hasError" :id="`error-${uniqueId}`" class="error-message" role="alert">
      Image failed to load
    </div>
  </div>
</template>

<script setup>
/**
 * Accessible Image Component with Loading Spinner
 *
 * This component enhances the standard Vuetify v-img component with accessibility
 * features, loading indicators, and error handling. It's designed to provide a
 * consistent and accessible image loading experience throughout the application.
 *
 * Features:
 * - Centered loading spinner during image load
 * - Screen reader announcements for loading state
 * - Error handling with visual and screen reader feedback
 * - Proper ARIA attributes for accessibility
 * - Support for all v-img props (aspect ratio, cover, etc.)
 * - Customizable spinner appearance
 *
 * Accessibility Features:
 * - Required alt text with validation
 * - ARIA live regions for status updates
 * - Role attributes for proper semantics
 * - Screen reader only text for loading state
 * - Error messages with proper ARIA relationships
 *
 * Usage:
 * ```html
 * <ImageWithSpinner
 *   src="/path/to/image.jpg"
 *   alt="Descriptive alt text"
 *   spinner-color="primary"
 *   spinner-size="40"
 * />
 * ```
 *
 * @component
 * @requires vue
 */
import { ref, onMounted } from 'vue';

/**
 * Component props
 *
 * @typedef {Object} ImageWithSpinnerProps
 * @property {string} src - URL of the image to display (required)
 * @property {string} alt - Alternative text for the image (required for accessibility)
 * @property {string} imageClass - CSS class to apply to the image
 * @property {boolean} cover - Whether the image should cover its container
 * @property {string|number} aspectRatio - Aspect ratio of the image (e.g., '16/9')
 * @property {string|number} height - Height of the image container
 * @property {string|number} width - Width of the image container
 * @property {boolean} eager - Whether to load the image eagerly (not lazy)
 * @property {string} lazySrc - Low-resolution placeholder image URL
 * @property {string} spinnerColor - Color of the loading spinner
 * @property {string|number} spinnerSize - Size of the loading spinner
 * @property {string|number} spinnerWidth - Stroke width of the loading spinner
 */
const props = defineProps({
  /**
   * URL of the image to display
   * Required prop - component will show error state if image fails to load
   */
  src: {
    type: String,
    required: true
  },

  /**
   * Alternative text for the image
   * Critical for accessibility - describes the image for screen reader users
   * Validated to ensure it's not empty
   */
  alt: {
    type: String,
    default: 'Image',
    validator: (value) => value.trim() !== '' // Ensure alt text is not empty
  },

  /**
   * CSS class to apply to the image element
   * Useful for custom styling or animations
   */
  imageClass: {
    type: String,
    default: ''
  },

  /**
   * Whether the image should cover its container
   * When true, the image will fill the container while maintaining aspect ratio
   */
  cover: {
    type: Boolean,
    default: true
  },

  /**
   * Aspect ratio of the image
   * Can be a string (e.g., '16/9') or a number (e.g., 1.78)
   */
  aspectRatio: {
    type: [String, Number],
    default: undefined
  },

  /**
   * Height of the image container
   * Can be a CSS value (e.g., '200px') or a number (interpreted as pixels)
   */
  height: {
    type: [String, Number],
    default: undefined
  },

  /**
   * Width of the image container
   * Can be a CSS value (e.g., '100%') or a number (interpreted as pixels)
   */
  width: {
    type: [String, Number],
    default: undefined
  },

  /**
   * Whether to load the image eagerly (not lazy)
   * When true, the image loads immediately rather than when it enters viewport
   */
  eager: {
    type: Boolean,
    default: false
  },

  /**
   * Low-resolution placeholder image URL
   * Shown while the main image is loading
   */
  lazySrc: {
    type: String,
    default: undefined
  },

  /**
   * Color of the loading spinner
   * Can be any Vuetify color (e.g., 'primary', 'error')
   */
  spinnerColor: {
    type: String,
    default: 'primary'
  },

  /**
   * Size of the loading spinner
   * Controls the diameter of the spinner
   */
  spinnerSize: {
    type: [String, Number],
    default: 40
  },

  /**
   * Stroke width of the loading spinner
   * Controls the thickness of the spinner's circular track
   */
  spinnerWidth: {
    type: [String, Number],
    default: 4
  }
});

/**
 * Reactive state for component
 *
 * These reactive references track the component's internal state
 * and are used to control the display of loading spinners and error messages.
 */

/**
 * Unique identifier for this component instance
 *
 * Used to create unique IDs for ARIA attribute relationships,
 * ensuring proper connections between elements for screen readers.
 * Generated on component mount.
 *
 * @type {import('vue').Ref<string>}
 */
const uniqueId = ref('');

/**
 * Error state flag
 *
 * Tracks whether the image has failed to load.
 * When true, displays an error message and updates ARIA attributes.
 *
 * @type {import('vue').Ref<boolean>}
 */
const hasError = ref(false);

/**
 * Loading state flag
 *
 * Tracks whether the image is currently loading.
 * When true, displays the loading spinner and sets appropriate ARIA attributes.
 * Defaults to true until the image loads or errors.
 *
 * @type {import('vue').Ref<boolean>}
 */
const isLoading = ref(true);

/**
 * Generate a unique ID for this component instance on mount
 *
 * This hook runs after the component is mounted to the DOM.
 * It generates a random string to use as a unique identifier for this instance,
 * which is used to create proper ARIA relationships between elements.
 *
 * The format is 'img-' followed by a random alphanumeric string.
 */
onMounted(() => {
  // Generate a random string for uniqueness
  uniqueId.value = `img-${Math.random().toString(36).substring(2, 9)}`;
});

/**
 * Handle successful image load
 *
 * This event handler is called when the image successfully loads.
 * It updates the loading state to false, which:
 * 1. Removes the loading spinner
 * 2. Updates ARIA attributes to indicate loading is complete
 *
 * @returns {void}
 */
const onImageLoad = () => {
  isLoading.value = false;
};

/**
 * Handle image load error
 *
 * This event handler is called when the image fails to load.
 * It:
 * 1. Sets the error state to true, displaying the error message
 * 2. Sets the loading state to false, removing the spinner
 * 3. Updates ARIA attributes to announce the error to screen readers
 *
 * @returns {void}
 */
const onImageError = () => {
  hasError.value = true;
  isLoading.value = false;
};
</script>

<style scoped>
/**
 * ImageWithSpinner Component Styles
 *
 * These styles define the appearance of the image container,
 * screen reader only text, and error messages.
 */

/**
 * Main container for the image and its loading/error states
 *
 * Positioned relatively to allow absolute positioning of children
 * (spinner and error message) within its boundaries.
 */
.image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/**
 * Screen reader only class
 *
 * This class visually hides content while keeping it accessible to screen readers.
 * It follows best practices for visually hidden content:
 * - Not using display: none (which would hide from screen readers)
 * - Using clip and overflow to hide visually
 * - Setting small dimensions but not zero (some screen readers may ignore zero-sized elements)
 * - Preventing text wrapping to avoid partial reading
 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/**
 * Error message styling
 *
 * Displayed when the image fails to load.
 * Positioned at the bottom of the image container with:
 * - Semi-transparent error color background
 * - High contrast white text for readability
 * - Centered text with adequate padding
 * - Medium font weight for emphasis
 */
.error-message {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(var(--v-theme-error), 0.8);
  color: white;
  padding: 8px;
  text-align: center;
  font-weight: 500;
}
</style>
