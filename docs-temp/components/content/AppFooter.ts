/**
 * @module AppFooter
 * @fileoverview Vue component: AppFooter
 */

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

