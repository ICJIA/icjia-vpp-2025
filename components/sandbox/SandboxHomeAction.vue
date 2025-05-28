<template>
  <section class="action-section section py-16 bg-primary-lighten-5">
    <v-container>
      <div class="text-center mb-12">
        <h2 class="text-h3 text-md-h2 font-weight-bold mb-6">
          For More Information
        </h2>
        <p class="text-h6 text-medium-emphasis max-width-800 mx-auto mb-8">
          Explore the full plan, find local resources, or learn how
          your organization can contribute to violence prevention efforts across Illinois.
        </p>
      </div>

      <!-- Action buttons grid -->
      <v-row justify="center" class="mb-12">
        <v-col
          v-for="(action, index) in callToActions"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          class="d-flex"
        >
          <v-card
            variant="elevated"
            class="flex-grow-1 pa-6 rounded-xl text-center action-card"
            :style="{ animationDelay: `${index * 200}ms` }"
            role="article"
            tabindex="0"
            @click="handleActionClick(action)"
            @keydown.enter="handleActionClick(action)"
            @keydown.space.prevent="handleActionClick(action)"
          >
            <v-icon
              :icon="action.icon"
              :color="action.color"
              size="48"
              class="mb-4"
            />
            <h3 class="text-h6 font-weight-bold mb-3">
              {{ action.title }}
            </h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              {{ action.description }}
            </p>
            <v-btn
              :color="action.color"
              variant="outlined"
              size="small"
              class="rounded-pill"
            >
              {{ action.buttonText }}
              <v-icon end icon="mdi-arrow-right" size="small" />
            </v-btn>
          </v-card>
        </v-col>
      </v-row>

      <!-- Primary CTA -->
      <div class="text-center">
        <v-btn
          color="primary"
          size="x-large"
          class="rounded-pill px-8 py-3 elevation-3 cta-button"
          @click="handlePrimaryCTA"
        >
          View the Complete Plan
          <v-icon end icon="mdi-download" />
        </v-btn>
        <p class="text-body-2 text-medium-emphasis mt-4">
          Download the full Violence Prevention Plan for Illinois: 2025-2029
        </p>
      </div>
    </v-container>
  </section>
</template>

<script setup>
/**
 * Sandbox Home Action Section Component
 *
 * Final informational section providing resources and access to the Violence Prevention Plan.
 * Features multiple information options and primary CTA to view the complete plan.
 *
 * Features:
 * - Multiple informational resource options
 * - Primary CTA to download/view the plan
 * - Interactive resource cards
 * - Animated entrance effects
 * - WCAG 2.1 AA accessibility compliance
 * - Full theme compatibility
 *
 * @component
 */

/**
 * Call-to-action options for user engagement
 */
const callToActions = [
  {
    title: 'Read the Full Plan',
    description: 'Explore the complete Violence Prevention Plan with detailed goals, recommendations, and implementation strategies.',
    icon: 'mdi-book-open-page-variant',
    color: 'primary',
    buttonText: 'View Plan',
    action: 'view-plan'
  },
  {
    title: 'Find Local Resources',
    description: 'Connect with violence prevention organizations and resources in your community across Illinois.',
    icon: 'mdi-map-marker-multiple',
    color: 'secondary',
    buttonText: 'Find Resources',
    action: 'find-resources'
  },
  {
    title: 'Get Involved',
    description: 'Learn about funding opportunities, partnerships, and ways your organization can contribute to violence prevention.',
    icon: 'mdi-hand-heart',
    color: 'success',
    buttonText: 'Learn More',
    action: 'get-involved'
  }
];

/**
 * Handle action card click
 */
const handleActionClick = (action) => {
  console.log('Action clicked:', action.action);
  
  switch (action.action) {
    case 'view-plan':
      handlePrimaryCTA();
      break;
    case 'find-resources':
      // Navigate to resources page
      console.log('Navigate to resources');
      break;
    case 'get-involved':
      // Navigate to involvement/partnership page
      console.log('Navigate to get involved');
      break;
  }
};

/**
 * Handle primary CTA button click
 */
const handlePrimaryCTA = () => {
  // Open the full plan document
  window.open('/files/vpp_plan.md', '_blank');
};
</script>

<style scoped>
.action-section {
  /* Theme-aware background with slight tint */
  background: rgb(var(--v-theme-primary), 0.03);
}

/* Dark theme background adjustment */
:root[data-theme="dark"] .action-section {
  background: rgb(var(--v-theme-primary), 0.05);
}

.max-width-800 {
  max-width: 800px;
}

/* Section animations */
.action-section h2 {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.2s;
}

.action-section > .v-container > div:first-child p {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.4s;
}

.action-section .cta-button {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 1.2s;
}

/* Action card styling */
.action-card {
  opacity: 0;
  animation: fadeSlideUp 0.6s forwards;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* Dark mode action card */
:root[data-theme="dark"] .action-card {
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.action-card:hover,
.action-card:focus-visible {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Dark mode action card hover */
:root[data-theme="dark"] .action-card:hover,
:root[data-theme="dark"] .action-card:focus-visible {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.6);
}

.action-card:focus-visible {
  outline: 3px solid var(--v-primary-base);
  outline-offset: 2px;
}

/* Primary CTA button styling */
.cta-button {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Animations */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .action-section h2,
  .action-section > .v-container > div:first-child p,
  .action-section .cta-button,
  .action-card {
    animation: none;
    opacity: 1;
  }
  
  .action-card:hover,
  .cta-button:hover {
    transform: none;
  }
}
</style>
