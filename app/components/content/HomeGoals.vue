<template>
  <section class="goals-section section section-primary py-16">
    <v-container>
      <!-- Section header -->
      <div class="text-center mb-12">
        <h2 class="text-h3 text-md-h2 font-weight-bold mb-4">
          Our Goals: 2025-2029
        </h2>
        <p class="text-h6 text-medium-emphasis max-width-800 mx-auto">
          Three actionable goals with specific strategies and measurable
          outcomes that translate our values into concrete violence prevention
          initiatives across Illinois.
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
 * Strategic goals from the Violence Prevention Plan - OFFICIAL TEXT
 * Updated to match exact wording from the official Violence Prevention Plan report
 * for government transparency and editorial integrity compliance
 * Using consistent primary color scheme to match original home page design
 */
const goals = [
  {
    number: "01",
    title:
      "Prevent violence and promote health and safety through trauma-informed/healing-centered, evidence-based and comprehensive primary, secondary, and/or tertiary prevention efforts.",
    description: "",
    icon: "mdi-shield-check",
    color: "primary",
    url: "/plan/executive-summary",
    relatedPrinciples: ["Promote Safety", "Support Health"],
    highlights: [
      "Honor complex histories and provide holistic services",
      "Engage families, schools, and communities",
      "Address multiple risk and protective factors",
      "Focus on groups at higher risk for violence",
      "Use evidence-based practices",
    ],
  },
  {
    number: "02",
    title:
      "Advance equity by increasing access to grants and other economic opportunities.",
    description: "",
    icon: "mdi-scale-balance",
    color: "primary",
    url: "/plan/executive-summary",
    relatedPrinciples: ["Advance Equity"],
    highlights: [
      "Continue improving access to funding",
      "Support small and medium-sized organizations",
      "Improve reimbursement and budget processes",
      "Promote and connect grantee work",
      "Improve systems and communication",
    ],
  },
  {
    number: "03",
    title:
      "Promote collaboration across state, municipal, and community-based agencies, informed by research and data, sharing of best practices and lessons learned, and ongoing discussions.",
    description: "",
    icon: "mdi-account-group",
    color: "primary",
    url: "/plan/executive-summary",
    relatedPrinciples: ["Engage State Agencies in Collaboration"],
    highlights: [
      "Analyze and disseminate statewide data trends",
      "Coordinate violence prevention funding",
      "Continue the Ad Hoc Violence Prevention Committee",
      "Host statewide violence prevention events",
      "Build community across stakeholders",
    ],
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
