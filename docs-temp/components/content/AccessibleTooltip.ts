/**
 * @module AccessibleTooltip
 * @fileoverview Vue component: AccessibleTooltip
 */

/**
 * Accessible tooltip component using pure CSS positioning
 *
 * This component provides accessible tooltips without Vuetify's v-tooltip,
 * avoiding the landmark/region accessibility violations caused by Vuetify
 * rendering tooltips outside of the main content area.
 *
 * Features:
 * - Pure CSS positioning (no portal rendering)
 * - Proper ARIA attributes for accessibility
 * - Keyboard accessible (shows on focus)
 * - Mobile-friendly with auto-hide
 * - No landmark violations
 *
 * @vue-prop {String} text - Text content of the tooltip
 * @vue-prop {String} [location=bottom] - Position of the tooltip (top, bottom, left, right)
 * @vue-prop {Number} [openDelay=50] - Delay before showing the tooltip (in ms)
 * @vue-prop {Number} [closeDelay=0] - Delay before hiding the tooltip (in ms)
 * @vue-prop {Number} [mobileCloseDelay=4000] - Delay before auto-hiding on mobile (in ms)
 *
 * @component
 */
import { ref, computed, onMounted, onUnmounted } from "vue";

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
    validator: (value) => ["top", "bottom", "left", "right"].includes(value),
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
    default: 0,
  },
  /**
   * Delay before automatically hiding the tooltip on mobile (in ms)
   */
  mobileCloseDelay: {
    type: Number,
    default: 4000,
  },
});

/**
 * Generate unique ID for ARIA association
 */
const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Visibility state
 */
const isVisible = ref(false);

/**
 * Timer refs for delayed show/hide
 */
let showTimer = null;
let hideTimer = null;
let mobileAutoHideTimer = null;

/**
 * Check if device is mobile
 */
const isMobile = ref(false);

const checkIfMobile = () => {
  if (typeof window !== "undefined") {
    isMobile.value = window.innerWidth < 960;
  }
};

/**
 * Props to pass to the slot for accessibility
 */
const slotProps = computed(() => ({
  "aria-describedby": isVisible.value ? tooltipId : undefined,
}));

/**
 * Show the tooltip with optional delay
 */
const showTooltip = () => {
  clearTimeout(hideTimer);
  clearTimeout(mobileAutoHideTimer);

  if (props.openDelay > 0) {
    showTimer = setTimeout(() => {
      isVisible.value = true;
      setupMobileAutoHide();
    }, props.openDelay);
  } else {
    isVisible.value = true;
    setupMobileAutoHide();
  }
};

/**
 * Hide the tooltip with optional delay
 */
const hideTooltip = () => {
  clearTimeout(showTimer);
  clearTimeout(mobileAutoHideTimer);

  if (props.closeDelay > 0) {
    hideTimer = setTimeout(() => {
      isVisible.value = false;
    }, props.closeDelay);
  } else {
    isVisible.value = false;
  }
};

/**
 * Set up auto-hide timer for mobile devices
 */
const setupMobileAutoHide = () => {
  if (isMobile.value && props.mobileCloseDelay > 0) {
    mobileAutoHideTimer = setTimeout(() => {
      isVisible.value = false;
    }, props.mobileCloseDelay);
  }
};

/**
 * Set up event listeners - client-side only
 */
if (process.client) {
  onMounted(() => {
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", checkIfMobile);
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    clearTimeout(mobileAutoHideTimer);
  });
}
