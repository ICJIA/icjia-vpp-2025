<template>
  <section class="section py-16 bg-primary-lighten-5">
    <v-container>
      <div class="text-center">
        <div class="mb-8">
          <slot />
        </div>

        <v-btn
          color="primary"
          size="large"
          class="rounded-pill px-8 py-3 elevation-2 contact-button"
          aria-label="Contact us via email"
          @keydown.enter="handleContactClick"
          @keydown.space.prevent="handleContactClick"
          @click="handleContactClick"
          tabindex="0"
        >
          <span class="d-flex align-center justify-center">
            Contact Us
            <v-icon end icon="mdi-email-outline" aria-hidden="true" class="ml-2" />
          </span>
        </v-btn>
      </div>
    </v-container>
  </section>
</template>

<script setup>
/**
 * AboutContact component for the About page
 *
 * This component displays the contact section with:
 * - Call-to-action heading and description
 * - Accessible contact button with keyboard navigation
 * - Screen reader announcements for interactions
 * - Proper ARIA labels and focus management
 *
 * @component
 */
import { inject } from 'vue';

/**
 * Get the announce function from the provider for screen reader announcements
 */
const announce = inject('announce', null);

/**
 * Handle contact button click or keyboard activation
 * Announces action to screen readers and would typically open a contact form
 */
const handleContactClick = () => {
  console.log('Contact button clicked');

  // Announce to screen readers with assertive priority for immediate feedback
  if (announce) {
    announce('Contact form will open shortly', 'assertive');
  }

  // This would typically open a contact form or navigate to a contact page
};
</script>

<style scoped>
.contact-button {
  transition: transform 0.3s ease;
}

.contact-button:hover,
.contact-button:focus-visible {
  transform: translateY(-4px);
}

.contact-button:focus-visible {
  outline: 3px solid var(--v-primary-base);
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .contact-button {
    transition: none !important;
  }

  .contact-button:hover,
  .contact-button:focus-visible {
    transform: none !important;
  }
}

/* Markdown content styling */
:deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

:deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

:deep(strong) {
  font-weight: 700;
}

:deep(em) {
  font-style: italic;
}
</style>
