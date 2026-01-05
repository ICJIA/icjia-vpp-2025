/**
 * @module index
 * @fileoverview Vue component: index
 */

/**
 * Home Page for Statewide Violence Prevention Plan for Illinois: 2025-2029
 *
 * This is the current homepage implementation with core sections only.
 * Additional sections (statistics, stakeholders, news, principles, approach)
 * are currently disabled and can be re-enabled with lazy loading when needed.
 *
 * Current Active Sections:
 * - Hero section with mission-driven opening statements
 * - Letters from leadership
 * - Lieutenant Governor message
 * - Strategic priorities overview (3 main goals)
 * - Call to action section with URL navigation support
 *
 * Features:
 * - Full theme compatibility (light/dark)
 * - WCAG 2.1 AA accessibility compliance
 * - Responsive design
 * - Performance optimized with minimal bundle size
 *
 * Component Props Documentation:
 *
 * HomeHero:
 * - No props required (self-contained hero section)
 *
 * SandboxHomeStatistics:
 * - No props required (contains SandboxStatisticCard components internally)
 *
 * SandboxStatisticCard (used within SandboxHomeStatistics):
 * - title: string (required) - The title of the statistic card
 * - description: string (required) - The description text for the statistic
 * - icon: string (required) - Material Design icon name
 * - color: string (default: 'primary') - Vuetify color theme
 * - delay: number (default: 0) - Animation delay in milliseconds
 * - url: string|null (default: null) - Optional URL for navigation (local or external)
 * - actionUrl: string (default: '#') - Deprecated: Use 'url' prop instead
 *
 * SandboxHomeGoals:
 * - No props required (contains SandboxGoalCard components internally)
 *
 * SandboxGoalCard (used within SandboxHomeGoals):
 * - goal: object (required) - The goal object containing title, description, etc.
 * - delay: number (default: 0) - Animation delay in milliseconds
 * - url: string|null (default: null) - Optional URL for navigation (local or external)
 *
 * SandboxHomeStakeholders:
 * - No props required (self-contained stakeholder information section)
 *
 * HomeNews:
 * - itemCount: number (default: 3) - Number of recent news items to display (2-3 recommended)
 *
 * SandboxHomePrinciples:
 * - No props required (contains SandboxPrincipleCard components internally)
 *
 * SandboxPrincipleCard (used within SandboxHomePrinciples):
 * - principle: object (required) - The principle object containing title, description, etc.
 * - delay: number (default: 0) - Animation delay in milliseconds
 * - url: string|null (default: null) - Optional URL for navigation (local or external)
 *
 * SandboxHomeApproach:
 * - No props required (self-contained public health approach section)
 *
 * SandboxHomeAction:
 * - No props required (contains action items with URL navigation internally)
 * - Action items support URL navigation through internal callToActions array
 *
 * URL Navigation Behavior:
 * - No URL provided: Cards show hover/focus effects only (current behavior)
 * - Local URLs (starting with '/' or relative paths): Use Nuxt's navigateTo() for client-side navigation
 * - External URLs (starting with 'http://' or 'https://'): Open in new window with security attributes
 * - All URL navigation maintains WCAG 2.1 AA accessibility compliance
 * - Keyboard navigation (Enter/Space) supported for all interactive cards
 * - Screen reader announcements provided for navigation actions
 *
 * Usage Examples:
 *
 * // Card with local navigation
 * <SandboxGoalCard :goal="goalData" url="/about" />
 *
 * // Card with external navigation
 * <SandboxPrincipleCard :principle="principleData" url="https://example.com" />
 *
 * // Card without navigation (hover effects only)
 * <SandboxStatisticCard title="Stat" description="Desc" icon="mdi-chart" />
 *
 * // Card with legacy actionUrl (deprecated)
 * <SandboxStatisticCard title="Stat" description="Desc" icon="mdi-chart" actionUrl="/legacy" />
 *
 * @page
 */
import { computed } from "vue";
import { useHead, useSeoMeta } from "#imports";
import { useConsoleLogger } from "~/composables/useConsoleLogger";

// Import IntersectionSection wrapper component
import IntersectionSection from "~/components/IntersectionSection.vue";

// Immediate imports (above the fold components)
import HomeHero from "~/components/content/HomeHero.vue";
import HomeLetters from "~/components/content/HomeLetters.vue";
import HomeGoals from "~/components/content/HomeGoals.vue";

// Lazy imports (below the fold components) - loaded dynamically when needed
const LazyHomeLieutenantGovernor = defineAsyncComponent(
  () => import("~/components/content/HomeLieutenantGovernor.vue")
);

const LazyHomeAction = defineAsyncComponent(
  () => import("~/components/content/HomeAction.vue")
);

// import StructuredData from "~/components/seo/StructuredData.vue";

// Initialize console logger
const { log } = useConsoleLogger();

// Create content object for StructuredData component - temporarily disabled
// const homeContent = {
//   title: "Violence Prevention Plan for Illinois: 2025-2029",
//   description:
//     "The Violence Prevention Plan for Illinois: 2025-2029 provides comprehensive resources and tools for violence prevention initiatives across Illinois communities.",
//   _path: "/",
//   _dir: "",
//   _draft: false,
//   _partial: false,
//   _locale: "",
//   _empty: false,
//   _type: "markdown",
//   _id: "content:index.md",
//   _source: "content",
//   _file: "index.md",
//   _extension: "md",
// };

// Log page initialization
log("content", "Home page initialized", {
  timestamp: new Date().toISOString(),
});

/**
 * Set page title and HTML attributes for accessibility and SEO
 */
useHead({
  title: "Violence Prevention Plan for Illinois: 2025-2029 - Home",
  htmlAttrs: {
    lang: "en",
  },
});

/**
 * Enhanced SEO meta tags for homepage
 */
const homeTitle = "Violence Prevention Plan for Illinois: 2025-2029 - Home";
const homeDescription =
  "The Violence Prevention Plan for Illinois: 2025-2029 provides comprehensive resources and tools for violence prevention initiatives across Illinois communities.";
const homeCanonicalUrl = "https://vpp.icjia.illinois.gov/";
const homeSocialImage =
  "https://vpp.icjia.illinois.gov/images/og-image-default.jpg";
const homeTwitterImage =
  "https://vpp.icjia.illinois.gov/images/twitter-card-default.jpg";

useSeoMeta({
  title: homeTitle,
  description: homeDescription,

  // Open Graph meta tags for social sharing
  ogTitle: homeTitle,
  ogDescription: homeDescription,
  ogImage: homeSocialImage,
  ogUrl: homeCanonicalUrl,
  ogType: "website",
  ogSiteName: "Statewide Violence Prevention Plan for Illinois: 2025-2029",
  ogLocale: "en_US",

  // Twitter Card meta tags
  twitterCard: "summary_large_image",
  twitterTitle: homeTitle,
  twitterDescription: homeDescription,
  twitterImage: homeTwitterImage,
  twitterSite: "@ICJIA_Illinois",
  twitterCreator: "@ICJIA_Illinois",

  // Additional SEO meta tags
  canonical: homeCanonicalUrl,
  robots: "index, follow",
  author: "Illinois Criminal Justice Information Authority",
  keywords:
    "violence prevention, Illinois, public health, community safety, trauma-informed care, evidence-based practices, ICJIA",
});

// Also inject an explicit <link rel="canonical"> for Lighthouse compliance
useHead({
  link: [{ rel: "canonical", href: homeCanonicalUrl }],
});
