<template>
  <v-tooltip
    :text="text"
    :location="location"
    :open-delay="openDelay"
    :close-delay="isMobile ? mobileCloseDelay : closeDelay"
    role="tooltip"
    :aria-label="text"
    v-bind="$attrs"
  >
    <template v-slot:activator="{ props }">
      <slot :props="props"></slot>
    </template>
  </v-tooltip>
</template>

<script setup>
/**
 * Accessible tooltip component with mobile auto-hide functionality
 *
 * This component enhances the standard v-tooltip with:
 * - Automatic closing on mobile devices after a brief period
 * - Proper ARIA attributes for accessibility
 * - Consistent behavior across the application
 * - Customizable delays for different device types
 *
 * @component
 */
import { ref, onMounted, onUnmounted } from "vue";

/**
 * Component props
 */
const props = defineProps({
  /**
   * Text content of the tooltip
   */
  text: {
    type: String,
    required: true,
  },
  /**
   * Position of the tooltip relative to the activator
   */
  location: {
    type: String,
    default: "bottom",
  },
  /**
   * Delay before showing the tooltip (in ms)
   */
  openDelay: {
    type: Number,
    default: 50,
  },
  /**
   * Delay before hiding the tooltip on desktop (in ms)
   */
  closeDelay: {
    type: Number,
    default: 0, // Default to 0 (standard behavior) for desktop
  },
  /**
   * Delay before automatically hiding the tooltip on mobile (in ms)
   */
  mobileCloseDelay: {
    type: Number,
    default: 4000, // Auto-hide after 4 seconds on mobile
  },
});

/**
 * Reactive state to track if the device is mobile - SSR-safe
 * Defaults to false on server-side to prevent hydration mismatches
 */
const isMobile = ref(false);

/**
 * Check if the device is mobile based on screen width
 * This is called on component mount and on window resize
 * Only runs on client-side to prevent hydration mismatches
 */
const checkIfMobile = () => {
  if (typeof window !== "undefined") {
    isMobile.value = window.innerWidth < 960; // Vuetify's md breakpoint
  }
};

/**
 * Set up event listeners for window resize - client-side only
 * This ensures the mobile detection stays accurate when the window is resized
 * Wrapped in process.client check to prevent SSR issues
 */
if (process.client) {
  onMounted(() => {
    // Initial check
    checkIfMobile();

    // Add resize listener
    window.addEventListener("resize", checkIfMobile);

    // Clean up event listener on component unmount
    onUnmounted(() => {
      window.removeEventListener("resize", checkIfMobile);
    });
  });
}
</script>

<style scoped>
/* No additional styles needed */
</style>
