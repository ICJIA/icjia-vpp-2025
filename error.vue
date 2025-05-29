<template>
  <div class="error-page">
    <v-container class="d-flex flex-column align-center justify-center text-center">
      <div class="error-content">
        <div class="error-animation mb-8">
          <v-icon
            icon="mdi-map-marker-off"
            size="100"
            color="primary"
            class="error-icon"
          />
          <div class="error-code">404</div>
        </div>

        <h1 class="text-h2 font-weight-bold mb-4">Page Not Found</h1>

        <p class="text-subtitle-1 text-primary font-weight-medium mb-2 max-width-text">
          Violence Prevention Plan for Illinois: 2025-2029
        </p>

        <p class="text-body-1 mb-8 max-width-text">
          Oops! It seems like the page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div class="text-center">
          <v-btn
            color="primary"
            size="large"
            class="rounded-pill px-8 py-3 elevation-1 home-button"
            @click="handleReturn"
            aria-label="Return to homepage"
          >
            <v-icon icon="mdi-home" class="mr-2" aria-hidden="true" />
            Return to Homepage
          </v-btn>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup>
/**
 * Custom error page for 404 and other errors
 *
 * This page provides:
 * - Visually appealing 404 error display
 * - Clear site identification (Violence Prevention Plan for Illinois: 2025-2029)
 * - Option to return to homepage
 * - Proper SEO metadata
 * - Accessible navigation options
 *
 * @page
 */
import { useHead, useSeoMeta, useNuxtApp, navigateTo } from "#imports";

// Define props for the error page
const props = defineProps({
  error: {
    type: Object,
    required: true,
  },
});

// Set page title and HTML attributes for accessibility and SEO
useHead({
  title: "Page Not Found - Violence Prevention Plan for Illinois: 2025-2029",
  htmlAttrs: {
    lang: "en",
  },
});

// Set SEO metadata
useSeoMeta({
  description:
    "Page not found. Return to the Violence Prevention Plan for Illinois: 2025-2029 homepage.",
  robots: "noindex, nofollow",
});

/**
 * Handle return to homepage
 * Uses Nuxt's built-in clearError function to reset the error state
 * and navigate to the homepage
 * Ensures page scrolls to top after navigation
 */
const handleReturn = () => {
  // Access Nuxt's built-in clearError function
  const nuxtApp = useNuxtApp();

  // Clear the error and navigate to homepage
  nuxtApp.callHook("app:error:cleared");

  // Navigate to homepage and ensure scroll to top
  navigateTo("/", {
    onFinish: () => {
      // Use setTimeout to ensure this runs after navigation completes
      setTimeout(() => {
        if (nuxtApp.$scrollToTop) {
          nuxtApp.$scrollToTop();
        } else {
          // Fallback if plugin not available
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
    },
  });
};
</script>

<style scoped>
.error-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.error-content {
  max-width: 600px;
  animation: fadeIn 0.8s ease-in-out;
}

.max-width-text {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.error-animation {
  position: relative;
  display: inline-block;
}

.error-icon {
  animation: pulse 2s infinite ease-in-out;
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-secondary-base));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  opacity: 0.8;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
}

.home-button {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.home-button:hover,
.home-button:focus-visible {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .error-code {
    font-size: 6rem;
  }

  .error-page {
    padding: 1rem;
  }
}
</style>
