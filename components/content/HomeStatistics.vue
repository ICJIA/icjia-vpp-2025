<template>
  <section class="statistics-section section section-secondary py-16">
    <v-container>
      <!-- Section header -->
      <div class="text-center mb-12">
        <h2 class="text-h3 text-md-h2 font-weight-bold mb-4">
          Violence in Illinois: The Data
        </h2>
        <p class="text-h6 text-medium-emphasis max-width-800 mx-auto">
          Understanding the scope and impact of violence is the first step in
          prevention. These statistics highlight the urgent need for
          comprehensive violence prevention efforts across Illinois.
        </p>
      </div>

      <!-- Statistics grid -->
      <v-row>
        <v-col
          v-for="(stat, index) in statistics"
          :key="index"
          cols="12"
          sm="6"
          lg="4"
          class="mb-4"
        >
          <HomeStatisticCard
            :title="stat.title"
            :description="stat.description"
            :icon="stat.icon"
            :color="stat.color"
            :delay="index * 100"
          />
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
/**
 * Home Statistics Section Component
 *
 * Displays key statistics about violence in Illinois based on the VPP analysis.
 * Features visual presentation of data points that demonstrate the need for
 * violence prevention with proper accessibility and theme support.
 *
 * Features:
 * - Key statistics from the VPP analysis
 * - Visual card-based presentation
 * - Animated entrance effects
 * - WCAG 2.1 AA accessibility compliance
 * - Full theme compatibility
 *
 * @component
 */
import HomeStatisticCard from "./HomeStatisticCard.vue";

/**
 * Statistics data from the Violence Prevention Plan analysis
 * Updated to use verbatim text from the source document (vpp_plan.md)
 * All statistics use primary color for consistency and subtle visual appeal
 * Optimized for 3-column layout display with equal card heights
 */
const statistics = [
  {
    title: "Youth Bullying Prevalence",
    description:
      "1 in 3 youth in 6th to 12th grades report experiencing a form of bullying (2018-2022). Due to the high prevalence of violence, and the persistent disparities, violence is seen as an epidemic impacting our state and our society.",
    icon: "mdi-school",
    color: "primary",
  },
  {
    title: "Youth Physical Fights",
    description:
      "1 in 5 report having been in a physical fight in the past 12 months (2018-2022). Due to the high prevalence of violence, and the persistent disparities, violence is seen as an epidemic impacting our state and our society.",
    icon: "mdi-account-alert",
    color: "primary",
  },
  {
    title: "Youth Sexual Violence",
    description:
      "About 12% of high school youth have experienced sexual violence (2019-2021). Due to the high prevalence of violence, and the persistent disparities, violence is seen as an epidemic impacting our state and our society.",
    icon: "mdi-account-group",
    color: "primary",
  },
  {
    title: "Child Maltreatment Rates",
    description:
      "Rates of child maltreatment are higher in Illinois than national rates (2018-2021). Due to the high prevalence of violence, and the persistent disparities, violence is seen as an epidemic impacting our state and our society.",
    icon: "mdi-shield-alert",
    color: "primary",
  },
  {
    title: "Firearm Mortality Increase",
    description:
      "In 2020 and 2021, Illinois saw an increase in the firearm mortality rate. Due to the high prevalence of violence, and the persistent disparities, violence is seen as an epidemic impacting our state and our society.",
    icon: "mdi-alert-octagon",
    color: "primary",
  },
  {
    title: "Gun Violence Disparities",
    description:
      "Black or African American men who are between the ages of 15-34 faced significant disparities in rates of experiencing gun violence and violent offenses. Across these rates of violence in Illinois, disparities exist for minoritized groups.",
    icon: "mdi-scale-unbalanced",
    color: "primary",
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
.statistics-section h2 {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.2s;
}

.statistics-section p {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.4s;
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
:root[data-theme="dark"] .v-card {
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .statistics-section h2,
  .statistics-section p {
    animation: none;
    opacity: 1;
  }
}
</style>
