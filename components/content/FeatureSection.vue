<template>
  <section class="section py-16">
    <v-container>
      <div class="text-center mb-16">
        <slot mdc-unwrap="p" />
      </div>

      <v-row>
        <v-col cols="12" md="4" class="mb-8">
          <FeatureCard
            icon="mdi-palette-outline"
            :delay="0"
          >
            <slot name="ipsum-caelum-bellum" mdc-unwrap="p" />
          </FeatureCard>
        </v-col>
        <v-col cols="12" md="4" class="mb-8">
          <FeatureCard
            icon="mdi-responsive"
            :delay="0.2"
          >
            <slot name="carmen-umbra-stella-vox" mdc-unwrap="p" />
          </FeatureCard>
        </v-col>
        <v-col cols="12" md="4" class="mb-8">
          <FeatureCard
            icon="mdi-lightning-bolt-outline"
            :delay="0.4"
          >
            <slot name="vox-tempus-elit-sol-vox" mdc-unwrap="p" />
          </FeatureCard>
        </v-col>
        <v-col cols="12" md="4" class="mb-8">
          <FeatureCard
            icon="mdi-theme-light-dark"
            :delay="0.6"
          >
            <slot name="vita-idem-bis-aether-lumen" mdc-unwrap="p" />
          </FeatureCard>
        </v-col>
        <v-col cols="12" md="4" class="mb-8">
          <FeatureCard
            icon="mdi-cube-scan"
            :delay="0.8"
          >
            <slot name="rex-adipiscing-bis-umbra" mdc-unwrap="p" />
          </FeatureCard>
        </v-col>
        <v-col cols="12" md="4" class="mb-8">
          <FeatureCard
            icon="mdi-animation-outline"
            :delay="1.0"
          >
            <slot name="stella-vox-terra-carmen-anima-rex" mdc-unwrap="p" />
          </FeatureCard>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
/**
 * Feature Section Component
 *
 * Displays the main features section with a title, description, and feature cards.
 * This component now uses slots for content management, allowing all text content
 * to be defined in markdown files for better searchability and content management.
 *
 * Features:
 * - Responsive grid layout for feature cards
 * - Slot-based content management for title, description, and individual features
 * - Staggered animations for visual appeal
 * - Accessible card components with proper ARIA attributes
 *
 * @component
 */
import FeatureCard from '~/components/content/FeatureCard.vue';
</script>