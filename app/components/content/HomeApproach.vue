<template>
  <section class="approach-section section section-primary py-16">
    <v-container>
      <v-row align="center">
        <!-- Image column -->
        <v-col cols="12" md="6" class="mb-8 mb-md-0">
          <ImageWithSpinner
            src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
            alt="Public health professionals working on violence prevention research and data analysis"
            image-class="rounded-xl shadow-img"
            aspect-ratio="4/3"
            cover
            spinner-color="primary"
          />
        </v-col>

        <!-- Content column -->
        <v-col cols="12" md="6" class="pl-md-12">
          <div class="approach-content">
            <h2 class="text-h3 text-md-h2 font-weight-bold mb-6">
              Public Health Approach to Violence Prevention
            </h2>
            <p class="text-h6 text-medium-emphasis mb-6">
              Evidence-informed violence prevention efforts utilize a public
              health framework to prevent violence. This approach is grounded in
              the scientific method and includes four steps.
            </p>

            <!-- Four steps of public health approach -->
            <div class="approach-steps mb-6">
              <h3 class="text-h5 font-weight-medium mb-4">
                Four-Step Framework
              </h3>
              <v-list class="bg-transparent pa-0" role="list">
                <v-list-item
                  v-for="(step, index) in approachSteps"
                  :key="index"
                  class="pa-0 mb-4"
                  role="listitem"
                >
                  <template v-slot:prepend>
                    <v-chip
                      :color="step.color"
                      size="small"
                      class="mr-3 font-weight-bold"
                    >
                      {{ index + 1 }}
                    </v-chip>
                  </template>
                  <div>
                    <v-list-item-title
                      class="text-body-1 font-weight-medium mb-1"
                    >
                      {{ step.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-body-2">
                      {{ step.description }}
                    </v-list-item-subtitle>
                  </div>
                </v-list-item>
              </v-list>
            </div>

            <!-- Prevention levels -->
            <div class="prevention-levels mb-6">
              <h3 class="text-h5 font-weight-medium mb-4">Prevention Levels</h3>
              <v-row>
                <v-col
                  v-for="(level, index) in preventionLevels"
                  :key="index"
                  cols="12"
                  sm="4"
                >
                  <div class="text-center">
                    <v-icon
                      :icon="level.icon"
                      :color="level.color"
                      size="large"
                      class="mb-2"
                    />
                    <div class="text-subtitle-1 font-weight-medium">
                      {{ level.name }}
                    </div>
                    <div class="text-body-2 text-medium-emphasis">
                      {{ level.description }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
/**
 * Sandbox Home Approach Section Component
 *
 * Explains the public health approach to violence prevention used in the plan.
 * Features the four-step framework and prevention levels with visual presentation.
 *
 * Features:
 * - Public health approach explanation
 * - Four-step framework from VPP analysis
 * - Prevention levels (primary, secondary, tertiary)
 * - Visual presentation with image
 * - Call-to-action for more information
 * - WCAG 2.1 AA accessibility compliance
 * - Full theme compatibility
 *
 * @component
 */
import ImageWithSpinner from "~/components/content/ImageWithSpinner.vue";

/**
 * Four steps of the public health approach from VPP analysis
 * Using consistent primary color scheme to match original home page design
 */
const approachSteps = [
  {
    title: "Define and Monitor the Problem",
    description:
      "Understanding who experiences violence, as well as when and where it occurs, is the first step in preventing violence. Data can help us understand the prevalence of violence, where it occurs, trends in violence rates over time, and who it impacts. In defining violence, it is also critical to find appropriate, validated measurements.",
    color: "primary",
  },
  {
    title: "Identify Risk and Protective Factors",
    description:
      "We need to understand what factors protect individuals from experiencing or perpetrating violence, and what factors place individuals at greater risk for victimization or perpetration. These factors can help providers know where to focus violence prevention efforts.",
    color: "primary",
  },
  {
    title: "Develop and Test Prevention Strategies",
    description:
      "Prevention efforts are developed and modified based on community needs, practitioner and organizational expertise and experience, and participant, stakeholder, and collaborator feedback. Once prevention strategies are developed or identified for implementation, strategies should be evaluated to ensure they are effective. Evidence-based practices are vital to ensure programs are doing what they set out to do.",
    color: "primary",
  },
  {
    title: "Assure Widespread Adoption",
    description:
      "Communities are encouraged to implement evidence-based programs. Additionally, they should continually assess if the strategy is a good match for their participants or community area, evaluating any adaptations or changes. The growing evidence-base for violence prevention practices will fuel widespread adoption of evidence-based strategies.",
    color: "primary",
  },
];

/**
 * Prevention levels from VPP analysis
 * Using consistent primary color scheme to match original home page design
 */
const preventionLevels = [
  {
    name: "Primary",
    description:
      "Primary prevention is considered universal, occurring for an entire population.",
    icon: "mdi-shield-check",
    color: "primary",
  },
  {
    name: "Secondary",
    description:
      "Secondary prevention is considered selected, or focused on those with one or more risk factors for violence.",
    icon: "mdi-shield-alert",
    color: "primary",
  },
  {
    name: "Tertiary",
    description:
      "Tertiary prevention is considered indicated, or efforts for those who have already experienced or perpetrated violence.",
    icon: "mdi-shield-account",
    color: "primary",
  },
];
</script>

<style scoped>
/* Background handled by global .section-secondary class */

/* Content animations */
.approach-content h2 {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.2s;
}

.approach-content > p {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.4s;
}

.approach-steps {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.6s;
}

.prevention-levels {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.8s;
}

.approach-content .v-btn {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 1s;
}

/* Image animation */
.shadow-img {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.4s;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.shadow-img:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* Dark theme image hover */
:root[data-theme="dark"] .shadow-img:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
}

/* List item styling */
.v-list-item {
  min-height: auto;
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

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .approach-content h2,
  .approach-content > p,
  .approach-steps,
  .prevention-levels,
  .approach-content .v-btn,
  .shadow-img {
    animation: none;
    opacity: 1;
  }

  .shadow-img:hover {
    transform: none;
  }
}
</style>
