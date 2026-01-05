/**
 * @module AppHeader
 * @fileoverview Vue component: AppHeader
 */

/**
 * Application header component with navigation and theme toggle
 *
 * This component provides:
 * - Main site navigation with accessible links
 * - Site branding and logo
 * - Theme toggle switch
 * - Proper ARIA attributes for accessibility
 * - Scroll to top functionality for homepage links
 * - Configuration-based navigation structure
 *
 * @component
 */
import ThemeSwitch from "./ThemeSwitch.vue";
import {
  useRouter,
  useRoute,
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
} from "#imports";
import menuConfig from "../../../config/menu.config.json";
import siteConfig from "../../../config/site.config.json";

/**
 * Component props
 */
defineProps({
  /**
   * Current theme ('light' or 'dark')
   */
  theme: {
    type: String,
    required: true,
  },

  /**
   * ARIA role for the component
   * This is inherited from the parent component
   */
  role: {
    type: String,
    default: "banner",
  },
});

// Import Vuetify's useDisplay composable for responsive detection
import { useDisplay } from "vuetify";

/**
 * Define emits for the component
 * toggle-theme: Emitted when theme switch is toggled
 */
defineEmits(["toggle-theme"]);

// Get Nuxt app instance to access plugins
const nuxtApp = useNuxtApp();
const router = useRouter();
const route = useRoute();

// Get Vuetify display breakpoints for responsive behavior
const { mobile } = useDisplay();

/**
 * State for tracking open dropdown menus in desktop view
 * Each index corresponds to a navigation item
 */
const openDropdowns = ref({});
/**
 * Hover close timers per dropdown index
 */
const hoverTimers = ref({});

const cancelClose = (index) => {
  const t = hoverTimers.value[index];
  if (t) {
    clearTimeout(t);
    delete hoverTimers.value[index];
  }
};

const scheduleClose = (index, delay = 150) => {
  cancelClose(index);
  hoverTimers.value[index] = setTimeout(() => {
    openDropdowns.value[index] = false;
    delete hoverTimers.value[index];
  }, delay);
};

/**
 * Ensure only one dropdown is open at a time
 */
const closeAllDropdowns = () => {
  Object.keys(openDropdowns.value).forEach((key) => {
    openDropdowns.value[key] = false;
  });
};

const openOnlyDropdown = (index) => {
  closeAllDropdowns();
  openDropdowns.value[index] = true;
};

const toggleDropdown = (index) => {
  const isOpen = !!openDropdowns.value[index];
  closeAllDropdowns();
  openDropdowns.value[index] = !isOpen;
};

const handleMenuModel = (index, value) => {
  if (value) {
    openOnlyDropdown(index);
  } else {
    openDropdowns.value[index] = false;
  }
};

/**
 * State for tracking mobile navigation drawer
 */
const mobileDrawerOpen = ref(false);

/**
 * State for tracking expanded dropdown menus in mobile view
 */
const mobileExpandedDropdowns = ref({});

/**
 * State for tracking tooltip visibility for icon-only items
 */
const tooltipStates = ref({});

/**
 * Timers for tooltip auto-close functionality
 */
const tooltipTimers = ref({});

/**
 * Computed property to generate dynamic "Read the Plan" menu children from site config
 */
const readThePlanMenuChildren = computed(() => {
  if (!siteConfig.ui?.navigation?.readThePlanMenu?.enabled) {
    return [];
  }

  const readThePlanMenuConfig = siteConfig.ui.navigation.readThePlanMenu;
  const children = [];

  // Add enabled items from site config
  Object.entries(readThePlanMenuConfig.items).forEach(([key, item]) => {
    if (item.enabled) {
      // Handle regular menu items
      children.push({
        text: item.text,
        to: item.to,
        href: item.href,
        ariaLabel: item.ariaLabel,
        class: "dropdown-item",
        mobileClass: "dropdown-item-mobile ml-4",
        color: "on-app-bar",
        displayMode: "both",
        isExternal: item.isExternal || false,
        target: item.isExternal ? "_blank" : undefined,
        rel: item.isExternal ? "noopener noreferrer" : undefined,
      });
    }
  });

  return children;
});

/**
 * Computed property to generate dynamic "More" menu children from site config
 */
const moreMenuChildren = computed(() => {
  if (!siteConfig.ui?.navigation?.moreMenu?.enabled) {
    return [];
  }

  const moreMenuConfig = siteConfig.ui.navigation.moreMenu;
  const children = [];

  // Add enabled items from site config
  Object.entries(moreMenuConfig.items).forEach(([key, item]) => {
    if (item.enabled) {
      // Handle divider items
      if (item.isDivider) {
        children.push({
          isDivider: true,
          class: item.class || "dropdown-divider",
          mobileClass: item.mobileClass || "dropdown-divider-mobile",
        });
      } else {
        // Handle regular menu items
        children.push({
          text: item.text,
          to: item.to,
          href: item.href,
          ariaLabel: item.ariaLabel,
          class: "dropdown-item",
          mobileClass: "dropdown-item-mobile ml-4",
          color: "on-app-bar",
          displayMode: "both",
          icon: item.icon,
          isExternal: item.isExternal || false,
          target: item.isExternal ? "_blank" : undefined,
          rel: item.isExternal ? "noopener noreferrer" : undefined,
        });
      }
    }
  });

  return children;
});

/**
 * Computed property to sort header items by order property and inject dynamic children
 * Items without an order property will be placed at the end
 */
const sortedHeaderItems = computed(() => {
  const items = [...menuConfig.header.items].map((item) => {
    // If this is the "Read the Plan" menu, inject dynamic children
    if (
      item.isReadThePlanMenu &&
      siteConfig.ui?.navigation?.readThePlanMenu?.enabled
    ) {
      return {
        ...item,
        children: readThePlanMenuChildren.value,
        text:
          siteConfig.ui.navigation.readThePlanMenu.mobileText ||
          "Read the Plan",
      };
    }
    // If this is the "More" menu, inject dynamic children
    if (item.isMoreMenu && siteConfig.ui?.navigation?.moreMenu?.enabled) {
      return {
        ...item,
        children: moreMenuChildren.value,
        text: siteConfig.ui.navigation.moreMenu.mobileText || "More",
      };
    }
    return item;
  });

  const sorted = items.sort((a, b) => {
    // Default order for items without an order property
    const orderA = a.order || 1000;
    const orderB = b.order || 1000;
    return orderA - orderB;
  });

  return sorted;
});

/**
 * Determine if an item should be displayed in desktop view
 * @param {Object} item - Navigation item from config
 * @returns {boolean} - Whether the item should be displayed in desktop view
 */
const shouldDisplayInDesktop = (item) => {
  return item.displayMode === "desktop" || item.displayMode === "both";
};

/**
 * Initialize dropdown state for each navigation item - client-side only
 * Use onMounted to prevent hydration mismatches
 */
onMounted(() => {
  // Initialize all dropdowns and tooltips as closed
  menuConfig.header.items.forEach((item, index) => {
    if (item.hasDropdown) {
      openDropdowns.value[index] = false;
      mobileExpandedDropdowns.value[index] = false;
    }
    // Initialize tooltip state for icon-only items and items with enableTooltip
    if (item.iconOnly || item.enableTooltip) {
      tooltipStates.value[index] = false;
    }
  });

  // Add global click handler to close dropdowns and tooltips when clicking outside
  if (typeof window !== "undefined") {
    window.addEventListener("click", handleOutsideClick);
  }

  // Add router navigation hook to close all dropdowns and tooltips when navigation occurs
  router.afterEach(() => {
    // Close all desktop dropdowns
    Object.keys(openDropdowns.value).forEach((key) => {
      openDropdowns.value[key] = false;
    });

    // Close all mobile dropdowns
    Object.keys(mobileExpandedDropdowns.value).forEach((key) => {
      mobileExpandedDropdowns.value[key] = false;
    });

    // Close all tooltips and clear timers
    if (tooltipStates.value) {
      Object.keys(tooltipStates.value).forEach((key) => {
        tooltipStates.value[key] = false;
        if (tooltipTimers.value && tooltipTimers.value[key]) {
          clearTimeout(tooltipTimers.value[key]);
          delete tooltipTimers.value[key];
        }
      });
    }

    // Close mobile drawer
    mobileDrawerOpen.value = false;
  });
});

/**
 * Clean up event listeners and timers on component unmount
 */
onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("click", handleOutsideClick);
  }
});

/**
 * Close dropdowns when clicking outside
 */
const handleOutsideClick = (event) => {
  // Check if click is outside dropdown menus and their activators
  const isOutsideDropdown =
    !event.target.closest(".v-menu") &&
    !event.target.closest('.v-btn[aria-haspopup="true"]');

  if (isOutsideDropdown) {
    // Close all dropdowns
    Object.keys(openDropdowns.value).forEach((key) => {
      openDropdowns.value[key] = false;
    });
  }
};

/**
 * Handle blur events on dropdown activator buttons
 * Delay closing to allow focus to move to dropdown items
 */
const handleDropdownBlur = (index) => {
  setTimeout(() => {
    // Check if focus is still within the dropdown
    const activeElement = document.activeElement;
    const isInDropdown =
      activeElement &&
      (activeElement.closest(".v-menu") ||
        activeElement.getAttribute("aria-haspopup") === "true");

    if (!isInDropdown) {
      openDropdowns.value[index] = false;
    }
  }, 100);
};

/**
 * Focus the next item in a dropdown menu
 */
const focusNextDropdownItem = (dropdownIndex, currentItemIndex) => {
  const dropdown = document.querySelectorAll(".v-menu")[dropdownIndex];
  if (!dropdown) return;

  const items = dropdown.querySelectorAll(".v-list-item");
  const nextIndex =
    currentItemIndex + 1 < items.length ? currentItemIndex + 1 : 0;

  if (items[nextIndex]) {
    items[nextIndex].focus();
  }
};

/**
 * Focus the previous item in a dropdown menu
 */
const focusPrevDropdownItem = (dropdownIndex, currentItemIndex) => {
  const dropdown = document.querySelectorAll(".v-menu")[dropdownIndex];
  if (!dropdown) return;

  const items = dropdown.querySelectorAll(".v-list-item");
  const prevIndex =
    currentItemIndex - 1 >= 0 ? currentItemIndex - 1 : items.length - 1;

  if (items[prevIndex]) {
    items[prevIndex].focus();
  }
};

/**
 * Handle tab key in dropdown menu to ensure proper focus management
 */
const handleDropdownTabKey = (
  dropdownIndex,
  currentItemIndex,
  totalItems,
  event
) => {
  // If tabbing from the last item, close the dropdown
  if (currentItemIndex === totalItems - 1 && !event.shiftKey) {
    openDropdowns.value[dropdownIndex] = false;
  }
};

/**
 * Handle click on dropdown menu items in desktop view
 * Closes the dropdown menu when an item is clicked
 * @param {number} index - Index of the dropdown menu
 */
const handleDropdownItemClick = (index) => {
  // Close the dropdown after a short delay to allow navigation to start
  setTimeout(() => {
    openDropdowns.value[index] = false;
  }, 100);
};

/**
 * Handle mouseleave event on dropdown menu in desktop view
 * Closes the dropdown menu when mouse leaves the dropdown area
 * @param {number} index - Index of the dropdown menu
 */
const handleDropdownMouseLeave = (index) => {
  // Close the dropdown when mouse leaves the dropdown area
  openDropdowns.value[index] = false;
};

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
