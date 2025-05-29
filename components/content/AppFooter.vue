<template>
  <v-footer color="background" border class="py-8" role="contentinfo">
    <div class="footer-container">
      <v-row justify="space-between" align="center" class="mb-6">
        <v-col cols="12" md="6" lg="5">
          <div class="footer-branding">
            <AccessibleTooltip
              :text="menuConfig.footer.branding.tooltip"
              :location="$vuetify.display.smAndDown ? 'top' : 'top'"
            >
              <template v-slot="{ props }">
                <a
                  :href="menuConfig.footer.branding.href"
                  class="d-flex align-center text-decoration-none"
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
            <p class="mt-4 text-body-2 footer-description footer-description-wide">
              {{ menuConfig.footer.description }}
            </p>
          </div>
        </v-col>

        <v-col cols="12" md="6" lg="7" class="d-flex justify-end">
          <nav aria-label="Footer Navigation" class="d-flex justify-end w-100">
            <!-- Dynamically generate footer sections from config -->
            <div
              v-for="(section, sectionIndex) in menuConfig.footer.sections"
              :key="sectionIndex"
              class="d-flex flex-column"
              :class="sectionIndex < menuConfig.footer.sections.length - 1 ? 'mr-8' : ''"
            >
              <h2 class="text-subtitle-1 font-weight-bold mb-4">{{ section.title }}</h2>

              <!-- Generate items for each section -->
              <template
                v-for="(item, itemIndex) in section.items"
                :key="`${sectionIndex}-${itemIndex}`"
              >
                <AccessibleTooltip
                  :text="item.tooltip"
                  :location="$vuetify.display.smAndDown ? 'top' : item.tooltipLocation"
                >
                  <template v-slot="{ props }">
                    <!-- Use nuxt-link for internal routes with 'to' property -->
                    <nuxt-link
                      v-if="item.to && !item.isExternal"
                      :to="item.to"
                      :class="item.class"
                      v-bind="props"
                      :aria-label="item.ariaLabel"
                    >
                      {{ item.text }}
                    </nuxt-link>

                    <!-- Home link with special handling -->
                    <a
                      v-else-if="item.href === '/'"
                      :href="item.href"
                      :class="item.class"
                      v-bind="props"
                      :aria-label="item.ariaLabel"
                      @click.prevent="handleHomeClick"
                    >
                      {{ item.text }}
                    </a>

                    <!-- External link with additional attributes -->
                    <a
                      v-else-if="item.isExternal"
                      :href="item.href"
                      :class="item.class"
                      v-bind="props"
                      :aria-label="item.ariaLabel"
                      :target="item.target"
                      :rel="item.rel"
                    >
                      <span class="d-flex align-center">
                        {{ item.text }}
                        <v-icon
                          v-if="item.externalIcon"
                          :icon="item.externalIcon"
                          size="small"
                          class="ml-1"
                          aria-hidden="true"
                        ></v-icon>
                      </span>
                    </a>

                    <!-- Default link (internal non-router links) -->
                    <a
                      v-else
                      :href="item.href"
                      :class="item.class"
                      v-bind="props"
                      :aria-label="item.ariaLabel"
                    >
                      {{ item.text }}
                    </a>
                  </template>
                </AccessibleTooltip>
              </template>
            </div>
          </nav>
        </v-col>
      </v-row>

      <v-divider class="mb-6" aria-hidden="true"></v-divider>

      <div class="text-center text-body-2 footer-copyright" role="contentinfo">
        <small>{{
          menuConfig.footer.copyright.replace("{year}", new Date().getFullYear())
        }}</small>
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

/* Footer description styling to match title width */
.footer-description-wide {
  max-width: none !important; /* Remove the 300px constraint */
  width: 100% !important;
}

/* Responsive description width adjustments */
@media (min-width: 768px) {
  .footer-description-wide {
    max-width: 500px !important; /* Allow wider text on medium screens */
  }
}

@media (min-width: 1024px) {
  .footer-description-wide {
    max-width: 600px !important; /* Even wider on large screens */
  }
}

@media (min-width: 1400px) {
  .footer-description-wide {
    max-width: 700px !important; /* Maximum width on very large screens */
  }
}
</style>
