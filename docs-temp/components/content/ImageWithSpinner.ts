/**
 * @module ImageWithSpinner
 * @fileoverview Vue component: ImageWithSpinner
 */

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
import { ref, useId } from "vue";

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
    required: true,
  },

  /**
   * Alternative text for the image
   * Critical for accessibility - describes the image for screen reader users
   * Validated to ensure it's not empty
   * Default is 'Image' but should be overridden with descriptive text
   */
  alt: {
    type: String,
    default: "Image",
    validator: (value) => value.trim() !== "", // Ensure alt text is not empty
  },

  /**
   * CSS class to apply to the image element
   * Useful for custom styling or animations
   */
  imageClass: {
    type: String,
    default: "",
  },

  /**
   * Whether the image should cover its container
   * When true, the image will fill the container while maintaining aspect ratio
   */
  cover: {
    type: Boolean,
    default: true,
  },

  /**
   * Aspect ratio of the image
   * Can be a string (e.g., '16/9') or a number (e.g., 1.78)
   */
  aspectRatio: {
    type: [String, Number],
    default: undefined,
  },

  /**
   * Height of the image container
   * Can be a CSS value (e.g., '200px') or a number (interpreted as pixels)
   */
  height: {
    type: [String, Number],
    default: undefined,
  },

  /**
   * Width of the image container
   * Can be a CSS value (e.g., '100%') or a number (interpreted as pixels)
   */
  width: {
    type: [String, Number],
    default: undefined,
  },

  /**
   * Whether to load the image eagerly (not lazy)
   * When true, the image loads immediately rather than when it enters viewport
   */
  eager: {
    type: Boolean,
    default: false,
  },

  /**
   * Low-resolution placeholder image URL
   * Shown while the main image is loading
   */
  lazySrc: {
    type: String,
    default: undefined,
  },

  /**
   * Color of the loading spinner
   * Can be any Vuetify color (e.g., 'primary', 'error')
   */
  spinnerColor: {
    type: String,
    default: "primary",
  },

  /**
   * Size of the loading spinner
   * Controls the diameter of the spinner
   */
  spinnerSize: {
    type: [String, Number],
    default: 40,
  },

  /**
   * Stroke width of the loading spinner
   * Controls the thickness of the spinner's circular track
   */
  spinnerWidth: {
    type: [String, Number],
    default: 4,
  },
});

/**
 * Reactive state for component
 *
 * These reactive references track the component's internal state
 * and are used to control the display of loading spinners and error messages.
 */

/**
 * Generate SSR-safe unique identifier for this component instance
 *
 * Used to create unique IDs for ARIA attribute relationships,
 * ensuring proper connections between elements for screen readers.
 * Uses Vue's useId() composable for consistent server/client IDs.
 *
 * @type {string}
 */
const uniqueId = useId();

/**
 * Error state flag
 *
 * Tracks whether the image has failed to load.
 * When true, displays an error message and updates ARIA attributes.
 *
 * @type {Object}
 */
const hasError = ref(false);

/**
 * Loading state flag
 *
 * Tracks whether the image is currently loading.
 * When true, displays the loading spinner and sets appropriate ARIA attributes.
 * Defaults to true until the image loads or errors.
 *
 * @type {Object}
 */
const isLoading = ref(true);

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
