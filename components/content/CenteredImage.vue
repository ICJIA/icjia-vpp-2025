<template>
  <figure class="centered-image-figure">
    <ImageWithSpinner
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :spinner-color="spinnerColor"
      :spinner-size="spinnerSize"
      :eager="eager"
      :cover="cover"
      :aspect-ratio="aspectRatio"
    />
    <figcaption v-if="caption" class="image-caption text-center pa-2">
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script setup>
/**
 * Centered Image Component
 *
 * This component displays an image centered within its container with an optional caption.
 * It uses the ImageWithSpinner component for loading states and error handling.
 *
 * @component
 * @requires ImageWithSpinner
 */
import ImageWithSpinner from '~/components/content/ImageWithSpinner.vue';

/**
 * Component props
 */
const props = defineProps({
  /**
   * URL of the image to display
   */
  src: {
    type: String,
    required: true
  },

  /**
   * Alternative text for the image
   */
  alt: {
    type: String,
    required: true
  },

  /**
   * Width of the image
   */
  width: {
    type: [String, Number],
    default: undefined
  },

  /**
   * Height of the image
   */
  height: {
    type: [String, Number],
    default: undefined
  },

  /**
   * Optional caption for the image
   */
  caption: {
    type: String,
    default: undefined
  },

  /**
   * Color of the loading spinner
   */
  spinnerColor: {
    type: String,
    default: 'primary'
  },

  /**
   * Size of the loading spinner
   */
  spinnerSize: {
    type: [String, Number],
    default: 40
  },

  /**
   * Whether to load the image eagerly
   */
  eager: {
    type: Boolean,
    default: false
  },

  /**
   * Whether the image should cover its container
   */
  cover: {
    type: Boolean,
    default: true
  },

  /**
   * Aspect ratio of the image
   */
  aspectRatio: {
    type: [String, Number],
    default: undefined
  }
});
</script>

<style scoped>
.centered-image-figure {
  text-align: center;
  margin: 1rem auto;
  max-width: 100%;
}

.image-caption {
  font-style: italic;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-top: 0.5rem;
}
</style>
