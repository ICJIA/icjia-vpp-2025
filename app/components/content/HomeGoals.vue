<template>
  <section class="goals-section section section-primary py-16">
    <v-container>
      <!-- Section header -->
      <div class="text-center mb-12">
        <h2 class="text-h3 text-md-h2 font-weight-bold mb-4">
          Recommendations and Resources
        </h2>
        <p class="text-h6 text-medium-emphasis max-width-800 mx-auto">
          Discover comprehensive violence prevention strategies, access valuable
          resources, and explore organizational achievements that support
          communities across Illinois.
        </p>
      </div>

      <!-- Goals grid - CSS Grid for perfect alignment -->
      <div class="goals-grid">
        <HomeGoalCard
          v-for="(goal, index) in goals"
          :key="index"
          :goal="goal"
          :delay="index * 200"
          class="goal-grid-item"
        />
      </div>
    </v-container>
  </section>
</template>

<script setup>
/**
 * Sandbox Home Goals Section Component - Completely Refactored
 *
 * Displays the three strategic priorities with perfect button alignment using CSS Grid.
 * Completely refactored to ensure pixel-perfect horizontal alignment of Learn More buttons
 * across all goal cards regardless of content length variations.
 *
 * Features:
 * - CSS Grid layout for perfect card alignment and equal heights
 * - Responsive grid system (1 column mobile, 3 columns desktop)
 * - Perfect button alignment across all cards in each row
 * - Larger icons (size 64) for enhanced visual impact
 * - Professional spacing and typography
 * - Smooth animations with staggered entrance effects
 * - Full accessibility compliance (WCAG 2.1 AA)
 * - Complete theme compatibility (light/dark modes)
 * - Enhanced text contrast for optimal readability
 *
 * Technical Implementation:
 * - Uses CSS Grid with align-items: stretch for equal heights
 * - Responsive grid-template-columns for different screen sizes
 * - Deep selectors for Vuetify component overrides
 * - Grid gap adjustments for optimal spacing
 *
 * @component
 */
import HomeGoalCard from "./HomeGoalCard.vue";

/**
 * Recommendations and Resources content
 * Three main sections providing access to violence prevention strategies,
 * resources, and organizational achievements across Illinois
 */
const goals = [
  {
    number: "01",
    title: "Goals and Recommendations",
    description:
      "Explore comprehensive violence prevention strategies with actionable goals, evidence-based practices, and measurable outcomes designed to create lasting change in Illinois communities.",
    icon: "mdi-clipboard-list",
    color: "primary",
    url: "/plan/goals-and-recommendations",
    relatedPrinciples: ["Strategic Planning", "Evidence-Based Practices"],
    highlights: [],
  },
  {
    number: "02",
    title: "Resources",
    description:
      "Access a comprehensive collection of tools, research, training materials, and best practices to support violence prevention initiatives across communities and organizations.",
    icon: "mdi-book-open-variant",
    color: "primary",
    url: "/resources",
    relatedPrinciples: ["Resource Access", "Capacity Building"],
    highlights: [],
  },
  {
    number: "03",
    title: "Organizational and Agency Highlights",
    description:
      "Discover achievements, success stories, and innovative programs from organizations and agencies leading violence prevention efforts throughout Illinois.",
    icon: "mdi-trophy",
    color: "primary",
    url: "/organizational-and-agency-highlights",
    relatedPrinciples: ["Collaboration", "Recognition"],
    highlights: [],
  },
];
</script>

<style scoped>
/* Background handled by global .section-primary class */

.max-width-800 {
  max-width: 800px;
}

.max-width-700 {
  max-width: 700px;
}

/* Section animations */
.goals-section h2 {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.2s;
}

.goals-section > .v-container > div:first-child p {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.4s;
}

/* CSS Grid for perfect card alignment */
.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  align-items: stretch;
}

/* Responsive grid adjustments */
@media (min-width: 768px) {
  .goals-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
  }
}

/* Grid item styling */
.goal-grid-item {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Force equal heights using CSS Grid subgrid fallback */
.goals-grid::after {
  content: "";
  grid-column: 1 / -1;
  height: 0;
}

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

/* Dark theme card adjustments */
:root[data-theme="dark"] :deep(.v-card) {
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
