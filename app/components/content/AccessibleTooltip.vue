<template>
  <span
    class="accessible-tooltip-wrapper"
    :class="[`tooltip-${location}`]"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
    @focus="showTooltip"
    @blur="hideTooltip"
  >
    <slot :props="slotProps"></slot>
    <span
      v-if="isVisible && text"
      class="accessible-tooltip"
      role="tooltip"
      :id="tooltipId"
      aria-live="polite"
    >
      {{ text }}
    </span>
  </span>
</template>

<script setup>
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
</script>

<style scoped>
.accessible-tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.accessible-tooltip {
  position: absolute;
  z-index: 9999;
  padding: 8px 12px;
  font-size: 0.875rem;
  line-height: 1.4;
  color: #ffffff;
  background-color: rgba(33, 33, 33, 0.95);
  border-radius: 4px;
  white-space: nowrap;
  max-width: 300px;
  white-space: normal;
  word-wrap: break-word;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

/* Position: bottom (default) */
.tooltip-bottom .accessible-tooltip {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
}

/* Position: top */
.tooltip-top .accessible-tooltip {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
}

/* Position: left */
.tooltip-left .accessible-tooltip {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 8px;
}

/* Position: right */
.tooltip-right .accessible-tooltip {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
}

/* Dark theme adjustments */
:root[data-theme="dark"] .accessible-tooltip {
  background-color: rgba(30, 40, 60, 0.98);
  color: #ffffff;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .accessible-tooltip {
    background-color: #000000;
    color: #ffffff;
    border: 2px solid #ffffff;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .accessible-tooltip {
    transition: none;
  }
}
</style>
