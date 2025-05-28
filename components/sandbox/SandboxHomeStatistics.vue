<template>
  <section class="statistics-section section py-16">
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
          <SandboxStatisticCard
            :statistic="stat.value"
            :label="stat.label"
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
 * Sandbox Home Statistics Section Component
 *
 * Displays key statistics about violence in Illinois based on the VPP analysis.
 * Features visual presentation of data points that demonstrate the need for
 * violence prevention with proper accessibility and theme support.
 *
 * Features:
 * - Key statistics from the VPP analysis
 * - Visual card-based presentation
 * - Animated entrance effects
 * - Disparities callout section
 * - WCAG 2.1 AA accessibility compliance
 * - Full theme compatibility
 *
 * @component
 */
import SandboxStatisticCard from './SandboxStatisticCard.vue';

/**
 * Statistics data from the Violence Prevention Plan analysis
 * Using subtle, consistent color scheme matching the original home page design
 * All statistics use primary color for consistency and subtle visual appeal
 * Reduced to 6 main data points for optimal 3-column layout display
 */
const statistics = [
  {
    value: '12%',
    label: 'High School Youth',
    description: 'experienced sexual violence (2019-2021)',
    icon: 'mdi-account-group',
    color: 'primary'
  },
  {
    value: '1 in 3',
    label: 'Youth (6th-12th Grade)',
    description: 'report experiencing bullying',
    icon: 'mdi-school',
    color: 'primary'
  },
  {
    value: '1 in 5',
    label: 'Youth',
    description: 'report physical fights in past 12 months',
    icon: 'mdi-account-alert',
    color: 'primary'
  },
  {
    value: 'Higher',
    label: 'Child Maltreatment',
    description: 'rates than national averages (2018-2021)',
    icon: 'mdi-shield-alert',
    color: 'primary'
  },
  {
    value: 'Increased',
    label: 'Firearm Mortality',
    description: 'rates in 2020 and 2021',
    icon: 'mdi-alert-octagon',
    color: 'primary'
  },
  {
    value: 'Significant',
    label: 'Disparities',
    description: 'for Black men aged 15-34 in gun violence',
    icon: 'mdi-scale-unbalanced',
    color: 'primary'
  }
];
</script>

<style scoped>
.statistics-section {
  background: rgb(var(--v-theme-background));
}

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
</style>
