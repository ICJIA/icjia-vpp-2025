<template>
  <section class="principles-section section section-primary py-16">
    <v-container>
      <!-- Section header -->
      <div class="text-center mb-12">
        <h2 class="text-h3 text-md-h2 font-weight-bold mb-4">
          Guiding Principles
        </h2>
        <p class="text-h6 text-medium-emphasis max-width-800 mx-auto">
          Our foundational values that shape every aspect of violence prevention
          work, ensuring all efforts are grounded in equity, safety, health,
          belonging, and collaboration.
        </p>
      </div>

      <!-- Principles grid - CSS Grid for perfect alignment -->
      <div class="principles-grid">
        <HomePrincipleCard
          v-for="(principle, index) in principles"
          :key="index"
          :principle="principle"
          :url="principle.url"
          :delay="index * 150"
          class="principle-grid-item"
        />
      </div>
    </v-container>
  </section>
</template>

<script setup>
/**
 * Sandbox Home Principles Section Component - Completely Refactored
 *
 * Displays the five guiding principles with perfect button alignment using CSS Grid.
 * Completely refactored to ensure pixel-perfect horizontal alignment of Learn More buttons
 * across all principle cards regardless of content length variations.
 *
 * Features:
 * - CSS Grid layout for perfect card alignment and equal heights
 * - Responsive grid system (1 column mobile, 2 tablet, 3 desktop)
 * - Perfect button alignment across all cards in each row
 * - Larger icons (size 64) for enhanced visual impact
 * - Professional spacing and typography
 * - Smooth animations with staggered entrance effects
 * - Full accessibility compliance (WCAG 2.1 AA)
 * - Complete theme compatibility (light/dark modes)
 * - Responsive design across all breakpoints
 *
 * Technical Implementation:
 * - Uses CSS Grid with align-items: stretch for equal heights
 * - Responsive grid-template-columns for different screen sizes
 * - Deep selectors for Vuetify component overrides
 * - Grid gap adjustments for optimal spacing
 *
 * @component
 */
import HomePrincipleCard from "./HomePrincipleCard.vue";

/**
 * Guiding principles from the official Violence Prevention Plan document
 * Updated with exact verbatim text from the official plan document
 * Using consistent primary color scheme to match original home page design
 */
const principles = [
  {
    title: "Foster belonging and social connectedness",
    description:
      "Individuals, families, and communities can find acceptance and develop resiliency through healthy, peaceful relationships. Violence prevention programming can include relational opportunities based on developmental stages and risk factors.",
    icon: "mdi-heart-multiple",
    color: "primary",
    url: "/guiding-principles",
  },
  {
    title: "Advance equity",
    description:
      "Violence prevention programming can address inequities by partnering with individuals, families and communities who experience a disproportionate amount of risk factors. State agencies can address historical inequities by embedding communities' true voice in the decision-making processes.",
    icon: "mdi-scale-balance",
    color: "primary",
    url: "/guiding-principles",
    relatedGoal: "Strategic Priority #2: Advance Equity",
  },
  {
    title: "Promote Safety",
    description:
      "The ability to live without fear of harm is a fundamental human right and developmentally essential to individual, familial and community success. Violence prevention programming cannot only attempt to stop violence but also strive to develop culturally responsive, safe, and peaceful environments.",
    icon: "mdi-shield-account",
    color: "primary",
    url: "/guiding-principles",
    relatedGoal: "Strategic Priority #1: Prevent Violence & Promote Safety",
  },
  {
    title: "Support health",
    description:
      "Violence prevention programming can build and sustain mentally and physically strong individuals, families, and communities. These trauma informed practices include policies and efforts that support staff in local organizations.",
    icon: "mdi-heart-pulse",
    color: "primary",
    url: "/guiding-principles",
    relatedGoal: "Strategic Priority #1: Prevent Violence & Promote Safety",
  },
  {
    title: "Engage state agencies in collaboration",
    description:
      "Violence prevention programming takes place across many state agencies and are often focused on similar outcomes. We can work more effectively by communicating across agencies at least quarterly in which sharing resources, best practices and data is the norm. This coordination results in efficiency for funded agencies and improved outcomes for individuals, families, and communities in Illinois.",
    icon: "mdi-account-group",
    color: "primary",
    url: "/guiding-principles",
    relatedGoal: "Strategic Priority #3: Promote Collaboration",
  },
];
</script>

<style scoped>
/* Background handled by global .section-secondary class */

.max-width-800 {
  max-width: 800px;
}

.max-width-600 {
  max-width: 600px;
}

/* Section animations */
.principles-section h2 {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.2s;
}

.principles-section > .v-container > div:first-child p {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.4s;
}

/* CSS Grid for perfect card alignment */
.principles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  align-items: stretch;
}

/* Responsive grid adjustments */
@media (min-width: 600px) {
  .principles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .principles-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 2.5rem;
  }

  /* First three cards span 2 columns each */
  .principle-grid-item:nth-child(1),
  .principle-grid-item:nth-child(2),
  .principle-grid-item:nth-child(3) {
    grid-column: span 2;
  }

  /* Center the last two cards in the bottom row */
  .principle-grid-item:nth-child(4) {
    grid-column: 2 / 4; /* Columns 2-3 */
  }

  .principle-grid-item:nth-child(5) {
    grid-column: 4 / 6; /* Columns 4-5 */
  }
}

/* Grid item styling */
.principle-grid-item {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Force equal heights using CSS Grid subgrid fallback */
.principles-grid::after {
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
