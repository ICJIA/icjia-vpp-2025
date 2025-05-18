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
 * Accessible image component with loading spinner and error handling
 *
 * This component enhances the standard v-img with:
 * - Loading spinner with proper ARIA attributes
 * - Error handling with visual and screen reader feedback
 * - Proper accessibility attributes for images
 * - Unique IDs for ARIA relationships
 *
 * @component
 */
import { ref, onMounted } from 'vue';

/**
 * Component props
 */
const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Image',
    validator: (value) => value.trim() !== '' // Ensure alt text is not empty
  },
  imageClass: {
    type: String,
    default: ''
  },
  cover: {
    type: Boolean,
    default: true
  },
  aspectRatio: {
    type: [String, Number],
    default: undefined
  },
  height: {
    type: [String, Number],
    default: undefined
  },
  width: {
    type: [String, Number],
    default: undefined
  },
  eager: {
    type: Boolean,
    default: false
  },
  lazySrc: {
    type: String,
    default: undefined
  },
  spinnerColor: {
    type: String,
    default: 'primary'
  },
  spinnerSize: {
    type: [String, Number],
    default: 40
  },
  spinnerWidth: {
    type: [String, Number],
    default: 4
  }
});

/**
 * Reactive state for component
 */
// Generate a unique ID for ARIA attributes
const uniqueId = ref('');
// Track error state for displaying error message
const hasError = ref(false);
// Track loading state for spinner and ARIA attributes
const isLoading = ref(true);

/**
 * Generate a unique ID for this component instance on mount
 * Used for ARIA attribute relationships
 */
onMounted(() => {
  uniqueId.value = `img-${Math.random().toString(36).substring(2, 9)}`;
});

/**
 * Handle successful image load
 * Updates loading state and removes spinner
 */
const onImageLoad = () => {
  isLoading.value = false;
};

/**
 * Handle image load error
 * Displays error message and updates ARIA attributes
 */
const onImageError = () => {
  hasError.value = true;
  isLoading.value = false;
};
</script>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

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
