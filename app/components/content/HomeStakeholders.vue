<template>
  <section class="stakeholders-section section section-primary py-16">
    <v-container>
      <v-row align="center">
        <!-- Image column - moved to left for alternating layout -->
        <v-col cols="12" md="6" class="mb-8 mb-md-0">
          <ImageWithSpinner
            src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
            alt="Diverse group of stakeholders collaborating on violence prevention"
            image-class="rounded-xl shadow-img"
            aspect-ratio="4/3"
            cover
            spinner-color="primary"
          />
        </v-col>

        <!-- Content column - moved to right for alternating layout -->
        <v-col cols="12" md="6" class="pl-md-12">
          <div class="stakeholders-content">
            <h2 class="text-h3 text-md-h2 font-weight-bold mb-6">
              The Planning Process
            </h2>
            <p class="text-h6 text-medium-emphasis mb-6">
              In preparation for the 2025-2029 Violence Prevention Plan, several
              groups were convened to review data and research, hear updates on
              violence prevention efforts across the state, review previous
              recommendations, and contribute feedback. The goals and
              recommendations in this plan are a result of this collaborative
              effort.
            </p>

            <!-- Planning workgroups -->
            <div class="mb-6">
              <h3 class="text-h5 font-weight-medium mb-4">Three Workgroups</h3>
              <ul class="workgroups-list" role="list">
                <li
                  v-for="(workgroup, index) in planningWorkgroups"
                  :key="index"
                  class="workgroup-item"
                  role="listitem"
                >
                  <v-icon
                    color="primary"
                    :icon="workgroup.icon"
                    class="workgroup-icon"
                    aria-hidden="true"
                  />
                  <div class="workgroup-content">
                    <div class="workgroup-title">
                      {{ workgroup.name }}
                    </div>
                    <div class="workgroup-description">
                      {{ workgroup.description }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Stakeholder stats -->
            <div class="stakeholder-stats mb-6">
              <v-row>
                <v-col cols="6" sm="3">
                  <div class="text-center">
                    <div class="text-h4 font-weight-bold text-primary">40+</div>
                    <div class="text-body-2 text-medium-emphasis">
                      Stakeholders
                    </div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-center">
                    <div class="text-h4 font-weight-bold text-primary">13</div>
                    <div class="text-body-2 text-medium-emphasis">Meetings</div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-center">
                    <div class="text-h4 font-weight-bold text-primary">3</div>
                    <div class="text-body-2 text-medium-emphasis">
                      Workgroups
                    </div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-center">
                    <div class="text-h4 font-weight-bold text-primary">4</div>
                    <div class="text-body-2 text-medium-emphasis">Years</div>
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
 * Home Planning Process Section Component - Alternating Layout
 *
 * Displays information about the planning process for developing the
 * 2025-2029 Violence Prevention Plan, including workgroups and collaborative efforts.
 * Implements alternating layout pattern with image on left, content on right.
 *
 * Features:
 * - Alternating layout pattern (image left, content right)
 * - Planning workgroups with consistent primary color theming
 * - Statistics from the planning process
 * - Subtle, muted color scheme following project design system
 * - WCAG 2.1 AA accessibility compliance
 * - Full theme compatibility (light/dark)
 * - Responsive design across all breakpoints
 *
 * Layout Pattern:
 * - Part of alternating section system where consecutive sections alternate image placement
 * - This section: Image left, Content right
 * - Next section (HomeApproach): Image left, Content right (maintains alternating pattern)
 *
 * @component
 */
import ImageWithSpinner from "~/components/content/ImageWithSpinner.vue";

/**
 * Planning workgroups from the 2025-2029 VPP planning process
 * Updated to use consistent primary color theming for subtle, muted design
 */
const planningWorkgroups = [
  {
    name: "Data Workgroup",
    description:
      "A data workgroup was formed to review the updated violence rates and trends report that was released, ensuring the new plan was reflective of these data",
    icon: "mdi-chart-line",
  },
  {
    name: "Grant Implementation Workgroup",
    description:
      "A grant implementation workgroup was formed to review the focus group and interview results from ICJIA violence prevention grantees and grant monitors. This workgroup focused on the goal related to equity in grant implementation",
    icon: "mdi-account-cash",
  },
  {
    name: "Recommendations Workgroup",
    description:
      "A recommendations workgroup was formed to review the 2020-2024 goals and recommendations, while considering new recommendations from the data and grant implementation workgroups",
    icon: "mdi-lightbulb-on",
  },
];
</script>

<style scoped>
/* Background handled by global .section-secondary class */

/* Content animations */
.stakeholders-content h2 {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.2s;
}

.stakeholders-content p {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.4s;
}

.stakeholders-content .v-list {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.6s;
}

.stakeholder-stats {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.8s;
}

.stakeholders-content .v-btn {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 1s;
}

/* Image animation */
.shadow-img {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.6s;
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

/* Custom workgroups list styling to match Vuetify list appearance */
.workgroups-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background: transparent;
}

.workgroup-item {
  display: flex;
  align-items: flex-start;
  padding: 0;
  margin-bottom: 1rem;
  min-height: auto;
}

.workgroup-icon {
  margin-right: 0.75rem;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.workgroup-content {
  flex: 1;
  min-width: 0;
}

.workgroup-title {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 0.25rem;
  color: rgba(var(--v-theme-on-surface), 0.87);
}

.workgroup-description {
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgba(var(--v-theme-on-surface), 0.9);
  word-wrap: break-word;
  hyphens: auto;
}

/* Stats styling */
.stakeholder-stats .text-h4 {
  line-height: 1.2;
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
  .stakeholders-content h2,
  .stakeholders-content p,
  .stakeholders-content .v-list,
  .stakeholder-stats,
  .stakeholders-content .v-btn,
  .shadow-img {
    animation: none;
    opacity: 1;
  }

  .shadow-img:hover {
    transform: none;
  }
}
</style>
