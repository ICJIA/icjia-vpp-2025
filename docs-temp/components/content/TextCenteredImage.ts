/**
 * @module TextCenteredImage
 * @fileoverview Vue component: TextCenteredImage
 */

/**
 * Simple Centered Image Component
 *
 * Displays an image centered in the column with click-to-open modal functionality.
 * Uses native browser alt text for accessibility.
 */
import { ref } from "vue";
import ImageWithSpinner from "~/components/content/ImageWithSpinner.vue";

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  width: {
    type: [String, Number],
    default: undefined,
  },
  height: {
    type: [String, Number],
    default: undefined,
  },
  caption: {
    type: String,
    default: "",
  },
  spinnerColor: {
    type: String,
    default: "primary",
  },
  spinnerSize: {
    type: [String, Number],
    default: 40,
  },
  eager: {
    type: Boolean,
    default: true,
  },
  cover: {
    type: Boolean,
    default: false,
  },
  aspectRatio: {
    type: [String, Number],
    default: undefined,
  },
});
