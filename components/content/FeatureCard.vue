<template>
  <div class="feature-card" :style="animationStyle">
    <v-card
      variant="elevated"
      class="h-100 rounded-xl pa-6 feature-card-inner"
      theme="light"
      role="article"
      tabindex="0"
      @keydown.enter="handleCardActivation"
      @keydown.space.prevent="handleCardActivation"
      :aria-labelledby="`feature-title-${uniqueId}`"
      :aria-describedby="`feature-desc-${uniqueId}`"
    >
      <div class="feature-icon-wrapper mb-4" aria-hidden="true">
        <v-icon
          :icon="icon"
          size="x-large"
          color="primary"
        />
      </div>

      <h3 :id="`feature-title-${uniqueId}`" class="text-h5 font-weight-bold mb-2">{{ title }}</h3>
      <p :id="`feature-desc-${uniqueId}`" class="text-body-2 text-medium-emphasis">{{ description }}</p>
    </v-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, inject } from 'vue';

// Get the announce function from the provider
const announce = inject('announce', null);

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  delay: {
    type: Number,
    default: 0
  }
});

// Generate a unique ID for ARIA attributes
const uniqueId = ref('');

onMounted(() => {
  // Generate a unique ID for this component instance
  uniqueId.value = `feature-${Math.random().toString(36).substring(2, 9)}`;
});

const animationStyle = computed(() => ({
  animationDelay: `${props.delay}s`
}));

// Handle keyboard activation (Enter/Space)
const handleCardActivation = () => {
  // This would typically navigate to a feature detail page or show more information
  console.log(`Feature activated: ${props.title}`);

  // Announce to screen readers
  if (announce) {
    announce(`Selected feature: ${props.title}`);
  }
};
</script>

<style scoped>
.feature-card {
  opacity: 0;
  animation: fadeSlideUp 0.6s forwards;
  height: 100%;
}

.feature-card-inner {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.feature-card-inner:hover,
.feature-card-inner:focus-visible {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.feature-card-inner:focus-visible {
  outline: 3px solid var(--v-primary-base);
  outline-offset: 2px;
}

.feature-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: rgba(var(--v-theme-primary), 0.1);
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>