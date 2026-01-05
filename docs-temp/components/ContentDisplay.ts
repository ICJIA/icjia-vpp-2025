/**
 * @module ContentDisplay
 * @fileoverview Vue component: ContentDisplay
 */

/**
 * ContentDisplay Component
 *
 * A reusable component for displaying content with consistent loading, error, and empty states.
 * Uses the useContentFetcher composable for data fetching and error handling.
 */
import { ref, computed, onMounted, watch } from "vue";
import { useNuxtApp } from "#imports";
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
   * Whether to fetch content lazily
   */
  lazy: {
    type: Boolean,
    default: false,
  },

  /**
   * Additional query options for content fetching
   */
  queryOptions: {
    type: Object,
    default: () => ({}),
  },

  /**
   * Optional transform function for content data
   */
  transform: {
    type: Function,
    default: null,
  },

  /**
   * Show debug information
   */
  showDebug: {
    type: Boolean,
    default: false,
  },

  /**
   * Whether to wrap content in a card
   */
  useCard: {
    type: Boolean,
    default: true,
  },

  /**
   * Card elevation when useCard is true
   */
  cardElevation: {
    type: [String, Number],
    default: "2",
  },

  /**
   * Whether to show frontmatter (title and description)
   */
  showFrontmatter: {
    type: Boolean,
    default: true,
  },

  /**
   * Whether to hide the first heading if it matches the title
   * This prevents duplicate titles when the content has a heading that matches the frontmatter title
   */
  hideMatchingHeading: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  "render-start",
  "render-complete",
  "error",
  "content-loaded",
]);

// Use the simplified content fetcher composable
const {
  content,
  pending,
  error,
  isContentRenderable,
  contentSuccessfullyRendered,
  userFriendlyErrorMessage,
  errorSeverity,
  errorTitle,
  contentPreview,
  refresh,
  markAsRendered,
  errorAction,
  technicalErrorDetails,
  isDevelopment,
} = useContentFetcher({
  path: props.path,
});

// Theme detection - SSR-safe
const isDark = ref(false);

// Use onMounted to ensure this only runs on client-side
onMounted(() => {
  // Check for dark theme preference on client-side only
  try {
    const { $vuetify } = useNuxtApp();
    if ($vuetify && $vuetify.theme) {
      isDark.value = $vuetify.theme.global.current.value.dark;

      // Watch for theme changes
      watch(
        () => $vuetify.theme.global.current.value.dark,
        (newVal) => {
          isDark.value = newVal;
        }
      );
    }
  } catch (error) {
    console.error("Theme detection error:", error);
  }
});

// Watch for content loading
watch(
  () => content.value,
  (newContent) => {
    if (newContent) {
      emit("content-loaded", newContent);
    }
  }
);

// Watch for errors
watch(
  () => error.value,
  (newError) => {
    if (newError) {
      emit("error", {
        error: newError,
        details: technicalErrorDetails.value,
      });
    }
  }
);

/**
 * Called when content rendering is complete
 */
const onContentRendered = () => {
  // Mark content as successfully rendered
  markAsRendered();

  // Emit event
  emit("render-complete", {
    path: props.path,
    content: content.value,
  });
};
