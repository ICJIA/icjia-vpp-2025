<template>
  <v-footer color="background" border class="py-8 app-footer" role="contentinfo">
    <div class="footer-container">
      <!-- Centered footer content -->
      <div class="text-center mb-6">
        <div class="footer-branding-centered">
          <AccessibleTooltip
            :text="menuConfig.footer.branding.tooltip"
            :location="$vuetify.display.smAndDown ? 'top' : 'top'"
          >
            <template v-slot="{ props }">
              <a
                :href="menuConfig.footer.branding.href"
                class="d-flex align-center justify-center text-decoration-none mb-4"
                v-bind="props"
                :aria-label="menuConfig.footer.branding.ariaLabel"
                @click.prevent="handleHomeClick"
              >
                <v-icon
                  :icon="menuConfig.footer.branding.icon"
                  :size="$vuetify.display.smAndDown ? 'medium' : 'large'"
                  color="primary"
                  :class="$vuetify.display.smAndDown ? 'mr-1' : 'mr-2'"
                  aria-hidden="true"
                />
                <!-- Responsive title display based on screen size -->
                <span
                  class="d-none d-xl-block text-body-1 font-weight-bold text-primary footer-title-xl"
                >
                  {{ menuConfig.footer.branding.text }}
                </span>
                <span
                  class="d-none d-lg-block d-xl-none text-body-1 font-weight-bold text-primary footer-title-lg"
                >
                  {{ menuConfig.footer.branding.textMd }}
                </span>
                <span
                  class="d-none d-sm-block d-lg-none text-subtitle-2 font-weight-bold text-primary"
                >
                  {{ menuConfig.footer.branding.textSm }}
                </span>
                <span
                  class="d-block d-sm-none text-subtitle-2 font-weight-bold text-primary"
                >
                  {{ menuConfig.footer.branding.textXs }}
                </span>
              </a>
            </template>
          </AccessibleTooltip>
          <p class="text-body-2 footer-description footer-description-centered mx-auto">
            The
            <a
              href="https://icjia.illinois.gov"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-organization-link"
              aria-label="Visit Illinois Criminal Justice Information Authority website"
            >
              Illinois Criminal Justice Information Authority
            </a>
            (ICJIA) aims to continue funding and supporting violence prevention efforts across Illinois. This report was written to inform ICJIA's violence prevention planning for 2025-2029, but also with the intent to be utilized by any state or community group interested in violence prevention efforts or in developing their own localized plan.
          </p>
        </div>
      </div>

      <v-divider class="mb-6" aria-hidden="true"></v-divider>

      <div class="text-center text-body-2 footer-copyright" role="contentinfo">
        <!-- Desktop layout: single line with dividers -->
        <small
          class="d-none d-sm-flex align-center justify-center footer-copyright-desktop"
        >
          <span>
            © {{ new Date().getFullYear() }}
            <a
              href="https://icjia.illinois.gov"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-organization-link"
              aria-label="Visit Illinois Criminal Justice Information Authority website"
            >
              Illinois Criminal Justice Information Authority
            </a>. All rights reserved.
          </span>
          <span class="mx-2 footer-divider" aria-hidden="true">|</span>
          <nuxt-link
            to="/accessibility/documentation"
            class="footer-link accessibility-link"
            aria-label="View accessibility documentation"
          >
            Accessibility
          </nuxt-link>
          <span class="mx-2 footer-divider" aria-hidden="true">|</span>
          <nuxt-link
            to="/legal/privacy-policy"
            class="footer-link accessibility-link"
            aria-label="View Privacy Policy"
          >
            Privacy
          </nuxt-link>
          <span class="mx-2 footer-divider" aria-hidden="true">|</span>
          <nuxt-link
            to="/legal/terms-of-service"
            class="footer-link accessibility-link"
            aria-label="View Terms of Service"
          >
            Terms of Service
          </nuxt-link>
        </small>

        <!-- Mobile layout: stacked with proper spacing -->
        <div class="d-flex d-sm-none flex-column align-center footer-copyright-mobile">
          <small class="mb-2">
            © {{ new Date().getFullYear() }}
            <a
              href="https://icjia.illinois.gov"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-organization-link"
              aria-label="Visit Illinois Criminal Justice Information Authority website"
            >
              Illinois Criminal Justice Information Authority
            </a>. All rights reserved.
          </small>
          <small class="d-flex flex-column align-center">
            <nuxt-link
              to="/accessibility/documentation"
              class="footer-link accessibility-link mb-1"
              aria-label="View accessibility documentation"
            >
              Accessibility
            </nuxt-link>
            <nuxt-link
              to="/legal/privacy-policy"
              class="footer-link accessibility-link mb-1"
              aria-label="View Privacy Policy"
            >
              Privacy
            </nuxt-link>
            <nuxt-link
              to="/legal/terms-of-service"
              class="footer-link accessibility-link"
              aria-label="View Terms of Service"
            >
              Terms of Service
            </nuxt-link>
          </small>
        </div>
      </div>
    </div>
  </v-footer>
</template>

<script setup>
/**
 * Application footer component with navigation, social links, and legal information
 *
 * This component provides:
 * - Secondary site navigation
 * - Social media links
 * - Legal information links
 * - Site branding
 * - Copyright information
 * - Tooltips for improved usability
 * - Proper ARIA attributes for accessibility
 * - Scroll to top functionality for homepage links
 * - Configuration-based navigation structure
 *
 * @component
 */
import { useRouter, useRoute } from "#imports";
import AccessibleTooltip from "./AccessibleTooltip.vue";
import menuConfig from "~/config/menu.config.json";

// Get Nuxt app instance to access plugins
const nuxtApp = useNuxtApp();
const router = useRouter();
const route = useRoute();

/**
 * Handle click on home links
 * If already on homepage, just scroll to top
 * Otherwise navigate to homepage
 */
const handleHomeClick = () => {
  if (route.path === "/") {
    // Already on homepage, just scroll to top
    nuxtApp.$scrollToTop();
  } else {
    // Navigate to homepage
    router.push("/");
  }
};
</script>

<style scoped>
.max-width-300 {
  max-width: 300px;
}

.footer-description,
.footer-copyright {
  color: rgba(
    var(--v-theme-on-background),
    0.87
  ); /* Higher contrast than default medium-emphasis */
}

.footer-link {
  color: rgba(
    var(--v-theme-on-background),
    0.87
  ); /* Increased from 0.7 opacity for better contrast */
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--v-primary-base);
}

.accessibility-link {
  font-size: inherit;
  font-weight: inherit;
  color: rgba(var(--v-theme-on-background), 0.87); /* Match copyright text color */
}

.accessibility-link:hover {
  color: var(--v-primary-base);
}

.footer-divider {
  color: rgba(var(--v-theme-on-background), 0.6); /* Subtle divider color */
  line-height: 1; /* Ensure proper vertical alignment */
}

/* Organization link styling - matches surrounding text but clearly a link */
.footer-organization-link {
  color: inherit; /* Match surrounding text color */
  font-size: inherit; /* Match surrounding text size */
  font-weight: inherit; /* Match surrounding text weight */
  text-decoration: underline; /* Clear link indicator */
  text-decoration-color: rgba(var(--v-theme-primary), 0.6); /* Subtle underline */
  transition: all 0.2s ease;
}

.footer-organization-link:hover {
  color: var(--v-primary-base); /* Change to primary color on hover */
  text-decoration-color: var(--v-primary-base); /* Stronger underline on hover */
}

/* Desktop copyright layout */
.footer-copyright-desktop {
  white-space: nowrap; /* Prevent wrapping on desktop */
  gap: 0; /* Remove any default gap */
}

/* Mobile copyright layout */
.footer-copyright-mobile {
  line-height: 1.4; /* Better line spacing for mobile */
}

.footer-copyright-mobile small {
  text-align: center;
}

/* Responsive breakpoint adjustments */
@media (max-width: 599px) {
  .footer-copyright-mobile small {
    font-size: 0.75rem; /* Slightly smaller text on very small screens */
  }
}

/* Ensure consistent spacing across breakpoints */
@media (min-width: 600px) {
  .footer-copyright-desktop {
    font-size: 0.875rem; /* Standard small text size */
  }
}

@media (max-width: 960px) {
  .d-flex.justify-end {
    justify-content: flex-start !important;
    margin-top: 32px;
  }
}

.footer-container {
  width: 100%;
  max-width: 1600px; /* Wider than default container */
  margin: 0 auto;
  padding: 0 16px; /* Minimum padding on small screens */
}

/* Responsive padding adjustments */
@media (min-width: 600px) {
  .footer-container {
    padding: 0 24px;
  }
}

@media (min-width: 960px) {
  .footer-container {
    padding: 0 32px;
  }
}

/* Custom footer title sizing to ensure full title fits on one line */
.footer-title-xl {
  font-size: 0.95rem !important; /* Slightly smaller than text-body-1 default */
  line-height: 1.3 !important;
  white-space: nowrap; /* Prevent wrapping */
}

.footer-title-lg {
  font-size: 0.9rem !important; /* Even smaller for lg screens */
  line-height: 1.3 !important;
  white-space: nowrap; /* Prevent wrapping */
}

/* Responsive adjustments for very large screens */
@media (min-width: 1400px) {
  .footer-title-xl {
    font-size: 1rem !important; /* Can be slightly larger on very wide screens */
  }

  .footer-title-lg {
    font-size: 0.95rem !important;
  }
}

/* Centered footer description styling */
.footer-description-centered {
  max-width: 800px; /* Optimal reading width */
  text-align: center;
  line-height: 1.6; /* Better readability */
}

/* Responsive description width adjustments for centered layout */
@media (max-width: 599px) {
  .footer-description-centered {
    max-width: 100%;
    font-size: 0.875rem; /* Slightly smaller on mobile */
    line-height: 1.5;
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .footer-description-centered {
    max-width: 600px;
  }
}

@media (min-width: 960px) {
  .footer-description-centered {
    max-width: 700px;
  }
}

@media (min-width: 1400px) {
  .footer-description-centered {
    max-width: 800px;
  }
}

/* Centered footer branding */
.footer-branding-centered {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
