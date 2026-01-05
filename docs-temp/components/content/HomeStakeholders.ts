/**
 * @module HomeStakeholders
 * @fileoverview Vue component: HomeStakeholders
 */

/**
 * Home Planning Process Section Component - Alternating Layout
 *
 * Displays information about the planning process for developing the
 * 2025-2029 Violence Prevention Plan, including workgroups and collaborative efforts.
 * Implements alternating layout pattern with image on left, content on right.
 *
 * Features:
 * - Alternating layout pattern (image left, content right)
 * - Planning workgroups with consistent primary color theming
 * - Statistics from the planning process
 * - Subtle, muted color scheme following project design system
 * - WCAG 2.1 AA accessibility compliance
 * - Full theme compatibility (light/dark)
 * - Responsive design across all breakpoints
 *
 * Layout Pattern:
 * - Part of alternating section system where consecutive sections alternate image placement
 * - This section: Image left, Content right
 * - Next section (HomeApproach): Image left, Content right (maintains alternating pattern)
 *
 * @component
 */
import ImageWithSpinner from "~/components/content/ImageWithSpinner.vue";

/**
 * Planning workgroups from the 2025-2029 VPP planning process
 * Updated to use consistent primary color theming for subtle, muted design
 */
const planningWorkgroups = [
  {
    name: "Data Workgroup",
    description:
      "A data workgroup was formed to review the updated violence rates and trends report that was released, ensuring the new plan was reflective of these data",
    icon: "mdi-chart-line",
  },
  {
    name: "Grant Implementation Workgroup",
    description:
      "A grant implementation workgroup was formed to review the focus group and interview results from ICJIA violence prevention grantees and grant monitors. This workgroup focused on the goal related to equity in grant implementation",
    icon: "mdi-account-cash",
  },
  {
    name: "Recommendations Workgroup",
    description:
      "A recommendations workgroup was formed to review the 2020-2024 goals and recommendations, while considering new recommendations from the data and grant implementation workgroups",
    icon: "mdi-lightbulb-on",
  },
];
