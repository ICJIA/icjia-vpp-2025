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
    >
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            :color="spinnerColor"
            :size="spinnerSize"
            :width="spinnerWidth"
            indeterminate
          ></v-progress-circular>
        </div>
      </template>
    </v-img>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Image'
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

const hasError = ref(false);

const onImageLoad = () => {
  // Image loaded successfully
};

const onImageError = () => {
  hasError.value = true;
};
</script>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
