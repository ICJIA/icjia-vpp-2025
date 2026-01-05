/**
 * @module ThemeSwitch
 * @fileoverview Vue component: ThemeSwitch
 */

/**
 * Accessible theme switch component with prominent switch and text labels
 *
 * This component provides:
 * - Prominent switch/slider component for better discoverability
 * - Clear text labels indicating current theme mode
 * - Visual theme icons (sun/moon) for enhanced clarity
 * - Keyboard accessibility with proper focus management
 * - Screen reader support with ARIA attributes and live announcements
 * - Proper label association using aria-labelledby and aria-describedby
 * - SSR-safe unique component IDs to prevent conflicts in multiple instances
 * - Responsive design that works on mobile and desktop
 * - WCAG 2.1 AA compliance with proper form labeling
 *
 * @component
 */

// Import Vue composables
import { useId } from "vue";
import { computed } from "vue";

/**
 * Component props
 */
const props = defineProps({
  theme: {
    type: String,
    required: true,
    validator: (value) => ["light", "dark"].includes(value),
  },
});

/**
 * Define emits for the component
 */
const emit = defineEmits(["toggle-theme"]);

/**
 * Generate unique IDs for proper label association
 * This ensures accessibility compliance by providing proper label relationships
 * Uses useId() for SSR-safe unique ID generation
 */
const componentId = useId();
const labelId = `theme-label-${componentId}`;
const descriptionId = `theme-description-${componentId}`;

/**
 * Computed property to convert theme string to boolean
 * Used for conditional rendering and ARIA attributes
 *
 * @returns {boolean} True if theme is dark, false if light
 */
const isDarkTheme = computed({
  get: () => props.theme === "dark",
  set: (value) => {
    // This is handled by the toggleTheme method
  },
});

/**
 * Computed property for the switch's aria-label
 * Provides context for screen readers
 *
 * @returns {string} Descriptive label for the current action
 */
const ariaLabel = computed(() =>
  isDarkTheme.value ? "Switch to light theme" : "Switch to dark theme",
);

/**
 * Handle switch value change
 * Emits event to parent component to handle theme change
 *
 * @param {boolean} value - New switch value (true for dark, false for light)
 */
const handleSwitchChange = (value) => {
  // Emit toggle event to parent component
  emit("toggle-theme");
};
