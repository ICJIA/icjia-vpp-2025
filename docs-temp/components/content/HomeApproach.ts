/**
 * @module HomeApproach
 * @fileoverview Vue component: HomeApproach
 */

/**
 * Sandbox Home Approach Section Component
 *
 * Explains the public health approach to violence prevention used in the plan.
 * Features the four-step framework and prevention levels with visual presentation.
 *
 * Features:
 * - Public health approach explanation
 * - Four-step framework from VPP analysis
 * - Prevention levels (primary, secondary, tertiary)
 * - Visual presentation with image
 * - Call-to-action for more information
 * - WCAG 2.1 AA accessibility compliance
 * - Full theme compatibility
 *
 * @component
 */
import ImageWithSpinner from "~/components/content/ImageWithSpinner.vue";

/**
 * Four steps of the public health approach from VPP analysis
 * Using consistent primary color scheme to match original home page design
 */
const approachSteps = [
  {
    title: "Define and Monitor the Problem",
    description:
      "Understanding who experiences violence, as well as when and where it occurs, is the first step in preventing violence. Data can help us understand the prevalence of violence, where it occurs, trends in violence rates over time, and who it impacts. In defining violence, it is also critical to find appropriate, validated measurements.",
    color: "primary",
  },
  {
    title: "Identify Risk and Protective Factors",
    description:
      "We need to understand what factors protect individuals from experiencing or perpetrating violence, and what factors place individuals at greater risk for victimization or perpetration. These factors can help providers know where to focus violence prevention efforts.",
    color: "primary",
  },
  {
    title: "Develop and Test Prevention Strategies",
    description:
      "Prevention efforts are developed and modified based on community needs, practitioner and organizational expertise and experience, and participant, stakeholder, and collaborator feedback. Once prevention strategies are developed or identified for implementation, strategies should be evaluated to ensure they are effective. Evidence-based practices are vital to ensure programs are doing what they set out to do.",
    color: "primary",
  },
  {
    title: "Assure Widespread Adoption",
    description:
      "Communities are encouraged to implement evidence-based programs. Additionally, they should continually assess if the strategy is a good match for their participants or community area, evaluating any adaptations or changes. The growing evidence-base for violence prevention practices will fuel widespread adoption of evidence-based strategies.",
    color: "primary",
  },
];

/**
 * Prevention levels from VPP analysis
 * Using consistent primary color scheme to match original home page design
 */
const preventionLevels = [
  {
    name: "Primary",
    description:
      "Primary prevention is considered universal, occurring for an entire population.",
    icon: "mdi-shield-check",
    color: "primary",
  },
  {
    name: "Secondary",
    description:
      "Secondary prevention is considered selected, or focused on those with one or more risk factors for violence.",
    icon: "mdi-shield-alert",
    color: "primary",
  },
  {
    name: "Tertiary",
    description:
      "Tertiary prevention is considered indicated, or efforts for those who have already experienced or perpetrated violence.",
    icon: "mdi-shield-account",
    color: "primary",
  },
];
