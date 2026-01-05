/**
 * @module HomePrinciples
 * @fileoverview Vue component: HomePrinciples
 */

/**
 * Home Principles Section Component - Static Display
 *
 * Displays the five guiding principles as static, non-interactive cards
 * using CSS Grid for perfect alignment and visual consistency.
 *
 * Features:
 * - CSS Grid layout for perfect card alignment and equal heights
 * - Responsive grid system (1 column mobile, 2 tablet, 3 desktop)
 * - Static display with no interactive behaviors
 * - Larger icons (size 64) for enhanced visual impact
 * - Professional spacing and typography
 * - Smooth animations with staggered entrance effects
 * - Full accessibility compliance (WCAG 2.1 AA)
 * - Complete theme compatibility (light/dark modes)
 * - Responsive design across all breakpoints
 *
 * Technical Implementation:
 * - Uses CSS Grid with align-items: stretch for equal heights
 * - Responsive grid-template-columns for different screen sizes
 * - Deep selectors for Vuetify component overrides
 * - Grid gap adjustments for optimal spacing
 *
 * @component
 */
import HomePrincipleCard from "./HomePrincipleCard.vue";

/**
 * Guiding principles from the official Violence Prevention Plan document
 * Updated with exact verbatim text from the official plan document
 * Using consistent primary color scheme to match original home page design
 */
const principles = [
  {
    title: "Foster belonging and social connectedness",
    description:
      "Individuals, families, and communities can find acceptance and develop resiliency through healthy, peaceful relationships. Violence prevention programming can include relational opportunities based on developmental stages and risk factors.",
    icon: "mdi-heart-multiple",
    color: "primary",
  },
  {
    title: "Advance equity",
    description:
      "Violence prevention programming can address inequities by partnering with individuals, families and communities who experience a disproportionate amount of risk factors. State agencies can address historical inequities by embedding communities' true voice in the decision-making processes.",
    icon: "mdi-scale-balance",
    color: "primary",
    relatedGoal: "Strategic Priority #2: Advance Equity",
  },
  {
    title: "Promote Safety",
    description:
      "The ability to live without fear of harm is a fundamental human right and developmentally essential to individual, familial and community success. Violence prevention programming cannot only attempt to stop violence but also strive to develop culturally responsive, safe, and peaceful environments.",
    icon: "mdi-shield-account",
    color: "primary",
    relatedGoal: "Strategic Priority #1: Prevent Violence & Promote Safety",
  },
  {
    title: "Support health",
    description:
      "Violence prevention programming can build and sustain mentally and physically strong individuals, families, and communities. These trauma informed practices include policies and efforts that support staff in local organizations.",
    icon: "mdi-heart-pulse",
    color: "primary",
    relatedGoal: "Strategic Priority #1: Prevent Violence & Promote Safety",
  },
  {
    title: "Engage state agencies in collaboration",
    description:
      "Violence prevention programming takes place across many state agencies and are often focused on similar outcomes. We can work more effectively by communicating across agencies at least quarterly in which sharing resources, best practices and data is the norm. This coordination results in efficiency for funded agencies and improved outcomes for individuals, families, and communities in Illinois.",
    icon: "mdi-account-group",
    color: "primary",
    relatedGoal: "Strategic Priority #3: Promote Collaboration",
  },
];
