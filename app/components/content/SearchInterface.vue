<template>
  <v-card class="mb-8" elevation="2">
    <v-card-text>
      <v-text-field
        :model-value="modelValue"
        @update:model-value="$emit('update:model-value', $event)"
        label="Search content"
        :placeholder="modelValue ? '' : 'Enter search terms...'"
        variant="outlined"
        hide-details
        clearable
        @click:clear="$emit('clear')"
        @focus="$emit('focus')"
        prepend-inner-icon="mdi-magnify"
        :loading="isSearching"
        aria-label="Search content"
        class="search-input"
        autofocus
      ></v-text-field>
    </v-card-text>
  </v-card>
</template>

<script setup>
/**
 * Search Interface Component
 * 
 * Lazy-loaded search input component that includes VTextField
 * and other heavy Vuetify components not needed in the main bundle.
 */

// Import heavy Vuetify components only when needed
import { VTextField } from 'vuetify/components';

// Register components locally for this component
const components = {
  VTextField
};

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  isSearching: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['update:model-value', 'clear', 'focus']);
</script>

<style scoped>
.search-input {
  font-size: 1.1rem;
}

.search-input :deep(.v-field__input) {
  font-size: 1.1rem;
}
</style>
