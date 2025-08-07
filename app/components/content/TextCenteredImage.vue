<template>
  <div class="simple-centered-image">
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
      @click="openModal"
      style="cursor: pointer"
    />
    <div v-if="props.caption" class="simple-caption">
      {{ props.caption }}
    </div>
    <div class="simple-secondary-caption">
      <span
        @click="openModal"
        @keydown.enter="openModal"
        @keydown.space.prevent="openModal"
        role="button"
        tabindex="0"
        style="cursor: pointer"
      >
        Click Image to View
      </span>
    </div>

    <!-- Modal -->
    <v-dialog v-model="isModalOpen" width="95vw">
      <v-card>
        <v-card-title class="d-flex justify-end">
          <v-btn icon="mdi-close" variant="text" @click="closeModal" />
        </v-card-title>
        <v-card-text class="pa-4">
          <img
            :src="props.src"
            :alt="props.alt"
            style="
              width: 100%;
              max-height: 75vh;
              object-fit: contain;
              display: block;
            "
          />
          <div
            class="text-center mt-4"
            style="
              font-size: 16px;
              color: rgb(var(--v-theme-on-surface));
              font-weight: 900;
            "
          >
            {{ props.caption || props.alt }}
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
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
</script>

<style>
.simple-centered-image {
  text-align: center;
  margin: 2rem 0;
}

.simple-caption {
  margin-top: 1rem;
  font-weight: 900;
  color: rgb(var(--v-theme-on-surface));
}

.simple-secondary-caption {
  margin-top: 0.25rem;
  font-weight: 400;
  color: rgb(var(--v-theme-on-surface));
  text-align: center;
  font-size: 0.875rem;
}

.modal-image {
  width: 100%;
  height: auto;
  max-height: 85vh;
  object-fit: contain;
}
</style>
