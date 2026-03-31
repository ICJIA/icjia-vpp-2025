<template>
  <section class="section py-16">
    <v-container>
      <div class="text-center mb-12">
        <slot />
      </div>

      <v-row>
        <v-col cols="12" md="4" class="mb-8">
          <v-card
            class="h-100 rounded-xl value-card pa-6"
            variant="elevated"
            role="article"
            tabindex="0"
            @keydown.enter="handleValueCardActivation('Lorem ipsum')"
            @keydown.space.prevent="handleValueCardActivation('Lorem ipsum')"
            aria-labelledby="value-title-0"
            aria-describedby="value-desc-0"
          >
            <v-icon
              icon="mdi-heart-outline"
              size="x-large"
              color="primary"
              class="mb-4"
              aria-hidden="true"
            ></v-icon>
            <div id="value-title-0">
              <slot name="lorem-ipsum" />
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" class="mb-8">
          <v-card
            class="h-100 rounded-xl value-card pa-6"
            variant="elevated"
            role="article"
            tabindex="0"
            @keydown.enter="handleValueCardActivation('Consectetur')"
            @keydown.space.prevent="handleValueCardActivation('Consectetur')"
            aria-labelledby="value-title-1"
            aria-describedby="value-desc-1"
          >
            <v-icon
              icon="mdi-lightbulb-outline"
              size="x-large"
              color="primary"
              class="mb-4"
              aria-hidden="true"
            ></v-icon>
            <div id="value-title-1">
              <slot name="consectetur" />
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" class="mb-8">
          <v-card
            class="h-100 rounded-xl value-card pa-6"
            variant="elevated"
            role="article"
            tabindex="0"
            @keydown.enter="handleValueCardActivation('Incididunt Opus')"
            @keydown.space.prevent="
              handleValueCardActivation('Incididunt Opus')
            "
            aria-labelledby="value-title-2"
            aria-describedby="value-desc-2"
          >
            <v-icon
              icon="mdi-shield-check-outline"
              size="x-large"
              color="primary"
              class="mb-4"
              aria-hidden="true"
            ></v-icon>
            <div id="value-title-2">
              <slot name="incididunt-opus" />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
/**
 * AboutValues component for the About page
 *
 * This component displays the core values section with:
 * - Interactive value cards with keyboard navigation
 * - Proper ARIA labels and accessibility attributes
 * - Responsive grid layout
 * - Screen reader announcements for interactions
 *
 * @component
 */
import { inject } from "vue";

/**
 * Get the announce function from the provider for screen reader announcements
 */
const announce = inject("announce", null);

/**
 * Handle value card activation via keyboard or click
 * Announces selection to screen readers for accessibility
 *
 * @param {string} title - The title of the value
 */
const handleValueCardActivation = (title) => {
  console.log(`Value card activated: ${title}`);

  // Announce to screen readers for accessibility
  if (announce) {
    announce(`Selected value: ${title}`);
  }
};
</script>

<style scoped>
.value-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  height: 100%;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* Dark mode value card shadow */
:root[data-theme="dark"] .value-card {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.5),
    0 2px 4px -1px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.value-card:hover,
.value-card:focus-visible {
  transform: translateY(-8px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Dark mode value card hover shadow */
:root[data-theme="dark"] .value-card:hover,
:root[data-theme="dark"] .value-card:focus-visible {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.7),
    0 10px 10px -5px rgba(0, 0, 0, 0.6);
}

.value-card:focus-visible {
  outline: 3px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .value-card {
    transition: none !important;
  }

  .value-card:hover,
  .value-card:focus-visible {
    transform: none !important;
  }
}

/* Markdown content styling */
:deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

:deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

:deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

:deep(strong) {
  font-weight: 700;
}

:deep(em) {
  font-style: italic;
}
</style>
