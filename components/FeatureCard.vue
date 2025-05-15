<template>
  <div class="feature-card" :style="animationStyle">
    <v-card 
      variant="elevated" 
      class="h-100 rounded-xl pa-6 feature-card-inner"
      theme="light"
    >
      <div class="feature-icon-wrapper mb-4">
        <v-icon
          :icon="icon"
          size="x-large"
          color="primary"
        />
      </div>
      
      <h3 class="text-h5 font-weight-bold mb-2">{{ title }}</h3>
      <p class="text-body-2 text-medium-emphasis">{{ description }}</p>
    </v-card>
  </div>
</template>

<script setup>
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

const animationStyle = computed(() => ({
  animationDelay: `${props.delay}s`
}));
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

.feature-card-inner:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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