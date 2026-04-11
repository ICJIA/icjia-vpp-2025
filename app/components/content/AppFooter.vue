<template>
  <v-footer color="background" class="modern-footer" role="contentinfo">
    <div class="footer-content">
      <!-- Main footer section -->
      <div class="footer-main">
        <!-- ICJIA Logo section -->
        <div class="footer-icjia-logo d-none d-md-block">
          <AccessibleTooltip text="Go to ICJIA" location="top">
            <a
              href="https://icjia.illinois.gov"
              target="_blank"
              rel="noopener noreferrer"
              class="icjia-logo-link"
              aria-label="Visit Illinois Criminal Justice Information Authority website"
            >
              <img
                src="/images/icjia-logo.webp"
                alt="Illinois Criminal Justice Information Authority Logo"
                class="icjia-logo"
              />
            </a>
          </AccessibleTooltip>
        </div>

        <!-- Branding section -->
        <div class="footer-branding">
          <a
            :href="menuConfig.footer.branding.href"
            class="brand-link"
            :aria-label="menuConfig.footer.branding.ariaLabel"
            @click.prevent="handleHomeClick"
          >
            <span class="brand-text">
              {{
                $vuetify.display.smAndDown
                  ? menuConfig.footer.branding.textSm
                  : $vuetify.display.mdAndDown
                    ? menuConfig.footer.branding.textMd
                    : menuConfig.footer.branding.text
              }}
            </span>
          </a>
        </div>

        <!-- Description section -->
        <div class="footer-description">
          <p>
            The
            <a
              href="https://icjia.illinois.gov"
              target="_blank"
              rel="noopener noreferrer"
              class="org-link"
              aria-label="Visit Illinois Criminal Justice Information Authority website"
            >
              Illinois Criminal Justice Information Authority
            </a>
            (ICJIA) aims to continue funding and supporting violence prevention
            efforts across Illinois. This report was written to inform ICJIA's
            violence prevention planning for 2025-2029, but also with the intent
            to be utilized by any state or community group interested in
            violence prevention efforts or in developing their own localized
            plan.
          </p>
        </div>
      </div>

      <!-- Footer bottom section -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <!-- Copyright / ICJIA link -->
          <span class="footer-item">
            © 2025
            <a
              href="https://icjia.illinois.gov"
              target="_blank"
              rel="noopener noreferrer"
              class="org-link"
              aria-label="Visit Illinois Criminal Justice Information Authority website"
            >
              Illinois Criminal Justice Information Authority
            </a>
          </span>

          <span class="footer-divider d-none d-md-inline" aria-hidden="true"
            >|</span
          >

          <!-- Privacy -->
          <nuxt-link
            to="/legal/privacy-policy"
            class="footer-item"
            aria-label="View Privacy Policy"
          >
            Privacy
          </nuxt-link>

          <span class="footer-divider d-none d-md-inline" aria-hidden="true"
            >|</span
          >

          <!-- Documentation Portal -->
          <a
            href="/docs/"
            class="footer-item"
            aria-label="View Developer Documentation Portal"
            @click.prevent="navigateToStatic('/docs/')"
          >
            Documentation
          </a>

          <span class="footer-divider d-none d-md-inline" aria-hidden="true"
            >|</span
          >

          <!-- Accessibility -->
          <a
            href="/docs/accessibility/"
            class="footer-item"
            aria-label="View Accessibility Audit Report"
            @click.prevent="navigateToStatic('/docs/accessibility/')"
          >
            Accessibility
          </a>
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
import menuConfig from "../../../config/menu.config.json";

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

/**
 * Navigate to static files in /public/docs/
 * Uses window.location.href to bypass Nuxt router since these are static HTML files
 * @param {string} path - Path to navigate to (e.g., '/docs/' or '/docs/accessibility/')
 */
const navigateToStatic = (path) => {
  window.location.href = path;
};
</script>

<style scoped>
/* Modern Footer Design */
.modern-footer {
  border-top: 1px solid rgba(var(--v-theme-on-background), 0.08);
  padding: 48px 0 32px;
  flex-shrink: 0; /* Prevent footer from collapsing to 0 during hydration */
  contain: layout style; /* Isolate footer from ancestor layout recalculations */
}

/* Light mode footer - darker background for better visual separation */
:root:not([data-theme="dark"]) .modern-footer {
  background-color: #d1d5db !important; /* Darker grey than section backgrounds (#E5E5E5) */
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Main footer section */
.footer-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 40px;
}

/* Branding section */
.footer-branding {
  margin-bottom: 16px;
}

.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
  min-height: 44px;
}

.brand-link:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
  transform: translateY(-1px);
}

.brand-icon {
  flex-shrink: 0;
}

.brand-text {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  line-height: 1.3;
}

/* ICJIA Logo section */
.footer-icjia-logo {
  margin: 0 0 8px 0;
  text-align: center;
}

.icjia-logo-link {
  display: inline-block;
  padding: 4px;
  border-radius: 8px;
  transition: all 0.2s ease;
  text-decoration: none;
}

.icjia-logo-link:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
  transform: translateY(-1px);
}

.icjia-logo {
  height: 100px;
  width: auto;
  object-fit: contain;
  transition: opacity 0.2s ease;
}

.icjia-logo-link:hover .icjia-logo {
  opacity: 0.8;
}

/* Description section */
.footer-description {
  max-width: 700px;
  margin: 0 auto;
}

.footer-description p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(var(--v-theme-on-background), 0.9);
  margin: 0;
}

/* Ensure sufficient contrast in light theme (WCAG 2.1 AA 4.5:1 minimum) */
:root:not([data-theme="dark"]) .footer-description p {
  color: rgba(0, 0, 0, 0.87);
}

.org-link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.3);
}

.org-link:hover {
  color: rgb(var(--v-theme-primary));
  border-bottom-color: rgb(var(--v-theme-primary));
}

/* Footer bottom section */
.footer-bottom {
  padding-top: 24px;
  border-top: 1px solid rgba(var(--v-theme-on-background), 0.06);
  text-align: center;
  /* Force-visible safety overrides in case any global styles hide this section */
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  height: auto !important;
  max-height: none !important;
}

.footer-bottom-content {
  display: flex !important;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0;
  font-size: 0.875rem;
  text-align: center;
}

/* Mobile responsive adjustments */
@media (max-width: 767px) {
  .footer-bottom-content {
    flex-direction: column;
    gap: 4px;
  }
}

.footer-item {
  color: rgba(var(--v-theme-on-background), 0.9);
  text-decoration: none;
  padding: 2px 0;
  margin: 0 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-weight: 500;
  white-space: nowrap;
}

/* Ensure sufficient contrast in light theme (WCAG 2.1 AA 4.5:1 minimum) */
:root:not([data-theme="dark"]) .footer-item {
  color: rgba(0, 0, 0, 0.87);
}

.footer-item:hover {
  color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.footer-divider {
  color: rgba(var(--v-theme-on-background), 0.5);
  margin: 0 4px;
}

/* Responsive design */
@media (max-width: 768px) {
  .modern-footer {
    padding: 32px 0 24px;
  }

  .footer-content {
    padding: 0 16px;
  }

  .footer-main {
    margin-bottom: 32px;
  }

  .brand-text {
    font-size: 0.9rem;
  }

  .footer-description p {
    font-size: 0.875rem;
  }

  .footer-bottom {
    padding-top: 28px;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    height: auto !important;
    max-height: none !important;
  }

  .footer-bottom-content {
    gap: 8px;
    font-size: 0.8rem;
    display: flex !important;
  }

  .nav-link-inline {
    font-size: 0.8rem;
    padding: 4px 6px;
  }
}

@media (max-width: 480px) {
  .footer-bottom-content {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .footer-nav-inline {
    flex-direction: column;
    gap: 8px;
  }

  .nav-link-inline {
    padding: 6px 12px;
  }

  .brand-link {
    gap: 8px;
    padding: 8px 12px;
  }

  .footer-description p {
    font-size: 0.8rem;
    line-height: 1.5;
  }
}

/* Desktop layout improvements */
@media (min-width: 769px) {
  .footer-nav-inline {
    gap: 16px;
  }
}

/* Large screen optimizations */
@media (min-width: 1200px) {
  .footer-content {
    padding: 0 32px;
  }

  .footer-description {
    max-width: 800px;
  }
}
</style>
