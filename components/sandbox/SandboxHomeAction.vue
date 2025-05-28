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

      <!-- Action buttons grid with consistent styling -->
      <div class="actions-grid mb-12">
        <div
          v-for="(action, index) in callToActions"
          :key="index"
          class="action-grid-item"
        >
          <div class="action-card-container" :style="{ animationDelay: `${index * 200}ms` }">
            <v-card
              variant="elevated"
              class="h-100 rounded-xl action-card-inner"
              role="article"
              tabindex="0"
              @click="handleActionClick(action)"
              @keydown.enter="handleActionClick(action)"
              @keydown.space.prevent="handleActionClick(action)"
              :aria-labelledby="`action-title-${index}`"
              :aria-describedby="`action-desc-${index}`"
            >
              <div class="card-content-grid">
                <!-- Icon Section -->
                <div class="icon-section">
                  <v-icon
                    :icon="action.icon"
                    size="64"
                    color="primary"
                    class="action-icon"
                    aria-hidden="true"
                  />
                </div>

                <!-- Title Section -->
                <div class="title-section">
                  <h3 :id="`action-title-${index}`" class="action-title">
                    {{ action.title }}
                  </h3>
                </div>

                <!-- Description Section -->
                <div :id="`action-desc-${index}`" class="description-section">
                  <p class="action-description">
                    {{ action.description }}
                  </p>
                </div>

                <!-- Button Section - Always at bottom -->
                <div class="button-section">
                  <v-btn
                    color="primary"
                    variant="outlined"
                    size="small"
                    class="action-btn"
                    :aria-label="`${action.buttonText} for ${action.title}`"
                  >
                    {{ action.buttonText }}
                    <v-icon end icon="mdi-arrow-right" size="small" />
                  </v-btn>
                </div>
              </div>
            </v-card>
          </div>
        </div>
      </div>

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
 * Using muted, subtle colors for consistent design system
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
    color: 'primary',
    buttonText: 'Find Resources',
    action: 'find-resources'
  },
  {
    title: 'Get Involved',
    description: 'Learn about funding opportunities, partnerships, and ways your organization can contribute to violence prevention.',
    icon: 'mdi-hand-heart',
    color: 'primary',
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

/* CSS Grid for perfect card alignment */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  align-items: stretch;
}

/* Responsive grid adjustments */
@media (min-width: 600px) {
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .actions-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
  }
}

/* Grid item styling */
.action-grid-item {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Container for animation and positioning */
.action-card-container {
  opacity: 0;
  animation: fadeSlideUp 0.6s forwards;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Card styling with perfect height control */
.action-card-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
  padding: 2rem;
  border-radius: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
}

/* Card Content Grid - Perfect alignment system */
.card-content-grid {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  grid-template-areas:
    "icon"
    "title"
    "description"
    "button";
  height: 100%;
  gap: 1.5rem;
  align-content: start;
}

/* Icon Section */
.icon-section {
  grid-area: icon;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}

.action-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Title Section */
.title-section {
  grid-area: title;
  text-align: center;
}

.action-title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
  color: rgb(var(--v-theme-on-surface));
}

/* Description Section - Expands to fill space */
.description-section {
  grid-area: description;
  display: flex;
  align-items: flex-start;
  text-align: center;
}

.action-description {
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
  /* Enhanced contrast for better readability */
  color: rgba(var(--v-theme-on-surface), 0.87);
}

/* Button Section - Always at bottom */
.button-section {
  grid-area: button;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-top: auto;
  padding-top: 1rem;
}

.action-btn {
  border-radius: 2rem;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.025em;
  min-width: 120px;
}

/* Hover and Focus States */
.action-card-inner:hover,
.action-card-inner:focus-visible {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.action-card-inner:focus-visible {
  outline: 3px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Dark Theme Adjustments */
:root[data-theme="dark"] .action-card-inner {
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
}

:root[data-theme="dark"] .action-card-inner:hover,
:root[data-theme="dark"] .action-card-inner:focus-visible {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.6);
}

:root[data-theme="dark"] .action-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* Light theme text contrast */
:root[data-theme="light"] .action-title,
:root:not([data-theme]) .action-title {
  color: rgba(0, 0, 0, 0.87);
}

:root[data-theme="light"] .action-description,
:root:not([data-theme]) .action-description {
  color: rgba(0, 0, 0, 0.75);
}

/* Enhanced text contrast for dark theme */
:root[data-theme="dark"] .action-title {
  color: rgba(255, 255, 255, 0.95);
}

:root[data-theme="dark"] .action-description {
  color: rgba(255, 255, 255, 0.85);
}

/* Force Vuetify card to use our grid layout */
:deep(.v-card) {
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
}

:deep(.v-card__text) {
  padding: 0 !important;
  flex: 1 !important;
}

/* Responsive adjustments */
@media (max-width: 599px) {
  .action-card-inner {
    min-height: 350px;
    padding: 1.5rem;
  }

  .card-content-grid {
    gap: 1.25rem;
  }

  .action-title {
    font-size: 1.125rem;
  }

  .action-description {
    font-size: 0.8125rem;
  }
}

@media (min-width: 1024px) {
  .action-card-inner {
    min-height: 450px;
    padding: 2.5rem;
  }

  .card-content-grid {
    gap: 2rem;
  }
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
  .action-card-container {
    animation: none;
    opacity: 1;
  }

  .action-card-inner {
    transition: none;
  }

  .action-card-inner:hover,
  .cta-button:hover {
    transform: none;
  }
}
</style>
