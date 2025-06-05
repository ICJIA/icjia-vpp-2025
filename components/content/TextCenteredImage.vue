<template>
  <div class="text-centered-image-container mt-10 mb-10" :class="spacingClass">
    <figure
      class="centered-image-wrapper"
      role="group"
      :aria-labelledby="props.caption ? captionId : undefined"
      tabindex="0"
    >
      <!-- Enhanced tooltip with markdown description support -->
      <v-tooltip
        :text="tooltipTextContent"
        location="top"
        :open-delay="0"
        :close-delay="isMobile ? 2000 : 500"
        role="tooltip"
        max-width="400"
        class="image-description-tooltip"
      >
        <template v-slot:activator="{ props: tooltipProps }">
          <div
            class="image-content-wrapper clickable-image"
            v-bind="tooltipProps"
            @click="openModal"
            @keydown.enter="openModal"
            @keydown.space.prevent="openModal"
            role="button"
            :aria-label="`Click to view larger image: ${props.alt}`"
            tabindex="0"
          >
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
      </v-tooltip>
      <!-- Primary caption (if provided) -->
      <figcaption
        v-if="props.caption"
        :id="captionId"
        class="image-caption text-center pa-2"
        :class="props.captionClass"
      >
        {{ props.caption }}
      </figcaption>

      <!-- Secondary caption with interaction hint (always shown) -->
      <div
        class="image-secondary-caption text-center pa-1"
        :class="{ 'mt-1': props.caption }"
        role="note"
        aria-label="Interaction hint for image modal"
      >
        Click to view full image
      </div>
    </figure>

    <!-- Image Modal Dialog -->
    <v-dialog
      v-model="isModalOpen"
      width="90%"
      max-width="1200px"
      class="image-modal-dialog"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="modalTitleId"
      @keydown.esc="closeModal"
    >
      <v-card class="image-modal-card">
        <v-card-title class="d-flex justify-space-between align-center pa-4">
          <span :id="modalTitleId" class="text-h6">
            {{ props.caption || 'Image Viewer' }}
          </span>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="closeModal"
            aria-label="Close image viewer"
            class="modal-close-btn"
          />
        </v-card-title>
        <v-card-text class="pa-0">
          <div class="modal-image-container">
            <ImageWithSpinner
              :src="props.src"
              :alt="props.alt"
              :spinner-color="props.spinnerColor"
              :spinner-size="60"
              :eager="true"
              cover
              class="modal-image"
            />
          </div>
          <!-- Caption below image in modal (if caption exists) -->
          <div
            v-if="props.caption"
            class="modal-image-caption text-center pa-4"
          >
            {{ props.caption }}
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
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
 * - Optional primary caption with proper semantic markup
 * - Secondary "Click to view" caption for interaction guidance
 * - Loading spinner during image load
 * - Enhanced tooltip with markdown descriptions (stripped to plain text) or alt text fallback
 * - Click-to-open modal for larger image viewing
 * - Modal with 90% viewport width for enhanced viewing
 * - Primary caption displayed below image in modal view
 * - Proper accessibility attributes and structure
 * - WCAG 2.1 AA compliance
 * - Support for prefers-reduced-motion
 * - Configurable spacing options
 * - Keyboard navigation support (Enter/Space to open modal, Esc to close)
 *
 * Usage in Nuxt Content MDC:
 * ```md
 * ::text-centered-image{src="/images/example.png" alt="Descriptive alt text" caption="Image Caption" description="**Detailed description** with *markdown* support for screen readers" spacing="medium"}
 * ::
 * ```
 *
 * @component
 * @requires ImageWithSpinner
 * @requires remove-markdown
 * @example
 * <TextCenteredImage
 *   src="/images/example.png"
 *   alt="A descriptive alternative text for the image"
 *   caption="Optional image caption"
 *   description="**Detailed description** with *markdown* formatting for enhanced accessibility"
 *   spacing="medium"
 *   width="600"
 *   height="400"
 * />
 */
import { ref, onMounted, computed } from 'vue';
import ImageWithSpinner from '~/components/content/ImageWithSpinner.vue';
import removeMd from 'remove-markdown';

/**
 * Unique ID for the caption to associate it with the image
 * Generated on component mount for proper ARIA relationships
 * @type {import('vue').Ref<string>}
 */
const captionId = ref('');

/**
 * Unique ID for the modal title to associate it with the dialog
 * Generated on component mount for proper ARIA relationships
 * @type {import('vue').Ref<string>}
 */
const modalTitleId = ref('');

/**
 * Reactive state for modal visibility
 * Controls whether the image modal dialog is open or closed
 * @type {import('vue').Ref<boolean>}
 */
const isModalOpen = ref(false);

/**
 * Reactive state to track if the device is mobile
 * Used for tooltip behavior adaptation
 * @type {import('vue').Ref<boolean>}
 */
const isMobile = ref(false);

/**
 * Generate unique IDs for caption and modal on mount
 * This ensures proper ARIA relationships between elements
 * Also sets up mobile detection for responsive tooltip behavior
 */
onMounted(() => {
  const uniqueSuffix = Math.random().toString(36).substring(2, 9);
  captionId.value = `caption-${uniqueSuffix}`;
  modalTitleId.value = `modal-title-${uniqueSuffix}`;

  // Mobile detection for tooltip behavior
  if (typeof window !== 'undefined') {
    const checkIfMobile = () => {
      isMobile.value = window.innerWidth < 960; // Vuetify's md breakpoint
    };

    // Initial check
    checkIfMobile();

    // Add resize listener
    window.addEventListener('resize', checkIfMobile);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }
});

/**
 * Open the image modal dialog
 *
 * This function opens the modal dialog to display the image in a larger view.
 * It includes proper accessibility announcements and focus management.
 *
 * @returns {void}
 * @example
 * // Called when user clicks on image or presses Enter/Space
 * openModal();
 */
const openModal = () => {
  isModalOpen.value = true;

  // Announce to screen readers that modal is opening
  // This helps users understand the context change
  if (typeof window !== 'undefined') {
    // Use a brief timeout to ensure the modal is rendered before announcing
    setTimeout(() => {
      const announcement = `Image viewer opened for: ${props.alt}`;
      // Create a temporary element for screen reader announcement
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.textContent = announcement;
      document.body.appendChild(announcer);

      // Remove the announcer after a brief delay
      setTimeout(() => {
        document.body.removeChild(announcer);
      }, 1000);
    }, 100);
  }
};

/**
 * Close the image modal dialog
 *
 * This function closes the modal dialog and returns focus to the original image.
 * It includes proper accessibility announcements for screen readers.
 *
 * @returns {void}
 * @example
 * // Called when user clicks close button or presses Escape
 * closeModal();
 */
const closeModal = () => {
  isModalOpen.value = false;

  // Announce to screen readers that modal is closing
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      const announcement = 'Image viewer closed';
      // Create a temporary element for screen reader announcement
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.textContent = announcement;
      document.body.appendChild(announcer);

      // Remove the announcer after a brief delay
      setTimeout(() => {
        document.body.removeChild(announcer);
      }, 1000);
    }, 100);
  }
};

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
   * Optional detailed description of the image in markdown format
   * Used for screen readers and tooltips to provide comprehensive image context
   * All markdown formatting is completely stripped using remove-markdown package and normalized to plain text
   * @type {string}
   */
  description: {
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

/**
 * Computed tooltip text content
 * Uses description if provided (strips ALL markdown formatting), otherwise falls back to alt text
 * Uses remove-markdown package to completely strip all markdown syntax and normalize to clean plain text
 * @returns {string} Clean plain text content for tooltip display
 */
const tooltipTextContent = computed(() => {
  if (props.description && props.description.trim()) {
    // Use remove-markdown package to strip markdown formatting while preserving ALL content
    const cleanText = removeMd(props.description, {
      stripListLeaders: true, // Remove list markers but keep content
      listUnicodeChar: '', // Don't replace with unicode, just remove markers
      gfm: true, // Support GitHub flavored markdown
      useImgAltText: true // Keep alt text from images
    });

    // AGGRESSIVE cleanup to remove ALL line breaks and normalize whitespace
    // BUT PRESERVE ALL TEXT CONTENT
    return cleanText
      .replace(/\\n\\n/g, ' ') // Remove literal \n\n strings
      .replace(/\\n/g, ' ') // Remove literal \n strings
      .replace(/\n\n/g, ' ') // Remove double line breaks
      .replace(/\n/g, ' ') // Remove single line breaks
      .replace(/\r\n/g, ' ') // Remove Windows line breaks
      .replace(/\r/g, ' ') // Remove Mac line breaks
      .replace(/\t/g, ' ') // Remove tabs
      .replace(/\s+/g, ' ') // Normalize ALL multiple whitespace to single space
      .trim();
  }

  // Fallback to alt text if no description provided
  return props.alt;
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
 * Enhanced with clickable functionality for modal opening
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
 * Clickable image styling
 * Provides visual feedback for interactive images
 */
.clickable-image {
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  border-radius: 8px;
  overflow: hidden;
}

.clickable-image:hover {
  transform: scale(1.02);
  opacity: 0.95;
}

.clickable-image:focus {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.clickable-image:active {
  transform: scale(0.98);
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
  font-weight: 700; /* Increased weight for better visibility */
}

/**
 * Secondary caption styling for interaction hints
 * Visually distinct from primary caption while maintaining WCAG 2.1 AA contrast requirements
 */
.image-secondary-caption {
  font-size: 0.75rem;
  line-height: 1.3;
  margin-top: 0.5rem;
  padding: 0 1rem;
  color: rgb(var(--v-theme-on-background));
  opacity: 0.9; /* Higher opacity for better contrast */
  background: none;
  border: none;
  text-align: center;
  max-width: 100%;
  font-style: italic;
  font-weight: 700; /* Increased to 700 for better visibility */
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.image-secondary-caption:hover {
  opacity: 1;
  color: rgb(var(--v-theme-primary));
}

/* When secondary caption follows primary caption */
.image-secondary-caption.mt-1 {
  margin-top: 0.25rem;
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

  .image-secondary-caption {
    font-size: 0.6875rem;
    padding: 0 0.5rem;
    margin-top: 0.375rem;
    font-weight: 700; /* Heavier font weight for mobile readability */
    opacity: 0.95; /* Higher opacity for mobile contrast */
  }

  .image-secondary-caption.mt-1 {
    margin-top: 0.1875rem;
  }
}

/**
 * High contrast mode support
 * Ensures visibility in high contrast environments with maximum contrast ratios
 */
@media (prefers-contrast: high) {
  .centered-image-wrapper {
    border: 2px solid rgb(var(--v-theme-on-background));
  }

  .image-caption {
    opacity: 1;
    font-weight: 600;
  }

  .image-secondary-caption {
    opacity: 1;
    font-weight: 800; /* Maximum font weight for high contrast */
    color: rgb(var(--v-theme-on-background)); /* Use highest contrast color */
    text-decoration: underline; /* Additional visual emphasis */
  }

  .image-secondary-caption:hover {
    color: rgb(var(--v-theme-on-background));
    text-decoration: underline;
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
 * Ensures proper contrast and visibility in dark mode with WCAG 2.1 AA compliance
 */
:root[data-theme="dark"] .image-caption {
  color: rgb(var(--v-theme-on-background));
  opacity: 0.9;
}

:root[data-theme="dark"] .image-secondary-caption {
  color: rgb(var(--v-theme-on-background));
  opacity: 0.95; /* Higher opacity for better contrast in dark mode */
}

:root[data-theme="dark"] .image-secondary-caption:hover {
  color: rgb(var(--v-theme-primary));
  opacity: 1;
}

/**
 * Enhanced tooltip styles for image descriptions
 * Provides better formatting for markdown-converted HTML content
 */
.image-description-tooltip .v-tooltip__content {
  max-width: 400px !important;
  padding: 12px 16px !important;
  font-size: 0.875rem !important;
  line-height: 1.5 !important;
  text-align: left !important;
  word-wrap: break-word !important;
}

/**
 * Markdown content styling within tooltips
 * Ensures proper formatting for HTML elements
 */
.tooltip-markdown-content {
  color: inherit;
  font-family: inherit;
}

.tooltip-markdown-content p {
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
}

.tooltip-markdown-content p:last-child {
  margin-bottom: 0;
}

.tooltip-markdown-content strong {
  font-weight: 600;
  color: inherit;
}

.tooltip-markdown-content em {
  font-style: italic;
  color: inherit;
}

.tooltip-markdown-content code {
  background-color: rgba(var(--v-theme-on-surface), 0.1);
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.85em;
}

.tooltip-markdown-content ul {
  margin: 0.5rem 0;
  padding-left: 1.2rem;
  list-style-type: disc;
}

.tooltip-markdown-content li {
  margin: 0.25rem 0;
  line-height: 1.4;
}

.tooltip-markdown-content h1,
.tooltip-markdown-content h2,
.tooltip-markdown-content h3,
.tooltip-markdown-content h4,
.tooltip-markdown-content h5,
.tooltip-markdown-content h6 {
  margin: 0.5rem 0 0.25rem 0;
  font-weight: 600;
  line-height: 1.3;
}

.tooltip-markdown-content h1 { font-size: 1.1em; }
.tooltip-markdown-content h2 { font-size: 1.05em; }
.tooltip-markdown-content h3 { font-size: 1em; }
.tooltip-markdown-content h4 { font-size: 0.95em; }
.tooltip-markdown-content h5 { font-size: 0.9em; }
.tooltip-markdown-content h6 { font-size: 0.85em; }

.tooltip-markdown-content a {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}

.tooltip-markdown-content a:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .image-description-tooltip .v-tooltip__content {
    max-width: 320px !important;
    padding: 16px 20px !important;
    font-size: 0.9rem !important;
  }

  .tooltip-markdown-content {
    font-size: 0.9rem;
  }

  .tooltip-markdown-content ul {
    padding-left: 1rem;
  }
}

@media (prefers-contrast: high) {
  .image-description-tooltip .v-tooltip__content {
    padding: 16px 20px !important;
    border: 2px solid rgb(var(--v-theme-on-surface)) !important;
    font-weight: 600 !important;
  }

  .tooltip-markdown-content strong {
    font-weight: 800 !important;
  }

  .tooltip-markdown-content code {
    background-color: rgba(var(--v-theme-on-surface), 0.2) !important;
    border: 1px solid rgba(var(--v-theme-on-surface), 0.3) !important;
  }

  .tooltip-markdown-content a {
    font-weight: 600 !important;
    text-decoration: underline !important;
  }
}

/**
 * Modal dialog styles
 * Ensures proper modal appearance and accessibility
 */
.image-modal-dialog {
  z-index: 2000;
}

.image-modal-card {
  max-height: 90vh;
  overflow: hidden;
  border-radius: 12px;
}

.modal-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 75vh; /* Reduced to accommodate caption */
  overflow: hidden;
  background-color: rgb(var(--v-theme-surface));
}

.modal-image {
  width: 100%;
  height: auto;
  max-height: 75vh; /* Reduced to accommodate caption */
  object-fit: contain;
}

.modal-image-caption {
  font-size: 0.875rem;
  line-height: 1.4;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.87;
  background-color: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  max-width: 100%;
  word-wrap: break-word;
  font-weight: 700; /* Consistent with main caption styling */
}

.modal-close-btn {
  color: rgb(var(--v-theme-on-surface));
}

.modal-close-btn:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.1);
}

.modal-close-btn:focus {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/**
 * Responsive modal styles
 * Ensures proper modal display on mobile devices
 */
@media (max-width: 768px) {
  .modal-image-container {
    max-height: 70vh; /* Further reduced for mobile */
  }

  .modal-image {
    max-height: 70vh; /* Further reduced for mobile */
  }

  .modal-image-caption {
    font-size: 0.8125rem;
    padding: 1rem;
  }
}

/**
 * Reduced motion support for modal interactions
 * Respects user preference for reduced motion
 */
@media (prefers-reduced-motion: reduce) {
  .clickable-image {
    transition: none;
  }

  .clickable-image:hover {
    transform: none;
  }

  .clickable-image:active {
    transform: none;
  }
}

/**
 * Print styles
 * Ensures proper rendering when printed
 * Hides modal elements and interaction hints in print view
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

  .image-secondary-caption {
    display: none; /* Hide interaction hint in print */
  }

  .image-modal-dialog {
    display: none !important;
  }

  .clickable-image {
    cursor: default;
  }

  .clickable-image:hover {
    transform: none;
    opacity: 1;
  }
}
</style>
