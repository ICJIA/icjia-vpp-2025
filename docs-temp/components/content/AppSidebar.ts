/**
 * @module AppSidebar
 * @fileoverview Vue component: AppSidebar
 */

/**
 * Mobile navigation sidebar component
 * Provides clean, isolated mobile navigation without duplication issues
 * Dynamically generates menu items from menu configuration
 */

// Imports
import menuConfig from "../../../config/menu.config.json";
import siteConfig from "../../../config/site.config.json";

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String,
    default: "light",
  },
});

// Emits
const emit = defineEmits(["update:modelValue", "toggle-theme"]);

// Normalize a path by removing a single trailing slash (except for root)
const normalizePath = (p) => {
  if (!p) return "";
  const s = typeof p === "string" ? p : p.path || "";
  return s !== "/" && s.endsWith("/") ? s.slice(0, -1) : s;
};

/**
 * Determine if a given route path is active (exact match, trailing-slash agnostic)
 * @param {string} to - Target path
 * @returns {boolean}
 */
const isActive = (to) => {
  const current = normalizePath(route.path);
  const target = normalizePath(to);
  return !!target && current === target;
};

// Composables
const route = useRoute();

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

/**
 * Get the "Read the Plan" menu item from menu config
 */
const readThePlanItem = computed(() => {
  return menuConfig.header.items.find(
    (item) => item.text === "Read the Plan" && item.hasDropdown
  );
});

/**
 * Get the "Read the Plan" menu children from site config (same as AppHeader)
 */
const readThePlanChildren = computed(() => {
  if (!siteConfig.ui?.navigation?.readThePlanMenu?.enabled) {
    return [];
  }

  const readThePlanMenuConfig = siteConfig.ui.navigation.readThePlanMenu;
  const children = [];

  // Add enabled items from site config (excluding dividers for sidebar)
  Object.entries(readThePlanMenuConfig.items).forEach(([key, item]) => {
    if (item.enabled) {
      // Handle regular menu items only
      children.push({
        text: item.text,
        to: item.to,
        href: item.href,
        ariaLabel: item.ariaLabel,
        class: "dropdown-item",
        mobileClass: "dropdown-item-mobile ml-4",
        color: "on-app-bar",
        displayMode: "both",
        isExternal: item.isExternal,
        target: item.target,
        rel: item.rel,
      });
    }
  });

  return children;
});

/**
 * Get the "More" menu children from site config (same as AppHeader)
 */
const moreMenuChildren = computed(() => {
  if (!siteConfig.ui?.navigation?.moreMenu?.enabled) {
    return [];
  }

  const moreMenuConfig = siteConfig.ui.navigation.moreMenu;
  const children = [];

  // Add enabled items from site config (excluding dividers for sidebar)
  Object.entries(moreMenuConfig.items).forEach(([key, item]) => {
    if (item.enabled && !item.isDivider) {
      // Handle regular menu items only (skip dividers in sidebar)
      children.push({
        text: item.text,
        to: item.to,
        href: item.href,
        ariaLabel: item.ariaLabel,
        tooltip: item.tooltip,
        tooltipLocation: "right",
        class: "dropdown-item",
        mobileClass: "dropdown-item-mobile ml-4",
        color: "on-app-bar",
        displayMode: "both",
        icon: item.icon,
        isExternal: item.isExternal,
        target: item.target,
        rel: item.rel,
        externalIcon: item.externalIcon,
      });
    }
  });

  return children;
});

/**
 * Get the Home menu item from menu config
 */
const homeItem = computed(() => {
  return menuConfig.header.items.find((item) => item.text === "Home");
});

/**
 * Get the Download menu item from menu config
 */
const downloadItem = computed(() => {
  return menuConfig.header.items.find((item) => item.text === "Download");
});

/**
 * Handle navigation and close sidebar
 * @param {string} path - The path to navigate to
 */
const handleNavigation = (path) => {
  if (path === "/") {
    // Handle home navigation if needed
  }
  // Close sidebar after navigation
  isOpen.value = false;
};

/**
 * Truncate text in the middle with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated text with ellipsis in the middle
 */
const truncateMiddle = (text, maxLength = 30) => {
  if (!text || text.length <= maxLength) {
    return text;
  }

  const ellipsis = "...";
  const charsToShow = maxLength - ellipsis.length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return (
    text.substring(0, frontChars) +
    ellipsis +
    text.substring(text.length - backChars)
  );
};
