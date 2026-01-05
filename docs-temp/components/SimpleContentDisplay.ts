/**
 * @module SimpleContentDisplay
 * @fileoverview Vue component: SimpleContentDisplay
 */

/**
 * SimpleContentDisplay Component
 *
 * A minimal component for displaying markdown content without any UI decorations.
 * Just shows the raw content with basic loading and error states.
 *
 * @example Basic usage
 * ```vue
 * <SimpleContentDisplay :path="contentPath" />
 * ```
 *
 * @example With debug enabled
 * ```vue
 * <SimpleContentDisplay :path="contentPath" :debug="true" />
 * ```
 *
 * @example All available props
 * ```vue
 * <SimpleContentDisplay
 *   :path="contentPath"
 *   :debug="isDevelopment"
 * />
 * ```
 */
import { ContentRenderer } from "#components";
import useContentFetcher from "~/composables/useContentFetcher";

const props = defineProps({
  /**
   * Content path to fetch
   */
  path: {
    type: String,
    required: true,
  },

  /**
   * Debug mode
   *
   * When enabled, displays the complete raw JSON representation of the content data
   * below the rendered content. This is useful for development and debugging
   * to understand the content structure and troubleshoot rendering issues.
   *
   * The debug display shows all keys and values in the content object, including
   * metadata, body content, and any other properties returned by the content API.
   * It is formatted with proper indentation for readability and placed in a
   * visually distinct section below the rendered content.
   *
   * @type {Boolean}
   * @default false
   * @example
   * // Enable debug mode
   * <SimpleContentDisplay :path="contentPath" :debug="true" />
   *
   * // Conditionally enable debug mode in development only
   * <SimpleContentDisplay :path="contentPath" :debug="isDevelopment" />
   */
  debug: {
    type: Boolean,
    default: false,
  },
});

// Use the content fetcher composable with minimal options
const { content, pending, error } = useContentFetcher({
  path: props.path,
});
