/**
 * @module HomeHighlights
 * @fileoverview Vue component: HomeHighlights
 */

/**
 * Home Highlights Component
 *
 * Displays the project highlights section with an image and feature list.
 * This component was extracted from the original index.vue page to enable
 * its use within MDC (Markdown Components) files.
 *
 * Features:
 * - Responsive layout with image and content side-by-side
 * - Accessible list with proper ARIA attributes
 * - Interactive elements with keyboard navigation support
 * - Animated image with hover effects
 * - Call-to-action button
 *
 * Accessibility Features:
 * - Proper heading hierarchy
 * - ARIA labels for list structure
 * - Keyboard navigation support
 * - Screen reader friendly content structure
 *
 * @component
 */
import ImageWithSpinner from "~/components/content/ImageWithSpinner.vue";

/**
 * Home Highlights Component
 *
 * Displays the project highlights section with an image and feature list.
 * This component now uses slots for content management, allowing all text content
 * to be defined in markdown files for better searchability and content management.
 *
 * Features:
 * - Responsive layout with image and content side-by-side
 * - Accessible list with proper ARIA attributes
 * - Interactive elements with keyboard navigation support
 * - Animated image with hover effects
 * - Call-to-action button
 * - Slot-based content management for title, description, and individual highlights
 *
 * @component
 */
