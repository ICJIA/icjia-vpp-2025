/**
 * @module HomeGoals
 * @fileoverview Vue component: HomeGoals
 */

/**
 * Sandbox Home Goals Section Component - Completely Refactored
 *
 * Displays the three strategic priorities with perfect button alignment using CSS Grid.
 * Completely refactored to ensure pixel-perfect horizontal alignment of Learn More buttons
 * across all goal cards regardless of content length variations.
 *
 * Features:
 * - CSS Grid layout for perfect card alignment and equal heights
 * - Responsive grid system (1 column mobile, 3 columns desktop)
 * - Perfect button alignment across all cards in each row
 * - Larger icons (size 64) for enhanced visual impact
 * - Professional spacing and typography
 * - Smooth animations with staggered entrance effects
 * - Full accessibility compliance (WCAG 2.1 AA)
 * - Complete theme compatibility (light/dark modes)
 * - Enhanced text contrast for optimal readability
 *
 * Technical Implementation:
 * - Uses CSS Grid with align-items: stretch for equal heights
 * - Responsive grid-template-columns for different screen sizes
 * - Deep selectors for Vuetify component overrides
 * - Grid gap adjustments for optimal spacing
 *
 * @component
 */
import HomeGoalCard from "./HomeGoalCard.vue";

/**
 * Recommendations and Resources content
 * Three main sections providing access to violence prevention strategies,
 * resources, and organizational achievements across Illinois
 */
const goals = [
  {
    number: "01",
    title: "Goals and Recommendations",
    description:
      "Explore comprehensive violence prevention strategies with actionable goals, evidence-based practices, and measurable outcomes designed to create lasting change in Illinois communities.",
    icon: "mdi-clipboard-list",
    color: "primary",
    url: "/plan/goals-and-recommendations",
    relatedPrinciples: ["Strategic Planning", "Evidence-Based Practices"],
    highlights: [],
  },
  {
    number: "02",
    title: "Resources",
    description:
      "Access a comprehensive collection of tools, research, training materials, and best practices to support violence prevention initiatives across communities and organizations.",
    icon: "mdi-book-open-variant",
    color: "primary",
    url: "/resources",
    relatedPrinciples: ["Resource Access", "Capacity Building"],
    highlights: [],
  },
  {
    number: "03",
    title: "Organizational and Agency Highlights",
    description:
      "Discover achievements, success stories, and innovative programs from organizations and agencies leading violence prevention efforts throughout Illinois.",
    icon: "mdi-trophy",
    color: "primary",
    url: "/organizational-and-agency-highlights",
    relatedPrinciples: ["Collaboration", "Recognition"],
    highlights: [],
  },
];
