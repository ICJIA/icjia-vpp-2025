<template>
  <section class="stakeholders-section section py-16">
    <v-container>
      <v-row align="center">
        <!-- Content column -->
        <v-col cols="12" md="6" class="pr-md-12">
          <div class="stakeholders-content">
            <h2 class="text-h3 text-md-h2 font-weight-bold mb-6">
              Collaborative Partnership Approach
            </h2>
            <p class="text-h6 text-medium-emphasis mb-6">
              This plan was developed through an extensive collaborative process involving 
              diverse stakeholders from across Illinois, ensuring community voices are 
              centered in our violence prevention efforts.
            </p>

            <!-- Key partners -->
            <div class="mb-6">
              <h3 class="text-h5 font-weight-medium mb-4">Key Partners</h3>
              <v-list class="bg-transparent pa-0" role="list">
                <v-list-item
                  v-for="(partner, index) in keyPartners"
                  :key="index"
                  class="pa-0 mb-3"
                  role="listitem"
                >
                  <template v-slot:prepend>
                    <v-icon
                      :color="partner.color"
                      :icon="partner.icon"
                      class="mr-3"
                      aria-hidden="true"
                    />
                  </template>
                  <div>
                    <v-list-item-title class="text-body-1 font-weight-medium">
                      {{ partner.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-body-2">
                      {{ partner.role }}
                    </v-list-item-subtitle>
                  </div>
                </v-list-item>
              </v-list>
            </div>

            <!-- Stakeholder stats -->
            <div class="stakeholder-stats mb-6">
              <v-row>
                <v-col cols="6" sm="3">
                  <div class="text-center">
                    <div class="text-h4 font-weight-bold text-primary">40+</div>
                    <div class="text-body-2 text-medium-emphasis">Stakeholders</div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-center">
                    <div class="text-h4 font-weight-bold text-secondary">13</div>
                    <div class="text-body-2 text-medium-emphasis">Meetings</div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-center">
                    <div class="text-h4 font-weight-bold text-accent">3</div>
                    <div class="text-body-2 text-medium-emphasis">Workgroups</div>
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-center">
                    <div class="text-h4 font-weight-bold text-success">4</div>
                    <div class="text-body-2 text-medium-emphasis">Years</div>
                  </div>
                </v-col>
              </v-row>
            </div>

            <!-- CTA button -->
            <v-btn
              color="primary"
              size="large"
              class="rounded-pill px-6"
              @click="handleViewPartners"
            >
              View All Partners
              <v-icon end icon="mdi-arrow-right" />
            </v-btn>
          </div>
        </v-col>

        <!-- Image column -->
        <v-col cols="12" md="6" class="mt-8 mt-md-0">
          <ImageWithSpinner
            src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
            alt="Diverse group of stakeholders collaborating on violence prevention"
            image-class="rounded-xl shadow-img"
            aspect-ratio="4/3"
            cover
            spinner-color="primary"
          />
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
/**
 * Sandbox Home Stakeholders Section Component
 *
 * Displays information about the collaborative partnership approach
 * and key stakeholders involved in developing the Violence Prevention Plan.
 *
 * Features:
 * - Key partner organizations and their roles
 * - Stakeholder statistics from the planning process
 * - Visual presentation with image
 * - Call-to-action to view all partners
 * - WCAG 2.1 AA accessibility compliance
 * - Full theme compatibility
 *
 * @component
 */
import ImageWithSpinner from '~/components/content/ImageWithSpinner.vue';

/**
 * Key partner organizations from the VPP analysis
 */
const keyPartners = [
  {
    name: 'Illinois Criminal Justice Information Authority (ICJIA)',
    role: 'Lead agency coordinating statewide violence prevention efforts',
    icon: 'mdi-shield-account',
    color: 'primary'
  },
  {
    name: 'University of Illinois Urbana-Champaign',
    role: 'Violence Prevention Research Lab - research and analysis',
    icon: 'mdi-school',
    color: 'secondary'
  },
  {
    name: 'Violence Prevention Ad Hoc Committee',
    role: 'Quarterly coordination of violence prevention funding',
    icon: 'mdi-account-group',
    color: 'accent'
  },
  {
    name: 'Community-Based Organizations',
    role: 'Frontline violence prevention and community services',
    icon: 'mdi-heart-multiple',
    color: 'success'
  },
  {
    name: 'State & Municipal Agencies',
    role: 'Policy implementation and resource coordination',
    icon: 'mdi-office-building',
    color: 'info'
  }
];

/**
 * Handle view all partners button click
 */
const handleViewPartners = () => {
  // This would navigate to a detailed partners/stakeholders page
  console.log('View all partners clicked');
  // Could scroll to a detailed section or navigate to another page
};
</script>

<style scoped>
.stakeholders-section {
  background: rgb(var(--v-theme-background));
}

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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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
