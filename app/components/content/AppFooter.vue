<template>
  <v-footer color="background" class="modern-footer" role="contentinfo">
    <div class="footer-content">
      <!-- Main footer section -->
      <div class="footer-main">
        <!-- Branding section -->
        <div class="footer-branding">
          <AccessibleTooltip
            :text="menuConfig.footer.branding.tooltip"
            location="top"
          >
            <template v-slot="{ props }">
              <a
                :href="menuConfig.footer.branding.href"
                class="brand-link"
                v-bind="props"
                :aria-label="menuConfig.footer.branding.ariaLabel"
                @click.prevent="handleHomeClick"
              >
                <v-icon
                  :icon="menuConfig.footer.branding.icon"
                  size="large"
                  color="primary"
                  class="brand-icon"
                  aria-hidden="true"
                />
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
            </template>
          </AccessibleTooltip>
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
        <nav class="footer-nav" aria-label="Footer navigation">
          <nuxt-link
            to="/accessibility/documentation"
            class="nav-link"
            aria-label="View accessibility documentation"
          >
            Accessibility
          </nuxt-link>
          <nuxt-link
            to="/legal/privacy-policy"
            class="nav-link"
            aria-label="View Privacy Policy"
          >
            Privacy
          </nuxt-link>
          <nuxt-link
            to="/legal/terms-of-service"
            class="nav-link"
            aria-label="View Terms of Service"
          >
            Terms of Service
          </nuxt-link>
        </nav>

        <div class="copyright">
          <span>
            © {{ new Date().getFullYear() }}
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
</script>

<style scoped>
/* Modern Footer Design */
.modern-footer {
  border-top: 1px solid rgba(var(--v-theme-on-background), 0.08);
  padding: 48px 0 32px;
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
  margin-bottom: 24px;
}

.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  padding: 12px 16px;
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

/* Description section */
.footer-description {
  max-width: 700px;
  margin: 0 auto;
}

.footer-description p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(var(--v-theme-on-background), 0.8);
  margin: 0;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid rgba(var(--v-theme-on-background), 0.06);
  text-align: center;
}

.copyright {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-background), 0.7);
  text-align: center;
}

.footer-nav {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.nav-link {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-background), 0.8);
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  min-height: 44px;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.nav-link:hover {
  color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.04);
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
    gap: 16px;
    padding-top: 28px;
  }

  .footer-nav {
    gap: 16px;
  }

  .nav-link {
    font-size: 0.8rem;
    padding: 6px 8px;
  }
}

@media (max-width: 480px) {
  .footer-nav {
    flex-direction: column;
    gap: 8px;
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
  .footer-nav {
    gap: 32px;
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
