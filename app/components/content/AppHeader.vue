<template>
  <v-app-bar
    color="app-bar"
    elevation="0"
    :border="true"
    class="app-header"
    role="banner"
  >
    <div
      class="header-container d-flex align-center justify-space-between py-0"
    >
      <!-- Site logo/branding -->
      <a
        :href="menuConfig.header.branding.href"
        class="text-decoration-none brand-link"
        @click.prevent="handleHomeClick"
      >
        <v-row no-gutters align="center">
          <v-col cols="auto">
            <div class="logo d-flex align-center">
              <NuxtImg
                src="/images/illinois-seal.png"
                alt="Illinois State Seal"
                class="logo-image"
                sizes="sm:32px md:40px"
                format="webp"
                preload
              />
              <!-- Responsive title display based on screen size -->
              <span
                class="d-none d-xl-block text-h6 font-weight-bold text-primary"
              >
                {{ menuConfig.header.branding.text }}
              </span>
              <span
                class="d-none d-lg-block d-xl-none text-h6 font-weight-bold text-primary"
              >
                {{ menuConfig.header.branding.textMd }}
              </span>
              <span
                class="d-none d-sm-block d-lg-none text-subtitle-1 font-weight-bold text-primary"
              >
                {{ menuConfig.header.branding.textSm }}
              </span>
              <span
                class="d-block d-sm-none text-subtitle-1 font-weight-bold text-primary"
              >
                {{ menuConfig.header.branding.textXs }}
              </span>
            </div>
          </v-col>
        </v-row>
      </a>

      <!-- Mobile hamburger menu button (visible on sm and down) -->
      <div class="d-md-none">
        <v-btn
          id="mobile-menu-trigger"
          icon
          variant="text"
          color="primary"
          :aria-label="menuConfig.header.mobile.ariaLabel"
          @click="mobileDrawerOpen = !mobileDrawerOpen"
        >
          <v-icon
            :icon="
              mobileDrawerOpen
                ? menuConfig.header.mobile.closeIcon
                : menuConfig.header.mobile.menuIcon
            "
            size="large"
          ></v-icon>
        </v-btn>
      </div>

      <!-- Desktop navigation (visible on md and up) -->
      <nav
        id="site-navigation"
        class="d-none d-md-flex align-center justify-end"
        aria-label="Main Navigation"
      >
        <!-- Dynamically generate navigation items from config, sorted by order property -->
        <template v-for="(item, index) in sortedHeaderItems" :key="index">
          <template v-if="shouldDisplayInDesktop(item)">
            <!-- Dropdown menu -->
            <v-menu
              v-if="item.hasDropdown"
              :open-on-hover="false"
              :close-on-content-click="true"
              location="bottom start"
              offset="5"
              :model-value="openDropdowns[index]"
              @update:model-value="handleMenuModel(index, $event)"
              @mouseenter="cancelClose(index)"
              @mouseleave="scheduleClose(index)"
              :class="{
                'more-menu-dropdown': item.isMoreMenu,
                'read-the-plan-dropdown': item.isReadThePlanMenu,
              }"
            >
              <template v-slot:activator="{ props: menuProps }">
                <!-- Icon-only dropdown (like More menu) -->
                <v-btn
                  v-if="item.iconOnly"
                  v-bind="menuProps"
                  :variant="item.variant"
                  :class="[
                    item.class,
                    {
                      'more-menu-btn': item.isMoreMenu,
                      'read-the-plan-btn': item.isReadThePlanMenu,
                    },
                  ]"
                  :color="item.color"
                  :aria-label="item.ariaLabel"
                  :aria-haspopup="true"
                  :aria-expanded="openDropdowns[index] ? 'true' : 'false'"
                  @click.prevent.stop="
                    openDropdowns[index] = !openDropdowns[index]
                  "
                  @mouseenter="
                    openOnlyDropdown(index);
                    cancelClose(index);
                  "
                  @focus="openOnlyDropdown(index)"
                  @blur="handleDropdownBlur(index)"
                  @keydown.enter.prevent="toggleDropdown(index)"
                  @keydown.space.prevent="toggleDropdown(index)"
                  @keydown.esc="openDropdowns[index] = false"
                  @keydown.down.prevent="focusNextDropdownItem(index, 0)"
                >
                  <v-icon :icon="item.icon" size="default"></v-icon>
                </v-btn>

                <!-- Regular dropdown button with text -->
                <v-btn
                  v-else
                  v-bind="menuProps"
                  :variant="item.variant"
                  :class="[
                    item.class,
                    {
                      'more-menu-btn': item.isMoreMenu,
                      'read-the-plan-btn': item.isReadThePlanMenu,
                    },
                  ]"
                  :color="item.color"
                  :aria-haspopup="true"
                  :aria-expanded="openDropdowns[index] ? 'true' : 'false'"
                  @click.prevent.stop="
                    openDropdowns[index] = !openDropdowns[index]
                  "
                  @mouseenter="
                    openOnlyDropdown(index);
                    cancelClose(index);
                  "
                  @focus="openOnlyDropdown(index)"
                  @blur="handleDropdownBlur(index)"
                  @keydown.enter.prevent="
                    openDropdowns[index] = !openDropdowns[index]
                  "
                  @keydown.space.prevent="
                    openDropdowns[index] = !openDropdowns[index]
                  "
                  @keydown.esc="openDropdowns[index] = false"
                  @keydown.down.prevent="focusNextDropdownItem(index, 0)"
                >
                  {{ item.text }}
                  <v-icon
                    v-if="item.dropdownIcon"
                    :icon="item.dropdownIcon"
                    size="large"
                    class="ml-1 dropdown-chevron"
                    aria-hidden="true"
                  ></v-icon>
                </v-btn>
              </template>

              <v-card class="dropdown-menu" elevation="4">
                <v-list density="compact" nav>
                  <template
                    v-for="(child, childIndex) in item.children"
                    :key="childIndex"
                  >
                    <!-- Divider item -->
                    <v-divider
                      v-if="child.isDivider"
                      class="dropdown-divider"
                      :class="child.class"
                    ></v-divider>

                    <!-- Regular dropdown item -->
                    <v-list-item
                      v-else
                      :value="`desktop-dropdown-${index}-item-${childIndex}`"
                      :to="child.to"
                      :href="child.href"
                      :target="child.isExternal ? child.target : undefined"
                      :rel="child.isExternal ? child.rel : undefined"
                      :active="
                        child.to &&
                        (route.path === child.to ||
                          route.path === child.to + '/')
                      "
                      :class="child.class"
                      :color="child.color"
                      @focus="openDropdowns[index] = true"
                      @click="handleDropdownItemClick(index)"
                      @keydown.esc="openDropdowns[index] = false"
                      @keydown.up.prevent="
                        focusPrevDropdownItem(index, childIndex)
                      "
                      @keydown.down.prevent="
                        focusNextDropdownItem(index, childIndex)
                      "
                      @keydown.tab="
                        handleDropdownTabKey(
                          index,
                          childIndex,
                          item.children.length,
                          $event
                        )
                      "
                    >
                      <v-list-item-title class="d-flex align-center">
                        <v-icon
                          v-if="child.icon"
                          :icon="child.icon"
                          size="small"
                          class="mr-2"
                          aria-hidden="true"
                        ></v-icon>
                        {{ child.text }}
                        <v-icon
                          v-if="child.isExternal && child.externalIcon"
                          :icon="child.externalIcon"
                          size="small"
                          class="ml-1"
                          aria-hidden="true"
                        ></v-icon>
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                </v-list>
              </v-card>
            </v-menu>

            <!-- Icon-only internal link with Vue Router -->
            <v-btn
              v-else-if="item.to && !item.isExternal && item.iconOnly"
              icon
              :variant="item.variant"
              :class="item.class"
              :to="item.to"
              :color="item.color"
              :aria-label="item.ariaLabel"
              :aria-current="route.path === item.to ? 'page' : undefined"
            >
              <v-icon :icon="item.icon"></v-icon>
            </v-btn>

            <!-- Regular internal link with Vue Router -->
            <v-btn
              v-else-if="item.to && !item.isExternal"
              :variant="item.variant"
              :class="item.class"
              :to="item.to"
              :color="item.color"
              :aria-current="route.path === item.to ? 'page' : undefined"
            >
              {{ item.text }}
            </v-btn>

            <!-- Home link with special handling -->
            <v-btn
              v-else-if="item.href === '/'"
              :variant="item.variant"
              :class="item.class"
              :href="item.href"
              :color="item.color"
              :aria-current="route.path === '/' ? 'page' : undefined"
              @click.prevent="handleHomeClick"
            >
              {{ item.text }}
            </v-btn>

            <!-- External link -->
            <v-btn
              v-else-if="item.isExternal"
              :variant="item.variant"
              :class="item.class"
              :href="item.href"
              :color="item.color"
              :target="item.target"
              :rel="item.rel"
            >
              {{ item.text }}
              <v-icon
                v-if="item.externalIcon"
                :icon="item.externalIcon"
                size="small"
                class="ml-1"
                aria-hidden="true"
              ></v-icon>
            </v-btn>

            <!-- Default link (internal non-router links) -->
            <v-btn
              v-else
              :variant="item.variant"
              :class="item.class"
              :href="item.href"
              :color="item.color"
            >
              {{ item.text }}
            </v-btn>
          </template>
        </template>

        <!-- Theme toggle with good spacing -->
        <ThemeSwitch
          :theme="theme"
          @toggle-theme="$emit('toggle-theme')"
          class="ml-8"
        />
      </nav>
    </div>
  </v-app-bar>

  <!-- Mobile Navigation Sidebar -->
  <AppSidebar
    v-model="mobileDrawerOpen"
    :theme="theme"
    @toggle-theme="$emit('toggle-theme')"
  />
</template>

<script setup>
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
    Object.keys(tooltipStates.value).forEach((key) => {
      tooltipStates.value[key] = false;
      if (tooltipTimers.value[key]) {
        clearTimeout(tooltipTimers.value[key]);
        delete tooltipTimers.value[key];
      }
    });

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
</script>

<style scoped>
.app-header {
  backdrop-filter: blur(10px);
}

/* Desktop navigation styles */
.nav-link {
  position: relative;
  overflow: hidden;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: var(--v-primary-base);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after,
.router-link-active::after {
  width: 60%;
}

.logo {
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

/* Dropdown menu styles for desktop */
.dropdown-menu {
  border-radius: 4px;
  min-width: 200px;
  width: max-content;
  overflow: hidden;
}

.dropdown-item {
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  border-left: 3px solid transparent;
  padding-left: 16px !important;
}

.dropdown-item:hover,
.dropdown-item:focus {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
  border-left-color: var(--v-theme-primary);
}

.dropdown-item:focus-visible {
  outline: 2px solid var(--v-theme-primary);
  outline-offset: -2px;
}

/* Dropdown divider styles */
.dropdown-divider {
  margin: 8px 0;
  opacity: 0.3;
}

.dropdown-divider-mobile {
  margin: 8px 16px;
  opacity: 0.3;
}

/* Navigation download button custom styling - subtle card-like approach */
.nav-download-btn {
  /* Light theme: pure white background like cards for subtle contrast against light grey nav bar */
  background-color: #ffffff !important; /* Same as NewsCard and search cards */
  color: #0747a6 !important; /* Primary color text */
  border: 1px solid rgba(0, 0, 0, 0.05) !important; /* Subtle border like cards */
  transition: all 0.3s ease;
}

.nav-download-btn:hover {
  background-color: #f8f8f8 !important; /* Slightly darker on hover */
  color: #053285 !important; /* Darker primary on hover */
  transform: translateY(-1px);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

/* Dark theme: lighter surface background like cards for contrast against dark nav bar */
:root[data-theme="dark"] .nav-download-btn {
  background-color: #2a3441 !important; /* Same as NewsCard and search cards */
  color: #93c5fd !important; /* Theme primary color text */
  border: 1px solid rgba(255, 255, 255, 0.05) !important; /* Subtle border like cards */
}

:root[data-theme="dark"] .nav-download-btn:hover {
  background-color: #334155 !important; /* Slightly lighter on hover */
  color: #bfdbfe !important; /* Lighter blue on hover */
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.5),
    0 2px 4px -1px rgba(0, 0, 0, 0.4) !important;
}

/* Simple theme toggle spacing */

/* Mobile navigation styles */
.mobile-nav-drawer {
  z-index: 1000;
}

.nav-link-mobile {
  transition: background-color 0.2s ease;
  border-left: 3px solid transparent;
}

.nav-link-mobile:hover,
.nav-link-mobile:focus,
.nav-link-mobile.router-link-active {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
  border-left-color: var(--v-theme-primary);
}

.dropdown-item-mobile {
  transition: background-color 0.2s ease;
  border-left: 3px solid transparent;
}

.dropdown-item-mobile:hover,
.dropdown-item-mobile:focus,
.dropdown-item-mobile.router-link-active {
  background-color: rgba(var(--v-theme-primary), 0.05) !important;
  border-left-color: var(--v-theme-primary);
}

/* Enhanced dropdown chevron styling for better visibility */
.dropdown-chevron {
  font-weight: 900 !important;
  opacity: 1 !important;
  font-size: 1.25rem !important;
  transform: scale(1.2);
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.dropdown-chevron:hover {
  transform: scale(1.3);
  opacity: 1 !important;
}

.mobile-dropdown-chevron {
  font-weight: 900 !important;
  opacity: 1 !important;
  font-size: 1.25rem !important;
  transform: scale(1.2);
  transition:
    transform 0.3s ease,
    opacity 0.2s ease;
}

.mobile-dropdown-chevron:hover {
  transform: scale(1.3);
  opacity: 1 !important;
}

/* Animation for mobile dropdown chevron */
.rotate-90 {
  transform: rotate(90deg);
  transition: transform 0.3s ease;
}

.v-list-item-title {
  display: flex;
  align-items: center;
}

.header-container {
  width: 100%;
  max-width: 1600px; /* Wider than default container */
  margin: 0 auto;
  padding: 0 16px; /* Minimum padding on small screens */
}

/* Responsive padding adjustments */
@media (min-width: 600px) {
  .header-container {
    padding: 0 24px;
  }
}

@media (min-width: 960px) {
  .header-container {
    padding: 0 32px;
  }
}

/* Explicit logo image sizing to prevent overlap on small screens */
.logo-image {
  width: 32px;
  height: 32px;
  display: block;
  object-fit: contain;
  /* Add breathing room between logo and title */
  margin-inline-end: 8px; /* ~8px on xs/sm */
}

@media (min-width: 960px) {
  .logo-image {
    width: 40px;
    height: 40px;
    margin-inline-end: 12px; /* a touch more spacing on md+ */
  }
}

/* Enhanced target size for accessibility - WCAG 2.5.5 Target Size (Enhanced) */
/* Ensure all interactive elements meet 44x44 pixel minimum target size */
.app-header .v-btn {
  min-width: 44px !important;
  min-height: 44px !important;
}

/* Specific styling for icon-only buttons to ensure proper target size */
.app-header .v-btn[icon] {
  min-width: 44px !important;
  min-height: 44px !important;
  width: 44px !important;
  height: 44px !important;
}

/* Mobile navigation list items target size enhancement */
.mobile-nav-drawer .v-list-item {
  min-height: 44px !important;
  padding: 8px 16px !important;
}

/* Mobile navigation dropdown items target size enhancement */
.mobile-nav-drawer .v-list-item {
  min-height: 44px !important;
}

/* Dropdown menu items target size enhancement */
.dropdown-menu .v-list-item {
  min-height: 44px !important;
  padding: 8px 16px !important;
}

/* Logo/branding link target size enhancement */
.brand-link {
  min-height: 44px !important;
  display: flex !important;
  align-items: center !important;
  padding: 4px 8px !important;
}

/* Static menu heading styling for both More menu and dropdown menus */
.mobile-nav-drawer .more-menu-heading,
.mobile-nav-drawer .dropdown-menu-heading {
  background-color: transparent !important;
  background: none !important;
  border-left: 4px solid rgb(var(--v-theme-primary)) !important;
  margin: 8px 0 4px 0 !important;
  pointer-events: none !important;
}

.mobile-nav-drawer .more-menu-heading .v-list-item-title,
.mobile-nav-drawer .dropdown-menu-heading .v-list-item-title {
  color: rgb(var(--v-theme-primary)) !important;
  font-size: 0.9rem !important;
  letter-spacing: 0.5px !important;
  text-transform: uppercase !important;
}

/* Menu items styling (indented) - transparent backgrounds */
.mobile-nav-drawer .more-menu-item,
.mobile-nav-drawer .dropdown-menu-item {
  border-left: 2px solid rgba(var(--v-theme-primary), 0.2) !important;
  margin-left: 16px !important;
  background-color: transparent !important;
  background: none !important;
}

.mobile-nav-drawer .more-menu-item:hover,
.mobile-nav-drawer .dropdown-menu-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
  border-left-color: rgba(var(--v-theme-primary), 0.4) !important;
}

/* Remove all gray backgrounds and surface colors from mobile navigation */
.mobile-nav-drawer .v-list-group {
  background-color: transparent !important;
  background: none !important;
}

.mobile-nav-drawer .v-list-group .v-list-group__items {
  background-color: transparent !important;
  background: none !important;
}

.mobile-nav-drawer .v-list-item {
  background-color: transparent !important;
  background: none !important;
}

/* Override any Vuetify surface colors in mobile navigation */
.mobile-nav-drawer .v-list,
.mobile-nav-drawer .v-navigation-drawer__content {
  background-color: transparent !important;
  background: none !important;
  --v-theme-surface: transparent !important;
}

/* Ensure no gray backgrounds in any theme */
.v-theme--light .mobile-nav-drawer .v-list-item,
.v-theme--dark .mobile-nav-drawer .v-list-item,
.v-theme--light .mobile-nav-drawer .v-list-group,
.v-theme--dark .mobile-nav-drawer .v-list-group {
  background-color: transparent !important;
  background: none !important;
}

/* Ensure proper text truncation styling */
.mobile-nav-drawer .v-list-item-title {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  max-width: 100% !important;
}
</style>
