<template>
  <section class="statistics-section section section-primary py-16">
    <v-container>
      <!-- Section header -->
      <div class="text-center mb-12">
        <h2 class="text-h3 text-md-h2 font-weight-bold mb-4">
          Violence in Illinois: The Data
        </h2>
        <p class="text-h6 text-medium-emphasis max-width-800 mx-auto">
          Understanding the scope and impact of violence is the first step in prevention. 
          These statistics highlight the urgent need for comprehensive violence prevention efforts across Illinois.
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

      <!-- Download CTA -->
      <DownloadPlanButton container-class="mt-12 download-cta-section" />
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
 * - Download CTA button for plan access
 * - WCAG 2.1 AA accessibility compliance
 * - Full theme compatibility
 *
 * @component
 */
import HomeStatisticCard from './HomeStatisticCard.vue';
import DownloadPlanButton from './DownloadPlanButton.vue';

/**
 * Statistics data from the Violence Prevention Plan analysis
 * Refactored for visual consistency with catchy titles and coherent descriptions
 * All statistics use primary color for consistency and subtle visual appeal
 * Optimized for 3-column layout display with equal card heights
 */
const statistics = [
  {
    title: 'Bullying Affects One in Three',
    description: 'One in three youth in grades 6-12 report experiencing bullying. This widespread issue creates lasting trauma and requires immediate intervention strategies.',
    icon: 'mdi-school',
    color: 'primary'
  },
  {
    title: 'Physical Violence Among Youth',
    description: 'One in five Illinois youth report being in physical fights within the past 12 months. These incidents often escalate and require early intervention approaches.',
    icon: 'mdi-account-alert',
    color: 'primary'
  },
  {
    title: 'Youth Sexual Violence Crisis',
    description: '12% of Illinois high school students experienced sexual violence between 2019-2021. This alarming statistic highlights the urgent need for comprehensive prevention programs in our schools.',
    icon: 'mdi-account-group',
    color: 'primary'
  },
  {
    title: 'Child Maltreatment Rates',
    description: 'Illinois shows higher child maltreatment rates than national averages from 2018-2021. Strengthening family support systems is critical for prevention.',
    icon: 'mdi-shield-alert',
    color: 'primary'
  },
  {
    title: 'Rising Firearm Mortality',
    description: 'Firearm mortality rates increased significantly in 2020 and 2021. Community-based violence intervention programs are essential to reverse this trend.',
    icon: 'mdi-alert-octagon',
    color: 'primary'
  },
  {
    title: 'Racial Disparities in Violence',
    description: 'Black men aged 15-34 face significant disparities in gun violence exposure. Addressing systemic inequities is fundamental to effective prevention.',
    icon: 'mdi-scale-unbalanced',
    color: 'primary'
  }
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

.statistics-section .download-cta-section {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 1.0s;
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
  .statistics-section p,
  .statistics-section .download-cta-section {
    animation: none;
    opacity: 1;
  }
}
</style>
