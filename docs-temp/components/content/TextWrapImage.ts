/**
 * @module TextWrapImage
 * @fileoverview Vue component: TextWrapImage
 */

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
